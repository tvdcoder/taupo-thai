import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  const { orderId, preparationTime } = await req.json()

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { preparationTime: preparationTime },
    })

    revalidatePath(`/confirm-order/${orderId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error setting preparation time:', error)
    return NextResponse.json({ success: false, error: 'Failed to set preparation time' }, { status: 500 })
  }
}