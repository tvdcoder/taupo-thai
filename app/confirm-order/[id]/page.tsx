'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { formatDate } from '../../../lib/utils'

async function getOrder(id: string) {
  const response = await fetch(`/api/orders/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch order')
  }
  return response.json()
}

async function updateOrder(orderId: number, status: 'confirmed' | 'rejected', preparationTime: string) {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, preparationTime }),
  })
  if (!response.ok) {
    throw new Error('Failed to update order')
  }
  return response.json()
}

export default function ConfirmOrderPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getOrder(params.id)
      .then(setOrder)
      .finally(() => setIsLoading(false))
  }, [params.id])

  const handleUpdateOrder = async (status: 'confirmed' | 'rejected', preparationTime: string) => {
    try {
      await updateOrder(parseInt(params.id), status, preparationTime)
      router.push('/response-recorded')
    } catch (error) {
      console.error('Error updating order:', error)
      // Handle error (e.g., show an error message to the user)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!order || order.status !== 'pending_confirmation') {
    return <div>Order not found or already processed</div>
  }

  const preparationTimes = ['15min', '30min', '45min', '60min', '75min', '90min']

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-md mx-auto bg-white shadow-sm">
        <div className="flex flex-col items-center p-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2024-11-12_at_22.47.23-removebg-gbJQaR0Q1tJYvE9JxyBKyS18NwHiHQ.png"
            alt="Taupo Thai Logo"
            width={120}
            height={120}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold text-center mb-1">ORDER #{order.id}</h1>
          <p className="text-gray-600 text-sm mb-1">{formatDate(new Date(order.createdAt))}</p>
          <p className="font-medium">Taupo Thai Restaurant & Bar</p>
        </div>

        <div className="px-6 space-y-4">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium">
                  x{item.quantity} {item.name} {item.option && `(${item.option})`}
                </p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t pt-2">
            <div className="flex justify-between items-center font-bold">
              <p>Total:</p>
              <p>${order.subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-center mb-2">
            {order.orderType}, {order.paymentMethod === 'store' ? 'PAYABLE IN STORE' : 'PAID ONLINE'}
          </p>
          <div className="space-y-1">
            <p className="font-bold">CUSTOMER INFO:</p>
            <p>MOBILE: {order.mobile}</p>
            <p>NAME: {order.name}</p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <p className="text-center mb-1">Requested for {order.pickupTime}</p>
          <p className="text-center mb-4">Select Time</p>
          
          <div className="flex justify-center mb-4">
            <Button
              onClick={() => handleUpdateOrder('confirmed', 'Req. Time')}
              className="w-32 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded"
            >
              Req. Time
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {preparationTimes.map((time) => (
              <Button
                key={time}
                onClick={() => handleUpdateOrder('confirmed', time)}
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 text-black border border-gray-200 rounded"
              >
                {time}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => handleUpdateOrder('confirmed', '15min')}
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-3 text-lg rounded"
            >
              ACCEPT
            </Button>
            
            <Button 
              onClick={() => handleUpdateOrder('rejected', '')}
              className="w-full bg-[#f44336] hover:bg-[#da190b] text-white font-bold py-3 text-lg rounded"
            >
              REJECT
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}