"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MapPin, Calendar, ArrowRight, LogIn } from "lucide-react"

const slides = [
  {
    id: "01",
    label: "SARWAR SHARIF",
    title: "Stay Near Sarwar Sharif Dargah",
    description:
      "Experience comfortable accommodation just moments away from the sacred Sarwar Sharif Dargah. Perfect for pilgrims, families, and travelers.",
    image: "/images/sarwarshrif.png",
    location: "SARWAR SHARIF MAIN MARKET",
    est: "GANI HOTEL & RESTAURANT",
    tag: "SPIRITUAL JOURNEY",
  },
  {
    id: "03",
    label: "HOTEL & RESTAURANT",
    title: "Comfortable Rooms & Delicious Food",
    description:
      "Enjoy clean rooms, warm hospitality, and delicious meals all in one place. Ideal for a relaxing and convenient stay in Sarwar.",
    image: "/images/ganihotel5.png",
    location: "NEAR DARGAH & MARKET",
    est: "FAMILY FRIENDLY STAY",
    tag: "COMFORT & HOSPITALITY",
  },
  {
    id: "02",
    label: "PILGRIMS & FAMILIES",
    title: "Your Home Away From Home",
    description:
      "Whether you're visiting for Ziyarat, family travel, or business, Gani Hotel & Restaurant offers comfort, convenience, and authentic hospitality.",
    image: "/images/ganihotel2.png",
    location: "SARWAR, RAJASTHAN",
    est: "WELCOME ALL GUESTS",
    tag: "PEACEFUL STAY",
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-advance timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = useCallback(() => setCurrent((prev) => (prev + 1) % slides.length), [])
  const prevSlide = useCallback(() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length), [])

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50 // minimum swipe distance in px
    if (Math.abs(diff) > threshold) {
      if (diff > 0) nextSlide()
      else prevSlide()
    }
  }

  const slide = slides[current]

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden bg-black font-sans selection:bg-orange-500/30
                 h-[85vh] min-h-[520px] md:h-screen md:min-h-[600px]"
    >
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
          {/* Background Image — object-position keeps focal point visible on mobile */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover object-center"
              draggable={false}
            />
            {/* Gradient overlay — stronger on mobile for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 md:bg-black/60" />
          </div>

          {/* Main Content Area */}
          <div className="relative z-10 flex h-full flex-col justify-end pb-24 md:justify-center md:pb-0 px-5 sm:px-8 md:px-20">

            {/* Top Sub-Info — hidden on very small screens, compact on medium */}
            <div className="hidden sm:flex absolute top-24 md:top-32 left-5 sm:left-8 md:left-20 items-center gap-4 md:gap-8 text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] text-gray-400 font-semibold">
              <span className="flex items-center gap-1.5 md:gap-2">
                <MapPin className="h-3 w-3 text-orange-500" /> {slide.location}
              </span>
              <span className="hidden md:flex items-center gap-2">
                <Calendar className="h-3 w-3 text-orange-500" /> {slide.est}
              </span>
            </div>

            {/* Side Indicator — desktop only */}
            <div className="absolute top-32 right-12 hidden lg:flex items-center gap-2 text-[10px] tracking-[0.3em] text-gray-400 font-semibold uppercase">
              <span className="text-orange-500">0{current + 1}</span> — {slide.tag}
            </div>

            {/* Text Overlay */}
            <div className="max-w-4xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {/* Label */}
                <h3 className="mb-2 md:mb-4 text-[10px] md:text-xs font-bold tracking-[0.3em] md:tracking-[0.4em] text-orange-500 uppercase">
                  {slide.id} — {slide.label}
                </h3>

                {/* Title — responsive font sizes */}
                <h2 className="mb-4 md:mb-6 font-serif text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-medium leading-[1.15] md:leading-[1.1] text-white italic">
                  {slide.title.split('&').map((part, i) => (
                    <span key={i}>{part}{i === 0 && <span className="font-sans not-italic text-white"> & </span>}</span>
                  ))}
                </h2>

                {/* Description — 2 lines on mobile, full on desktop */}
                <p className="mb-6 md:mb-10 max-w-md md:max-w-xl text-sm sm:text-base md:text-lg text-gray-300/90 font-light leading-relaxed line-clamp-3 md:line-clamp-none">
                  {slide.description}
                </p>

                {/* CTA Buttons — stack on mobile, row on desktop */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                  <Button
                    size="lg"
                    className="h-12 sm:h-14 rounded-full bg-white px-6 sm:px-8 text-black hover:bg-gray-200 transition-transform active:scale-95 text-sm sm:text-base font-semibold"
                  >
                    EXPLORE ROOMS <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 sm:h-14 rounded-full border-orange-500/50 bg-transparent px-6 sm:px-8 text-orange-400 hover:bg-orange-500 hover:text-white transition-all text-sm sm:text-base font-semibold"
                  >
                    VIEW MENU
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Mobile — tag indicator at the bottom of content */}
            <div className="mt-5 flex items-center gap-2 sm:hidden text-[9px] tracking-[0.25em] text-gray-500 font-semibold uppercase">
              <MapPin className="h-3 w-3 text-orange-500/70" />
              {slide.location}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* --- NAVIGATION ARROWS --- */}
      {/* Desktop: side-positioned circles. Mobile: smaller, lower positioned */}
      <div className="absolute inset-y-0 left-2 sm:left-4 flex items-center z-30">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full
                     border border-white/20 bg-black/30 text-white backdrop-blur-md
                     transition-all hover:bg-orange-600 active:scale-90
                     touch-manipulation"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-2 sm:right-4 flex items-center z-30">
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full
                     border border-white/20 bg-black/30 text-white backdrop-blur-md
                     transition-all hover:bg-orange-600 active:scale-90
                     touch-manipulation"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* --- BOTTOM INDICATORS --- */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 flex -translate-x-1/2 gap-2.5 sm:gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 sm:h-2 transition-all duration-500 rounded-full touch-manipulation ${
              index === current
                ? "w-10 sm:w-12 bg-orange-600"
                : "w-4 sm:w-4 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Slide counter badge — mobile only */}
      <div className="absolute top-20 right-4 flex sm:hidden items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 z-30">
        <span className="text-xs font-bold text-orange-500">{String(current + 1).padStart(2, "0")}</span>
        <span className="text-[10px] text-gray-400">/</span>
        <span className="text-[10px] text-gray-500">{String(slides.length).padStart(2, "0")}</span>
      </div>
    </div>
  )
}