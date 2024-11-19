import { NextResponse } from 'next/server'
import { sendWhatsApp } from '../../../lib/sendWhatsApp'

export async function POST(req: Request) {
  try {
    const { 
      orderId,
      name,
      mobile,
      email,
      orderType,
      paymentMethod,
      items,
      subtotal,
      pickupTime
    } = await req.json()
    
    if (!orderId || !name || !mobile || !orderType || !paymentMethod || !items || !subtotal || !pickupTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const restaurantWhatsAppNumber = process.env.RESTAURANT_WHATSAPP_NUMBER

    if (!restaurantWhatsAppNumber) {
      throw new Error('Restaurant WhatsApp number is not configured')
    }

    const message = `
New order #${orderId} received!

Order Type: ${orderType.charAt(0).toUpperCase() + orderType.slice(1)}
Payment Method: ${paymentMethod === 'store' ? 'Pay at Store' : 'Credit Card'}

Order details:
${items.map(item => `- ${item.name} x${item.quantity}`).join('\n')}

Total: $${subtotal.toFixed(2)}
Time of Pickup: ${pickupTime}

Customer details:
Name: ${name}
Phone: ${mobile}
${email ? `Email: ${email}` : ''}

Please prepare the order for ${orderType === 'takeaway' ? 'pickup' : 'dine-in'}.
    `.trim()

    await sendWhatsApp(restaurantWhatsAppNumber, message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
    return NextResponse.json({ error: 'Failed to send WhatsApp notification' }, { status: 500 })
  }
}