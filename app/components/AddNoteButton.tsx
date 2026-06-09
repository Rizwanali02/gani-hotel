"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { updateGuestNotes } from "@/app/actions/guest"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FileText, Loader2, X, Save } from "lucide-react"

interface AddNoteButtonProps {
  guestId: string
  guestName: string
  existingNotes?: string
}

export function AddNoteButton({
  guestId,
  guestName,
  existingNotes = "",
}: AddNoteButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [notes, setNotes] = useState(existingNotes)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleOpen = () => {
    setNotes(existingNotes)
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateGuestNotes(guestId, notes)
      if (result.success) {
        toast.success(`Note updated for ${guestName}`)
        setShowModal(false)
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save note")
    } finally {
      setSaving(false)
    }
  }

  const hasNote = existingNotes && existingNotes.trim().length > 0

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className={`transition-all duration-300 ${
          hasNote
            ? "border-sky-500/30 bg-sky-500/5 text-sky-400 hover:border-sky-500/50 hover:bg-sky-500/10"
            : "border-gray-800 text-gray-500 hover:border-gray-700 hover:bg-gray-800/40 hover:text-gray-300"
        }`}
      >
        <FileText className="h-3.5 w-3.5 mr-1.5" />
        {hasNote ? "View Note" : "Add Note"}
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-0 text-white shadow-2xl overflow-hidden sm:max-w-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20">
                <FileText className="h-4 w-4 text-sky-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">Guest Notes</DialogTitle>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{guestName}</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Notes & Observations
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="Enter any remarks, special requests, or observations about this guest..."
                className="w-full rounded-xl border border-gray-800 bg-gray-950/40 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-colors resize-none leading-relaxed"
              />
              <p className="text-[10px] text-gray-600">
                Notes are visible to all admins and will be stored in the guest&apos;s permanent record.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-gray-800 px-6 py-4">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="flex-1 border-gray-700 text-gray-400 hover:bg-gray-800"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Note
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
