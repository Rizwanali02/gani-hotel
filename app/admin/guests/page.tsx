import { getGuests } from "@/app/actions/guest"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { UserPlus, Users, ArrowLeft, Calendar } from "lucide-react"
import { CheckOutButton } from "@/app/components/CheckOutButton"

export default async function GuestLedgerPage() {
  const guests = await getGuests()

  return (
    <div className="space-y-6 animate-fade-in">
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
            Guest Ledger
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Monitor occupants, manage billing status, and perform checkout tasks.
          </p>
        </div>
        <Link href="/admin/guests/new">
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/20 transition-all duration-300">
            <UserPlus className="mr-2 h-4 w-4" />
            Check-in Guest
          </Button>
        </Link>
      </div>

      {/* Guests Table */}
      <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-md shadow-xl overflow-hidden">
        <CardHeader className="border-b border-gray-800/60 bg-gray-900/20 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Users className="h-5 w-5 text-orange-500" />
                Active Occupants
              </CardTitle>
              <CardDescription className="text-xs text-gray-450 mt-1">
                Currently residing guests with active checkout actions.
              </CardDescription>
            </div>
            <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
              {guests?.length || 0} Rooms Occupied
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {guests && guests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-950/40">
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-300 font-semibold py-4">Guest Details</TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">Room & Type</TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">Check-in Details</TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">Financials</TableHead>
                    <TableHead className="text-gray-300 font-semibold py-4">Status</TableHead>
                    <TableHead className="text-right text-gray-300 font-semibold py-4 pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest: any) => (
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
                        <div className="flex items-start gap-1.5 text-xs text-gray-450">
                          <Calendar className="h-3.5 w-3.5 mt-0.5 text-orange-500/70" />
                          <div>
                            <p className="text-gray-300 font-medium">
                              {new Date(guest.checkIn).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {new Date(guest.checkIn).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-emerald-400">
                            {formatCurrency(guest.amountPaid)}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Total: {formatCurrency(guest.totalAmount)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${
                            guest.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : guest.paymentStatus === 'PARTIAL'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {guest.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <CheckOutButton
                          guestId={guest._id}
                          paymentStatus={guest.paymentStatus}
                          amountPaid={guest.amountPaid}
                          totalAmount={guest.totalAmount}
                          guestName={guest.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Users className="mb-4 h-12 w-12 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-400">No Active Guests Found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm">
                There are currently no guests registered in active status. All occupants have checked out.
              </p>
              <Link href="/admin/guests/new" className="mt-6">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Check-in First Guest
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}