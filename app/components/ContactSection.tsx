"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MessageCircle,
  Phone,
  Mail,
  User,
  Send,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateWhatsAppLink } from "@/lib/utils"

const CONTACT_1 = {
  name: process.env.NEXT_PUBLIC_CONTACT_NAME_1 || "Gani Hotel Reception",
  number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8696916676",
  role: "Hotel Bookings & Stay Enquiries",
  available: "24 / 7",
  color: "emerald",
}

const CONTACT_2 = {
  name: process.env.NEXT_PUBLIC_CONTACT_NAME_2 || "Gani Restaurant",
  number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_2 || "8696916677",
  role: "Restaurant Orders & Reservations",
  available: "8 AM – 11 PM",
  color: "orange",
}

const INFO_ITEMS = [
  {
    icon: MapPin,
    label: "Location",
    value: "Gani Hotel & Restaurant,Sarwar Sharif, Rajasthan, India",
  },
  {
    icon: Clock,
    label: "Check-in / Check-out",
    value: "07:00 AM / 10:00 PM",
  },
  {
    icon: Mail,
    label: "Email",
    value: "[EMAIL_ADDRESS]",
  },
]

export function ContactSection() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [selectedContact, setSelectedContact] = useState<typeof CONTACT_1 | typeof CONTACT_2>(CONTACT_1)
  const [sent, setSent] = useState(false)

  const handleSendWhatsApp = (contact: typeof CONTACT_1) => {
    if (!name.trim()) {
      alert("Please enter your name before sending.")
      return
    }

    const text = [
      `Hello! I'm *${name.trim()}*${email.trim() ? ` (${email.trim()})` : ""}.`,
      "",
      message.trim()
        ? `*Message:* ${message.trim()}`
        : "I'd like to get in touch with you.",
      "",
      "_Sent via Gani Hotel & Restaurant website_",
    ].join("\n")

    const link = generateWhatsAppLink(contact.number, text)
    window.open(link, "_blank", "noopener,noreferrer")
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const handleDirectWhatsApp = (contact: typeof CONTACT_1) => {
    const text = `Hello *${contact.name}*! I'd like to enquire about your services.`
    window.open(generateWhatsAppLink(contact.number, text), "_blank", "noopener,noreferrer")
  }

  const contactColor = (contact: typeof CONTACT_1) =>
    contact.color === "emerald"
      ? {
        ring: "ring-emerald-500/30",
        icon: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        btn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20",
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      }
      : {
        ring: "ring-orange-500/30",
        icon: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        btn: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20",
        badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      }

  return (
    <section id="contact-section" className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-400">
            Get In Touch
          </span>
          <h2 className="font-serif text-4xl font-bold text-white md:text-5xl">
            Contact Us
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Reach out directly via WhatsApp or fill in your details below — we'll
            respond within minutes.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 items-start">
          {/* LEFT — Contact Cards + Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* WhatsApp Contact Cards */}
            {[CONTACT_1, CONTACT_2].map((contact) => {
              const c = contactColor(contact)
              return (
                <div
                  key={contact.number}
                  className={`group rounded-2xl border ${c.border} bg-gray-900/50 backdrop-blur-sm p-6 transition-all duration-300 hover:ring-1 ${c.ring}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg}`}>
                        <MessageCircle className={`h-5 w-5 ${c.icon}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.role}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${c.badge}`}>
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                      {contact.available}
                    </span>
                  </div>
                  <p className="mb-4 font-mono text-sm text-gray-400">
                    +91 {contact.number}
                  </p>
                  <Button
                    onClick={() => handleDirectWhatsApp(contact)}
                    size="sm"
                    className={`w-full text-white font-semibold shadow-lg hover:shadow-lg transition-all duration-300 ${c.btn}`}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                  </Button>
                </div>
              )
            })}

            {/* Quick Info */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-5 space-y-4">
              {INFO_ITEMS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-800">
                    <Icon className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
                    <p className="text-sm text-gray-300 font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-8"
          >
            <h3 className="mb-1 text-xl font-bold text-white">Send us a message</h3>
            <p className="mb-6 text-sm text-gray-400">
              Fill in your details and choose which team to contact.
            </p>

            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950/50 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950/50 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Tell us about your enquiry — room type, dates, or any special request..."
                  className="w-full rounded-xl border border-gray-800 bg-gray-950/50 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-colors resize-none"
                />
              </div>

              {/* Send to — choose contact */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Send To
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[CONTACT_1, CONTACT_2].map((contact) => {
                    const active = selectedContact.number === contact.number
                    const c = contactColor(contact)
                    return (
                      <button
                        key={contact.number}
                        type="button"
                        onClick={() => setSelectedContact(contact)}
                        className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all duration-200 ${active
                          ? `${c.border} ${c.bg} ring-1 ${c.ring}`
                          : "border-gray-800 bg-transparent hover:border-gray-700"
                          }`}
                      >
                        <p className={`text-xs font-semibold ${active ? c.icon : "text-gray-400"}`}>
                          {contact.name}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{contact.role}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={() => handleSendWhatsApp(selectedContact)}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-green-600/20 transition-all duration-300 mt-2"
              >
                {sent ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Opened WhatsApp!
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send via WhatsApp
                  </>
                )}
              </Button>
              <p className="text-center text-[10px] text-gray-600">
                This opens WhatsApp with your message pre-filled. No data is stored.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
