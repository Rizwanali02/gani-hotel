"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, LogIn, LogOut, Shield, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, role, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-500">
              <span className="text-lg font-bold text-white">G</span>
            </div>
            <span className="font-serif text-xl font-bold text-white">Gani</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/#rooms-section" className="text-sm text-gray-300 hover:text-white">
              Rooms
            </Link>
            <Link href="/#menu-section" className="text-sm text-gray-300 hover:text-white">
              Menu
            </Link>

            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            ) : user ? (
              <>
                {role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="border-orange-500 text-orange-500">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSignOut()}
                  className="text-gray-400 "
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button variant="default" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="text-white md:hidden">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-black/90 backdrop-blur-md md:hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                href="/#rooms-section"
                className="block py-2 text-sm text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Rooms
              </Link>
              <Link
                href="/#menu-section"
                className="block py-2 text-sm text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Menu
              </Link>

              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              ) : user ? (
                <>
                  {role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full border-orange-500 text-orange-500">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400"
                    onClick={() => {
                      signOut()
                      setIsOpen(false)
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}