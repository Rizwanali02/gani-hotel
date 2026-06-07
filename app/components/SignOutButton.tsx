"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch('/auth/signout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      className="border-gray-700 text-gray-400 hover:text-white"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}