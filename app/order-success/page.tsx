'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

interface OrderDetails {
  id: number
  name: string
  mobile: string
  orderType: string
  pickupTime: string
  items: Array<{ name: string; quantity: number; price: number }>
  subtotal: number
  paymentMethod: string
}

export default function OrderSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = searchParams.get('order_id')
      if (!orderId) {
        setError('Order ID not found')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/get-order?id=${orderId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch order details')
        }
        const data = await response.json()
        setOrderDetails(data)
      } catch (err) {
        setError('Error fetching order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [searchParams])

  if (loading) {
    return <div className="text-center py-10">Loading order details...</div>
  }

  if (error || !orderDetails) {
    return <div className="text-center py-10 text-red-500">{error || 'Order details not found'}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Confirmed!</h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Order #{orderDetails.id}</h2>
        <p><strong>Name:</strong> {orderDetails.name}</p>
        <p><strong>Mobile:</strong> {orderDetails.mobile}</p>
        <p><strong>Order Type:</strong> {orderDetails.orderType}</p>
        <p><strong>Pickup Time:</strong> {orderDetails.pickupTime}</p>
        <p><strong>Payment Method:</strong> {orderDetails.paymentMethod === 'store' ? 'Pay at Store' : 'Credit Card'}</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-2">Order Items:</h3>
        <ul>
          {orderDetails.items.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        
        <p className="mt-4 text-xl font-bold">Total: ${orderDetails.subtotal.toFixed(2)}</p>
        
        {orderDetails.paymentMethod === 'store' && (
          <p className="mt-4 text-red-500 font-semibold">Please remember to pay ${orderDetails.subtotal.toFixed(2)} at the store during pickup.</p>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}