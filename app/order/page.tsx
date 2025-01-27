'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Clock, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const menuCategories = [
  { title: "Starters", color: "bg-red-300", items: [
    { name: "Thai Curry Puff Chicken (4pc)", price: 13.50, description: "Deep fried chicken and vegetables wrapped in puff pastry" },
    { name: "Pak Tod (6pc)", price: 13.50, description: "Deep fried mixed vegetables with sweet chilli sauce" },
    { name: "Thai Spring Roll (4pc)", price: 12.50, description: "Mixed vegetables, vermicelli rolled in rice pastry" },
    { name: "Chilli mussels (6pc)", price: 17.50, description: "Green chilli mussels steamed with thai herbs" },
    { name: "Combination Entries", price: 16.50, description: "Spring roll, curry Puff, Prawn Toast & Satay Gai" },
    { name: "Money Bag (4pc)", price: 14.50, description: "Minced pork and prawn with three spice mix and grounded peanuts, sweet corn wrapped in pastry and golden deep fried" },
    { name: "Satay Gai (Chicken) (4pc)", price: 15.50, description: "Grilled marinated chicken with peanut sauce" },
    { name: "Prawn Toast (4pc)", price: 14.50 },
    { name: "Thai fish cakes (4pc)", price: 14.50, description: "Fish mixed with chilli paste herbs and fresh beans" },
    { name: "Salt & Pepper Squid (6pc)", price: 13.50 },
    { name: "Goong Groob", price: 14.50, description: "Deep fried King prawns with sesame seeds" },
    { name: "Prawn Twisters (6pc)", price: 13.50 }
  ]},
  { title: "Salads & Soups", color: "bg-green-300", items: [
    { name: "Tom yum mushroom soup", price: 11.50, description: "Traditional thai soup cooked with lemongrass, lemon juice, mushroom and chilli" },
    { name: "Tom yum chicken soup", price: 13.50, description: "Traditional thai soup cooked with lemongrass, lemon juice, mushroom and chilli" },
    { name: "Tom yum Prawn or seafood soup (big pot)", price: 29.50, description: "Traditional thai soup cooked with lemongrass, lemon juice, mushroom and chilli" },
    { name: "Tom kha mushroom soup", price: 11.50, description: "Soup cooked in a delicious coconut milk, lemon juice, lemongrass, galangal & chilli" },
    { name: "Tom kha chicken soup", price: 13.50, description: "Soup cooked in a delicious coconut milk, lemon juice, lemongrass, galangal & chilli" },
    { name: "Tom kha prawn or seafood soup (Big Pot)", price: 29.50, description: "Soup cooked in a delicious coconut milk, lemon juice, lemongrass, galangal & chilli" },
    { name: "Thai pork salad (Num Tok)", price: 26.90, description: "Slices of grilled pork with chilli, lemon juice and mint" },
    { name: "Thai beef salad (Yum neau)", price: 26.90, description: "Hot & sour beef thai style" },
    { name: "Thai seafood salad (Yum talay)", price: 29.90, description: "Hot & sour combination seafood with thai herbs and salad" },
    { name: "Larb (duck or duck salad)", price: 29.90, description: "Spicy BBQ duck with lemon dressing, red onion, mint, chilli and ground roasted rice and garden salad" }
  ]},
  { title: "Curry", color: "bg-yellow-300", items: [
    { name: "Thai red curry", price: 27.95, description: "Red curry cooked with coconut milk and bamboo shoots", options: ["chicken", "beef", "pork"] },
    { name: "Thai red curry", price: 30.95, description: "Red curry cooked with coconut milk and bamboo shoots", options: ["prawn", "seafood", "duck", "lamb"] },
    { name: "Thai green curry", price: 27.95, description: "Green curry cooked with coconut milk and bamboo shoots", options: ["chicken", "beef", "pork"] },
    { name: "Thai green curry", price: 30.95, description: "Green curry cooked with coconut milk and bamboo shoots", options: ["prawn", "seafood", "duck", "lamb"] },
    { name: "Masaman curry", price: 27.95, description: "Chunky meat curry cooked with coconut milk and potato", options: ["chicken", "beef", "pork"] },
    { name: "Masaman curry", price: 30.95, description: "Chunky meat curry cooked with coconut milk and potato", options: ["prawn", "seafood", "duck", "lamb"] },
    { name: "Yellow curry", price: 27.95, description: "Yellow Curry with potato, onion and thai spices", options: ["chicken", "beef", "pork"] },
    { name: "Yellow curry", price: 30.95, description: "Yellow Curry with potato, onion and thai spices", options: ["prawn", "seafood", "duck", "lamb"] },
    { name: "Panang curry", price: 27.95, description: "Cooked with pumpkin, green beans and crushed peanuts", options: ["chicken", "beef", "pork"] },
    { name: "Panang curry", price: 30.95, description: "Cooked with pumpkin, green beans and crushed peanuts", options: ["prawn", "seafood", "duck", "lamb"] },
    { name: "Choo Chee curry", price: 27.95, description: "Red curry cooked with coconut milk, Lime leaves and capsicums", options: ["chicken", "beef", "pork"] },
    { name: "Choo Chee curry", price: 30.95, description: "Red curry cooked with coconut milk, Lime leaves and capsicums", options: ["prawn", "seafood", "duck", "lamb"] },
    { name: "Jungle curry", price: 27.95, description: "Traditional spicy herb curry with vegetables", options: ["chicken", "beef", "pork"] },
    { name: "Jungle curry", price: 30.95, description: "Traditional spicy herb curry with vegetables", options: ["prawn", "seafood", "duck", "lamb"] }
  ]},
  { title: "Stir Fry", color: "bg-orange-300", items: [
    { name: "Pad Gra Prow - Basil & Chilli", price: 28.95, description: "Chilli, garlic, bamboo, beans and basil leaves", options: ["chicken", "beef", "pork"] },
    { name: "Pad Gra Prow - Basil & Chilli", price: 31.95, description: "Chilli, garlic, bamboo, beans and basil leaves", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
    { name: "Pad Priew Wan - Sweet & Sour", price: 28.95, description: "Thai sweet and sour sauce with tomato, onion and pineapple", options: ["chicken", "beef", "pork"] },
    { name: "Pad Priew Wan - Sweet & Sour", price: 31.95, description: "Thai sweet and sour sauce with tomato, onion and pineapple", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
    { name: "Pad khing - Ginger", price: 28.95, description: "Stir fried vegetables, mushroom with ginger and oyster sauce", options: ["chicken", "beef", "pork"] },
    { name: "Pad khing - Ginger", price: 31.95, description: "Stir fried vegetables, mushroom with ginger and oyster sauce", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
    { name: "Pad Graw Tiam - Garlic & Pepper", price: 28.95, description: "Fresh garlic, pepper sauce and market vegetables", options: ["chicken", "beef", "pork"] },
    { name: "Pad Graw Tiam - Garlic & Pepper", price: 31.95, description: "Fresh garlic, pepper sauce and market vegetables", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
    { name: "Pad namman hoi - Oyster sauce", price: 28.95, description: "Mixed vegetable, mushroom in oyster sauce", options: ["chicken", "beef", "pork"] },
    { name: "Pad namman hoi - Oyster sauce", price: 31.95, description: "Mixed vegetable, mushroom in oyster sauce", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
    { name: "Pad Prik Gaeng", price: 28.95, description: "Stir fried beans, chilli paste, coconut cream and lime leaves", options: ["chicken", "beef", "pork"] },
    { name: "Pad Prik Gaeng", price: 31.95, description: "Stir fried beans, chilli paste, coconut cream and lime leaves", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
    { name: "Pad Med Himmaparn - Cashew nut", price: 28.95, description: "Thai chilli paste with cashew nut, market vegetables and thai sauce", options: ["chicken", "beef", "pork"] },
    { name: "Pad Med Himmaparn -Cashew nut", price: 31.95, description: "Thai chilli paste with cashew nut, market vegetables and thai sauce", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
    { name: "Pra - ram - Peanut", price: 28.95, description: "Market vegetables in oyster sauce topped with peanut sauce", options: ["chicken", "beef", "pork"] },
    { name: "Pineapple Stir fry", price: 28.95, description: "Cooked with choice of meat and pineapple and vegetables", options: ["chicken", "beef", "pork"] },
    { name: "Pineapple Stir fry", price: 31.95, description: "Cooked with choice of meat and pineapple and vegetables", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
    { name: "Tamarind Stir fry", price: 31.95, description: "Cooked with choice of meat, steamed vegetables, tamarind juice and oyster sauce", options: ["prawn", "duck"] },
    { name: "Whole Snapper (Garlic & Pepper sauce)", price: 39.95, description: "Deep fried whole snapper with garlic & pepper sauce" },
    { name: "Whole Snapper (Sweet & Sour sauce)", price: 39.95, description: "Deep fried whole snapper with sweet & sour sauce" },
    { name: "Choo Chee (Whole snapper)", price: 39.95 },
    { name: "Choo Chee (Prawn / fish fillet)", price: 39.95 }
  ]},
  { title: "Vegetarian", color: "bg-green-400", items: [
    { name: "Gaeng Kiew wang Jay (Green curry)", price: 22.99, description: "Green curry with tofu, vegetables, bean curd and coconut milk" },
    { name: "Gaeng Panang Jay (Panang curry)", price: 22.99, description: "Panang curry with tofu, vegetables and coconut milk" },
    { name: "Pad Med Mam Himmaparn (Cashew nut)", price: 25.50, description: "Stir fry tofu with sweet chilli, vegetables and cashew nuts" },
    { name: "Pad Prew Wan Jay (Sweet & sour)", price: 25.50, description: "Stir fry mixed vegetables, tofu with sweet & sour thai style sauce" },
    { name: "Pad Gra Prow Jay (Basil & chilli)", price: 25.50, description: "Stir fry tofu with mixed vegetables, chilli and basil leaves" },
    { name: "Pad Thai Jay", price: 23.99, description: "Stir fry thai noodle with tofu, eggs, beans sprouts, spring onions and crushed peanuts" },
    { name: "Kao Pad Jay", price: 22.99, description: "Special fried rice with vegetables, cashew nuts and option of egg" },
    { name: "Param Long Song", price: 22.99, description: "Steamed vegetables with thai peanut sauce" },
    { name: "Pineapple fried rice", price: 22.99, description: "Stir fry mixed vegetables with pineapple" },
    { name: "Tom Kha Jay (soup)", price: 11.50, description: "Spicy tofu, bamboo shoots, mushroom and coconut milk" },
    { name: "Tom Yum Jay (soup)", price: 11.50, description: "Hot & sour mushroom with tofu and lemongrass flavour" }
  ]},
  { title: "Rice & Noodles", color: "bg-yellow-400", items: [
    { name: "Kao Pad", price: 26.99, description: "Thai fried rice with egg, spring onion, tomato and vegetables", options: ["chicken", "beef", "pork"] },
    { name: "Kao Pad", price: 28.99, description: "Thai fried rice with egg, spring onion, tomato and vegetables", options: ["prawn", "lamb", "squid"] },
    { name: "Pad Thai", price: 26.99, description: "Rice noodle with egg, beansporut, onion, carrot, spring onion and crushed peanut", options: ["chicken", "beef", "pork"] },
    { name: "Pad Thai", price: 28.99, description: "Rice noodle with egg, beansporut, onion, carrot, spring onion and crushed peanut", options: ["prawn", "lamb", "squid"] },
    { name: "Drunken Noodle", price: 26.99, description: "Fried noodle with basil leaves, chilli, garlic, carrot & bamboo", options: ["chicken", "beef", "pork"] },
    { name: "Drunken Noodle", price: 28.99, description: "Fried noodle with basil leaves, chilli, garlic, carrot & bamboo", options: ["prawn", "lamb", "squid"] },
    { name: "Kao Pad Sapparos", price: 26.99, description: "Thai fried rice with pineapple, cashew nut and curry powder", options: ["chicken", "beef", "pork"] },
    { name: "Kao Pad Sapparos", price: 28.99, description: "Thai fried rice with pineapple, cashew nut and curry powder", options: ["prawn", "lamb", "squid"] },
    { name: "Pad Se - iw", price: 26.99, description: "Fried noodle with dark soy sauce, egg, carrot and green vegetables", options: ["chicken", "beef", "pork"] },
    { name: "Pad Se - iw", price: 28.99, description: "Fried noodle with dark soy sauce, egg, carrot and green vegetables", options: ["prawn", "lamb", "squid"] },
    { name: "Kao Pad Ka Praw", price: 26.99, description: "Rice cooked with chilli, garlic, carrot, bean, zucchini & bamboo", options: ["chicken", "beef", "pork"] },
    { name: "Kao Pad Ka Praw", price: 28.99, description: "Rice cooked with chilli, garlic, carrot, bean, zucchini & bamboo", options: ["prawn", "lamb", "squid"] }
  ]},
  { title: "Desserts", color: "bg-pink-300", items: [
    { name: "Ice cream sundae (Choc / Vanilla)", price: 11.50 },
    { name: "Banana Split", price: 11.50 },
    { name: "Deep fried ice cream", price: 13.50 },
    { name: "Deep fried banana", price: 11.50 },
    { name: "Strawberry Cheesecake", price: 11.50 },
    { name: "Roti (Bread)", price: 4.50 }
  ]},
  { title: "Chef Specials", color: "bg-purple-300", items: [
    { name: "Steak", price: 36.95 },
    { name: "Chicken nuggets (6pc) & Chips", price: 16.00 },
    { name: "Crispy pork and veggie stir fry", price: 24.90 },
    { name: "Fish & Chips", price: 20.00 }
  ]}
]

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  option?: string
}

export default function Component() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [orderType, setOrderType] = useState('takeaway')
  const [paymentMethod, setPaymentMethod] = useState('store')
  const [pickupTime, setPickupTime] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [pickupTimes, setPickupTimes] = useState<string[]>([])
  const tabsListRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setPickupTimes(generatePickupTimes())
  }, [])

  const addToCart = (item: { name: string; price: number; options?: string[] }, selectedOption?: string) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => 
        cartItem.name === item.name && cartItem.option === selectedOption
      )
      if (existingItem) {
        return currentCart.map(cartItem =>
          cartItem.name === item.name && cartItem.option === selectedOption
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...currentCart, { 
        id: Date.now(), 
        ...item, 
        quantity: 1, 
        option: selectedOption 
      }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    )
  }

  const getItemQuantityInCart = (itemName: string, option?: string) => {
    const item = cart.find(cartItem => cartItem.name === itemName && cartItem.option === option)
    return item ? item.quantity : 0
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const isValidNZPhoneNumber = (phone: string) => {
    const cleanedNumber = phone.replace(/\D/g, '');
    return /^(0|64)?2\d{7,9}$/.test(cleanedNumber);
  }

  const formatPhoneNumber = (phone: string) => {
    const cleanedNumber = phone.replace(/\D/g, '');
    if (cleanedNumber.startsWith('0')) {
      return '64' + cleanedNumber.slice(1);
    } else if (!cleanedNumber.startsWith('64')) {
      return '64' + cleanedNumber;
    }
    return cleanedNumber;
  }

  const isFormValid = () => {
    return name.trim() !== '' && 
           isValidNZPhoneNumber(mobile) && 
           pickupTime !== '' && 
           cart.length > 0 &&
           ['takeaway', 'dine-in'].includes(orderType) &&
           ['store', 'credit-card'].includes(paymentMethod)
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!isFormValid()) {
      setError('Please fill in all required fields correctly and add items to your cart.')
      setIsLoading(false)
      return
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          option: item.option
        })),
        name,
        mobile: formatPhoneNumber(mobile),
        email,
        orderType,
        paymentMethod,
        pickupTime,
        subtotal,
      };

      if (paymentMethod === 'credit-card') {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to create checkout session')
        }

        const stripe = await stripePromise
        if (!stripe) {
          throw new Error('Failed to load Stripe')
        }

        const { error } = await stripe.redirectToCheckout({
          sessionId: result.sessionId,
        })

        if (error) {
          throw error
        }
      } else {
        const response = await fetch('/api/place-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Failed to place order')
        }

        if (result.success) {
          router.push(`/order-success?order_id=${result.orderId}`)
        } else {
          setError(`${result.message} Your order ID is ${result.orderId}. Please contact the restaurant for confirmation.`)
        }
      }
    } catch (error: any) {
      console.error('Error processing order:', error)
      setError(`There was an error processing your order: ${error.message}. Please try again or contact the restaurant.`)
    } finally {
      setIsLoading(false)
    }
  }

  const generatePickupTimes = () => {
    const times = []
    const now = new Date()
    const nzTime = new Date(now.toLocaleString("en-US", {timeZone: "Pacific/Auckland"}))
    
    if (nzTime.getDay() === 0) {
      return ["Closed on Sundays"]
    }

    const currentHour = nzTime.getHours()
    const currentMinute = nzTime.getMinutes()

    for (let hour = 11; hour < 21; hour++) {
      if (hour >= 14 && hour < 17) continue;

      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 11 && minute < 30) continue;
        if (hour === 21 && minute > 0) break;

        if (hour > currentHour || (hour === currentHour && minute > currentMinute + 30)) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          times.push(time)
        }
      }
    }

    if (times.length === 0) {
      for (let hour = 11; hour < 21; hour++) {
        if (hour >= 14 && hour < 17) continue;
        for (let minute = 0; minute < 60; minute += 15) {
          if (hour === 11 && minute < 30) continue;
          if (hour === 21 && minute > 0) break;
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          times.push(time)
        }
      }
    }

    return times
  }

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = direction === 'left' ? -100 : 100
      tabsListRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FInal%20background-1QBTDWqBZCuDtvk4nL5549cN20arkv.jpeg')"}}>
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

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row bg-white bg-opacity-90 my-8 rounded-lg">
        <div className="w-full lg:w-2/3 pr-0 lg:pr-8 mb-8 lg:mb-0">
          <h1 className="text-3xl font-bold mb-6">Order Online</h1>
          <Tabs defaultValue={menuCategories[0].title}>
            <div className="relative mb-4">
              <Button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 text-black hover:bg-opacity-75 rounded-full p-1 -ml-4"
                onClick={() => scrollTabs('left')}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <TabsList
                ref={tabsListRef}
                className="bg-gray-200 flex overflow-x-auto whitespace-nowrap scrollbar-hide w-full"
                style={{ scrollBehavior: 'smooth' }}
              >
                {menuCategories.map((category) => (
                  <TabsTrigger 
                    key={category.title} 
                    value={category.title} 
                    className={`px-4 py-2 font-bold text-black transition-all duration-200 ease-in-out ${category.color}
                      data-[state=active]:shadow-md data-[state=active]:translate-y-[-4px] 
                      data-[state=active]:border-b-4 data-[state=active]:border-black`}
                  >
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 text-black hover:bg-opacity-75 rounded-full p-1 -mr-4"
                onClick={() => scrollTabs('right')}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            {menuCategories.map((category) => (
              <TabsContent key={category.title} value={category.title} className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {category.items.map((item, index) => (
                    <div key={index} className="border p-4 rounded-lg bg-white shadow-md">
                      <h3 className="font-bold">{item.name}</h3>
                      <p>${item.price.toFixed(2)}</p>
                      {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                      {item.options ? (
                        <div className="mt-2">
                          <Select onValueChange={(value) => addToCart(item, value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              {item.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="flex items-center mt-2">
                          {getItemQuantityInCart(item.name) > 0 ? (
                            <div className="flex items-center">
                              <Button 
                                onClick={() => updateQuantity(cart.find(cartItem => cartItem.name === item.name)?.id || 0, getItemQuantityInCart(item.name) - 1)} 
                                className="p-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="mx-2 font-bold">{getItemQuantityInCart(item.name)}</span>
                              <Button 
                                onClick={() => updateQuantity(cart.find(cartItem => cartItem.name === item.name)?.id || 0, getItemQuantityInCart(item.name) + 1)} 
                                className="p-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              onClick={() => addToCart(item)} 
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Your Order</h2>
            <div className="max-h-[400px] overflow-y-auto mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex flex-col mb-4 border-b pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {item.name}
                      {item.option && <span className="text-sm text-gray-600"> ({item.option})</span>}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <Button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 mr-1">-</Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 mr-1">+</Button>
                    </div>
                    <Button onClick={() => removeFromCart(item.id)} className="px-2 py-1">Remove</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xl font-bold">Subtotal: ${subtotal.toFixed(2)}</div>
          </div>
          <form className="mt-6 space-y-4" onSubmit={placeOrder}>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number (New Zealand) *</Label>
              <Input 
                id="mobile" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
                required 
                placeholder="e.g. 021 123 4567 or 03 456 7890"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Order Type</Label>
              <RadioGroup value={orderType} onValueChange={setOrderType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dine-in" id="dine-in" />
                  <Label htmlFor="dine-in">Dine-in</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="takeaway" id="takeaway" />
                  <Label htmlFor="takeaway">Takeaway</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="store">Pay at Store</SelectItem>
                  <SelectItem value="credit-card">Pay with Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pickup Time *</Label>
              <Select value={pickupTime} onValueChange={setPickupTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup time" />
                </SelectTrigger>
                <SelectContent>
                  {pickupTimes.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && (
              <div className="text-red-500 font-bold">{error}</div>
            )}
            <Button 
              type="submit" 
              disabled={!isFormValid() || isLoading || pickupTimes[0] === "Closed on Sundays"} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading 
                ? 'Processing...' 
                : pickupTimes[0] === "Closed on Sundays"
                  ? 'Closed on Sundays'
                  : paymentMethod === 'credit-card' ? 'Proceed to Payment' : 'Place Order'
              }
            </Button>
          </form>
        </div>
      </main>

      <footer className="bg-black bg-opacity-75 text-white py-4 mt-auto text-sm">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-serif text-yellow-400 mb-2">Taupo Thai Restaurant & Bar</h3>
              <p className="flex items-center mb-1">
                <MapPin className="mr-2 h-3 w-3" />
                100 Roberts Street, Taupo
              </p>
              <p className="flex items-center mb-1">
                <Phone className="mr-2 h-3 w-3" />
                073765438 (L.Line)
              </p>
              <p className="flex items-center mb-1">
                <Phone className="mr-2 h-3 w-3" />
                0272344252 (Mob)
              </p>
              <p className="flex items-center mb-1">
                <Phone className="mr-2 h-3 w-3" />
                0226545258 (Mob)
              </p>
              <p className="flex items-center">
                <Clock className="mr-2 h-3 w-3" />
                Open 7 Days: 11:30am - Late
              </p>
            </div>
            <div className="sm:text-right mt-4 sm:mt-0">
              <h3 className="text-base font-semibold mb-2 text-yellow-400">Quick Links</h3>
              <nav>
                <ul className="space-y-1">
                  <li><Link href="/menu" className="hover:text-yellow-400">Menu</Link></li>
                  <li><Link href="/about" className="hover:text-yellow-400">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-yellow-400">Contact</Link></li>
                  <li><Link href="/order" className="hover:text-yellow-400">Order Online</Link></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}






// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import Image from 'next/image'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { MapPin, Phone, Clock, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
// import { loadStripe } from '@stripe/stripe-js'

// const menuCategories = [
//   { title: "Starters", color: "bg-red-300", items: [
//     { name: "Thai Curry Puff Chicken (4pc)", price: 13.50, description: "Deep fried chicken and vegetables wrapped in puff pastry" },
//     { name: "Pak Tod (6pc)", price: 13.50, description: "Deep fried mixed vegetables with sweet chilli sauce" },
//     { name: "Thai Spring Roll (4pc)", price: 12.50, description: "Mixed vegetables, vermicelli rolled in rice pastry" },
//     { name: "Chilli mussels (6pc)", price: 17.50, description: "Green chilli mussels steamed with thai herbs" },
//     { name: "Combination Entries", price: 16.50, description: "Spring roll, curry Puff, Prawn Toast & Satay Gai" },
//     { name: "Money Bag (4pc)", price: 14.50, description: "Minced pork and prawn with three spice mix and grounded peanuts, sweet corn wrapped in pastry and golden deep fried" },
//     { name: "Satay Gai (Chicken) (4pc)", price: 15.50, description: "Grilled marinated chicken with peanut sauce" },
//     { name: "Prawn Toast (4pc)", price: 14.50 },
//     { name: "Thai fish cakes (4pc)", price: 14.50, description: "Fish mixed with chilli paste herbs and fresh beans" },
//     { name: "Salt & Pepper Squid (6pc)", price: 13.50 },
//     { name: "Goong Groob", price: 14.50, description: "Deep fried King prawns with sesame seeds" },
//     { name: "Prawn Twisters (6pc)", price: 13.50 }
//   ]},
//   { title: "Salads & Soups", color: "bg-green-300", items: [
//     { name: "Tom yum mushroom soup", price: 11.50, description: "Traditional thai soup cooked with lemongrass, lemon juice, mushroom and chilli" },
//     { name: "Tom yum chicken soup", price: 13.50, description: "Traditional thai soup cooked with lemongrass, lemon juice, mushroom and chilli" },
//     { name: "Tom yum Prawn or seafood soup (big pot)", price: 29.50, description: "Traditional thai soup cooked with lemongrass, lemon juice, mushroom and chilli" },
//     { name: "Tom kha mushroom soup", price: 11.50, description: "Soup cooked in a delicious coconut milk, lemon juice, lemongrass, galangal & chilli" },
//     { name: "Tom kha chicken soup", price: 13.50, description: "Soup cooked in a delicious coconut milk, lemon juice, lemongrass, galangal & chilli" },
//     { name: "Tom kha prawn or seafood soup (Big Pot)", price: 29.50, description: "Soup cooked in a delicious coconut milk, lemon juice, lemongrass, galangal & chilli" },
//     { name: "Thai pork salad (Num Tok)", price: 26.90, description: "Slices of grilled pork with chilli, lemon juice and mint" },
//     { name: "Thai beef salad (Yum neau)", price: 26.90, description: "Hot & sour beef thai style" },
//     { name: "Thai seafood salad (Yum talay)", price: 29.90, description: "Hot & sour combination seafood with thai herbs and salad" },
//     { name: "Larb (duck or duck salad)", price: 29.90, description: "Spicy BBQ duck with lemon dressing, red onion, mint, chilli and ground roasted rice and garden salad" }
//   ]},
//   { title: "Curry", color: "bg-yellow-300", items: [
//     { name: "Thai red curry", price: 27.95, description: "Red curry cooked with coconut milk and bamboo shoots", options: ["chicken", "beef", "pork"] },
//     { name: "Thai red curry", price: 30.95, description: "Red curry cooked with coconut milk and bamboo shoots", options: ["prawn", "seafood", "duck", "lamb"] },
//     { name: "Thai green curry", price: 27.95, description: "Green curry cooked with coconut milk and bamboo shoots", options: ["chicken", "beef", "pork"] },
//     { name: "Thai green curry", price: 30.95, description: "Green curry cooked with coconut milk and bamboo shoots", options: ["prawn", "seafood", "duck", "lamb"] },
//     { name: "Masaman curry", price: 27.95, description: "Chunky meat curry cooked with coconut milk and potato", options: ["chicken", "beef", "pork"] },
//     { name: "Masaman curry", price: 30.95, description: "Chunky meat curry cooked with coconut milk and potato", options: ["prawn", "seafood", "duck", "lamb"] },
//     { name: "Yellow curry", price: 27.95, description: "Yellow Curry with potato, onion and thai spices", options: ["chicken", "beef", "pork"] },
//     { name: "Yellow curry", price: 30.95, description: "Yellow Curry with potato, onion and thai spices", options: ["prawn", "seafood", "duck", "lamb"] },
//     { name: "Panang curry", price: 27.95, description: "Cooked with pumpkin, green beans and crushed peanuts", options: ["chicken", "beef", "pork"] },
//     { name: "Panang curry", price: 30.95, description: "Cooked with pumpkin, green beans and crushed peanuts", options: ["prawn", "seafood", "duck", "lamb"] },
//     { name: "Choo Chee curry", price: 27.95, description: "Red curry cooked with coconut milk, Lime leaves and capsicums", options: ["chicken", "beef", "pork"] },
//     { name: "Choo Chee curry", price: 30.95, description: "Red curry cooked with coconut milk, Lime leaves and capsicums", options: ["prawn", "seafood", "duck", "lamb"] },
//     { name: "Jungle curry", price: 27.95, description: "Traditional spicy herb curry with vegetables", options: ["chicken", "beef", "pork"] },
//     { name: "Jungle curry", price: 30.95, description: "Traditional spicy herb curry with vegetables", options: ["prawn", "seafood", "duck", "lamb"] }
//   ]},
//   { title: "Stir Fry", color: "bg-orange-300", items: [
//     { name: "Pad Gra Prow - Basil & Chilli", price: 28.95, description: "Chilli, garlic, bamboo, beans and basil leaves", options: ["chicken", "beef", "pork"] },
//     { name: "Pad Gra Prow - Basil & Chilli", price: 31.95, description: "Chilli, garlic, bamboo, beans and basil leaves", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
//     { name: "Pad Priew Wan - Sweet & Sour", price: 28.95, description: "Thai sweet and sour sauce with tomato, onion and pineapple", options: ["chicken", "beef", "pork"] },
//     { name: "Pad Priew Wan - Sweet & Sour", price: 31.95, description: "Thai sweet and sour sauce with tomato, onion and pineapple", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
//     { name: "Pad khing - Ginger", price: 28.95, description: "Stir fried vegetables, mushroom with ginger and oyster sauce", options: ["chicken", "beef", "pork"] },
//     { name: "Pad khing - Ginger", price: 31.95, description: "Stir fried vegetables, mushroom with ginger and oyster sauce", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
//     { name: "Pad Graw Tiam - Garlic & Pepper", price: 28.95, description: "Fresh garlic, pepper sauce and market vegetables", options: ["chicken", "beef", "pork"] },
//     { name: "Pad Graw Tiam - Garlic & Pepper", price: 31.95, description: "Fresh garlic, pepper sauce and market vegetables", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
//     { name: "Pad namman hoi - Oyster sauce", price: 28.95, description: "Mixed vegetable, mushroom in oyster sauce", options: ["chicken", "beef", "pork"] },
//     { name: "Pad namman hoi - Oyster sauce", price: 31.95, description: "Mixed vegetable, mushroom in oyster sauce", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
//     { name: "Pad Prik Gaeng", price: 28.95, description: "Stir fried beans, chilli paste, coconut cream and lime leaves", options: ["chicken", "beef", "pork"] },
//     { name: "Pad Prik Gaeng", price: 31.95, description: "Stir fried beans, chilli paste, coconut cream and lime leaves", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
//     { name: "Pad Med Himmaparn - Cashew nut", price: 28.95, description: "Thai chilli paste with cashew nut, market vegetables and thai sauce", options: ["chicken", "beef", "pork"] },
//     { name: "Pad Med Himmaparn -Cashew nut", price: 31.95, description: "Thai chilli paste with cashew nut, market vegetables and thai sauce", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
//     { name: "Pra - ram - Peanut", price: 28.95, description: "Market vegetables in oyster sauce topped with peanut sauce", options: ["chicken", "beef", "pork"] },
//     { name: "Pineapple Stir fry", price: 28.95, description: "Cooked with choice of meat and pineapple and vegetables", options: ["chicken", "beef", "pork"] },
//     { name: "Pineapple Stir fry", price: 31.95, description: "Cooked with choice of meat and pineapple and vegetables", options: ["prawn", "squid", "fish", "seafood", "duck", "lamb"] },
//     { name: "Tamarind Stir fry", price: 31.95, description: "Cooked with choice of meat, steamed vegetables, tamarind juice and oyster sauce", options: ["prawn", "duck"] },
//     { name: "Whole Snapper (Garlic & Pepper sauce)", price: 39.95, description: "Deep fried whole snapper with garlic & pepper sauce" },
//     { name: "Whole Snapper (Sweet & Sour sauce)", price: 39.95, description: "Deep fried whole snapper with sweet & sour sauce" },
//     { name: "Choo Chee (Whole snapper)", price: 39.95 },
//     { name: "Choo Chee (Prawn / fish fillet)", price: 39.95 }
//   ]},
//   { title: "Vegetarian", color: "bg-green-400", items: [
//     { name: "Gaeng Kiew wang Jay (Green curry)", price: 22.99, description: "Green curry with tofu, vegetables, bean curd and coconut milk" },
//     { name: "Gaeng Panang Jay (Panang curry)", price: 22.99, description: "Panang curry with tofu, vegetables and coconut milk" },
//     { name: "Pad Med Mam Himmaparn (Cashew nut)", price: 25.50, description: "Stir fry tofu with sweet chilli, vegetables and cashew nuts" },
//     { name: "Pad Prew Wan Jay (Sweet & sour)", price: 25.50, description: "Stir fry mixed vegetables, tofu with sweet & sour thai style sauce" },
//     { name: "Pad Gra Prow Jay (Basil & chilli)", price: 25.50, description: "Stir fry tofu with mixed vegetables, chilli and basil leaves" },
//     { name: "Pad Thai Jay", price: 23.99, description: "Stir fry thai noodle with tofu, eggs, beans sprouts, spring onions and crushed peanuts" },
//     { name: "Kao Pad Jay", price: 22.99, description: "Special fried rice with vegetables, cashew nuts and option of egg" },
//     { name: "Param Long Song", price: 22.99, description: "Steamed vegetables with thai peanut sauce" },
//     { name: "Pineapple fried rice", price: 22.99, description: "Stir fry mixed vegetables with pineapple" },
//     { name: "Tom Kha Jay (soup)", price: 11.50, description: "Spicy tofu, bamboo shoots, mushroom and coconut milk" },
//     { name: "Tom Yum Jay (soup)", price: 11.50, description: "Hot & sour mushroom with tofu and lemongrass flavour" }
//   ]},
//   { title: "Rice & Noodles", color: "bg-yellow-400", items: [
//     { name: "Kao Pad", price: 26.99, description: "Thai fried rice with egg, spring onion, tomato and vegetables", options: ["chicken", "beef", "pork"] },
//     { name: "Kao Pad", price: 28.99, description: "Thai fried rice with egg, spring onion, tomato and vegetables", options: ["prawn", "lamb", "squid"] },
//     { name: "Pad Thai", price: 26.99, description: "Rice noodle with egg, beansporut, onion, carrot, spring onion and crushed peanut", options: ["chicken", "beef", "pork"] },
//     { name: "Pad Thai", price: 28.99, description: "Rice noodle with egg, beansporut, onion, carrot, spring onion and crushed peanut", options: ["prawn", "lamb", "squid"] },
//     { name: "Drunken Noodle", price: 26.99, description: "Fried noodle with basil leaves, chilli, garlic, carrot & bamboo", options: ["chicken", "beef", "pork"] },
//     { name: "Drunken Noodle", price: 28.99, description: "Fried noodle with basil leaves, chilli, garlic, carrot & bamboo", options: ["prawn", "lamb", "squid"] },
//     { name: "Kao Pad Sapparos", price: 26.99, description: "Thai fried rice with pineapple, cashew nut and curry powder", options: ["chicken", "beef", "pork"] },
//     { name: "Kao Pad Sapparos", price: 28.99, description: "Thai fried rice with pineapple, cashew nut and curry powder", options: ["prawn", "lamb", "squid"] },
//     { name: "Pad Se - iw", price: 26.99, description: "Fried noodle with dark soy sauce, egg, carrot and green vegetables", options: ["chicken", "beef", "pork"] },
//     { name: "Pad Se - iw", price: 28.99, description: "Fried noodle with dark soy sauce, egg, carrot and green vegetables", options: ["prawn", "lamb", "squid"] },
//     { name: "Kao Pad Ka Praw", price: 26.99, description: "Rice cooked with chilli, garlic, carrot, bean, zucchini & bamboo", options: ["chicken", "beef", "pork"] },
//     { name: "Kao Pad Ka Praw", price: 28.99, description: "Rice cooked with chilli, garlic, carrot, bean, zucchini & bamboo", options: ["prawn", "lamb", "squid"] }
//   ]},
//   { title: "Desserts", color: "bg-pink-300", items: [
//     { name: "Ice cream sundae (Choc / Vanilla)", price: 11.50 },
//     { name: "Banana Split", price: 11.50 },
//     { name: "Deep fried ice cream", price: 13.50 },
//     { name: "Deep fried banana", price: 11.50 },
//     { name: "Strawberry Cheesecake", price: 11.50 },
//     { name: "Roti (Bread)", price: 4.50 }
//   ]},
//   { title: "Chef Specials", color: "bg-purple-300", items: [
//     { name: "Steak", price: 36.95 },
//     { name: "Chicken nuggets (6pc) & Chips", price: 16.00 },
//     { name: "Crispy pork and veggie stir fry", price: 24.90 },
//     { name: "Fish & Chips", price: 20.00 }
//   ]}
// ]

// type CartItem = {
//   id: number
//   name: string
//   price: number
//   quantity: number
//   option?: string
// }

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// export default function Component() {
//   const [cart, setCart] = useState<CartItem[]>([])
//   const [name, setName] = useState('')
//   const [mobile, setMobile] = useState('')
//   const [email, setEmail] = useState('')
//   const [orderType, setOrderType] = useState('takeaway')
//   const [paymentMethod, setPaymentMethod] = useState('store')
//   const [pickupTime, setPickupTime] = useState('')
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [pickupTimes, setPickupTimes] = useState<string[]>([])
//   const tabsListRef = useRef<HTMLDivElement>(null)
//   const router = useRouter()

//   useEffect(() => {
//     setPickupTimes(generatePickupTimes())
//   }, [])

//   const addToCart = (item: { name: string; price: number; options?: string[] }, selectedOption?: string) => {
//     setCart(currentCart => {
//       const existingItem = currentCart.find(cartItem => 
//         cartItem.name === item.name && cartItem.option === selectedOption
//       )
//       if (existingItem) {
//         return currentCart.map(cartItem =>
//           cartItem.name === item.name && cartItem.option === selectedOption
//             ? { ...cartItem, quantity: cartItem.quantity + 1 }
//             : cartItem
//         )
//       }
//       return [...currentCart, { 
//         id: Date.now(), 
//         ...item, 
//         quantity: 1, 
//         option: selectedOption 
//       }]
//     })
//   }

//   const removeFromCart = (id: number) => {
//     setCart(currentCart => currentCart.filter(item => item.id !== id))
//   }

//   const updateQuantity = (id: number, quantity: number) => {
//     setCart(currentCart =>
//       currentCart.map(item =>
//         item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
//       ).filter(item => item.quantity > 0)
//     )
//   }

//   const getItemQuantityInCart = (itemName: string, option?: string) => {
//     const item = cart.find(cartItem => cartItem.name === itemName && cartItem.option === option)
//     return item ? item.quantity : 0
//   }

//   const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

//   const isValidNZPhoneNumber = (phone: string) => {
//     const cleanedNumber = phone.replace(/\D/g, '');
//     return /^(0|64)?2\d{7,9}$/.test(cleanedNumber);
//   }

//   const formatPhoneNumber = (phone: string) => {
//     const cleanedNumber = phone.replace(/\D/g, '');
//     if (cleanedNumber.startsWith('0')) {
//       return '64' + cleanedNumber.slice(1);
//     } else if (!cleanedNumber.startsWith('64')) {
//       return '64' + cleanedNumber;
//     }
//     return cleanedNumber;
//   }

//   const isFormValid = () => {
//     return name.trim() !== '' && 
//            isValidNZPhoneNumber(mobile) && 
//            pickupTime !== '' && 
//            cart.length > 0 &&
//            ['takeaway', 'dine-in'].includes(orderType) &&
//            ['store', 'credit-card'].includes(paymentMethod)
//   }

//   const placeOrder = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setIsLoading(true)

//     if (!isFormValid()) {
//       setError('Please fill in all required fields correctly and add items to your cart.')
//       setIsLoading(false)
//       return
//     }

//     if (paymentMethod === 'store') {
//       const confirmOrder = window.confirm("Please note that once placed, this order cannot be cancelled. Do you want to proceed?")
//       if (!confirmOrder) {
//         setIsLoading(false)
//         return
//       }
//     }

//     try {
//       const orderData = {
//         items: cart.map(item => ({
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           option: item.option
//         })),
//         name,
//         mobile: formatPhoneNumber(mobile),
//         email,
//         orderType,
//         paymentMethod,
//         pickupTime,
//         subtotal,
//       };

//       if (paymentMethod === 'credit-card') {
//         const stripe = await stripePromise
//         if (!stripe) {
//           throw new Error('Stripe failed to load')
//         }

//         const response = await fetch('/api/create-checkout-session', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(orderData),
//         })

//         const data = await response.json()

//         if (!response.ok) {
//           throw new Error(data.error || 'Failed to create checkout session')
//         }

//         const { sessionId } = data
//         console.log('Redirecting to Stripe checkout with session ID:', sessionId)
//         const { error } = await stripe.redirectToCheckout({ sessionId })

//         if (error) {
//           throw error
//         }
//       } else {
//         const response = await fetch('/api/place-order', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(orderData),
//         })

//         const result = await response.json()

//         if (!response.ok) {
//           throw new Error(result.message || 'Failed to place order')
//         }

//         if (result.success) {
//           router.push(`/order-success?order_id=${result.orderId}`)
//         } else {
//           setError(`${result.message} Your order ID is ${result.orderId}. Please contact the restaurant for confirmation.`)
//         }
//       }
//     } catch (error: any) {
//       console.error('Error processing order:', error)
//       setError(`There was an error processing your order: ${error.message}. Please try again or contact the restaurant.`)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const generatePickupTimes = () => {
//     const times = []
//     const now = new Date()
//     const nzTime = new Date(now.toLocaleString("en-US", {timeZone: "Pacific/Auckland"}))
    
//     // Sunday check removed for testing
//     // if (nzTime.getDay() === 0) {
//     //   return ["Closed on Sundays"]
//     // }

//     const currentHour = nzTime.getHours()
//     const currentMinute = nzTime.getMinutes()

//     for (let hour = 11; hour < 21; hour++) {
//       // Skip hours between 14:00 and 17:00
//       if (hour >= 14 && hour < 17) continue;

//       for (let minute = 0; minute < 60; minute += 15) {
//         // Start from 11:30
//         if (hour === 11 && minute < 30) continue;
        
//         // Stop at 21:00
//         if (hour === 21 && minute > 0) break;

//         // Only include times that are at least 30 minutes in the future
//         if (hour > currentHour || (hour === currentHour && minute > currentMinute + 30)) {
//           const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
//           times.push(time)
//         }
//       }
//     }

//     // If no times are available today, show times for tomorrow
//     if (times.length === 0) {
//       for (let hour = 11; hour < 21; hour++) {
//         if (hour >= 14 && hour < 17) continue;
//         for (let minute = 0; minute < 60; minute += 15) {
//           if (hour === 11 && minute < 30) continue;
//           if (hour === 21 && minute > 0) break;
//           const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
//           times.push(time)
//         }
//       }
//     }

//     return times
//   }

//   const scrollTabs = (direction: 'left' | 'right') => {
//     if (tabsListRef.current) {
//       const scrollAmount = direction === 'left' ? -100 : 100
//       tabsListRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
//     }
//   }

//   return (
//     <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FInal%20background-1QBTDWqBZCuDtvk4nL5549cN20arkv.jpeg')"}}>
//       <header className="bg-black bg-opacity-75 text-white py-4">
//         <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between">
//           <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-4 sm:mb-0">
//             <Link href="/" className="h-12 w-12">
//               <Image
//                 src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2024-11-12_at_22.47.23-removebg-gbJQaR0Q1tJYvE9JxyBKyS18NwHiHQ.png"
//                 alt="Taupo Thai Restaurant Logo"
//                 width={48}
//                 height={48}
//                 className="h-full w-full object-contain"
//               />
//             </Link>
//             <nav className="mt-4 sm:mt-0">
//               <ul className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-8 font-medium">
//                 <li><Link href="/" className="hover:text-yellow-400">HOME</Link></li>
//                 <li><Link href="/menu" className="hover:text-yellow-400">MENU</Link></li>
//                 <li><Link href="/about" className="hover:text-yellow-400">ABOUT</Link></li>
//                 <li><Link href="/contact" className="hover:text-yellow-400">CONTACT</Link></li>
//               </ul>
//             </nav>
//           </div>
//           <Link href="/order" className="mt-4 sm:mt-0">
//             <Button className="bg-purple-700 hover:bg-purple-800 w-full sm:w-auto">
//               ORDER ONLINE
//             </Button>
//           </Link>
//         </div>
//       </header>

//       <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row bg-white bg-opacity-90 my-8 rounded-lg">
//         <div className="w-full lg:w-2/3 pr-0 lg:pr-8 mb-8 lg:mb-0">
//           <h1 className="text-3xl font-bold mb-6">Order Online</h1>
//           <Tabs defaultValue={menuCategories[0].title}>
//             <div className="relative mb-4">
//               <Button
//                 className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 text-black hover:bg-opacity-75 rounded-full p-1 -ml-4"
//                 onClick={() => scrollTabs('left')}
//               >
//                 <ChevronLeft className="h-6 w-6" />
//               </Button>
//               <TabsList
//                 ref={tabsListRef}
//                 className="bg-gray-200 flex overflow-x-auto whitespace-nowrap scrollbar-hide w-full"
//                 style={{ scrollBehavior: 'smooth' }}
//               >
//                 {menuCategories.map((category) => (
//                   <TabsTrigger 
//                     key={category.title} 
//                     value={category.title} 
//                     className={`px-4 py-2 font-bold text-black transition-all duration-200 
// ease-in-out ${category.color}
//                       data-[state=active]:shadow-md data-[state=active]:translate-y-[-4px] 
//                       data-[state=active]:border-b-4 data-[state=active]:border-black`}
//                   >
//                     {category.title}
//                   </TabsTrigger>
//                 ))}
//               </TabsList>
//               <Button
//                 className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 text-black hover:bg-opacity-75 rounded-full p-1 -mr-4"
//                 onClick={() => scrollTabs('right')}
//               >
//                 <ChevronRight className="h-6 w-6" />
//               </Button>
//             </div>
//             {menuCategories.map((category) => (
//               <TabsContent key={category.title} value={category.title} className="pt-2">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   {category.items.map((item, index) => (
//                     <div key={index} className="border p-4 rounded-lg bg-white shadow-md">
//                       <h3 className="font-bold">{item.name}</h3>
//                       <p>${item.price.toFixed(2)}</p>
//                       {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
//                       {item.options ? (
//                         <div className="mt-2">
//                           <Select onValueChange={(value) => addToCart(item, value)}>
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select option" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {item.options.map((option) => (
//                                 <SelectItem key={option} value={option}>
//                                   {option}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       ) : (
//                         <div className="flex items-center mt-2">
//                           {getItemQuantityInCart(item.name) > 0 ? (
//                             <div className="flex items-center">
//                               <Button 
//                                 onClick={() => updateQuantity(cart.find(cartItem => cartItem.name === item.name)?.id || 0, getItemQuantityInCart(item.name) - 1)} 
//                                 className="p-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
//                               >
//                                 <Minus className="h-4 w-4" />
//                               </Button>
//                               <span className="mx-2 font-bold">{getItemQuantityInCart(item.name)}</span>
//                               <Button 
//                                 onClick={() => updateQuantity(cart.find(cartItem => cartItem.name === item.name)?.id || 0, getItemQuantityInCart(item.name) + 1)} 
//                                 className="p-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
//                               >
//                                 <Plus className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           ) : (
//                             <Button 
//                               onClick={() => addToCart(item)} 
//                               className="bg-purple-600 hover:bg-purple-700 text-white"
//                             >
//                               Add to Cart
//                             </Button>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </TabsContent>
//             ))}
//           </Tabs>
//         </div>
//         <div className="w-full lg:w-1/3">
//           <div className="bg-gray-100 p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold mb-4">Your Order</h2>
//             <div className="max-h-[400px] overflow-y-auto mb-4">
//               {cart.map(item => (
//                 <div key={item.id} className="flex flex-col mb-4 border-b pb-2">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="font-medium">
//                       {item.name}
//                       {item.option && <span className="text-sm text-gray-600"> ({item.option})</span>}
//                     </span>
//                     <span>${(item.price * item.quantity).toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <Button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 mr-1">-</Button>
//                       <span className="mx-2">{item.quantity}</span>
//                       <Button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 mr-1">+</Button>
//                     </div>
//                     <Button onClick={() => removeFromCart(item.id)} className="px-2 py-1">Remove</Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 text-xl font-bold">Subtotal: ${subtotal.toFixed(2)}</div>
//           </div>
//           <form className="mt-6 space-y-4" onSubmit={placeOrder}>
//             <div>
//               <Label htmlFor="name">Name *</Label>
//               <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
//             </div>
//             <div>
//               <Label htmlFor="mobile">Mobile Number (New Zealand) *</Label>
//               <Input 
//                 id="mobile" 
//                 value={mobile} 
//                 onChange={(e) => setMobile(e.target.value)} 
//                 required 
//                 placeholder="e.g. 021 123 4567 or 03 456 7890"
//               />
//             </div>
//             <div>
//               <Label htmlFor="email">Email (optional)</Label>
//               <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//             </div>
//             <div>
//               <Label>Order Type</Label>
//               <RadioGroup value={orderType} onValueChange={setOrderType}>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="dine-in" id="dine-in" />
//                   <Label htmlFor="dine-in">Dine-in</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="takeaway" id="takeaway" />
//                   <Label htmlFor="takeaway">Takeaway</Label>
//                 </div>
//               </RadioGroup>
//             </div>
//             <div>
//               <Label>Payment Method</Label>
//               <Select value={paymentMethod} onValueChange={setPaymentMethod}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select payment method" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="store">Pay at Store</SelectItem>
//                   <SelectItem value="credit-card">Pay with Credit Card</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Pickup Time *</Label>
//               <Select value={pickupTime} onValueChange={setPickupTime}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select pickup time" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {pickupTimes.map((time) => (
//                     <SelectItem key={time} value={time}>{time}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             {error && (
//               <div className="text-red-500 font-bold">{error}</div>
//             )}
//             <Button 
//               type="submit" 
//               disabled={!isFormValid() || isLoading} 
//               className="w-full bg-purple-600 hover:bg-purple-700 text-white"
//             >
//               {isLoading 
//                 ? 'Processing...' 
//                 : (paymentMethod === 'credit-card' ? 'Proceed to Payment' : 'Place Order')
//               }
//             </Button>
//           </form>
//         </div>
//       </main>

//       <footer className="bg-black bg-opacity-75 text-white py-4 mt-auto text-sm">
//         <div className="container mx-auto px-4">
//           <div className="grid sm:grid-cols-2 gap-4">
//             <div>
//               <h3 className="text-lg font-serif text-yellow-400 mb-2">Taupo Thai Restaurant & Bar</h3>
//               <p className="flex items-center mb-1">
//                 <MapPin className="mr-2 h-3 w-3" />
//                 100 Roberts Street, Taupo
//               </p>
//               <p className="flex items-center mb-1">
//                 <Phone className="mr-2 h-3 w-3" />
//                 073765438 (L.Line)
//               </p>
//               <p className="flex items-center mb-1">
//                 <Phone className="mr-2 h-3 w-3" />
//                 0272344252 (Mob)
//               </p>
//               <p className="flex items-center mb-1">
//                 <Phone className="mr-2 h-3 w-3" />
//                 0226545258 (Mob)
//               </p>
//               <p className="flex items-center">
//                 <Clock className="mr-2 h-3 w-3" />
//                 Open 7 Days: 11:30am - Late
//               </p>
//             </div>
//             <div className="sm:text-right mt-4 sm:mt-0">
//               <h3 className="text-base font-semibold mb-2 text-yellow-400">Quick Links</h3>
//               <nav>
//                 <ul className="space-y-1">
//                   <li><Link href="/menu" className="hover:text-yellow-400">Menu</Link></li>
//                   <li><Link href="/about" className="hover:text-yellow-400">About Us</Link></li>
//                   <li><Link href="/contact" className="hover:text-yellow-400">Contact</Link></li>
//                   <li><Link href="/order" className="hover:text-yellow-400">Order Online</Link></li>
//                 </ul>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }