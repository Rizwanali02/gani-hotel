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

declare global {
  interface Window {
    google?: any
  }
}

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [googleLoaded, setGoogleLoaded] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, loginWithEmail, user, loading: authLoading } = useAuth()

  const redirectUrl = searchParams.get('redirect') || '/'
  const messageParam = searchParams.get('message')
  
  let infoMessage = ""
  if (messageParam === "signin_required") {
    infoMessage = "Please sign in to access the requested page."
  } else if (messageParam === "session_expired") {
    infoMessage = "Your session has expired. Please sign in again."
  }

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectUrl)
    }
  }, [user, authLoading, redirectUrl, router])

  // Load Google Identity Services
  useEffect(() => {
    if (window.google) {
      setGoogleLoaded(true)
      initializeGoogleSignIn()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      setGoogleLoaded(true)
      initializeGoogleSignIn()
    }
    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      )
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  const initializeGoogleSignIn = () => {
    if (!window.google || !document.getElementById('googleSignInButton')) return

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    })

    window.google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 380,
      }
    )
  }

  const handleGoogleResponse = async (response: any) => {
    setLoading(true)
    setError(null)

    try {
      const result = await signIn(response.credential)

      if (result.success) {
        router.replace(redirectUrl)
      } else {
        setError(result.error || 'Sign in failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setError(null)

    try {
      const result = await loginWithEmail(email, password)
      if (result.success) {
        router.replace(redirectUrl)
      } else {
        setError(result.error || 'Invalid email or password')
      }
    } catch (err) {
      setError('A connection error occurred. Please try again.')
    } finally {
      setEmailLoading(false)
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

  // Don't render sign-in if already logged in
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
          <p className="mt-2 text-sm text-gray-400">Sign in to manage your bookings</p>
        </div>

        {/* Sign In Card */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl text-white">Welcome Back</CardTitle>
            <CardDescription className="text-center text-gray-400 text-xs">
              Access your dashboard via Google or Email credentials.
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

            {searchParams.get('error') && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Authentication failed: {searchParams.get('error')}</span>
              </div>
            )}

            {infoMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 p-3 text-sm text-orange-400 border border-orange-500/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Google Sign In Button */}
            <div className="flex justify-center min-h-[48px] pt-1">
              {loading ? (
                <Button disabled className="w-full" size="lg">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying with Google...
                </Button>
              ) : (
                <div
                  id="googleSignInButton"
                  className="flex justify-center w-full"
                />
              )}
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-xs font-semibold uppercase tracking-wider">OR</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4 text-left">
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
              <Button type="submit" disabled={emailLoading || loading} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/20 transition-all duration-300 mt-2">
                {emailLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In with Email"
                )}
              </Button>
            </form>

            <div className="text-center text-xs text-gray-455 pt-2">
              Don't have an account?{" "}
              <Link href={`/auth/signup?redirect=${encodeURIComponent(redirectUrl)}`} className="text-orange-500 font-semibold hover:underline">
                Create an account
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