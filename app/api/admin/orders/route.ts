import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'default_password'

export async function GET() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('admin_auth')
  
  if (!authCookie || authCookie.value !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to last 100 orders for performance
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}