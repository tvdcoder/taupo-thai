'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Spinner } from "../../../components/ui/spinner"
import { formatDate } from '../../../lib/utils'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  option?: string
}

interface Order {
  id: number
  createdAt: string
  items: OrderItem[]
  subtotal: number
  orderType: string
  paymentMethod: string
  mobile: string
  name: string
  pickupTime: string
  preparationTime: string
}

export default function ConfirmOrderPage({ order }: { order: Order }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState(order.preparationTime || 'Req. Time')

  const preparationTimes = ['Req. Time', '15min', '30min', '45min', '60min', '75min', '90min']

  const handleSetPreparationTime = async (time: string) => {
    setLoading(time)
    try {
      const response = await fetch('/api/set-preparation-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, preparationTime: time }),
      })
      if (response.ok) {
        setSelectedTime(time)
      } else {
        console.error('Failed to set preparation time')
      }
    } catch (error) {
      console.error('Error setting preparation time:', error)
    }
    setLoading(null)
  }

  const handleUpdateOrder = async (status: 'confirmed' | 'rejected') => {
    setLoading(status)
    try {
      const response = await fetch('/api/update-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, status, preparationTime: selectedTime }),
      })
      if (response.ok) {
        router.push('/response-recorded')
      } else {
        console.error('Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
    setLoading(null)
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
          <h1 className="text-3xl font-bold text-center mb-1">ORDER #{order.id}</h1>
          <p className="text-gray-600 text-sm mb-1">{formatDate(order.createdAt)}</p>
          <p className="font-medium">Taupo Thai Restaurant & Bar</p>
        </div>

        <div className="px-6 space-y-4">
          {order.items.map((item) => (
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
          
          <div className="grid grid-cols-4 gap-2 mb-6">
            {preparationTimes.map((time) => (
              <Button
                key={time}
                onClick={() => handleSetPreparationTime(time)}
                disabled={loading !== null}
                variant={time === selectedTime ? 'default' : 'outline'}
                className={`w-full ${time === selectedTime ? 'bg-[#4CAF50] text-white' : 'bg-white text-black'} hover:bg-[#45a049] hover:text-white border border-gray-200 rounded transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95`}
              >
                {loading === time ? <Spinner className="w-4 h-4" /> : time}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => handleUpdateOrder('confirmed')}
              disabled={loading !== null}
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-3 text-lg rounded transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            >
              {loading === 'confirmed' ? <Spinner className="w-6 h-6" /> : 'ACCEPT'}
            </Button>
            
            <Button 
              onClick={() => handleUpdateOrder('rejected')}
              disabled={loading !== null}
              className="w-full bg-[#f44336] hover:bg-[#da190b] text-white font-bold py-3 text-lg rounded transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
            >
              {loading === 'rejected' ? <Spinner className="w-6 h-6" /> : 'REJECT'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}




// import { notFound, redirect } from 'next/navigation'
// import Image from 'next/image'
// import { prisma } from '../../../lib/db'
// import { Button } from "@/components/ui/button"
// import { revalidatePath } from 'next/cache'
// import { sendSMS } from '../../../lib/sendSMS'
// import { formatDate } from '../../../lib/utils'

// async function getOrder(id: string) {
//   return await prisma.order.findUnique({
//     where: { id: parseInt(id) },
//     include: { items: true },
//   })
// }

// function calculateNewPickupTime(originalTime: string, additionalTime: string) {
//   if (additionalTime === 'Req. Time') return originalTime

//   const [hours, minutes] = originalTime.split(':').map(Number)
//   const additionalMinutes = parseInt(additionalTime)

//   const date = new Date()
//   date.setHours(hours, minutes + additionalMinutes)

//   return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
// }

// async function updateOrder(orderId: number, status: 'confirmed' | 'rejected', preparationTime: string) {
//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: orderId },
//     })

//     if (!order) {
//       throw new Error('Order not found')
//     }

//     const newPickupTime = calculateNewPickupTime(order.pickupTime, preparationTime)

//     const updatedOrder = await prisma.order.update({
//       where: { id: orderId },
//       data: { 
//         status: status,
//         preparationTime: preparationTime,
//         pickupTime: newPickupTime
//       },
//     })

//     if (status === 'confirmed') {
//       const customerMessage = `Your order #${updatedOrder.id} has been confirmed and will be ready for pickup at ${newPickupTime}. Thank you for choosing Taupo Thai!`
//       await sendSMS(updatedOrder.mobile, customerMessage)
//     } else {
//       const customerMessage = `We're sorry, but your order #${updatedOrder.id} cannot be accepted at this time. Please try again later or call us at 073765438.`
//       await sendSMS(updatedOrder.mobile, customerMessage)
//     }

//     revalidatePath(`/confirm-order/${orderId}`)
//     return { success: true, newPickupTime }
//   } catch (error) {
//     console.error('Error updating order:', error)
//     return { success: false, error: 'Failed to update order' }
//   }
// }

// async function handleUpdateOrder(formData: FormData) {
//   'use server'
  
//   const orderId = parseInt(formData.get('orderId') as string)
//   const status = formData.get('status') as 'confirmed' | 'rejected'
//   const preparationTime = formData.get('preparationTime') as string

//   if (!orderId) {
//     throw new Error('Order ID not found')
//   }

//   if (!status) {
//     throw new Error('Status is required')
//   }

//   const result = await updateOrder(orderId, status, preparationTime)
//   if (result.success) {
//     redirect('/response-recorded')
//   } else {
//     // Handle the error case, perhaps by showing an error message
//     console.error(result.error)
//     // You might want to add error handling UI here
//   }
// }

// async function handleSetPreparationTime(formData: FormData) {
//   'use server'
  
//   const orderId = parseInt(formData.get('orderId') as string)
//   const preparationTime = formData.get('preparationTime') as string

//   if (!orderId) {
//     throw new Error('Order ID not found')
//   }

//   try {
//     await prisma.order.update({
//       where: { id: orderId },
//       data: { preparationTime: preparationTime },
//     })

//     revalidatePath(`/confirm-order/${orderId}`)
//   } catch (error) {
//     console.error('Error setting preparation time:', error)
//   }
// }

// export default async function ConfirmOrderPage({ params }: { params: { id: string } }) {
//   const order = await getOrder(params.id)

//   if (!order || order.status !== 'pending_confirmation') {
//     notFound()
//   }

//   const preparationTimes = ['Req. Time', '15min', '30min', '45min', '60min', '75min', '90min']

//   return (
//     <div className="min-h-screen bg-[#f5f5f5]">
//       <div className="max-w-md mx-auto bg-white shadow-sm">
//         <div className="flex flex-col items-center p-6">
//           <Image
//             src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2024-11-12_at_22.47.23-removebg-gbJQaR0Q1tJYvE9JxyBKyS18NwHiHQ.png"
//             alt="Taupo Thai Logo"
//             width={120}
//             height={120}
//             className="mb-4"
//           />
//           <h1 className="text-3xl font-bold text-center mb-1">ORDER #{order.id}</h1>
//           <p className="text-gray-600 text-sm mb-1">{formatDate(order.createdAt)}</p>
//           <p className="font-medium">Taupo Thai Restaurant & Bar</p>
//         </div>

//         <div className="px-6 space-y-4">
//           {order.items.map((item) => (
//             <div key={item.id} className="flex justify-between items-center">
//               <div className="flex-1">
//                 <p className="font-medium">
//                   x{item.quantity} {item.name} {item.option && `(${item.option})`}
//                 </p>
//               </div>
//               <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
//             </div>
//           ))}
//           <div className="border-t pt-2">
//             <div className="flex justify-between items-center font-bold">
//               <p>Total:</p>
//               <p>${order.subtotal.toFixed(2)}</p>
//             </div>
//           </div>
//         </div>

//         <div className="px-6 py-4">
//           <p className="text-center mb-2">
//             {order.orderType}, {order.paymentMethod === 'store' ? 'PAYABLE IN STORE' : 'PAID ONLINE'}
//           </p>
//           <div className="space-y-1">
//             <p className="font-bold">CUSTOMER INFO:</p>
//             <p>MOBILE: {order.mobile}</p>
//             <p>NAME: {order.name}</p>
//           </div>
//         </div>

//         <form action={handleSetPreparationTime}>
//           <input type="hidden" name="orderId" value={order.id} />
//           <div className="px-6 pb-6">
//             <p className="text-center mb-1">Requested for {order.pickupTime}</p>
//             <p className="text-center mb-4">Select Time</p>
            
//             <div className="grid grid-cols-4 gap-2 mb-6">
//               {preparationTimes.map((time) => (
//                 <Button
//                   key={time}
//                   type="submit"
//                   name="preparationTime"
//                   value={time}
//                   variant={time === order.preparationTime ? 'default' : 'outline'}
//                   className={`w-full ${time === order.preparationTime ? 'bg-[#4CAF50] text-white' : 'bg-white text-black'} hover:bg-[#45a049] hover:text-white border border-gray-200 rounded`}
//                 >
//                   {time}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         </form>

//         <form action={handleUpdateOrder}>
//           <input type="hidden" name="orderId" value={order.id} />
//           <input type="hidden" name="preparationTime" value={order.preparationTime || 'Req. Time'} />
//           <div className="px-6 pb-6">
//             <div className="grid grid-cols-2 gap-4">
//               <Button 
//                 type="submit"
//                 name="status"
//                 value="confirmed"
//                 className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-3 text-lg rounded"
//               >
//                 ACCEPT
//               </Button>
              
//               <Button 
//                 type="submit"
//                 name="status"
//                 value="rejected"
//                 className="w-full bg-[#f44336] hover:bg-[#da190b] text-white font-bold py-3 text-lg rounded"
//               >
//                 REJECT
//               </Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }