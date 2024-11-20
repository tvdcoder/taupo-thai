import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('admin_session')?.value

  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Start date and end date are required' }, { status: 400 })
  }

  try {
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      include: {
        items: true
      }
    })

    const csvContent = generateCSV(orders)
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=statement_${startDate}_to_${endDate}.csv`
      }
    })
  } catch (error) {
    console.error('Error generating statement:', error)
    return NextResponse.json({ error: 'Failed to generate statement' }, { status: 500 })
  }
}

function generateCSV(orders: any[]) {
  const headers = ['Order ID', 'Date', 'Name', 'Mobile', 'Order Type', 'Payment Method', 'Status', 'Total', 'Items']
  const rows = orders.map(order => [
    order.id,
    order.createdAt.toISOString(),
    order.name,
    order.mobile,
    order.orderType,
    order.paymentMethod,
    order.status,
    order.subtotal.toFixed(2),
    order.items.map((item: any) => `${item.name} (${item.quantity})`).join(', ')
  ])

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
}