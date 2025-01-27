import { notFound } from 'next/navigation'
import { prisma } from '../../../lib/prisma'
import ConfirmOrderClient from './ConfirmOrderClient'

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { items: true },
  })

  if (order) {
    return {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }
  }

  return null
}

export default async function ConfirmOrderPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)

  if (!order || order.status !== 'pending_confirmation') {
    notFound()
  }

  return <ConfirmOrderClient order={order} />
}