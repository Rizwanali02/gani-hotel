"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { AddNoteButton } from "@/app/components/AddNoteButton"
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Eye, 
  X, 
  Calendar, 
  IndianRupee, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Key, 
  ShieldCheck, 
  FileText, 
  CreditCard,
  Download,
  ExternalLink
} from "lucide-react"

interface Guest {
  _id: string
  name: string
  phone: string
  email?: string
  roomNo: string
  roomType: string
  checkIn: string
  checkOut?: string
  amountPaid: number
  totalAmount: number
  paymentStatus: "PAID" | "PENDING" | "PARTIAL"
  status: "ACTIVE" | "CHECKED_OUT"
  notes?: string
  idCardUrl?: string
  createdBy: string
  createdAt: string
}

interface GuestHistoryTableProps {
  guests: Guest[]
}

export function GuestHistoryTable({ guests }: GuestHistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)

  // Filter and search guests
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch =
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone.includes(searchQuery) ||
        (guest.email && guest.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        guest.roomNo.includes(searchQuery)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && guest.status === "ACTIVE") ||
        (statusFilter === "checked_out" && guest.status === "CHECKED_OUT")

      return matchesSearch && matchesStatus
    })
  }, [guests, searchQuery, statusFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-900 pb-6">
        <div>
          <Link href="/admin">
            <Button variant="ghost" className="mb-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-800/40">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Guest Registry
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            View the historical records of all guests, billing summaries, and archives.
          </p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name, room number, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-gray-850 bg-gray-900/40 pl-10 text-white placeholder-gray-500 focus:border-orange-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Status:</span>
          <div className="flex rounded-lg border border-gray-800 bg-gray-900/40 p-1">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                statusFilter === "active"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("checked_out")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                statusFilter === "checked_out"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Checked Out
            </button>
          </div>
        </div>
      </div>

      {/* Guests Table */}
      <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-md shadow-xl overflow-hidden">
        <CardHeader className="border-b border-gray-800/60 bg-gray-900/20 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Users className="h-5 w-5 text-orange-500" />
                All Guest Records
              </CardTitle>
              <CardDescription className="text-xs text-gray-450 mt-1">
                Showing {filteredGuests.length} matching records
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredGuests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-950/40">
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-300 font-semibold py-4">Guest Details</TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">Room & Type</TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">Stay Duration</TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">Financials</TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">Status</TableHead>
                    <TableHead className="text-right text-gray-300 font-semibold py-4 pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuests.map((guest) => (
                    <TableRow key={guest._id} className="border-gray-800/60 hover:bg-gray-900/20 transition-colors">
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-white text-sm">{guest.name}</p>
                          <p className="text-xs text-gray-400">{guest.phone}</p>
                          {guest.email && (
                            <p className="text-xs text-gray-500">{guest.email}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1.5">
                          <span className="inline-block font-semibold text-white text-sm bg-gray-900 border border-gray-800 rounded px-2 py-0.5">
                            Room {guest.roomNo}
                          </span>
                          <p className="text-xs text-gray-450">{guest.roomType}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-gray-300">
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <Calendar className="h-3.5 w-3.5 text-orange-500/70 shrink-0" />
                            <span>
                              In: {new Date(guest.checkIn).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          {guest.checkOut ? (
                            <div className="flex items-center gap-1.5 text-gray-400">
                              <Clock className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                              <span>
                                Out: {new Date(guest.checkOut).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-orange-400 font-medium">
                              <Clock className="h-3.5 w-3.5 animate-pulse shrink-0" />
                              <span>Still Occupied</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-emerald-400">
                              {formatCurrency(guest.amountPaid)}
                            </span>
                            <span className="text-[10px] text-gray-500">paid</span>
                          </div>
                          <p className="text-[11px] text-gray-500">
                            Total: {formatCurrency(guest.totalAmount)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          {/* Stay Status Badge */}
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                              guest.status === 'ACTIVE'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : 'bg-gray-800 text-gray-400 border border-gray-700'
                            }`}
                          >
                            {guest.status === 'ACTIVE' ? 'Active' : 'Checked Out'}
                          </span>
                          {/* Payment Status Badge */}
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                              guest.paymentStatus === 'PAID'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : guest.paymentStatus === 'PARTIAL'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {guest.paymentStatus}
                          </span>
                          {guest.notes && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-sky-400/70">
                              <FileText className="h-3 w-3" />
                              Has note
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <AddNoteButton
                            guestId={guest._id}
                            guestName={guest.name}
                            existingNotes={guest.notes || ""}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedGuest(guest)}
                            className="border-gray-850 bg-gray-950/20 text-gray-400 hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400 transition-all duration-300"
                          >
                            <Eye className="h-4 w-4 mr-1.5" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Users className="mb-4 h-12 w-12 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-400">No Records Found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm">
                No guest matches the search query or status filter. Try modifying your filter options.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guest Details Dialog */}
      <Dialog open={!!selectedGuest} onOpenChange={(open) => !open && setSelectedGuest(null)}>
        {selectedGuest && (
          <DialogContent 
            showCloseButton={false}
            className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 p-0 text-white shadow-2xl overflow-hidden sm:max-w-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-gray-950/20">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <User className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-white">Guest Folder</DialogTitle>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Record ID: {selectedGuest._id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuest(null)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Profile Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400/90 border-b border-gray-800 pb-1.5">
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-4.5 w-4.5 text-gray-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Guest Name</p>
                        <p className="text-sm font-semibold text-white">{selectedGuest.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-4.5 w-4.5 text-gray-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Phone Number</p>
                        <p className="text-sm font-semibold text-white">{selectedGuest.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4.5 w-4.5 text-gray-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Email Address</p>
                        <p className="text-sm font-semibold text-white">
                          {selectedGuest.email || <span className="text-gray-600 italic">Not provided</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stay Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400/90 border-b border-gray-800 pb-1.5">
                    Stay Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Key className="h-4.5 w-4.5 text-gray-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Room & Type</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-white text-sm bg-gray-805 border border-gray-800 rounded px-1.5 py-0.5">
                            Room {selectedGuest.roomNo}
                          </span>
                          <span className="text-xs text-gray-400">{selectedGuest.roomType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4.5 w-4.5 text-gray-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Check-in Timestamp</p>
                        <p className="text-sm font-semibold text-white">
                          {new Date(selectedGuest.checkIn).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-4.5 w-4.5 text-gray-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Check-out Timestamp</p>
                        <p className="text-sm font-semibold text-white">
                          {selectedGuest.checkOut ? (
                            new Date(selectedGuest.checkOut).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          ) : (
                            <span className="text-orange-400 font-semibold flex items-center gap-1.5 mt-0.5">
                              <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                              Currently Residing
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Financial Ledger & Status */}
              <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400/90 flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4" /> Financial Summary
                  </h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase border ${
                        selectedGuest.status === 'ACTIVE'
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                          : 'bg-gray-850 text-gray-400 border-gray-700'
                      }`}
                    >
                      {selectedGuest.status === 'ACTIVE' ? 'Active' : 'Checked Out'}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase border ${
                        selectedGuest.paymentStatus === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : selectedGuest.paymentStatus === 'PARTIAL'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {selectedGuest.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-900/30 border border-gray-800/50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Total Bill</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(selectedGuest.totalAmount)}</p>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                    <p className="text-[10px] text-emerald-500/70 uppercase tracking-wider mb-1">Settled Amount</p>
                    <p className="text-lg font-bold text-emerald-400">{formatCurrency(selectedGuest.amountPaid)}</p>
                  </div>
                  <div className={`${
                    selectedGuest.totalAmount - selectedGuest.amountPaid > 0 ? "bg-rose-500/5 border border-rose-500/10" : "bg-gray-900/30 border border-gray-800/50"
                  } rounded-lg p-3`}>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Due Balance</p>
                    <p className={`text-lg font-bold ${
                      selectedGuest.totalAmount - selectedGuest.amountPaid > 0 ? "text-rose-400" : "text-gray-400"
                    }`}>{formatCurrency(selectedGuest.totalAmount - selectedGuest.amountPaid)}</p>
                  </div>
                </div>
              </div>

              {/* ID Card Scan Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400/90 border-b border-gray-800 pb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Guest Identification
                </h4>
                {selectedGuest.idCardUrl ? (
                  <div className="relative group rounded-xl border border-gray-800 bg-gray-950/60 p-3 max-w-sm mx-auto overflow-hidden">
                    <img 
                      src={selectedGuest.idCardUrl} 
                      alt="Guest ID Card scan" 
                      className="w-full h-auto rounded-lg object-contain bg-black/40 border border-gray-850"
                    />
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-500 truncate">{selectedGuest.idCardUrl.split('/').pop()}</span>
                      <div className="flex gap-2">
                        <a 
                          href={selectedGuest.idCardUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold text-gray-300 hover:text-white bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-md transition-all shrink-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open
                        </a>
                        <a 
                          href={selectedGuest.idCardUrl} 
                          download
                          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-all shrink-0"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-xl py-6 text-center text-gray-500 text-xs">
                    <ShieldCheck className="h-8 w-8 text-gray-700 mb-2" />
                    No Identification Document Uploaded.
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400/90 flex items-center gap-1.5">
                    <FileText className="h-4 w-4" /> Booking Notes
                  </h4>
                  <AddNoteButton
                    guestId={selectedGuest._id}
                    guestName={selectedGuest.name}
                    existingNotes={selectedGuest.notes || ""}
                  />
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-950/20 p-4 text-xs leading-relaxed text-gray-300 font-mono whitespace-pre-wrap">
                  {selectedGuest.notes || "No extra notes or comments recorded."}
                </div>
              </div>

              {/* Meta details */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-800 text-[10px] text-gray-550">
                <p>Checked in by: <span className="font-semibold text-gray-400">{selectedGuest.createdBy}</span></p>
                <p>Registration Timestamp: <span className="font-semibold text-gray-400">{new Date(selectedGuest.createdAt).toLocaleString('en-IN')}</span></p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-gray-800 px-6 py-4 bg-gray-950/20">
              <Button
                onClick={() => setSelectedGuest(null)}
                className="bg-gray-800 hover:bg-gray-750 text-white font-semibold text-xs px-4"
              >
                Close Folder
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
