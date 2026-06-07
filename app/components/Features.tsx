"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button" // Shadcn button
import { 
  Wifi, 
  Shield, 
  UtensilsCrossed, 
  Car, 
  Monitor, 
  Users,
  Coffee,
  BedDouble,
  ChevronDown,
  ChevronUp
} from "lucide-react"

const features = [
  {
    icon: Wifi,
    title: "Free High-Speed WiFi",
    description: "Stay connected with complimentary high-speed internet throughout the property",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description: "Round-the-clock security with CCTV surveillance for your peace of mind",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: UtensilsCrossed,
    title: "In-House Restaurant",
    description: "Enjoy authentic local and international cuisine prepared by expert chefs",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Car,
    title: "Free Parking",
    description: "Secure parking facility available for all our guests at no extra cost",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Monitor,
    title: "Work-Friendly Spaces",
    description: "Dedicated co-working areas with comfortable seating and charging points",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Users,
    title: "Community Events",
    description: "Regular social events and activities to connect with fellow travelers",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Coffee,
    title: "Complimentary Breakfast",
    description: "Start your day with a delicious complimentary breakfast buffet",
    color: "from-teal-500 to-green-500",
  },
  {
    icon: BedDouble,
    title: "Premium Bedding",
    description: "Luxurious mattresses and premium linens for a comfortable night's sleep",
    color: "from-indigo-500 to-blue-500",
  },
]

export function Features() {
  const [showAll, setShowAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Screen size check karne ke liye logic
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize() // Initial check
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Agar mobile hai aur showAll false hai toh sirf 4 dikhao, warna saare
  const visibleFeatures = isMobile && !showAll ? features.slice(0, 4) : features

  return (
    <section className="bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="font-serif text-4xl font-bold text-white md:text-5xl">
            Why Choose Gani?
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Experience the perfect blend of comfort, convenience, and hospitality
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence>
            {visibleFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-2xl bg-gray-800 p-6 transition-all hover:bg-gray-750"
              >
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${feature.color} p-3`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {feature.description}
                </p>
                
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-all group-hover:border-orange-500/20" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- SEE MORE BUTTON FOR MOBILE --- */}
        {isMobile && (
          <div className="mt-10 flex justify-center">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700 hover:text-orange-400 transition-all rounded-full px-8"
            >
              {showAll ? (
                <span className="flex items-center gap-2">Show Less <ChevronUp size={18} /></span>
              ) : (
                <span className="flex items-center gap-2">See More <ChevronDown size={18} /></span>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}