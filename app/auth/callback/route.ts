import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import { User } from '@/app/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'

export async function GET(request: NextRequest) {
  console.log('🔵 Callback route hit')

  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  console.log('📝 Params:', { code: code ? 'RECEIVED' : 'MISSING', error })

  // Google sent an error
  if (error) {
    console.error('🔴 Google OAuth error:', error)
    return NextResponse.redirect(
      new URL(`/auth/signin?error=google_${error}`, request.url)
    )
  }

  // No code received
  if (!code) {
    console.error('🔴 No code received')
    return NextResponse.redirect(
      new URL('/auth/signin?error=no_code', request.url)
    )
  }

  try {
    // Exchange code for tokens
    console.log('🔄 Exchanging code for tokens...')
    
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback`

    console.log('🔑 Client ID present:', !!GOOGLE_CLIENT_ID)
    console.log('🔐 Client Secret present:', !!GOOGLE_CLIENT_SECRET)
    console.log('🔗 Redirect URI:', REDIRECT_URI)

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()
    console.log('📦 Token response:', { 
      hasAccessToken: !!tokens.access_token,
      hasIdToken: !!tokens.id_token,
      error: tokens.error,
      errorDescription: tokens.error_description 
    })

    if (tokens.error) {
      console.error('🔴 Token exchange error:', tokens.error, tokens.error_description)
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${tokens.error}`, request.url)
      )
    }

    // Get user info from Google
    console.log('🔄 Fetching user info from Google...')
    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    )

    const googleUser = await userResponse.json()
    console.log('👤 Google user:', { 
      email: googleUser.email,
      name: googleUser.name,
      hasSub: !!googleUser.sub 
    })

    if (!googleUser.email) {
      console.error('🔴 No email in Google user data')
      return NextResponse.redirect(
        new URL('/auth/signin?error=invalid_user', request.url)
      )
    }

    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...')
    await dbConnect()
    console.log('✅ MongoDB connected')

    // Find or create user
    let user = await User.findOne({ email: googleUser.email })
    console.log('🔍 Existing user found:', !!user)

    if (!user) {
      console.log('🆕 Creating new user...')
      user = await User.create({
        email: googleUser.email,
        name: googleUser.name || googleUser.email.split('@')[0],
        avatarUrl: googleUser.picture || '',
        googleId: googleUser.sub,
        role: 'USER',
      })
      console.log('✅ New user created:', user.email)
    } else {
      // Update existing user
      user.name = googleUser.name || user.name
      user.avatarUrl = googleUser.picture || user.avatarUrl
      user.googleId = googleUser.sub
      await user.save()
      console.log('✅ User updated:', user.email)
    }

    // Create JWT
    const jwtToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    console.log('✅ JWT created')

    // Redirect based on role
    const redirectUrl = user.role === 'ADMIN' ? '/admin' : '/'
    console.log('🔀 Redirecting to:', redirectUrl)
    
    const response = NextResponse.redirect(new URL(redirectUrl, request.url))

    // Set JWT cookie
    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    console.log('✅ Cookie set, redirecting...')

    return response

  } catch (error: any) {
    console.error('🔴 Unexpected callback error:', error.message)
    console.error('Stack:', error.stack)
    return NextResponse.redirect(
      new URL(`/auth/signin?error=server_error`, request.url)
    )
  }
}