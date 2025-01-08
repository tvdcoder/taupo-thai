'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

interface OrderItem {
  name: string
  price: number
  quantity: number
  option?: string
}

interface Order {
  id: number
  name: string
  mobile: string
  orderType: string
  paymentMethod: string
  pickupTime: string
  subtotal: number
  items: OrderItem[]
  createdAt: string
  status: string
}

export default function ConfirmOrderPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/get-order?id=${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch order')
        }
        const data = await response.json()
        setOrder(data)
        setSelectedTime(data.pickupTime) // Set initial requested time
      } catch (error) {
        setError('Failed to load order details')
        console.error('Error:', error)
      }
    }

    fetchOrder()
  }, [params.id])

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleAction = async (action: 'accept' | 'reject') => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: params.id,
          action,
          updatedPickupTime: selectedTime
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order')
      }

      const result = await response.json()
      if (result.success) {
        // Show success message or redirect
        window.location.href = `/order-${action}ed/${params.id}`
      } else {
        setError(result.message || `Failed to ${action} order`)
      }
    } catch (error) {
      setError(`Failed to ${action} order. Please try again.`)
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-4">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-4">
          <div className="text-center">Loading order details...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2024-11-12_at_22.47.23-removebg-gbJQaR0Q1tJYvE9JxyBKyS18NwHiHQ.png"
            alt="Taupo Thai Restaurant Logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">ORDER #{order.id}</h1>
          <p className="text-gray-600">
            {new Date(order.createdAt).toLocaleString('en-NZ', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}
          </p>
          <p className="text-xl font-semibold">Taupo Thai Restaurant & Bar</p>
        </div>

        <div className="border-t border-b border-dashed py-4 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between mb-2">
              <div>
                <span>x{item.quantity} {item.name}</span>
                {item.option && (
                  <div className="text-sm text-gray-600">&gt; {item.option}</div>
                )}
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-4">
            <span>Total:</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-bold">{order.orderType}, {order.paymentMethod === 'store' ? 'PAYABLE IN STORE' : 'PAID ONLINE'}</p>
        </div>

        <div className="mb-4">
          <h2 className="font-bold mb-2">CUSTOMER INFO:</h2>
          <p>MOBILE: {order.mobile}</p>
          <p>NAME: {order.name}</p>
        </div>

        <div className="border-t border-dashed pt-4 mb-6">
          <p className="text-center mb-4 text-xl">Requested for {order.pickupTime}</p>
          <h2 className="text-center text-2xl mb-4">Select Time</h2>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {['Req. Time', '15min', '30min', '45min', '60min', '75min', '90min'].map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => handleTimeSelect(time)}
                className={time === 'Req. Time' ? 'bg-green-500 text-white hover:bg-green-600' : ''}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleAction('accept')}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white text-xl py-6"
          >
            ACCEPT
          </Button>
          <Button
            onClick={() => handleAction('reject')}
            disabled={isLoading}
            variant="destructive"
            className="text-xl py-6"
          >
            REJECT
          </Button>
        </div>

        {error && (
          <div className="mt-4 text-center text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}