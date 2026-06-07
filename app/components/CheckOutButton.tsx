"use client"

import { Button } from "@/components/ui/button"
import { checkOutGuest } from "@/app/actions/guest"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function CheckOutButton({ guestId }: { guestId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckOut = async () => {
    setLoading(true)
    try {
      await checkOutGuest(guestId)
      toast.success("Guest checked out!")
      router.refresh()
    } catch (error) {
      toast.error("Failed to check out")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCheckOut} disabled={loading} className="border-gray-700 text-gray-300 hover:text-white">
      {loading ? "..." : "Check-out"}
    </Button>
  )
}