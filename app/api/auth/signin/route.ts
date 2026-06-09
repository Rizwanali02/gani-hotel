import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import { User } from '@/app/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { credential } = body // Google ID Token from client

    if (!credential) {
      return NextResponse.json(
        { success: false, error: 'Google credential is required' },
        { status: 400 }
      )
    }

    // ✅ Verify ID Token with Google
    const verifyResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    )

    const tokenInfo = await verifyResponse.json()

    console.log('Token info:', { 
      email: tokenInfo.email,
      aud: tokenInfo.aud,
      isValid: tokenInfo.aud === GOOGLE_CLIENT_ID
    })

    // Check if token is valid and belongs to our app
    if (tokenInfo.error || tokenInfo.aud !== GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { success: false, error: 'Invalid Google ID token' },
        { status: 401 }
      )
    }

    const { email, name, picture, sub } = tokenInfo

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email not found in Google token' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await dbConnect()

    // Find or create user
    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        email,
        name: name || email.split('@')[0],
        avatarUrl: picture || '',
        googleId: sub,
        role: 'USER',
      })
    } else {
      user.name = name || user.name
      user.avatarUrl = picture || user.avatarUrl
      user.googleId = sub
      await user.save()
    }

    // Create JWT for our app
    const appToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Set cookie and return response
    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    })

    response.cookies.set('token', appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response

  } catch (error: any) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}