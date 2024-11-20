import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('admin_session')?.value

  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to last 100 orders for performance
      include: {
        items: true // Include the related items for each order
      }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}