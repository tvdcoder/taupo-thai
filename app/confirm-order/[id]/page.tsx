import { notFound } from 'next/navigation'
import { prisma } from '../../../lib/prisma'
import ConfirmOrderClient from './ConfirmOrderClient'

async function getOrder(id: string) {
  return await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { items: true },
  })
}

export default async function ConfirmOrderPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)

  if (!order || order.status !== 'pending_confirmation') {
    notFound()
  }

  return <ConfirmOrderClient order={order} />
}