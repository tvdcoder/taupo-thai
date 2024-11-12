import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, Car, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FInal%20background-1QBTDWqBZCuDtvk4nL5549cN20arkv.jpeg')"}}>
      <div className="min-h-screen bg-black bg-opacity-50 flex flex-col">
        <header className="bg-black bg-opacity-75 text-white py-4">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="h-12 w-12">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/taupo-thai-restaurant-and-bar-3FTzt5KcAOKk9PGwwkBhXRWxVTPnVm.png"
                  alt="Taupo Thai Restaurant and Bar"
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

        <main className="flex-grow container mx-auto px-4 py-16 flex flex-col justify-center items-center text-white pb-8">
          <h1 className="text-4xl md:text-6xl font-serif text-yellow-400 mb-4 mt-16 text-center">
            Taupo Thai Restaurant & Bar
          </h1>
          <p className="text-xl mb-8 text-center max-w-2xl">
            Experience authentic Thai cuisine in the heart of Taupo
          </p>
          <Link href="/order">
            <Button className="bg-purple-700 hover:bg-purple-800 text-lg px-8">
              Order Now
            </Button>
          </Link>

          <div className="mt-24 grid md:grid-cols-2 gap-8 w-full max-w-6xl">
            <section className="bg-black bg-opacity-70 p-8 rounded-lg h-full flex flex-col">
              <h2 className="text-2xl font-serif text-yellow-400 mb-4">Welcome to Taupo Thai</h2>
              <div className="space-y-4 text-white flex-grow">
                <p>
                  Taupo Thai is a Thai Restaurant like no other. A fusion of Modern New Zealand cuisine and traditional Thai flavours, our truly unique offering challenges everything you ever thought you knew about Thai food.
                </p>
                <p>
                  We have an ongoing commitment to give the people of Taupo a true taste of the real Thailand. With a desire to bring the taste of true Thai, we bring you to the riverside of Northern Thailand. Going back to basics, our menu showcases authentic Thai dishes.
                </p>
                <p>
                  Taupo Thai restaurant is located in the centre of Taupo (100 Roberts Street). We pride ourselves on serving authentic Thai food and having impeccable service to bring you the very best dining experience possible.
                </p>
              </div>
            </section>

            <div className="space-y-8 flex flex-col justify-between h-full">
              <section className="bg-black bg-opacity-70 p-8 rounded-lg">
                <h2 className="text-2xl font-serif text-yellow-400 mb-4 flex items-center">
                  <Car className="mr-2" /> Car Parking
                </h2>
                <div className="space-y-2 text-white">
                  <p>Customer car parking available for both Dine-in & Take away</p>
                  <p>Delivery - Subject to availability on minimum order above $60.00</p>
                </div>
              </section>

              <section className="bg-black bg-opacity-70 p-8 rounded-lg flex-grow">
                <h2 className="text-2xl font-serif text-yellow-400 mb-4 flex items-center">
                  <Users className="mr-2" /> Private booking & Catering
                </h2>
                <div className="text-white">
                  <p>We are the biggest seating fine dining Thai restaurant in Taupo. We also do catering orders for functions, private parties and events. Please speak to the manager for further details.</p>
                </div>
              </section>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24 text-center w-full max-w-6xl">
            <div className="bg-black bg-opacity-70 p-6 rounded-lg">
              <MapPin className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h2 className="font-semibold text-yellow-400 mb-2">Location</h2>
              <p>100 Roberts Street, Taupo</p>
            </div>
            <div className="bg-black bg-opacity-70 p-6 rounded-lg">
              <Phone className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h2 className="font-semibold text-yellow-400 mb-2">Contact</h2>
              <p>073765438</p>
            </div>
            <div className="bg-black bg-opacity-70 p-6 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h2 className="font-semibold text-yellow-400 mb-2">Hours</h2>
              <p>Open 7 Days: 11:30am - Late</p>
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