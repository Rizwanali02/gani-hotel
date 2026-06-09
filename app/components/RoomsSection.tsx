"use client"

import { motion } from "framer-motion"
import {
  Wifi,
  Wind,
  Tv,
  Bath,
  Check,
  MessageCircle,
  Star,
  Phone,
  BedDouble,
  Sofa,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/utils"

const rooms = [
  {
    type: "Standard Room",
    capacity: "2-3 Guests",
    size: "Comfortable Stay",
    tagline: "Affordable & Family Friendly",
    description:
      "A clean and comfortable room featuring a double bed, sofa seating, attached bathroom, and essential amenities. Perfect for pilgrims, families, and travelers visiting Sarwar Sharif Dargah.",
    image: "/images/IMG_4922.DNG",
    amenities: [
      "Double Bed",
      "Sofa Seating",
      "Attached Bathroom",
      "Free WiFi",
      "TV",
      "24/7 Assistance",
    ],
    popular: true,
  },
  {
    type: "AC Room",
    capacity: "2-3 Guests",
    size: "Premium Comfort",
    tagline: "Most Preferred Choice",
    description:
      "Spacious air-conditioned accommodation with a comfortable double bed, sofa seating, attached bathroom, TV, and modern amenities for a relaxing stay near Sarwar Sharif Dargah and the main market.",
    image: "/images/IMG_4924.DNG",
    amenities: [
      "Air Conditioning",
      "Double Bed",
      "Sofa Seating",
      "Attached Bathroom",
      "Free WiFi",
      "TV",
      "24/7 Assistance",
    ],
    popular: true,
  },
]

const amenityIcons: Record<string, any> = {
  "Free WiFi": Wifi,
  "Air Conditioning": Wind,
  TV: Tv,
  "Attached Bathroom": Bath,
  "Double Bed": BedDouble,
  "Sofa Seating": Sofa,
  "24/7 Assistance": Phone,
}

export function RoomsSection() {
  const handleInquiry = (roomType: string) => {
    const message = `Assalamu Alaikum,

I would like to inquire about the *${roomType}* at Gani Hotel & Restaurant.

Please share:
• Room availability
• Current room rates
• Check-in / Check-out details

Thank you.`

    const link = generateWhatsAppLink(WHATSAPP_NUMBER, message)
    window.open(link, "_blank", "noopener,noreferrer")
  }

  const handleCall = () => {
    window.open(`tel:+91${WHATSAPP_NUMBER}`, "_self")
  }

  return (
    <section className="bg-gray-950 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
            Comfortable Accommodation
          </span>

          <h2 className="mt-6 font-serif text-4xl font-bold text-white md:text-5xl">
            Comfortable Rooms for Every Guest
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-400">
            Choose between our Standard and AC Rooms, thoughtfully designed with
            comfortable double beds, sofa seating, and modern amenities for a
            pleasant stay near Sarwar Sharif Dargah and the local market.
          </p>
        </motion.div>

        {/* Room Cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {rooms.map((room, index) => (
            <motion.div
              key={room.type}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gray-900 transition-all duration-300 hover:-translate-y-2 hover:border-orange-500/30 ${room.popular
                ? "ring-2 ring-orange-500 shadow-lg shadow-orange-500/10"
                : ""
                }`}
            >
              {/* Popular Badge */}
              {room.popular && (
                <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white">
                  <Star className="h-4 w-4 fill-white" />
                  Most Popular
                </div>
              )}

              {/* Room Image */}
              <div className="relative h-72 overflow-hidden">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${room.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
                <div className="absolute bottom-5 left-6">
                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-300">
                    {room.tagline}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <div className="mb-5">
                  <h3 className="font-serif text-3xl font-bold text-white">
                    {room.type}
                  </h3>

                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-orange-500" />
                      {room.capacity}
                    </span>
                    <span className="text-orange-500">•</span>
                    <span>{room.size}</span>
                  </div>

                  <p className="mt-4 leading-relaxed text-gray-400">
                    {room.description}
                  </p>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Room Amenities
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {room.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || Check
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <Icon className="h-4 w-4 text-orange-500" />
                          {amenity}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Pricing Notice */}
                <div className="mb-5 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-medium text-orange-300">
                      Contact us for room rates, availability & special offers
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleInquiry(room.type)}
                    size="lg"
                    className="bg-green-600 font-semibold text-white hover:bg-green-700"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>

                  <Button
                    onClick={handleCall}
                    size="lg"
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}