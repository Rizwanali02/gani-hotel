"use client"

import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, ArrowLeft, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"

export default function UnauthorizedPage() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOutAndRedirect = async () => {
    setLoading(true)
    try {
      await signOut()
      router.push("/auth/signin?message=signin_required")
    } catch (error) {
      console.error("Sign out failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-950 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 -top-24 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-md text-center py-6">
          <CardHeader className="flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <CardTitle className="font-serif text-2xl font-bold text-white">
              Access Denied
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2 max-w-xs">
              Your account does not possess the administrative privileges required to view the requested resource.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 px-6">
            <div className="text-xs text-gray-500 bg-gray-950/40 p-3 rounded-lg border border-gray-850/60 leading-relaxed text-left">
              <strong>Need access?</strong> If you believe this is an error, please ensure you are logged in using the authorized administrator credentials or contact your system administrator.
            </div>

            <div className="grid gap-3 pt-2">
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/10 transition-all duration-300">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Homepage
                </Button>
              </Link>
              
              <Button
                variant="outline"
                onClick={handleSignOutAndRedirect}
                disabled={loading}
                className="w-full border-gray-800 text-gray-400 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out & Switch Account
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
