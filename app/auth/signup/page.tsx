"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hotel, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { registerWithEmail, user, loading: authLoading } = useAuth()

  const redirectUrl = searchParams.get('redirect') || '/'

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectUrl)
    }
  }, [user, authLoading, redirectUrl, router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Clientside Validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const result = await registerWithEmail(name, email, password, confirmPassword)
      if (result.success) {
        router.replace(redirectUrl)
      } else {
        setError(result.error || "Failed to create account")
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Show loader while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  // Don't render signup if already logged in
  if (user) {
    return null
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 -top-24 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500"
          >
            <Hotel className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
            Gani Hotel & Restaurant
          </h1>
          <p className="mt-2 text-sm text-gray-400">Create an account to start booking</p>
        </div>

        {/* Signup Card */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl text-white">Create Account</CardTitle>
            <CardDescription className="text-center text-gray-400 text-xs">
              Fill in your details below to register.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Messages */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-gray-400">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-gray-850 bg-gray-950/40 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-400">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-850 bg-gray-950/40 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-gray-400">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-850 bg-gray-950/40 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-400">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-gray-850 bg-gray-950/40 text-white placeholder-gray-600 focus:border-orange-500/50 focus:ring-orange-500/10 transition-colors"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/20 transition-all duration-300 mt-2">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>

            <div className="text-center text-xs text-gray-455 pt-2">
              Already have an account?{" "}
              <Link href={`/auth/signin?redirect=${encodeURIComponent(redirectUrl)}`} className="text-orange-500 font-semibold hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
            ← Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
