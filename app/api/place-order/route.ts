import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { sendSMS } from '../../../lib/sendSMS'
import { isValidNZPhoneNumber, formatNZPhoneNumber } from '../../../lib/utils'

const RESTAURANT_PHONE = process.env.RESTAURANT_PHONE_NUMBER || ''
const MAX_RETRIES = 3
const RETRY_DELAY = 5000 // 5 seconds

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  option?: string;
}

interface OrderData {
  items: OrderItem[];
  name: string;
  mobile: string;
  email?: string;
  orderType: string;
  paymentMethod: 'store' | 'credit-card';
  pickupTime: string;
  subtotal: number;
}

async function retrySendSMS(to: string, message: string, retries = 0): Promise<boolean> {
  try {
    await sendSMS(to, message)
    return true
  } catch (error) {
    console.error(`SMS sending failed (attempt ${retries + 1}):`, error)
    if (retries < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return retrySendSMS(to, message, retries + 1)
    }
    console.error('Max retries reached. SMS sending failed.')
    return false
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const orderData: OrderData = {
      items: Array.isArray(body.items) ? body.items.map((item: any) => ({
        name: String(item.name || ''),
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 0),
        option: item.option ? String(item.option) : undefined
      })) : [],
      name: String(body.name || ''),
      mobile: String(body.mobile || ''),
      email: body.email ? String(body.email) : undefined,
      orderType: String(body.orderType || ''),
      paymentMethod: body.paymentMethod === 'credit-card' ? 'credit-card' : 'store',
      pickupTime: String(body.pickupTime || ''),
      subtotal: Number(body.subtotal || 0)
    }

    // Validation checks...
    if (!orderData.name || !orderData.mobile || !orderData.orderType || 
        !orderData.paymentMethod || !orderData.pickupTime || 
        !Array.isArray(orderData.items) || orderData.items.length === 0 || 
        isNaN(orderData.subtotal) || orderData.subtotal <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Please fill in all required fields' 
      }, { status: 400 })
    }

    if (!isValidNZPhoneNumber(orderData.mobile)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Please enter a valid New Zealand mobile number' 
      }, { status: 400 })
    }

    orderData.mobile = formatNZPhoneNumber(orderData.mobile)

    console.log('Starting database transaction')
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          name: orderData.name,
          mobile: orderData.mobile,
          email: orderData.email,
          orderType: orderData.orderType,
          paymentMethod: orderData.paymentMethod,
          pickupTime: orderData.pickupTime,
          subtotal: orderData.subtotal,
          status: orderData.paymentMethod === 'store' ? 'pending_confirmation' : 'processing',
          items: {
            create: orderData.items.map(item => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              option: item.option
            }))
          }
        }
      })

      const customerMessage = orderData.paymentMethod === 'store'
        ? `Your order #${order.id} has been received. We'll confirm it shortly. Please wait for our confirmation before coming to the store. Thank you!`
        : `Your order #${order.id} has been confirmed and paid. Thank you for your purchase!`

      const restaurantMessage = orderData.paymentMethod === 'store'
        ? `New order #${order.id} requires confirmation. Click here to view and confirm: ${process.env.NEXT_PUBLIC_BASE_URL}/confirm-order/${order.id}`
        : `New order #${order.id}:\n` +
          `Name: ${orderData.name}\n` +
          `Mobile: ${orderData.mobile}\n` +
          `Order Type: ${orderData.orderType}\n` +
          `Payment Method: Credit Card (Paid)\n` +
          `Pickup Time: ${orderData.pickupTime}\n` +
          `Total: $${orderData.subtotal.toFixed(2)}\n\n` +
          `Items:\n${orderData.items.map(item => `${item.name}${item.option ? ` (${item.option})` : ''} x${item.quantity}`).join('\n')}`

      console.log('Sending SMS notifications')
      const customerSMSSuccess = await retrySendSMS(orderData.mobile, customerMessage)
      const restaurantSMSSuccess = await retrySendSMS(RESTAURANT_PHONE, restaurantMessage)

      let finalStatus: string
      if (orderData.paymentMethod === 'store') {
        finalStatus = 'pending_confirmation'
      } else if (customerSMSSuccess && restaurantSMSSuccess) {
        finalStatus = 'paid'
      } else {
        finalStatus = 'notification_failed'
      }

      console.log('Updating order status to:', finalStatus)
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: finalStatus }
      })

      return {
        order: updatedOrder,
        customerSMSSuccess,
        restaurantSMSSuccess
      }
    })

    if (result.order.status === 'notification_failed') {
      console.warn('Order placed but notifications failed:', result.order.id)
      return NextResponse.json({ 
        success: true, 
        message: 'Order placed but we were unable to send notifications. The restaurant will contact you shortly.', 
        orderId: result.order.id
      }, { status: 202 })
    }

    console.log('Order process completed successfully:', result.order.id)
    return NextResponse.json({ 
      success: true, 
      message: result.order.paymentMethod === 'store' 
        ? 'Order received. Please wait for confirmation.' 
        : 'Order placed successfully', 
      orderId: result.order.id
    })
  } catch (error) {
    console.error('Error processing order:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack)
    }
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to process order. Please try again later.' 
    }, { status: 500 })
  }
}

