import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { revalidatePath } from 'next/cache'
import { sendSMS } from '../../../lib/sendSMS'

export async function POST(req: Request) {
  try {
    const { orderId, status, preparationTime } = await req.json()

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { 
        status,
        preparationTime
      },
      include: { items: true }
    })

    if (status === 'confirmed') {
      const customerMessage = `Your order #${updatedOrder.id} has been confirmed and will be ready for pickup at ${updatedOrder.pickupTime}. Thank you for choosing Taupo Thai!`
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