// import { NextResponse } from 'next/server'
// import { prisma } from '../../../lib/db'
// import { sendSMS } from '../../../lib/sendSMS'

// const RESTAURANT_PHONE = process.env.RESTAURANT_PHONE_NUMBER || ''

// interface OrderItem {
//   name: string;
//   price: number;
//   quantity: number;
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

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
    
//     // Validate and convert input data
//     const orderData: OrderData = {
//       items: Array.isArray(body.items) ? body.items.map(item => ({
//         name: String(item.name || ''),
//         price: Number(item.price || 0),
//         quantity: Number(item.quantity || 0)
//       })) : [],
//       name: String(body.name || ''),
//       mobile: String(body.mobile || ''),
//       email: body.email ? String(body.email) : undefined,
//       orderType: String(body.orderType || ''),
//       paymentMethod: body.paymentMethod === 'credit-card' ? 'credit-card' : 'store',
//       pickupTime: String(body.pickupTime || ''),
//       subtotal: Number(body.subtotal || 0)
//     }

//     // Validate required fields
//     if (orderData.items.length === 0 || !orderData.name || !orderData.mobile || !orderData.orderType || !orderData.paymentMethod || !orderData.pickupTime || isNaN(orderData.subtotal)) {
//       return NextResponse.json({ success: false, message: 'Invalid input data' }, { status: 400 })
//     }

//     // Create a new order in the database
//     const order = await prisma.order.create({
//       data: {
//         name: orderData.name,
//         mobile: orderData.mobile,
//         email: orderData.email,
//         orderType: orderData.orderType,
//         paymentMethod: orderData.paymentMethod,
//         pickupTime: orderData.pickupTime,
//         subtotal: orderData.subtotal,
//         status: orderData.paymentMethod === 'store' ? 'pending' : 'paid',
//         items: {
//           create: orderData.items
//         }
//       }
//     })

//     // Prepare customer notification message
//     const customerMessage = orderData.paymentMethod === 'store'
//       ? `Your order #${order.id} has been placed successfully. Please pay $${orderData.subtotal.toFixed(2)} at the store during pickup. Thank you for your order!`
//       : `Your order #${order.id} has been confirmed and paid. Thank you for your purchase!`

//     // Prepare restaurant notification message
//     const restaurantMessage = `New order #${order.id}:\n` +
//       `Name: ${orderData.name}\n` +
//       `Mobile: ${orderData.mobile}\n` +
//       `Order Type: ${orderData.orderType}\n` +
//       `Payment Method: ${orderData.paymentMethod === 'store' ? 'Pay at Store' : 'Credit Card'}\n` +
//       `Pickup Time: ${orderData.pickupTime}\n` +
//       `Total: $${orderData.subtotal.toFixed(2)}\n\n` +
//       `Items:\n${orderData.items.map(item => `${item.name} x${item.quantity}`).join('\n')}`

//     // Send SMS notification to customer
//     try {
//       await sendSMS(orderData.mobile, customerMessage)
//       console.log('SMS notification sent successfully to customer')
//     } catch (error) {
//       console.error('Failed to send SMS notification to customer:', error)
//     }

//     // Send SMS notification to restaurant
//     try {
//       await sendSMS(RESTAURANT_PHONE, restaurantMessage)
//       console.log('SMS notification sent successfully to restaurant')
//     } catch (error) {
//       console.error('Failed to send SMS notification to restaurant:', error)
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: 'Order placed successfully', 
//       orderId: order.id
//     })
//   } catch (error) {
//     console.error('Error processing order:', error instanceof Error ? error.message : String(error))
//     return NextResponse.json({ success: false, message: 'Failed to process order' }, { status: 500 })
//   }
// }

import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { sendSMS } from '../../../lib/sendSMS'

const RESTAURANT_PHONE = process.env.RESTAURANT_PHONE_NUMBER || ''
const MAX_RETRIES = 3
const RETRY_DELAY = 5000 // 5 seconds

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
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
    if (retries < MAX_RETRIES) {
      console.log(`SMS sending failed, retrying in ${RETRY_DELAY / 1000} seconds...`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return retrySendSMS(to, message, retries + 1)
    }
    console.error('Max retries reached. SMS sending failed:', error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate and convert input data
    const orderData: OrderData = {
      items: Array.isArray(body.items) ? body.items.map(item => ({
        name: String(item.name || ''),
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 0)
      })) : [],
      name: String(body.name || ''),
      mobile: String(body.mobile || ''),
      email: body.email ? String(body.email) : undefined,
      orderType: String(body.orderType || ''),
      paymentMethod: body.paymentMethod === 'credit-card' ? 'credit-card' : 'store',
      pickupTime: String(body.pickupTime || ''),
      subtotal: Number(body.subtotal || 0)
    }

    // Validate required fields
    if (orderData.items.length === 0 || !orderData.name || !orderData.mobile || !orderData.orderType || !orderData.paymentMethod || !orderData.pickupTime || isNaN(orderData.subtotal)) {
      return NextResponse.json({ success: false, message: 'Invalid input data' }, { status: 400 })
    }

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Create a new order in the database
      const order = await prisma.order.create({
        data: {
          name: orderData.name,
          mobile: orderData.mobile,
          email: orderData.email,
          orderType: orderData.orderType,
          paymentMethod: orderData.paymentMethod,
          pickupTime: orderData.pickupTime,
          subtotal: orderData.subtotal,
          status: 'processing',
          items: {
            create: orderData.items
          }
        }
      })

      // Prepare customer notification message
      const customerMessage = orderData.paymentMethod === 'store'
        ? `Your order #${order.id} has been placed successfully. Please pay $${orderData.subtotal.toFixed(2)} at the store during pickup. Thank you for your order!`
        : `Your order #${order.id} has been confirmed and paid. Thank you for your purchase!`

      // Prepare restaurant notification message
      const restaurantMessage = `New order #${order.id}:\n` +
        `Name: ${orderData.name}\n` +
        `Mobile: ${orderData.mobile}\n` +
        `Order Type: ${orderData.orderType}\n` +
        `Payment Method: ${orderData.paymentMethod === 'store' ? 'Pay at Store' : 'Credit Card'}\n` +
        `Pickup Time: ${orderData.pickupTime}\n` +
        `Total: $${orderData.subtotal.toFixed(2)}\n\n` +
        `Items:\n${orderData.items.map(item => `${item.name} x${item.quantity}`).join('\n')}`

      // Send SMS notifications with retry mechanism
      const customerSMSSuccess = await retrySendSMS(orderData.mobile, customerMessage)
      const restaurantSMSSuccess = await retrySendSMS(RESTAURANT_PHONE, restaurantMessage)

      // Update order status based on SMS sending results
      let finalStatus: string
      if (customerSMSSuccess && restaurantSMSSuccess) {
        finalStatus = orderData.paymentMethod === 'store' ? 'pending' : 'paid'
      } else {
        finalStatus = 'notification_failed'
      }

      // Update the order status
      const updatedOrder = await prisma.order.update({
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
      return NextResponse.json({ 
        success: true, 
        message: 'Order placed but notifications failed. Please contact the restaurant.', 
        orderId: result.order.id
      }, { status: 202 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order placed successfully', 
      orderId: result.order.id
    })
  } catch (error) {
    console.error('Error processing order:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ success: false, message: 'Failed to process order' }, { status: 500 })
  }
}