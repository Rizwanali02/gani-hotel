import { getGuests } from "@/app/actions/guest"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { UserPlus } from "lucide-react"
import { CheckOutButton } from "../components/CheckOutButton"

export default async function GuestLedgerPage() {
  const guests = await getGuests()

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Guest Ledger</h1>
          <p className="text-gray-400">Currently staying guests</p>
        </div>
        <Link href="/admin/guests/new">
          <Button><UserPlus className="mr-2 h-4 w-4" /> Check-in Guest</Button>
        </Link>
      </div>

      <Card className="border-gray-800 bg-gray-900">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Guest</TableHead>
                <TableHead className="text-gray-300">Room</TableHead>
                <TableHead className="text-gray-300">Check-in</TableHead>
                <TableHead className="text-gray-300">Payment</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests?.map((guest: any) => (
                <TableRow key={guest.id} className="border-gray-800">
                  <TableCell className="text-white">{guest.name}<br /><span className="text-sm text-gray-400">{guest.phone}</span></TableCell>
                  <TableCell className="text-white">{guest.roomNo} <span className="text-xs text-gray-400">({guest.roomType})</span></TableCell>
                  <TableCell className="text-gray-300">{new Date(guest.checkIn).toLocaleDateString()}</TableCell>
                  <TableCell className="text-white">{formatCurrency(guest.amountPaid)} <span className="text-xs text-gray-400">/ {formatCurrency(guest.totalAmount)}</span></TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs ${guest.paymentStatus === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{guest.paymentStatus}</span></TableCell>
                  <TableCell><CheckOutButton guestId={guest.id} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}