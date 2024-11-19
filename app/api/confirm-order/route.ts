import { NextResponse } from 'next/server'
import stripe from '../../../stripe-config'
import { prisma } from '../../../lib/prisma'
import { sendSMS } from '../../../lib/sendSMS'
import { formatNZPhoneNumber } from '../../../lib/utils'


const RESTAURANT_PHONE = process.env.RESTAURANT_PHONE_NUMBER || ''

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  const orderId = searchParams.get('order_id')

  if (!sessionId || !orderId) {
    return NextResponse.json({ error: 'Missing session_id or order_id' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        include: { items: true }
      })

      if (!order) {
        throw new Error('Order not found')
      }

      const customerMessage = `Your order #${order.id} has been confirmed and paid. Thank you for your purchase!`

      const restaurantMessage = `New paid order #${order.id}:\n` +
        `Name: ${order.name}\n` +
        `Mobile: ${formatNZPhoneNumber(order.mobile)}\n` +
        `Order Type: ${order.orderType}\n` +
        `Payment Method: Credit Card\n` +
        `Pickup Time: ${order.pickupTime}\n` +
        `Total: $${order.subtotal.toFixed(2)}\n\n` +
        `Items:\n${order.items.map(item => `${item.name} x${item.quantity}`).join('\n')}`

      try {
        // Send SMS notification to customer
        await sendSMS(order.mobile, customerMessage)
        console.log('SMS notification sent successfully to customer')

        // Send SMS notification to restaurant
        await sendSMS(RESTAURANT_PHONE, restaurantMessage)
        console.log('SMS notification sent successfully to restaurant')

        // If both SMS notifications are sent successfully, update the order status
        await prisma.order.update({
          where: { id: parseInt(orderId) },
          data: { status: 'paid' }
        })

        // Redirect to the order success page
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order-success?order_id=${order.id}`)
      } catch (error) {
        console.error('Failed to send SMS notifications:', error)
        // If SMS notifications fail, don't update the order status and return an error
        return NextResponse.json({ error: 'Failed to send order notifications. Please try again or contact support.' }, { status: 500 })
      }
    } else {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Error confirming order:', error)
    return NextResponse.json({ error: error.message || 'Failed to confirm order' }, { status: 500 })
  }
}