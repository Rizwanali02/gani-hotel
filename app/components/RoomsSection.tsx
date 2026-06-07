"use client"

import { motion } from "framer-motion"
import { 
  Users, 
  Maximize, 
  Wifi, 
  Wind, 
  Tv, 
  Bath,
  Check
} from "lucide-react"
import { WhatsAppButton } from "./WhatsAppButton"

const rooms = [
  {
    type: "Dormitory",
    price: 499,
    capacity: "6 Persons",
    size: "250 sq.ft",
    description: "Budget-friendly shared accommodation perfect for backpackers and solo travelers",
    image: "/images/dormitory.jpg",
    amenities: ["Free WiFi", "Personal Locker", "Reading Light", "Shared Bathroom", "AC"],
    popular: false,
  },
  {
    type: "Private Room",
    price: 1499,
    capacity: "2 Persons",
    size: "180 sq.ft",
    description: "Comfortable private room with all essential amenities for a pleasant stay",
    image: "/images/private-room.jpg",
    amenities: ["Free WiFi", "Private Bathroom", "TV", "Work Desk", "AC", "Room Service"],
    popular: false,
  },
  {
    type: "Deluxe Room",
    price: 2499,
    capacity: "2 Persons",
    size: "250 sq.ft",
    description: "Spacious deluxe accommodation with premium furnishings and city views",
    image: "/images/deluxe-room.jpg",
    amenities: ["Free WiFi", "Private Bathroom", "Smart TV", "Mini Bar", "AC", "Balcony", "Bathtub"],
    popular: true,
  },
  {
    type: "Suite",
    price: 3999,
    capacity: "3 Persons",
    size: "350 sq.ft",
    description: "Luxurious suite with separate living area and panoramic views",
    image: "/images/suite.jpg",
    amenities: ["Free WiFi", "Premium Bathroom", "55\" TV", "Living Room", "AC", "Jacuzzi", "Butler Service"],
    popular: false,
  },
]

const amenityIcons: Record<string, any> = {
  "Free WiFi": Wifi,
  "AC": Wind,
  "TV": Tv,
  "Smart TV": Tv,
  "55\" TV": Tv,
  "Private Bathroom": Bath,
  "Shared Bathroom": Bath,
  "Premium Bathroom": Bath,
}

export function RoomsSection() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {rooms.map((room, index) => (
        <motion.div
          key={room.type}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className={`group relative overflow-hidden rounded-3xl bg-gray-900 transition-all hover:scale-[1.02] ${
            room.popular ? "ring-2 ring-orange-500" : ""
          }`}
        >
          {/* Popular Badge */}
          {room.popular && (
            <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1 text-sm font-semibold text-white">
              Most Popular
            </div>
          )}

          {/* Room Image */}
          <div className="relative h-64 overflow-hidden">
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${room.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
          </div>

          {/* Room Details */}
          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {room.type}
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  {room.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-500">
                  ₹{room.price}
                </p>
                <p className="text-sm text-gray-400">per night</p>
              </div>
            </div>

            {/* Room Specs */}
            <div className="mb-4 flex gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Users className="h-4 w-4" />
                {room.capacity}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Maximize className="h-4 w-4" />
                {room.size}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-gray-300">Amenities</p>
              <div className="grid grid-cols-2 gap-2">
                {room.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Check
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <Icon className="h-4 w-4 text-orange-500" />
                      {amenity}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Book Button */}
            <WhatsAppButton
              roomType={room.type}
              variant="default"
              size="lg"
              className="w-full"
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}