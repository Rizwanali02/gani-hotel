"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createGuestRecord } from "@/app/actions/guest"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, User, BedDouble, CreditCard, Loader2 } from "lucide-react"
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
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link href="/admin/guests">
        <Button variant="ghost" className="-ml-2 text-gray-400 hover:text-white hover:bg-gray-800/40">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ledger
        </Button>
      </Link>

      <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-md shadow-xl overflow-hidden">
        <CardHeader className="border-b border-gray-800/60 bg-gray-900/20 pb-6">
          <CardTitle className="text-2xl font-bold text-white font-serif">Check-in New Guest</CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Enter guest personal, room booking, and initial payment details.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="space-y-6">
            
            {/* Section 1: Guest Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                <User className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Guest Information</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-400">Name *</Label>
                  <Input name="name" required placeholder="Guest full name" className="border-gray-800 bg-gray-950/50 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-400">Phone *</Label>
                  <Input name="phone" type="tel" required placeholder="Contact number" className="border-gray-800 bg-gray-950/50 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-400">Email Address</Label>
                <Input name="email" type="email" placeholder="guest@example.com" className="border-gray-800 bg-gray-950/50 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors" />
              </div>
            </div>

            {/* Section 2: Room & Booking */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                <BedDouble className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Room & Booking</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-400">Room Number *</Label>
                  <Input name="roomNo" required placeholder="e.g. 101, 204" className="border-gray-800 bg-gray-950/50 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-400">Room Type</Label>
                  <Select name="roomType" defaultValue="STANDARD">
                    <SelectTrigger className="border-gray-800 bg-gray-950/50 text-white focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-800 bg-gray-900 text-white">
                      <SelectItem value="STANDARD">Standard Room</SelectItem>
                      <SelectItem value="DELUXE">Deluxe Room</SelectItem>
                      <SelectItem value="SUITE">Suite</SelectItem>
                      <SelectItem value="FAMILY">Family Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-400">Check-in Date & Time *</Label>
                <Input name="checkIn" type="datetime-local" required className="border-gray-800 bg-gray-950/50 text-white focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors" />
              </div>
            </div>

            {/* Section 3: Billing & Payments */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                <CreditCard className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Billing & Payments</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-400">Total Booking Amount (₹)</Label>
                  <Input name="totalAmount" type="number" defaultValue="0" min="0" className="border-gray-800 bg-gray-950/50 text-white focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-400">Initial Amount Paid (₹)</Label>
                  <Input name="amountPaid" type="number" defaultValue="0" min="0" className="border-gray-800 bg-gray-950/50 text-white focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-400">Payment Status</Label>
                <Select name="paymentStatus" defaultValue="PENDING">
                  <SelectTrigger className="border-gray-800 bg-gray-950/50 text-white focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-800 bg-gray-900 text-white">
                    <SelectItem value="PAID">Fully Paid</SelectItem>
                    <SelectItem value="PARTIAL">Partially Paid</SelectItem>
                    <SelectItem value="PENDING">Pending Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-800/60 flex items-center gap-4">
              <Link href="/admin/guests" className="w-1/3">
                <Button type="button" variant="outline" className="w-full border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800/40">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="w-2/3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/20 transition-all duration-300">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking in...
                  </>
                ) : "Check-in Guest"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}