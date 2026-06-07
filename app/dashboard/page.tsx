import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Hotel, Coffee } from 'lucide-react'
import Link from 'next/link'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { SignOutButton } from '../components/SignOutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Get user's booking history
  const { data: bookings } = await supabase
    .from('GuestRecord')
    .select('*')
    .eq('email', user.email)
    .order('checkIn', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Dashboard Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || 'User'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                    {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">
                  Welcome back, {user.user_metadata?.full_name || 'Guest'}!
                </h1>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <WhatsAppButton
                    userName={user.user_metadata?.full_name}
                    userEmail={user.email}
                    roomType="Room Booking"
                    variant="default"
                    className="w-full"
                  />
                  <Link href="/#menu-section">
                    <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                      <Coffee className="mr-2 h-4 w-4" />
                      Order Food
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Your Recent Stays</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-lg bg-gray-800 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <Hotel className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-sm font-medium text-white">
                              Room {booking.roomNo} - {booking.roomType}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(booking.checkIn).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-400">
                            ₹{booking.amountPaid}
                          </p>
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs ${
                              booking.status === 'ACTIVE'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-gray-500/10 text-gray-400'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-gray-600" />
                    <p className="mt-4 text-gray-400">No stays yet</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Book your first stay via WhatsApp
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400">Name</label>
                  <p className="text-white">{user.user_metadata?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Email</label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Member Since</label>
                  <p className="text-white">
                    {new Date(user.created_at).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-400">
                  Chat with our manager directly on WhatsApp for booking modifications, special requests, or restaurant reservations.
                </p>
                <WhatsAppButton
                  userName={user.user_metadata?.full_name}
                  userEmail={user.email}
                  roomType="Support Request"
                  variant="outline"
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}