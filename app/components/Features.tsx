"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  ShoppingBag,
  UtensilsCrossed,
  BedDouble,
  Shield,
  Car,
  Users,
  Coffee,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react"
import { generateWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/utils"

const features = [
  {
    icon: MapPin,
    title: "Prime Dargah Location",
    description:
      "Located near the sacred Sarwar Sharif Dargah, allowing pilgrims easy access for ziyarat and prayers.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: ShoppingBag,
    title: "Main Market Access",
    description:
      "Stay close to the bustling Sarwar market, offering devotional items, local handicrafts, and daily essentials.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurant & Local Cuisine",
    description:
      "Enjoy fresh meals and authentic local flavors prepared with care for travelers and families.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BedDouble,
    title: "Comfortable Accommodation",
    description:
      "Clean, spacious, and affordable rooms designed for pilgrims, families, and business travelers.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Safe & Secure Stay",
    description:
      "A secure environment with attentive staff to ensure peace of mind throughout your stay.",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Car,
    title: "Easy Access from Ajmer",
    description:
      "Conveniently reachable from Ajmer within approximately one hour, making day trips simple and comfortable.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Users,
    title: "Perfect for Pilgrims & Families",
    description:
      "An ideal choice for devotees, families, and groups visiting Sarwar Sharif throughout the year.",
    color: "from-teal-500 to-green-500",
  },
  {
    icon: Coffee,
    title: "Peaceful Atmosphere",
    description:
      "Relax and unwind in a calm environment after visiting the Dargah, market, and nearby attractions.",
    color: "from-yellow-500 to-orange-500",
  },
]

export function Features() {
  const [showAll, setShowAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const visibleFeatures =
    isMobile && !showAll ? features.slice(0, 4) : features

  const handleInquiry = (roomType: string) => {
    const message = `Hello! I'm interested in the *${roomType}* at Gani Hotel & Restaurant.\n\nCould you please share:\n• Availability & pricing\n• Any current offers\n\nThank you!`
    const link = generateWhatsAppLink(WHATSAPP_NUMBER, message)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black py-24">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
            Near Sarwar Sharif Dargah & Main Market
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
            Why Stay at Gani Hotel & Restaurant?
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-400">
            Experience comfortable accommodation, delicious dining, and easy
            access to Sarwar Sharif Dargah, the local market, and the rich
            cultural atmosphere of the region.
          </p>
        </motion.div>

        {/* Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-8 text-center backdrop-blur-sm"
        >
          <h3 className="text-2xl font-bold text-white">
            Stay Close to Faith, Food & Local Culture
          </h3>

          <p className="mt-3 text-gray-300">
            Whether you're visiting Sarwar Sharif for pilgrimage, family travel,
            or business, Gani Hotel & Restaurant provides comfort, convenience,
            and authentic hospitality in one location.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence>
            {visibleFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -8,
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-orange-500/30 hover:bg-white/[0.08]"
              >
                <div
                  className={`mb-5 inline-flex rounded-2xl bg-gradient-to-r ${feature.color} p-4 shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>

                <div className="absolute inset-0 rounded-3xl border border-transparent transition-all duration-300 group-hover:border-orange-500/20" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mobile Show More */}
        {isMobile && (
          <div className="mt-10 flex justify-center">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="rounded-full border-gray-700 bg-gray-900 px-8 text-white hover:bg-gray-800 hover:text-orange-400"
            >
              {showAll ? (
                <span className="flex items-center gap-2">
                  Show Less <ChevronUp size={18} />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  See More <ChevronDown size={18} />
                </span>
              )}
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md"
        >
          <h3 className="text-3xl font-bold text-white">
            Planning Your Visit to Sarwar Sharif?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Book your stay with us and enjoy comfortable rooms, delicious food,
            and unmatched convenience just moments away from the Dargah and
            local market.
          </p>

          <Button
            onClick={() => handleInquiry("Room")}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-green-600/20 transition-all duration-300 mt-2"
          >
            <Send className="mr-2 h-4 w-4" />
            Send via WhatsApp
          </Button>
        </motion.div>
      </div>
    </section>
  )
}