'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import Image from 'next/image'

interface Order {
  id: number
  name: string
  mobile: string
  orderType: string
  paymentMethod: string
  status: string
  subtotal: number
  createdAt: string
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      const response = await fetch('/api/admin/auth', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      if (response.ok) {
        setIsAuthenticated(true)
        fetchOrders()
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const response = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (response.ok) {
      setIsAuthenticated(true)
      fetchOrders()
    } else {
      alert('Invalid password')
    }
    setIsLoading(false)
  }

  const fetchOrders = async () => {
    const response = await fetch('/api/admin/orders')
    if (response.ok) {
      const data = await response.json()
      setOrders(data)
    }
  }

  const handleDownloadStatement = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates')
      return
    }
    const response = await fetch(`/api/admin/generate-statement?startDate=${startDate}&endDate=${endDate}`)
    if (response.ok) {
      const blob = await response.blob()
      if (blob.size === 0) {
        alert('No orders found for the selected date range.')
      } else {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `statement_${startDate}_to_${endDate}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } else {
      alert('Failed to generate statement')
    }
  }

  const handleLogout = async () => {
    const response = await fetch('/api/admin/auth', { method: 'DELETE' })
    if (response.ok) {
      setIsAuthenticated(false)
      setOrders([])
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-white text-center">Loading...</div>
    }

    if (!isAuthenticated) {
      return (
        <div className="bg-black bg-opacity-75 p-8 rounded-lg max-w-md mx-auto">
          <h1 className="text-3xl font-serif text-yellow-400 text-center mb-8">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent border-gray-600 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800">Login</Button>
          </form>
        </div>
      )
    }

    return (
      <div className="bg-black bg-opacity-75 p-8 rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-yellow-400">Admin Dashboard</h1>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">Logout</Button>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Generate Statement</h2>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <Label htmlFor="startDate" className="text-white">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-white">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-gray-600 text-white"
              />
            </div>
            <Button onClick={handleDownloadStatement} className="bg-purple-700 hover:bg-purple-800">Download Statement</Button>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-white">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white bg-opacity-10 border border-gray-700">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-2 px-4 border-b border-gray-700">ID</th>
                <th className="py-2 px-4 border-b border-gray-700">Name</th>
                <th className="py-2 px-4 border-b border-gray-700">Mobile</th>
                <th className="py-2 px-4 border-b border-gray-700">Type</th>
                <th className="py-2 px-4 border-b border-gray-700">Payment</th>
                <th className="py-2 px-4 border-b border-gray-700">Status</th>
                <th className="py-2 px-4 border-b border-gray-700">Total</th>
                <th className="py-2 px-4 border-b border-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="text-white hover:bg-gray-700">
                  <td className="py-2 px-4 border-b border-gray-700">{order.id}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{order.name}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{order.mobile}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{order.orderType}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{order.paymentMethod}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{order.status}</td>
                  <td className="py-2 px-4 border-b border-gray-700">${order.subtotal.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
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
          {renderContent()}
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