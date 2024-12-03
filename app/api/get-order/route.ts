// import { NextResponse } from 'next/server'
// import { prisma } from '../../../lib/prisma'

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url)
//   const id = searchParams.get('id')

//   if (!id) {
//     return NextResponse.json({ error: 'Missing order id' }, { status: 400 })
//   }

//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: parseInt(id) },
//       include: {
//         items: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//             quantity: true,
//             option: true
//           }
//         }
//       }
//     })

//     if (!order) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 })
//     }

//     return NextResponse.json(order)
//   } catch (error: any) {
//     console.error('Error fetching order:', error)
//     return NextResponse.json({ error: error.message || 'Failed to fetch order' }, { status: 500 })
//   }
// }


import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing order id' }, { status: 400 })
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Transform the items to include 'option' only if it exists
    const transformedItems = order.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      ...(item.option && { option: item.option })
    }))

    const transformedOrder = {
      ...order,
      items: transformedItems
    }

    return NextResponse.json(transformedOrder)
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch order' }, { status: 500 })
  }
}