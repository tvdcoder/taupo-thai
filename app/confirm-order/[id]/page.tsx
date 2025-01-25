import { notFound } from 'next/navigation'
import { prisma } from '../../../lib/db'
import { Button } from '@/components/ui/button'

export default async function ConfirmOrderPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(params.id) },
    include: { items: true },
  })

  if (!order || order.status !== 'pending_confirmation') {
    notFound()
  }

  async function confirmOrder() {
    'use server'
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'confirmed' },
    })
    // TODO: Send confirmation SMS to customer
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Confirm Order #{order.id}</h1>
      <div className="mb-4">
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Mobile:</strong> {order.mobile}</p>
        <p><strong>Order Type:</strong> {order.orderType}</p>
        <p><strong>Pickup Time:</strong> {order.pickupTime}</p>
        <p><strong>Total:</strong> ${order.subtotal.toFixed(2)}</p>
      </div>
      <h2 className="text-xl font-bold mb-2">Items:</h2>
      <ul className="mb-4">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.name} {item.option && `(${item.option})`} x{item.quantity} - ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <form action={confirmOrder}>
        <Button type="submit">Confirm Order</Button>
      </form>
    </div>
  )
}