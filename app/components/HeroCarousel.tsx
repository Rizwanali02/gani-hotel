"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MapPin, Calendar, ArrowRight, LogIn } from "lucide-react"

const slides = [
  {
    id: "01",
    label: "EXPERIENCE & COMFORT",
    title: "Gani Premium Living & Dining",
    description: "Where boutique luxury stays meet master culinary perfection.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop", // Replace with your image
    location: "GANI SANCTUARY HIGHWAY LOCATION",
    est: "HIMALAYAN OASIS EST. 2023",
    tag: "THE ADVENTURE"
  },
  {
    id: "02",
    label: "LUXURY SUITES",
    title: "Modern Elegance & Serenity",
    description: "Find your perfect escape in our thoughtfully designed boutique rooms.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    location: "CITY CENTER PLAZA",
    est: "ESTABLISHED 2024",
    tag: "THE RELAXATION"
  }
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-sans selection:bg-orange-500/30">
      
      {/* --- TOP NAVIGATION BAR --- */}
      {/* <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-serif text-xl font-bold text-white">G</div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight text-white uppercase">Gani.</h1>
            <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">Hostel & Restaurant</p>
          </div>
        </div>

        <div className="hidden md:block">
          <a href="#" className="text-sm font-medium tracking-widest text-orange-500 uppercase border-b-2 border-orange-500 pb-1">Home</a>
        </div>

        <Button className="rounded-full bg-orange-600 px-6 hover:bg-orange-700 text-white">
          <LogIn className="mr-2 h-4 w-4" /> LOGIN
        </Button>
      </nav> */}

      {/* --- CAROUSEL CONTENT --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className="absolute inset-0 bg-black/60 transition-opacity" />
          </div>

          {/* Main Content Area */}
          <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-20">
            
            {/* Top Sub-Info */}
            <div className="absolute top-32 left-6 md:left-20 flex items-center gap-8 text-[10px] tracking-[0.3em] text-gray-400 font-semibold">
              <span className="flex items-center gap-2"><MapPin className="h-3 w-3 text-orange-500" /> {slides[current].location}</span>
              <span className="flex items-center gap-2"><Calendar className="h-3 w-3 text-orange-500" /> {slides[current].est}</span>
            </div>

            {/* Side Indicator */}
            <div className="absolute top-32 right-12 hidden lg:flex items-center gap-2 text-[10px] tracking-[0.3em] text-gray-400 font-semibold uppercase">
               <span className="text-orange-500">0{current + 1}</span> — {slides[current].tag}
            </div>

            {/* Text Overlay */}
            <div className="max-w-4xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h3 className="mb-4 text-xs font-bold tracking-[0.4em] text-orange-500 uppercase">
                  {slides[current].id} — {slides[current].label}
                </h3>
                <h2 className="mb-6 font-serif text-5xl font-medium leading-[1.1] text-white md:text-8xl italic">
                  {slides[current].title.split('&').map((part, i) => (
                    <span key={i}>{part}{i === 0 && <span className="font-sans not-italic text-white"> & </span>}</span>
                  ))}
                </h2>
                <p className="mb-10 max-w-xl text-lg text-gray-300/90 font-light">
                  {slides[current].description}
                </p>

                <div className="flex flex-wrap gap-5">
                  <Button size="lg" className="h-14 rounded-full bg-white px-8 text-black hover:bg-gray-200 transition-transform active:scale-95">
                    EXPLORE BOUTIQUE LIVING <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 rounded-full border-orange-500/50 bg-transparent px-8 text-orange-400 hover:bg-orange-500 hover:text-white transition-all">
                    BROWSE GOURMET MENU
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* --- NAVIGATION CONTROLS --- */}
      <div className="absolute inset-y-0 left-4 flex items-center z-30">
        <button
          onClick={prevSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-orange-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center z-30">
        <button
          onClick={nextSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition-all hover:bg-orange-600"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Progress/Dots */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              index === current ? "w-12 bg-orange-600" : "w-4 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}