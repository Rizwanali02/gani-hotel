'use server'

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import { User } from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

// Get current user from JWT token in cookies
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return null
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }

    // Connect to database
    await dbConnect()

    // Find user by ID
    const user = await User.findById(decoded.userId)
      .select('-__v') // Exclude mongoose version key
      .lean()

    if (!user) {
      return null
    }

    // Return plain object
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return null
  }
}

// Google Sign In
export async function signInWithGoogle(googleToken: string) {
  try {
    // Verify Google token and get user info
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: { Authorization: `Bearer ${googleToken}` },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to verify Google token')
    }

    const googleUser = await response.json()

    if (!googleUser.email) {
      throw new Error('Invalid Google user data')
    }

    await dbConnect()

    // Find or create user
    let user = await User.findOne({ email: googleUser.email })

    if (!user) {
      user = await User.create({
        email: googleUser.email,
        name: googleUser.name || googleUser.email.split('@')[0],
        avatarUrl: googleUser.picture || '',
        googleId: googleUser.sub,
        role: 'USER', // Default role
      })
    } else {
      // Update existing user's info
      user.name = googleUser.name || user.name
      user.avatarUrl = googleUser.picture || user.avatarUrl
      user.googleId = googleUser.sub
      await user.save()
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return {
      success: true,
      user: JSON.parse(JSON.stringify(user)),
    }
  } catch (error: any) {
    console.error('signInWithGoogle error:', error)
    return {
      success: false,
      error: error.message || 'Authentication failed',
    }
  }
}

// Sign Out
export async function signOut() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('token')
    return { success: true }
  } catch (error) {
    console.error('signOut error:', error)
    return { success: false }
  }
}

// Check if user is admin
export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === 'ADMIN'
}

// Get user role
export async function getUserRole() {
  const user = await getCurrentUser()
  return user?.role || null
}

// Update user role (admin only)
export async function updateUserRole(userId: string, newRole: string) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await dbConnect()

  const user = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true }
  ).lean()

  return JSON.parse(JSON.stringify(user))
}

// Get all users (admin only)
export async function getAllUsers() {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await dbConnect()

  const users = await User.find()
    .select('-__v')
    .sort({ createdAt: -1 })
    .lean()

  return JSON.parse(JSON.stringify(users))
}