"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { getMenuItems } from "@/app/actions/menu"
import { Clock, ChefHat, Flame, Leaf, Coffee, Utensils, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/utils"

const categories = [
  { id: "all", label: "All Items", icon: Utensils },
  { id: "starters", label: "Starters", icon: Flame },
  { id: "main-course", label: "Main Course", icon: ChefHat },
  { id: "beverages", label: "Beverages", icon: Coffee },
  { id: "desserts", label: "Desserts", icon: Leaf },
]

interface MenuItem {
  id: string
  title: string
  description: string
  price: number
  category: string
  imageUrl?: string
}

// Fallback menu items if database is empty
const fallbackMenu: MenuItem[] = [
  {
    id: "1",
    title: "Butter Chicken",
    description: "Tender chicken in rich, creamy tomato gravy with aromatic spices",
    price: 349,
    category: "main-course",
  },
  {
    id: "2",
    title: "Paneer Tikka",
    description: "Char-grilled cottage cheese marinated in spiced yogurt",
    price: 249,
    category: "starters",
  },
  {
    id: "3",
    title: "Masala Chai",
    description: "Traditional Indian tea brewed with aromatic spices and herbs",
    price: 49,
    category: "beverages",
  },
  {
    id: "4",
    title: "Gulab Jamun",
    description: "Soft milk dumplings soaked in rose-flavored sugar syrup",
    price: 99,
    category: "desserts",
  },
  {
    id: "5",
    title: "Biryani",
    description: "Fragrant basmati rice layered with spiced vegetables or meat",
    price: 299,
    category: "main-course",
  },
  {
    id: "6",
    title: "Tandoori Roti",
    description: "Whole wheat bread baked in traditional clay oven",
    price: 25,
    category: "main-course",
  },
  {
    id: "7",
    title: "Mango Lassi",
    description: "Refreshing yogurt drink blended with sweet mango pulp",
    price: 79,
    category: "beverages",
  },
  {
    id: "8",
    title: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 59,
    category: "starters",
  },
]

export function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(fallbackMenu)
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMenu() {
      try {
        const items = await getMenuItems()
        if (items && items.length > 0) {
          setMenuItems(items)
        }
      } catch (error) {
        console.log("Using fallback menu data")
      } finally {
        setLoading(false)
      }
    }
    loadMenu()
  }, [])

  const filteredItems = activeCategory === "all"
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory)

  const handleOrderInquiry = (itemTitle: string) => {
    const message = `Hello! I'd like to order *${itemTitle}* from Gani Restaurant.\n\nPlease confirm availability and pricing.\nThank you!`
    const link = generateWhatsAppLink(WHATSAPP_NUMBER, message)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const handleFullMenuInquiry = () => {
    const message = `Hello! I'd like to see the complete menu with pricing for Gani Restaurant.\n\nPlease share the full menu or any current offers.\nThank you!`
    const link = generateWhatsAppLink(WHATSAPP_NUMBER, message)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div>
      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 ${
                activeCategory === category.id
                  ? ""
                  : "border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {category.label}
            </Button>
          )
        })}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeCategory}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="wait">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                className="group relative overflow-hidden rounded-2xl bg-gray-800 transition-all hover:bg-gray-750"
              >
                {/* Optional Image */}
                {item.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-5">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                  
                  <p className="mb-4 text-sm text-gray-400">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>15-20 min</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOrderInquiry(item.title)}
                      className="border-green-600/30 text-green-400 hover:bg-green-600/10 hover:border-green-500/50 hover:text-green-300 transition-all"
                    >
                      <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                      Order Now
                    </Button>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl border border-transparent transition-all group-hover:border-orange-500/20" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Full Menu CTA */}
      <div className="mt-12 text-center">
        <p className="mb-4 text-gray-400">
          Want to see our complete menu or place a bulk order?
        </p>
        <Button
          onClick={handleFullMenuInquiry}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-green-600/20 transition-all duration-300"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Get Full Menu via WhatsApp
        </Button>
      </div>
    </div>
  )
}