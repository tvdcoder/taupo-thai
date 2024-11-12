import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FInal%20background-1QBTDWqBZCuDtvk4nL5549cN20arkv.jpeg')"}}>
      <div className="min-h-screen bg-black bg-opacity-50 flex flex-col">
        <header className="bg-black bg-opacity-75 text-white py-4">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="h-12 w-12">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2024-11-12_at_22.47.23-removebg-gbJQaR0Q1tJYvE9JxyBKyS18NwHiHQ.png"
                  alt="Taupo Thai Restaurant Logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </Link>
              <nav>
                <ul className="flex items-center space-x-8 font-medium">
                  <li><Link href="/" className="hover:text-yellow-400">HOME</Link></li>
                  <li><Link href="/menu" className="hover:text-yellow-400">MENU</Link></li>
                  <li><Link href="/about" className="hover:text-yellow-400">ABOUT</Link></li>
                  <li><Link href="/contact" className="hover:text-yellow-400">CONTACT</Link></li>
                </ul>
              </nav>
            </div>
            <Link href="/order">
              <Button className="bg-purple-700 hover:bg-purple-800">
                ORDER ONLINE
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-16 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-serif text-yellow-400 text-center mb-12">About Taupo Thai</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {/* First Row - Food */}
          <div className="relative w-full h-72">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Taupo%20pic14.jpg-SYD4gxytCSx9auNnWwrEqGJ3qDBXXB.jpeg"
              alt="Fresh stir-fried vegetables"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-full h-72">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Taupo%20pic2.jpg-aULjswcwX1297ZdQ7ritjQb8dMAL4n.jpeg"
              alt="Thai stir-fry with rice"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-full h-72">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Taupo%20Pic11.jpg-NO8OWaNWrQEBSnnNyRFJfRC80G2UrI.jpeg"
              alt="Dessert with chocolate drizzle"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Second Row - Restaurant Interior */}
          <div className="relative w-full h-72">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Taupo%20pic12.jpg-dKAP0o1aOExeGZK2iWDAexie6tEUMh.jpeg"
              alt="Busy restaurant evening atmosphere"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-full h-72">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Taupo%20pic1.jpg-OVe7AHIWv9jti1usjsvfD1RzLCH2w9.jpeg"
              alt="Restaurant interior with traditional decor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-full h-72">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Taupo%20pic8.jpg-cFo7kqB27lj5DeaAB61iBgcfwDWk9m.jpeg"
              alt="Dining area with customers"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Third Row - Bar and Dining Experience */}
          <div className="relative w-full h-72">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Taupo%20pic10.jpg-XNRp2Rwp6XI73ypDoS1ATAVcOBoULp.jpeg"
              alt="Well-stocked bar area"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-full h-72">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Taupo%20pic7.jpg-XPxceBVC4W08JTxFqjCHo0fwKzETqn.jpeg"
              alt="Happy diners enjoying their meal"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-full h-72">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Taupo%20pic5.jpg-JjffaW1KEE6WTyooZpaIqM23yIUlzi.jpeg"
              alt="Family dining experience"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
          <div className="max-w-3xl mx-auto text-white space-y-6 bg-black bg-opacity-75 p-6 rounded-lg">
            <p className="text-lg">
              Welcome to Taupo Thai Restaurant, where we bring the authentic flavors of Thailand to the heart of Taupo. Our restaurant combines traditional Thai cooking techniques with locally sourced New Zealand ingredients to create a unique dining experience.
            </p>
            <p className="text-lg">
              Our chefs have years of experience in Thai cuisine, ensuring that each dish maintains its authentic taste while incorporating modern presentation techniques. From our signature Tom Yum soup to our carefully crafted desserts, every item on our menu tells a story of Thai culinary tradition.
            </p>
            <p className="text-lg">
              We take pride in offering a warm, welcoming atmosphere where you can enjoy your meal in comfort. Our restaurant features both indoor and outdoor seating options, and our friendly staff is always ready to help you navigate our menu and find the perfect dish for your taste.
            </p>
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