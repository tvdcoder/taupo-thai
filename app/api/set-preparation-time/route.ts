import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  try {
    const { orderId, preparationTime } = await req.json()

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { preparationTime },
      include: { items: true },
    })

    revalidatePath(`/confirm-order/${orderId}`)
    
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error setting preparation time:', error)
    return NextResponse.json(
      { error: 'Failed to set preparation time' },
      { status: 500 }
    )
  }
}