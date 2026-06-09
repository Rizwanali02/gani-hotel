
import { WhatsAppButton } from "@/app/components/WhatsAppButton"
import { Button } from "@/components/ui/button"
import { Star, Users, Coffee, MapPin } from "lucide-react"
import { HeroCarousel } from "./components/HeroCarousel"
import { RoomsSection } from "./components/RoomsSection"
import { MenuSection } from "./components/MenuSection"
import { Features } from "./components/Features"
import { ContactSection } from "./components/ContactSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950">
      <HeroCarousel />

      {/* Features Section */}
      <Features />

      {/* Rooms Section */}
      <section id="rooms-section" className="py-20">
        <div className="container mx-auto px-4">
          {/* <div className="mb-12 text-center">
            <h2 className="font-serif text-4xl font-bold text-white md:text-5xl">
              Luxury Hostel Living
            </h2>
            <p className="mt-4 text-gray-400">
              Choose from our range of comfortable and affordable rooms
            </p>
          </div> */}
          <RoomsSection />
        </div>
      </section>

      {/* Restaurant Menu */}
      <section id="menu-section" className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-4xl font-bold text-white md:text-5xl">
              Gourmet Restaurant
            </h2>
            <p className="mt-4 text-gray-400">
              Savor authentic flavors crafted with passion
            </p>
          </div>
          <MenuSection />
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Ready to Experience Gani?
          </h2>
          <p className="mt-4 text-lg text-orange-100">
            Book your stay or reserve a table via WhatsApp
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <WhatsAppButton size="lg" roomType="Stay & Dine Package" />
          </div>
        </div>
      </section>
    </main>
  )
}