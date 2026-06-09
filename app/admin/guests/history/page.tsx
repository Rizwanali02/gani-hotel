import { getAllGuests } from "@/app/actions/guest"
import { GuestHistoryTable } from "@/app/components/GuestHistoryTable"

export const dynamic = "force-dynamic"

export default async function GuestHistoryPage() {
  const guests = await getAllGuests()

  return (
    <div className="space-y-6 animate-fade-in">
      <GuestHistoryTable guests={guests} />
    </div>
  )
}
