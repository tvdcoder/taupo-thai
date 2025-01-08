import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { sendSMS } from '../../../lib/sendSMS'

const RESTAURANT_PHONE = process.env.RESTAURANT_PHONE_NUMBER || ''

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId, action, updatedPickupTime } = body

    if (!orderId || !action || !['accept', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { items: true }
    })

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    if (order.status !== 'pending_confirmation') {
      return NextResponse.json({ success: false, message: 'Order is not pending confirmation' }, { status: 400 })
    }

    let newStatus: string
    let customerMessage: string
    let restaurantMessage: string

    if (action === 'accept') {
      newStatus = 'confirmed'
      customerMessage = `Your order #${order.id} has been confirmed. Please pay $${order.subtotal.toFixed(2)} at the store during pickup at ${updatedPickupTime}. Thank you!`
      restaurantMessage = `Order #${order.id} has been accepted. Pickup time: ${updatedPickupTime}`
    } else {
      newStatus = 'rejected'
      customerMessage = `We're sorry, but your order #${order.id} could not be accepted at this time. Please contact the restaurant for more information.`
      restaurantMessage = `Order #${order.id} has been rejected.`
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { 
        status: newStatus,
        pickupTime: action === 'accept' ? updatedPickupTime : order.pickupTime
      }
    })

    const customerSMSSuccess = await sendSMS(order.mobile, customerMessage)
    const restaurantSMSSuccess = await sendSMS(RESTAURANT_PHONE, restaurantMessage)

    if (!customerSMSSuccess || !restaurantSMSSuccess) {
      console.warn(`Failed to send SMS for order ${order.id}`)
    }

    return NextResponse.json({ 
      success: true, 
      message: `Order ${action}ed successfully`, 
      order: updatedOrder 
    })

  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update order status. Please try again.' 
    }, { status: 500 })
  }
}