'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { formatDate } from '../../../lib/utils'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  option?: string
  orderId: number
}

interface Order {
  id: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  subtotal: number
  orderType: string
  paymentMethod: string
  mobile: string
  name: string
  pickupTime: string
  preparationTime: string | null
  status: string
}

export default function ConfirmOrderClient({ order }: { order: Order }) {
  const [animatingButton, setAnimatingButton] = useState<string | null>(null)
  const [currentOrder, setCurrentOrder] = useState(order)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const preparationTimes = ['Req. Time', '15min', '30min', '45min', '60min', '75min', '90min']

  useEffect(() => {
    if (animatingButton) {
      const timer = setTimeout(() => setAnimatingButton(null), 300)
      return () => clearTimeout(timer)
    }
  }, [animatingButton])

  const handleButtonClick = async (action: string, value: string) => {
    setIsLoading(true) // Set loading state to true
    setAnimatingButton(action + value)
    setError(null) // Clear any previous errors
    try {
      if (action === 'preparationTime') {
        const response = await fetch('/api/set-preparation-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: currentOrder.id, preparationTime: value }),
        })
        if (response.ok) {
          const updatedOrder = await response.json()
          setCurrentOrder(updatedOrder)
        } else {
          throw new Error('Failed to update preparation time')
        }
      } else if (action === 'status') {
        const response = await fetch('/api/update-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            orderId: currentOrder.id, 
            status: value, 
            preparationTime: currentOrder.preparationTime || 'Req. Time' 
          }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update order status')
        }
        window.location.href = '/response-recorded'
      }
    } catch (error) {
      console.error('Error updating order:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setAnimatingButton(null)
      setIsLoading(false) // Set loading state to false
    }
  }

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
          <h1 className="text-3xl font-bold text-center mb-1">ORDER #{currentOrder.id}</h1>
          <p className="text-gray-600 text-sm mb-1">{formatDate(new Date(currentOrder.createdAt))}</p>
          <p className="font-medium">Taupo Thai Restaurant & Bar</p>
        </div>

        <div className="px-6 space-y-4">
          {currentOrder.items.map((item) => (
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
              <p>${currentOrder.subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-center mb-2">
            {currentOrder.orderType}, {currentOrder.paymentMethod === 'store' ? 'PAYABLE IN STORE' : 'PAID ONLINE'}
          </p>
          <div className="space-y-1">
            <p className="font-bold">CUSTOMER INFO:</p>
            <p>MOBILE: {currentOrder.mobile}</p>
            <p>NAME: {currentOrder.name}</p>
          </div>
        </div>

        {error && (
          <div className="px-6 py-4 bg-red-100 border border-red-400 text-red-700 mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="px-6 pb-6">
          <p className="text-center mb-1">Requested for {currentOrder.pickupTime}</p>
          <p className="text-center mb-4">Select Time</p>
          
          <div className="grid grid-cols-4 gap-2 mb-6">
            {preparationTimes.map((time) => (
              <Button
                key={time}
                onClick={() => handleButtonClick('preparationTime', time)}
                variant={time === currentOrder.preparationTime ? 'default' : 'outline'}
                className={`w-full ${time === currentOrder.preparationTime ? 'bg-[#4CAF50] text-white' : 'bg-white text-black'} hover:bg-[#45a049] hover:text-white border border-gray-200 rounded ${animatingButton === 'preparationTime' + time ? 'scale-95' : 'scale-100'} transition-transform duration-300`}
              >
                {time}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => handleButtonClick('status', 'confirmed')}
              className={`w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-3 text-lg rounded ${animatingButton === 'statusconfirmed' ? 'scale-95' : 'scale-100'} transition-transform duration-300`}
              disabled={isLoading} // Added disabled prop
            >
              {isLoading ? 'Processing...' : 'ACCEPT'} {/* Conditional rendering for loading state */}
            </Button>
            
            <Button 
              onClick={() => handleButtonClick('status', 'rejected')}
              className={`w-full bg-[#f44336] hover:bg-[#da190b] text-white font-bold py-3 text-lg rounded ${animatingButton === 'statusrejected' ? 'scale-95' : 'scale-100'} transition-transform duration-300`}
              disabled={isLoading} // Added disabled prop
            >
              {isLoading ? 'Processing...' : 'REJECT'} {/* Conditional rendering for loading state */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}