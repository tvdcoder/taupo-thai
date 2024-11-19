import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { sendSMS } from '../../../lib/sendSMS'

const RESTAURANT_PHONE = process.env.RESTAURANT_PHONE_NUMBER || ''

async function sendNotifications(order: any) {
  const customerMessage = order.paymentMethod === 'store'
    ? `Your order #${order.id} has been placed successfully. Please pay $${order.subtotal.toFixed(2)} at the store during pickup. Thank you for your order!`
    : `Your order #${order.id} has been confirmed and paid. Thank you for your purchase!`

  const restaurantMessage = `New order #${order.id}:\n` +
    `Name: ${order.name}\n` +
    `Mobile: ${order.mobile}\n` +
    `Order Type: ${order.orderType}\n` +
    `Payment Method: ${order.paymentMethod === 'store' ? 'Pay at Store' : 'Credit Card'}\n` +
    `Pickup Time: ${order.pickupTime}\n` +
    `Total: $${order.subtotal.toFixed(2)}\n\n` +
    `Items:\n${order.items.map((item: any) => `${item.name} x${item.quantity}`).join('\n')}`

  await sendSMS(order.mobile, customerMessage)
  await sendSMS(RESTAURANT_PHONE, restaurantMessage)
}

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { items: true }
    })

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    if (order.status !== 'hold') {
      return NextResponse.json({ success: false, message: 'Order is not on hold' }, { status: 400 })
    }

    await sendNotifications(order)

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: order.paymentMethod === 'store' ? 'pending' : 'paid' }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Notifications sent successfully and order status updated', 
      orderId: updatedOrder.id
    })
  } catch (error) {
    console.error('Error retrying notifications:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ success: false, message: 'Failed to retry notifications' }, { status: 500 })
  }
}