// import { NextResponse } from 'next/server'
// import { prisma } from '../../../lib/db'
// import { sendSMS } from '../../../lib/sendSMS'
// import { isValidNZPhoneNumber, formatNZPhoneNumber } from '../../../lib/utils'

// const RESTAURANT_PHONE = process.env.RESTAURANT_PHONE_NUMBER || ''
// const MAX_RETRIES = 3
// const RETRY_DELAY = 5000 // 5 seconds

// interface OrderItem {
//   name: string;
//   price: number;
//   quantity: number;
//   option?: string;
// }

// interface OrderData {
//   items: OrderItem[];
//   name: string;
//   mobile: string;
//   email?: string;
//   orderType: string;
//   paymentMethod: 'store' | 'credit-card';
//   pickupTime: string;
//   subtotal: number;
// }

// async function retrySendSMS(to: string, message: string, retries = 0): Promise<boolean> {
//   try {
//     await sendSMS(to, message)
//     return true
//   } catch (error) {
//     if (retries < MAX_RETRIES) {
//       console.log(`SMS sending failed, retrying in ${RETRY_DELAY / 1000} seconds...`)
//       await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
//       return retrySendSMS(to, message, retries + 1)
//     }
//     console.error('Max retries reached. SMS sending failed:', error)
//     return false
//   }
// }

// export async function POST(req: Request) {
//   try {
//     console.log('Received order request')
//     const body = await req.json()
//     console.log('Request body:', JSON.stringify(body, null, 2))
    
//     // Validate and convert input data
//     const orderData: OrderData = {
//       items: Array.isArray(body.items) ? body.items.map((item: any) => ({
//         name: String(item.name || ''),
//         price: Number(item.price || 0),
//         quantity: Number(item.quantity || 0),
//         option: item.option ? String(item.option) : undefined
//       })) : [],
//       name: String(body.name || ''),
//       mobile: String(body.mobile || ''),
//       email: body.email ? String(body.email) : undefined,
//       orderType: String(body.orderType || ''),
//       paymentMethod: body.paymentMethod === 'credit-card' ? 'credit-card' : 'store',
//       pickupTime: String(body.pickupTime || ''),
//       subtotal: Number(body.subtotal || 0)
//     }

//     console.log('Processed order data:', JSON.stringify(orderData, null, 2))

//     // Validate required fields
//     if (!orderData.name || !orderData.mobile || !orderData.orderType || 
//         !orderData.paymentMethod || !orderData.pickupTime || 
//         !Array.isArray(orderData.items) || orderData.items.length === 0 || 
//         isNaN(orderData.subtotal) || orderData.subtotal <= 0) {
//       console.error('Validation failed:', {
//         hasName: !!orderData.name,
//         hasMobile: !!orderData.mobile,
//         hasOrderType: !!orderData.orderType,
//         hasPaymentMethod: !!orderData.paymentMethod,
//         hasPickupTime: !!orderData.pickupTime,
//         itemsLength: orderData.items.length,
//         subtotal: orderData.subtotal
//       })
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Please fill in all required fields' 
//       }, { status: 400 })
//     }

//     if (!isValidNZPhoneNumber(orderData.mobile)) {
//       console.error('Invalid phone number:', orderData.mobile)
//       return NextResponse.json({ 
//         success: false, 
//         message: 'Please enter a valid New Zealand mobile number' 
//       }, { status: 400 })
//     }

