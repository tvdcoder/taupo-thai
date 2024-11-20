'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Image from 'next/image'

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
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FInal%20background-1QBTDWqBZCuDtvk4nL5549cN20arkv.jpeg')"}}>
      <div className="min-h-screen bg-black bg-opacity-50 flex flex-col">
        <header className="bg-black bg-opacity-75 text-white py-4">
          <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-4 sm:mb-0">
              <Link href="/" className="h-12 w-12">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2024-11-12_at_22.47.23-removebg-gbJQaR0Q1tJYvE9JxyBKyS18NwHiHQ.png"
                  alt="Taupo Thai Restaurant Logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </Link>
              <nav className="mt-4 sm:mt-0">
                <ul className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-8 font-medium">
                  <li><Link href="/" className="hover:text-yellow-400">HOME</Link></li>
                  <li><Link href="/menu" className="hover:text-yellow-400">MENU</Link></li>
                  <li><Link href="/about" className="hover:text-yellow-400">ABOUT</Link></li>
                  <li><Link href="/contact" className="hover:text-yellow-400">CONTACT</Link></li>
                </ul>
              </nav>
            </div>
            <Link href="/order" className="mt-4 sm:mt-0">
              <Button className="bg-purple-700 hover:bg-purple-800 w-full sm:w-auto">
                ORDER ONLINE
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 sm:py-16">
          <div className="bg-white bg-opacity-90 shadow-md rounded-lg p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Order Confirmed!</h1>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Order #{orderDetails.id}</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {orderDetails.name}</p>
              <p><strong>Mobile:</strong> {orderDetails.mobile}</p>
              <p><strong>Order Type:</strong> {orderDetails.orderType}</p>
              <p><strong>Pickup Time:</strong> {orderDetails.pickupTime}</p>
              <p><strong>Payment Method:</strong> {orderDetails.paymentMethod === 'store' ? 'Pay at Store' : 'Credit Card'}</p>
            </div>
            
            <h3 className="text-lg sm:text-xl font-semibold mt-6 mb-2">Order Items:</h3>
            <ul className="space-y-2">
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
        </main>

        <footer className="bg-black bg-opacity-75 text-white py-4 mt-auto text-sm">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p>&copy; 2024 Taupo Thai Restaurant & Bar. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}



// 'use client'

// import { useEffect, useState } from 'react'
// import { useSearchParams } from 'next/navigation'
// import Link from 'next/link'
// import { Button } from "@/components/ui/button"

// interface OrderDetails {
//   id: number
//   name: string
//   mobile: string
//   orderType: string
//   pickupTime: string
//   items: Array<{ name: string; quantity: number; price: number }>
//   subtotal: number
//   paymentMethod: string
// }

// export default function OrderSuccessPage() {
//   const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const searchParams = useSearchParams()

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       const orderId = searchParams.get('order_id')
//       if (!orderId) {
//         setError('Order ID not found')
//         setLoading(false)
//         return
//       }

//       try {
//         const response = await fetch(`/api/get-order?id=${orderId}`)
//         if (!response.ok) {
//           throw new Error('Failed to fetch order details')
//         }
//         const data = await response.json()
//         setOrderDetails(data)
//       } catch (err) {
//         setError('Error fetching order details')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchOrderDetails()
//   }, [searchParams])

//   if (loading) {
//     return <div className="text-center py-10">Loading order details...</div>
//   }

//   if (error || !orderDetails) {
//     return <div className="text-center py-10 text-red-500">{error || 'Order details not found'}</div>
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">Order Confirmed!</h1>
//       <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
//         <h2 className="text-2xl font-semibold mb-4">Order #{orderDetails.id}</h2>
//         <p><strong>Name:</strong> {orderDetails.name}</p>
//         <p><strong>Mobile:</strong> {orderDetails.mobile}</p>
//         <p><strong>Order Type:</strong> {orderDetails.orderType}</p>
//         <p><strong>Pickup Time:</strong> {orderDetails.pickupTime}</p>
//         <p><strong>Payment Method:</strong> {orderDetails.paymentMethod === 'store' ? 'Pay at Store' : 'Credit Card'}</p>
        
//         <h3 className="text-xl font-semibold mt-6 mb-2">Order Items:</h3>
//         <ul>
//           {orderDetails.items.map((item, index) => (
//             <li key={index} className="flex justify-between">
//               <span>{item.name} x{item.quantity}</span>
//               <span>${(item.price * item.quantity).toFixed(2)}</span>
//             </li>
//           ))}
//         </ul>
        
//         <p className="mt-4 text-xl font-bold">Total: ${orderDetails.subtotal.toFixed(2)}</p>
        
//         {orderDetails.paymentMethod === 'store' && (
//           <p className="mt-4 text-red-500 font-semibold">Please remember to pay ${orderDetails.subtotal.toFixed(2)} at the store during pickup.</p>
//         )}
        
//         <div className="mt-8 text-center">
//           <Link href="/">
//             <Button className="bg-purple-600 hover:bg-purple-700 text-white">
//               Return to Home
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }