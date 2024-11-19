// import { NextResponse } from 'next/server'
// import twilio from 'twilio'

// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN
// const client = twilio(accountSid, authToken)

// function formatNZPhoneNumber(phone: string): string {
//   // Remove any non-digit characters
//   const digits = phone.replace(/\D/g, '')
//   // Add +64 prefix if not present
//   return digits.startsWith('64') ? `+${digits}` : `+64${digits.slice(1)}`
// }

// export async function POST(req: Request) {
//   try {
//     const { orderId, name, items, subtotal, pickupTime, paymentMethod, mobile } = await req.json()

//     if (!orderId || !name || !items || !subtotal || !pickupTime || !paymentMethod || !mobile) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
//     }

//     const message = paymentMethod === 'store'
//       ? `Your order #${orderId} has been placed successfully. Please pay $${subtotal.toFixed(2)} at the store during pickup. Thank you for your order!`
//       : `Your order #${orderId} has been confirmed and paid. Thank you for your purchase!`

//     const formattedMessage = `
// ${message}

// Order details:
// ${items.map(item => `- ${item.name} x${item.quantity}`).join('\n')}

// Total: $${subtotal.toFixed(2)}
// Pickup time: ${pickupTime}

// Thank you for choosing Taupo Thai Restaurant!
//     `.trim()

//     const formattedPhone = formatNZPhoneNumber(mobile)

//     await client.messages.create({
//       body: formattedMessage,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: formattedPhone
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error('Error sending SMS notification:', error)
//     return NextResponse.json({ error: 'Failed to send SMS notification' }, { status: 500 })
//   }
// }

import { NextResponse } from 'next/server'
import { sendSMS } from '../../../lib/sendSMS'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface SMSRequestBody {
  items: OrderItem[]
  name: string
  mobile: string
  orderType: string
  paymentMethod: string
  pickupTime: string
  subtotal: number
}

export async function POST(req: Request) {
  try {
    const {
      items,
      name,
      mobile,
      orderType,
      paymentMethod,
      pickupTime,
      subtotal
    }: SMSRequestBody = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid items data' },
        { status: 400 }
      )
    }

    const message = `Thank you for your order at Taupo Thai!

Order details:
${items.map((item: OrderItem) => `- ${item.name} x${item.quantity}`).join('\n')}

Total: $${subtotal.toFixed(2)}
Pickup time: ${pickupTime}

Payment method: ${paymentMethod === 'store' ? 'Pay at store' : 'Credit card'}
Order type: ${orderType}

If you have any questions, please call us at 07 376 5438.`

    await sendSMS(mobile, message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending SMS:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send SMS' },
      { status: 500 }
    )
  }
}