//     // Format the phone number for backend use
//     orderData.mobile = formatNZPhoneNumber(orderData.mobile)

//     console.log('Starting database transaction')
//     // Use a transaction to ensure atomicity
//     const result = await prisma.$transaction(async (tx) => {
//       console.log('Creating order in database')
//       // Create a new order in the database
//       const order = await tx.order.create({
//         data: {
//           name: orderData.name,
//           mobile: orderData.mobile,
//           email: orderData.email,
//           orderType: orderData.orderType,
//           paymentMethod: orderData.paymentMethod,
//           pickupTime: orderData.pickupTime,
//           subtotal: orderData.subtotal,
//           status: orderData.paymentMethod === 'store' ? 'pending_confirmation' : 'processing',
//           items: {
//             create: orderData.items.map(item => ({
//               name: item.name,
//               price: item.price,
//               quantity: item.quantity,
//               option: item.option
//             }))
//           }
//         }
//       })
//       console.log('Order created:', order.id)

//       // Prepare customer notification message
//       const customerMessage = orderData.paymentMethod === 'store'
//         ? `Your order #${order.id} has been received. We'll confirm it shortly. Please wait for our confirmation before coming to the store. Thank you!`
//         : `Your order #${order.id} has been confirmed and paid. Thank you for your purchase!`

//       // Prepare restaurant notification message
//       const restaurantMessage = orderData.paymentMethod === 'store'
//         ? `New order #${order.id} requires confirmation. Click here to view and confirm: ${process.env.NEXT_PUBLIC_BASE_URL}/confirm-order/${order.id}`
//         : `New order #${order.id}:\n` +
//           `Name: ${orderData.name}\n` +
//           `Mobile: ${orderData.mobile}\n` +
//           `Order Type: ${orderData.orderType}\n` +
//           `Payment Method: Credit Card (Paid)\n` +
//           `Pickup Time: ${orderData.pickupTime}\n` +
//           `Total: $${orderData.subtotal.toFixed(2)}\n\n` +
//           `Items:\n${orderData.items.map(item => `${item.name}${item.option ? ` (${item.option})` : ''} x${item.quantity}`).join('\n')}`

//       console.log('Sending SMS notifications')
//       // Send SMS notifications with retry mechanism
//       const customerSMSSuccess = await retrySendSMS(orderData.mobile, customerMessage)
//       const restaurantSMSSuccess = await retrySendSMS(RESTAURANT_PHONE, restaurantMessage)

//       // Update order status based on SMS sending results and payment method
//       let finalStatus: string
//       if (orderData.paymentMethod === 'store') {
//         finalStatus = 'pending_confirmation'
//       } else if (customerSMSSuccess && restaurantSMSSuccess) {
//         finalStatus = 'paid'
//       } else {
//         finalStatus = 'notification_failed'
//       }

//       console.log('Updating order status to:', finalStatus)
//       // Update the order status
//       const updatedOrder = await tx.order.update({
//         where: { id: order.id },
//         data: { status: finalStatus }
//       })

//       return {
//         order: updatedOrder,
//         customerSMSSuccess,
//         restaurantSMSSuccess
//       }
//     })

//     if (result.order.status === 'notification_failed') {
//       console.warn('Order placed but notifications failed:', result.order.id)
//       return NextResponse.json({ 
//         success: true, 
//         message: 'Order placed but notifications failed. Please contact the restaurant.', 
//         orderId: result.order.id
//       }, { status: 202 })
//     }

//     console.log('Order process completed successfully:', result.order.id)
//     return NextResponse.json({ 
//       success: true, 
//       message: result.order.paymentMethod === 'store' 
//         ? 'Order received. Please wait for confirmation.' 
//         : 'Order placed successfully', 
//       orderId: result.order.id
//     })
//   } catch (error) {
//     console.error('Error processing order:', error instanceof Error ? error.message : String(error))
//     if (error instanceof Error && error.stack) {
//       console.error('Stack trace:', error.stack)
//     }
//     return NextResponse.json({ 
//       success: false, 
//       message: 'Failed to process order. Please try again later.' 
//     }, { status: 500 })
//   }
// }