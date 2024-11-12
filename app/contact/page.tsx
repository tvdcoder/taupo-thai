'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('https://formspree.io/f/xldenldl', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        setSubmitted(true)
        form.reset()
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error submitting the form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkFormValidity = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    const isValid = form.checkValidity()
    setIsFormValid(isValid)
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FInal%20background-1QBTDWqBZCuDtvk4nL5549cN20arkv.jpeg')"}}>
      <div className="min-h-screen bg-black bg-opacity-50 flex flex-col">
        <header className="bg-black bg-opacity-75 text-white py-4">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl text-yellow-400 font-serif">
              TAUPO THAI RESTAURANT
            </Link>
            <nav>
              <ul className="flex space-x-6 font-medium">
                <li><Link href="/" className="hover:text-yellow-400">HOME</Link></li>
                <li><Link href="/menu" className="hover:text-yellow-400">MENU</Link></li>
                <li><Link href="/about" className="hover:text-yellow-400">ABOUT</Link></li>
                <li><Link href="/contact" className="hover:text-yellow-400">CONTACT</Link></li>
                <li>
                  <Button className="bg-purple-700 hover:bg-purple-800">
                    ORDER ONLINE
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-serif text-yellow-400 text-center mb-8">Contact Us</h1>
            
            <div className="max-w-md mx-auto">
              <div className="bg-black bg-opacity-75 p-6 rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-6" onInput={checkFormValidity}>
                  <div className="text-xs text-gray-400 mb-4">* INDICATES REQUIRED FIELD</div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">
                        FIRST NAME <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        className="bg-transparent border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">
                        LAST NAME <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        className="bg-transparent border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      EMAIL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="bg-transparent border-gray-600 text-white"
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-32 ${isFormValid ? 'bg-purple-700 hover:bg-purple-800' : 'bg-gray-500 hover:bg-gray-600'}`}
                    >
                      {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                    </Button>
                  </div>

                  {submitted && (
                    <p className="text-green-400">Thank you for your message. We&apos;ll be in touch soon!</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-black bg-opacity-75 text-white py-4 mt-auto text-sm">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-4">
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
              <div className="md:text-right">
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
    </div>
  )
}