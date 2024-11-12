import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock } from "lucide-react"
import Link from "next/link"
import Image from 'next/image'

export default function MenuPage() {
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

      <main className="flex-grow container mx-auto px-4 py-8 bg-white bg-opacity-90 my-8 rounded-lg">
        <h1 className="text-3xl sm:text-4xl font-serif text-purple-700 text-center mb-8">Our Menu</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Starters", items: [
              { name: "Thai Curry Puff Chicken (4pc)", price: "$13.50", description: "Deep fried chicken and vegetables wrapped in puff pastry" },
              { name: "Pak Tod (6pc)", price: "$13.50", description: "Deep fried mixed vegetables with sweet chilli sauce" },
              { name: "Thai Spring Roll (4pc)", price: "$12.50", description: "Mixed vegetables, vermicelli rolled in rice pastry" },
              { name: "Chilli mussels (6pc)", price: "$17.50", description: "Green chilli mussels steamed with thai herbs" },
              { name: "Combination Entries", price: "$16.50", description: "Spring roll, curry Puff, Prawn Toast & Satay Gai" },
              { name: "Money Bag (4pc)", price: "$14.50", description: "Minced pork and prawn with three spice mix and grounded peanuts, sweet corn wrapped in pastry and golden deep fried" },
              { name: "Satay Gai (Chicken) (4pc)", price: "$15.50", description: "Grilled marinated chicken with peanut sauce" },
              { name: "Prawn Toast (4pc)", price: "$14.50" },
              { name: "Thai fish cakes (4pc)", price: "$14.50", description: "Fish mixed with chilli paste herbs and fresh beans" },
              { name: "Salt & Pepper Squid (6pc)", price: "$13.50" },
              { name: "Goong Groob", price: "$14.50", description: "Deep fried King prawns with sesame seeds" },
              { name: "Prawn Twisters (6pc)", price: "$13.50" }
            ]},
            { title: "Salads & Soups", items: [
              { name: "Tom yum mushroom soup", price: "$11.50", description: "Traditional thai soup cooked with lemongrass, lemon juice, mushroom and chilli" },
              { name: "Tom yum chicken soup", price: "$13.50", description: "Traditional thai soup cooked with lemongrass, lemon juice, mushroom and chilli" },
              { name: "Tom yum Prawn or seafood soup (big pot)", price: "$29.50", description: "Traditional thai soup cooked with lemongrass, lemon juice, mushroom and chilli" },
              { name: "Tom kha mushroom soup", price: "$11.50", description: "Soup cooked in a delicious coconut milk, lemon juice, lemongrass, galangal & chilli" },
              { name: "Tom kha chicken soup", price: "$13.50", description: "Soup cooked in a delicious coconut milk, lemon juice, lemongrass, galangal & chilli" },
              { name: "Tom kha prawn or seafood soup (Big Pot)", price: "$29.50", description: "Soup cooked in a delicious coconut milk, lemon juice, lemongrass, galangal & chilli" },
              { name: "Thai pork salad (Num Tok)", price: "$26.90", description: "Slices of grilled pork with chilli, lemon juice and mint" },
              { name: "Thai beef salad (Yum neau)", price: "$26.90", description: "Hot & sour beef thai style" },
              { name: "Thai seafood salad (Yum talay)", price: "$29.90", description: "Hot & sour combination seafood with thai herbs and salad" },
              { name: "Larb (duck or duck salad)", price: "$29.90", description: "Spicy BBQ duck with lemon dressing, red onion, mint, chilli and ground roasted rice and garden salad" }
            ]},
            { title: "Curry", items: [
              { name: "Thai red curry (chicken, beef, pork)", price: "$27.95", description: "Red curry cooked with coconut milk and bamboo shoots" },
              { name: "Thai red curry (Prawn, seafood, duck, lamb)", price: "$30.95", description: "Red curry cooked with coconut milk and bamboo shoots" },
              { name: "Thai green curry (chicken, beef, pork)", price: "$27.95", description: "Green curry cooked with coconut milk and bamboo shoots" },
              { name: "Thai green curry (Prawn, seafood, duck, lamb)", price: "$30.95", description: "Green curry cooked with coconut milk and bamboo shoots" },
              { name: "Masaman curry (chicken, beef, pork)", price: "$27.95", description: "Chunky meat curry cooked with coconut milk and potato" },
              { name: "Masaman curry (Prawn, seafood, duck, lamb)", price: "$30.95", description: "Chunky meat curry cooked with coconut milk and potato" },
              { name: "Yellow curry (chicken, beef, pork)", price: "$27.95", description: "Yellow Curry with potato, onion and thai spices" },
              { name: "Yellow curry (Prawn, seafood, duck, lamb)", price: "$30.95", description: "Yellow Curry with potato, onion and thai spices" },
              { name: "Panang curry (chicken, beef, pork)", price: "$27.95", description: "Cooked with pumpkin, green beans and crushed peanuts" },
              { name: "Panang curry (Prawn, seafood, duck, lamb)", price: "$30.95", description: "Cooked with pumpkin, green beans and crushed peanuts" },
              { name: "Choo Chee curry (chicken, beef, pork)", price: "$27.95", description: "Red curry cooked with coconut milk, Lime leaves and capsicums" },
              { name: "Choo Chee curry (Prawn, seafood, duck, lamb)", price: "$30.95", description: "Red curry cooked with coconut milk, Lime leaves and capsicums" },
              { name: "Jungle curry (Chicken, beef, pork)", price: "$27.95", description: "Traditional spicy herb curry with vegetables" },
              { name: "Jungle curry (Prawn, seafood, duck, lamb)", price: "$30.95", description: "Traditional spicy herb curry with vegetables" }
            ]},
            { title: "Stir Fry", items: [
              { name: "Pad Gra Prow - Basil & Chilli (Chicken, beef, pork)", price: "$28.95", description: "Chilli, garlic, bamboo, beans and basil leaves" },
              { name: "Pad Gra Prow - Basil & Chilli (Prawn, squid, fish, seafood, duck, lamb)", price: "$31.95", description: "Chilli, garlic, bamboo, beans and basil leaves" },
              { name: "Pad Priew Wan - Sweet & Sour (Chicken, beef, pork)", price: "$28.95", description: "Thai sweet and sour sauce with tomato, onion and pineapple" },
              { name: "Pad Priew Wan - Sweet & Sour (Prawn, squid, fish, seafood, duck, lamb)", price: "$31.95", description: "Thai sweet and sour sauce with tomato, onion and pineapple" },
              { name: "Pad khing - Ginger (Chicken, beef, pork)", price: "$28.95", description: "Stir fried vegetables, mushroom with ginger and oyster sauce" },
              { name: "Pad khing - Ginger (Prawn, squid, fish, seafood, duck, lamb)", price: "$31.95", description: "Stir fried vegetables, mushroom with ginger and oyster sauce" },
              { name: "Pad Graw Tiam - Garlic & Pepper (Chicken, beef, pork)", price: "$28.95", description: "Fresh garlic, pepper sauce and market vegetables" },
              { name: "Pad Graw Tiam - Garlic & Pepper (Prawn, squid, fish, seafood, duck, lamb)", price: "$31.95", description: "Fresh garlic, pepper sauce and market vegetables" },
              { name: "Pad namman hoi - Oyster sauce (Chicken, beef, pork)", price: "$28.95", description: "Mixed vegetable, mushroom in oyster sauce" },
              { name: "Pad namman hoi - Oyster sauce (Prawn, squid, fish, seafood, duck, lamb)", price: "$31.95", description: "Mixed vegetable, mushroom in oyster sauce" },
              { name: "Pad Prik Gaeng (Chicken, beef, pork)", price: "$28.95", description: "Stir fried beans, chilli paste, coconut cream and lime leaves" },
              { name: "Pad Prik Gaeng (Prawn, squid, fish, seafood, duck, lamb)", price: "$31.95", description: "Stir fried beans, chilli paste, coconut cream and lime leaves" },
              { name: "Pad Med Himmaparn - Cashew nut (chicken, beef, pork)", price: "$28.95", description: "Thai chilli paste with cashew nut, market vegetables and thai sauce" },
              { name: "Pad Med Himmaparn -Cashew nut (Prawn, squid, fish, seafood, duck, lamb)", price: "$31.95", description: "Thai chilli paste with cashew nut, market vegetables and thai sauce" },
              { name: "Pra - ram - Peanut (Chicken, beef, pork)", price: "$28.95", description: "Market vegetables in oyster sauce topped with peanut sauce" },
              { name: "Pineapple Stir fry (Chicken, beef, pork)", price: "$28.95", description: "Cooked with choice of meat and pineapple and vegetables" },
              { name: "Pineapple Stir fry (Prawn, squid, fish, seafood, duck, lamb)", price: "$31.95", description: "Cooked with choice of meat and pineapple and vegetables" },
              { name: "Tamarind Stir fry (Prawn & duck)", price: "$31.95", description: "Cooked with choice of meat, steamed vegetables, tamarind juice and oyster sauce" },
              { name: "Whole Snapper (Garlic & Pepper sauce)", price: "$39.95", description: "Deep fried whole snapper with garlic & pepper sauce" },
              { name: "Whole Snapper (Sweet & Sour sauce)", price: "$39.95", description: "Deep fried whole snapper with sweet & sour sauce" },
              { name: "Choo Chee (Whole snapper)", price: "$39.95" },
              { name: "Choo Chee (Prawn / fish fillet)", price: "$39.95" }
            ]},
            { title: "Vegetarian", items: [
              { name: "Gaeng Kiew wang Jay (Green curry)", price: "$22.99", description: "Green curry with tofu, vegetables, bean curd and coconut milk" },
              { name: "Gaeng Panang Jay (Panang curry)", price: "$22.99", description: "Panang curry with tofu, vegetables and coconut milk" },
              { name: "Pad Med Mam Himmaparn (Cashew nut)", price: "$25.50", description: "Stir fry tofu with sweet chilli, vegetables and cashew nuts" },
              { name: "Pad Prew Wan Jay (Sweet & sour)", price: "$25.50", description: "Stir fry mixed vegetables, tofu with sweet & sour thai style sauce" },
              { name: "Pad Gra Prow Jay (Basil & chilli)", price: "$25.50", description: "Stir fry tofu with mixed vegetables, chilli and basil leaves" },
              { name: "Pad Thai Jay", price: "$23.99", description: "Stir fry thai noodle with tofu, eggs, beans sprouts, spring onions and crushed peanuts" },
              { name: "Kao Pad Jay", price: "$22.99", description: "Special fried rice with vegetables, cashew nuts and option of egg" },
              { name: "Param Long Song", price: "$22.99", description: "Steamed vegetables with thai peanut sauce" },
              { name: "Pineapple fried rice", price: "$22.99", description: "Stir fry mixed vegetables with pineapple" },
              { name: "Tom Kha Jay (soup)", price: "$11.50", description: "Spicy tofu, bamboo shoots, mushroom and coconut milk" },
              { name: "Tom Yum Jay (soup)", price: "$11.50", description: "Hot & sour mushroom with tofu and lemongrass flavour" }
            ]},
            { title: "Rice & Noodles", items: [
              { name: "Kao Pad (Chicken / Beef / Pork)", price: "$26.99", description: "Thai fried rice with egg, spring onion, tomato and vegetables" },
              { name: "Kao Pad (Prawn / Lamb / Squid)", price: "$28.99", description: "Thai fried rice with egg, spring onion, tomato and vegetables" },
              { name: "Pad Thai (Chicken / Beef / Pork)", price: "$26.99", description: "Rice noodle with egg, beansporut, onion, carrot, spring onion and crushed peanut" },
              { name: "Pad Thai (Prawn / Lamb / Squid)", price: "$28.99", description: "Rice noodle with egg, beansporut, onion, carrot, spring onion and crushed peanut" },
              { name: "Drunken Noodle (Chicken / Beef / Pork)", price: "$26.99", description: "Fried noodle with basil leaves, chilli, garlic, carrot & bamboo" },
              { name: "Drunken Noodle (Prawn / Lamb / Squid)", price: "$28.99", description: "Fried noodle with basil leaves, chilli, garlic, carrot & bamboo" },
              { name: "Kao Pad Sapparos (Chicken / Beef / Pork)", price: "$26.99", description: "Thai fried rice with pineapple, cashew nut and curry powder" },
              { name: "Kao Pad Sapparos (Prawn / Lamb / Squid)", price: "$28.99", description: "Thai fried rice with pineapple, cashew nut and curry powder" },
              { name: "Pad Se - iw (Chicken / Beef / Pork)", price: "$26.99", description: "Fried noodle with dark soy sauce, egg, carrot and green vegetables" },
              { name: "Pad Se - iw (Prawn / Lamb / Squid)", price: "$28.99", description: "Fried noodle with dark soy sauce, egg, carrot and green vegetables" },
              { name: "Kao Pad Ka Praw (Chicken / Beef / Pork)", price: "$26.99", description: "Rice cooked with chilli, garlic, carrot, bean, zucchini & bamboo" },
              { name: "Kao Pad Ka Praw (Prawn / Lamb / Squid)", price: "$28.99", description: "Rice cooked with chilli, garlic, carrot, bean, zucchini & bamboo" }
            ]},
            { title: "Dessert, Ice Cream & Fruit Salad", items: [
              { name: "Ice cream sundae (Choc / Vanilla)", price: "$11.50" },
              { name: "Banana Split", price: "$11.50" },
              { name: "Deep fried ice cream", price: "$13.50" },
              { name: "Deep fried banana", price: "$11.50" },
              { name: "Strawberry Cheesecake", price: "$11.50" },
              { name: "Roti (Bread)", price: "$4.50" }
            ]},
            { title: "Banquet Menu", items: [
              { name: "Banquet Menu (Per Person)", price: "$48.00", description: "Combination Entrees (4 Pc): Spring roll, curry Puff, Prawn Toast & Satay Gai" },
              { name: "Thai Green curry (Chicken)", price: "" },
              { name: "Cashew nut (Prawn)", price: "", description: "Stir fried prawn with vegetables and cashew nut" },
              { name: "Sweet & sour (Veg Tofu)", price: "", description: "Stir fry with sweet & sour" },
              { name: "Dessert or Cheesecake & Jasmine tea, Steamed Jasmine rice", price: "" }
            ]},
            { title: "Chef Specials", items: [
              { name: "Steak", price: "$36.95" },
              { name: "Chicken nuggets (6pc) & Chips", price: "$16.00" },
              { name: "Crispy pork and veggie stir fry", price: "$24.90" },
              { name: "Fish & Chips", price: "$20.00" }
            ]}
          ].map((section, index) => (
            <section key={index} className={`p-4 sm:p-6 rounded-lg ${
              ["Salads & Soups", "Curry"].includes(section.title) ? "md:col-span-1" : 
              ["Dessert, Ice Cream & Fruit Salad", "Banquet Menu", "Chef Specials"].includes(section.title) ? "md:col-span-1" :
              section.items.length > 10 ? "md:col-span-2" : 
              "md:col-span-1"
            }`}>
              <h2 className="text-xl sm:text-2xl font-serif text-purple-700 mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <div className="flex justify-between">
                      <span className="font-medium text-sm sm:text-base">{item.name}</span>
                      <span className="text-sm sm:text-base">{item.price}</span>
                    </div>
                    {item.description && <p className="text-xs sm:text-sm text-gray-600">{item.description}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
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