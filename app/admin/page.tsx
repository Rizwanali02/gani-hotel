import { getGuests, getRevenueStats } from "@/app/actions/guest"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, IndianRupee, TrendingUp, AlertCircle, UserPlus, ArrowRight, ClipboardList, Shield } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

export default async function AdminDashboard() {
  const guests = await getGuests()
  const { totalToday, totalPending, totalAllTime } = await getRevenueStats()

  const activeGuests = guests?.length || 0

  const stats = [
    {
      title: "Active Guests",
      value: activeGuests,
      icon: Users,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "hover:border-sky-500/30",
      glow: "group-hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]",
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(totalToday),
      icon: IndianRupee,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/30",
      glow: "group-hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]",
    },
    {
      title: "Pending Payments",
      value: formatCurrency(totalPending),
      icon: AlertCircle,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/30",
      glow: "group-hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    },
    {
      title: "Total Guests (All Time)",
      value: totalAllTime || 0,
      icon: TrendingUp,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "hover:border-violet-500/30",
      glow: "group-hover:shadow-[0_0_20px_rgba(167,139,250,0.15)]",
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-orange-500 text-sm font-semibold tracking-wider uppercase mb-1">
            <Shield className="h-4 w-4" />
            Management Panel
          </div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight md:text-4xl">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Real-time analytics and central hotel operations hub.
          </p>
        </div>
        <Link href="/admin/guests/new">
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/20 transition-all duration-300">
            <UserPlus className="mr-2 h-4 w-4" />
            Check-in Guest
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`group border-gray-800/80 bg-gray-900/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${stat.border} ${stat.glow}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 transition-colors group-hover:text-gray-300">
                {stat.title}
              </CardTitle>
              <div className={`rounded-xl ${stat.bg} p-2.5 transition-all duration-300 group-hover:scale-110`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid: Quick Actions & Recent Guests */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Quick Actions (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Quick Actions</h2>
          </div>
          <div className="grid gap-4">
            {/* Action 1: New Guest Check-in */}
            <Link href="/admin/guests/new" className="group">
              <div className="flex items-start gap-4 rounded-xl border border-gray-800 bg-gray-900/30 p-5 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                    Check-in New Guest
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Register a new guest, assign a room, record IDs, and accept initial payments.
                  </p>
                </div>
              </div>
            </Link>

            {/* Action 2: View Guest Ledger */}
            <Link href="/admin/guests" className="group">
              <div className="flex items-start gap-4 rounded-xl border border-gray-800 bg-gray-900/30 p-5 backdrop-blur-sm transition-all duration-300 hover:border-sky-500/30 hover:bg-sky-500/5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform duration-300">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-white group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                    View Guest Ledger
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Monitor active rooms, view checking logs, modify payments, or perform guest checkout.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Guests (7 Columns) */}
        <Card className="lg:col-span-7 border-gray-800 bg-gray-900/40 backdrop-blur-md flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800/60 pb-4">
              <div>
                <CardTitle className="text-lg font-bold text-white">Recent Guests</CardTitle>
                <CardDescription className="text-gray-400 text-xs mt-0.5">
                  Latest room check-ins and active status.
                </CardDescription>
              </div>
              <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400">
                {activeGuests} Active
              </span>
            </CardHeader>
            <CardContent className="pt-6">
              {guests && guests.length > 0 ? (
                <div className="space-y-4">
                  {guests.slice(0, 5).map((guest: any) => (
                    <div
                      key={guest._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-800/50 bg-gray-950/40 p-4 transition-all duration-300 hover:border-gray-700/60 hover:bg-gray-950/70"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-800 text-gray-300 font-semibold border border-gray-700">
                          {guest.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {guest.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {guest.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <span className="inline-block rounded-lg bg-gray-900 border border-gray-800 px-2 py-1 text-xs font-semibold text-gray-300">
                            Room {guest.roomNo} • {guest.roomType}
                          </span>
                        </div>
                        <div className="text-right min-w-[90px]">
                          <p className="text-sm font-semibold text-emerald-400">
                            {formatCurrency(guest.amountPaid)}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                              guest.paymentStatus === "PAID"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : guest.paymentStatus === "PARTIAL"
                                ? "bg-sky-500/10 text-sky-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {guest.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Users className="mx-auto h-10 w-10 text-gray-600 mb-3" />
                  <h3 className="text-sm font-semibold text-gray-400">No active guests</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Get started by checking in a new guest.
                  </p>
                </div>
              )}
            </CardContent>
          </div>
          {guests && guests.length > 0 && (
            <div className="p-6 pt-0 border-t border-gray-800/40 mt-4">
              <Link href="/admin/guests">
                <Button variant="ghost" className="w-full text-xs text-gray-400 hover:text-white justify-center hover:bg-gray-800/50">
                  View full guest ledger
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}