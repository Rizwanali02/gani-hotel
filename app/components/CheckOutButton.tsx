"use client"

import { Button } from "@/components/ui/button"
import { checkOutGuest } from "@/app/actions/guest"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle, IndianRupee, LogOut, X, Loader2, CheckCircle } from "lucide-react"

interface CheckOutButtonProps {
  guestId: string
  paymentStatus: string
  amountPaid: number
  totalAmount: number
  guestName: string
}

export function CheckOutButton({
  guestId,
  paymentStatus,
  amountPaid,
  totalAmount,
  guestName,
}: CheckOutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [settlementAmount, setSettlementAmount] = useState("")
  const [settling, setSettling] = useState(false)
  const router = useRouter()

  const outstanding = totalAmount - amountPaid
  const isPaid = paymentStatus === "PAID" || outstanding <= 0

  const handleCheckOut = async () => {
    if (!isPaid) {
      // Show settlement modal for unpaid guests
      setSettlementAmount(outstanding.toString())
      setShowModal(true)
      return
    }

    // Fully paid — direct checkout
    setLoading(true)
    try {
      const result = await checkOutGuest(guestId)
      if (result.success) {
        toast.success(`${guestName} checked out successfully!`)
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to check out")
    } finally {
      setLoading(false)
    }
  }

  const handleSettle = async () => {
    const amount = parseFloat(settlementAmount)

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (amount < outstanding) {
      toast.error(`Minimum settlement required: ${formatCurrency(outstanding)}. Partial settlement is not allowed at checkout.`)
      return
    }

    setSettling(true)
    try {
      const result = await checkOutGuest(guestId, amount)
      if (result.success) {
        toast.success(`${guestName} — Payment settled & checked out!`)
        setShowModal(false)
        router.refresh()
      } else {
        toast.error("Settlement failed. Please try again.")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to settle & check out")
    } finally {
      setSettling(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCheckOut}
        disabled={loading}
        className={`transition-all duration-300 ${
          isPaid
            ? "border-gray-800 text-gray-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
            : "border-amber-500/30 bg-amber-500/5 text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            Processing...
          </>
        ) : isPaid ? (
          <>
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            Check-out
          </>
        ) : (
          <>
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
            Settle & Out
          </>
        )}
      </Button>

      {/* Settlement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <IndianRupee className="h-4 w-4 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Payment Settlement</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Guest Info */}
              <div className="rounded-xl bg-gray-950/60 border border-gray-800/60 p-4 space-y-3">
                <p className="text-sm font-medium text-white">{guestName}</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Total</p>
                    <p className="text-sm font-bold text-white">{formatCurrency(totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Paid</p>
                    <p className="text-sm font-bold text-emerald-400">{formatCurrency(amountPaid)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Due</p>
                    <p className="text-sm font-bold text-rose-400">{formatCurrency(outstanding)}</p>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15 p-3">
                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  Checkout requires full payment settlement. The guest cannot be checked out until the outstanding balance of <strong>{formatCurrency(outstanding)}</strong> is cleared.
                </p>
              </div>

              {/* Settlement Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settlement Amount (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="number"
                    value={settlementAmount}
                    onChange={(e) => setSettlementAmount(e.target.value)}
                    min={outstanding}
                    step="1"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950/40 pl-10 pr-4 py-3 text-white text-lg font-semibold placeholder-gray-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-colors"
                    placeholder={outstanding.toString()}
                  />
                </div>
                {parseFloat(settlementAmount) < outstanding && settlementAmount !== "" && (
                  <p className="text-xs text-rose-400">
                    Amount must be at least {formatCurrency(outstanding)}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-gray-800 px-6 py-4">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 border-gray-700 text-gray-400 hover:bg-gray-800"
                disabled={settling}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSettle}
                disabled={settling || parseFloat(settlementAmount) < outstanding}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
              >
                {settling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Settling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Settle {formatCurrency(outstanding)} & Check-out
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}