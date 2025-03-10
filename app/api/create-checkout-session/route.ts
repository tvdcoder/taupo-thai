import { NextResponse } from 'next/server'
import stripe from '../../../stripe-config'
import { prisma } from '../../../lib/prisma'
import { formatNZPhoneNumber } from '../../../lib/utils'

const isValidNZPhoneNumber = (phone: string) => {
  // Updated regex to accept numbers with or without the "0" or "+64" prefix
  return /^(\+?64|0)?2\d{7,9}$/.test(phone.replace(/\s/g, ''))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, name, mobile, email, orderType, pickupTime } = body

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0 || !name || !mobile || !orderType || !pickupTime) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
    }

    // Validate New Zealand phone number
    if (!isValidNZPhoneNumber(mobile)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Create a pending order in the database
    const order = await prisma.order.create({
      data: {
        name,
        mobile: formatNZPhoneNumber(mobile),
        email: email || undefined,
        orderType,
        pickupTime,
        paymentMethod: 'credit-card',
        status: 'pending',
        subtotal,
        items: {
          create: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        }
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'nzd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order`,
      metadata: {
        orderId: order.id.toString(),
      },
    })

    return NextResponse.json({ sessionId: session.id, orderId: order.id })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 })
  }
}




// import { NextResponse } from 'next/server'
// import stripe from '../../../stripe-config'
// import { prisma } from '../../../lib/prisma'

// const isValidNZPhoneNumber = (phone: string) => {
//   // Updated regex to accept numbers with or without the "0" or "+64" prefix
//   return /^(\+?64|0)?2\d{7,9}$/.test(phone.replace(/\s/g, ''))
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const { items, name, mobile, email, orderType, pickupTime } = body

//     // Validate input
//     if (!items || !Array.isArray(items) || items.length === 0 || !name || !mobile || !orderType || !pickupTime) {
//       return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
//     }

//     // Validate New Zealand phone number
//     if (!isValidNZPhoneNumber(mobile)) {
//       return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
//     }

//     // Create a pending order in the database
//     const order = await prisma.order.create({
//       data: {
//         name,
//         mobile,
//         email: email || undefined,
//         orderType,
//         pickupTime,
//         paymentMethod: 'credit-card',
//         status: 'pending',
//         subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
//         items: {
//           create: items.map(item => ({
//             name: item.name,
//             price: item.price,
//             quantity: item.quantity
//           }))
//         }
//       }
//     })

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: items.map(item => ({
//         price_data: {
//           currency: 'nzd',
//           product_data: {
//             name: item.name,
//           },
//           unit_amount: Math.round(item.price * 100),
//         },
//         quantity: item.quantity,
//       })),
//       mode: 'payment',
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order`,
//       metadata: {
//         orderId: order.id.toString(),
//       },
//     })

//     return NextResponse.json({ sessionId: session.id, orderId: order.id })
//   } catch (error: any) {
//     console.error('Error creating checkout session:', error)
//     return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 })
//   }
// }