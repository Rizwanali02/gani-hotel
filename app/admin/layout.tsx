"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, UserPlus, Shield, History } from "lucide-react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/guests", label: "Guest Ledger", icon: Users },
    { href: "/admin/guests/new", label: "Check-in Guest", icon: UserPlus },
    { href: "/admin/guests/history", label: "All Guests", icon: History },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Spacer to push content below the fixed top Navbar */}
      <div className="pt-16 flex flex-col md:flex-row min-h-screen">
        {/* Sidebar for desktop */}
        <aside className="w-64 border-r border-gray-800 bg-gray-900/40 backdrop-blur-md hidden md:block flex-shrink-0">
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-8 px-2">
                <Shield className="h-5 w-5 text-orange-500" />
                <span className="font-serif font-semibold text-lg text-white">Admin Portal</span>
              </div>
              <nav className="space-y-1">
                {links.map((link) => {
                  const isActive = pathname === link.href
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-400 border-l-2 border-orange-500 pl-2.5"
                          : "text-gray-400 hover:bg-gray-850/40 hover:text-gray-200"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-orange-400" : "text-gray-400"}`} />
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="text-xs text-gray-500 px-2 mt-auto">
              © {new Date().getFullYear()} Gani Hotel
            </div>
          </div>
        </aside>

        {/* Mobile secondary navigation */}
        <div className="md:hidden border-b border-gray-800 bg-gray-900/60 backdrop-blur-md sticky top-16 z-30">
          <div className="flex justify-around py-2 px-4">
            {links.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center gap-1 py-1 px-3 text-xs font-medium transition-all ${
                    isActive ? "text-orange-400 font-bold" : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
