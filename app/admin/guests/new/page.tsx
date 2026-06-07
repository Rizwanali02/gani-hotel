"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createGuestRecord } from "@/app/actions/guest"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewGuestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createGuestRecord(formData)
      toast.success("Guest checked in!")
      router.push("/admin/guests")
    } catch (error) {
      toast.error("Failed to check in guest")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/guests">
          <Button variant="ghost" className="mb-6 text-gray-400"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
        </Link>
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader><CardTitle className="text-white">Check-in New Guest</CardTitle></CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div><Label className="text-gray-300">Name *</Label><Input name="name" required className="mt-1 border-gray-700 bg-gray-800 text-white" /></div>
              <div><Label className="text-gray-300">Phone *</Label><Input name="phone" type="tel" required className="mt-1 border-gray-700 bg-gray-800 text-white" /></div>
              <div><Label className="text-gray-300">Email</Label><Input name="email" type="email" className="mt-1 border-gray-700 bg-gray-800 text-white" /></div>
              <div><Label className="text-gray-300">Room No *</Label><Input name="roomNo" required className="mt-1 border-gray-700 bg-gray-800 text-white" /></div>
              <div>
                <Label className="text-gray-300">Room Type</Label>
                <Select name="roomType" defaultValue="PRIVATE">
                  <SelectTrigger className="mt-1 border-gray-700 bg-gray-800 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800 text-white">
                    <SelectItem value="DORMITORY">Dormitory</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                    <SelectItem value="DELUXE">Deluxe</SelectItem>
                    <SelectItem value="SUITE">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-gray-300">Check-in Date *</Label><Input name="checkIn" type="datetime-local" required className="mt-1 border-gray-700 bg-gray-800 text-white" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-gray-300">Total Amount</Label><Input name="totalAmount" type="number" defaultValue="0" className="mt-1 border-gray-700 bg-gray-800 text-white" /></div>
                <div><Label className="text-gray-300">Amount Paid</Label><Input name="amountPaid" type="number" defaultValue="0" className="mt-1 border-gray-700 bg-gray-800 text-white" /></div>
              </div>
              <div>
                <Label className="text-gray-300">Payment Status</Label>
                <Select name="paymentStatus" defaultValue="PENDING">
                  <SelectTrigger className="mt-1 border-gray-700 bg-gray-800 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800 text-white">
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="PARTIAL">Partial</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Checking in..." : "Check-in Guest"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}