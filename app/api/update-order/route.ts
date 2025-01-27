import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { sendSMS } from '../../../lib/sendSMS'
import { revalidatePath } from 'next/cache'

function calculateNewPickupTime(originalTime: string, additionalTime: string) {
  if (additionalTime === 'Req. Time') return originalTime

  const [hours, minutes] = originalTime.split(':').map(Number)
  const additionalMinutes = parseInt(additionalTime)

  const date = new Date()
  date.setHours(hours, minutes + additionalMinutes)

  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId, status, preparationTime } = body

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const newPickupTime = calculateNewPickupTime(order.pickupTime, preparationTime)

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { 
        status,
        preparationTime,
        pickupTime: newPickupTime
      }
    })

    if (status === 'confirmed') {
      const customerMessage = `Your order #${updatedOrder.id} has been confirmed and will be ready for pickup at ${newPickupTime}. Thank you for choosing Taupo Thai!`
      await sendSMS(updatedOrder.mobile, customerMessage)
    } else if (status === 'rejected') {
      const customerMessage = `We're sorry, but your order #${updatedOrder.id} cannot be accepted at this time. Please try again later or call us at 073765438.`
      await sendSMS(updatedOrder.mobile, customerMessage)
    }

    revalidatePath(`/confirm-order/${orderId}`)
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}