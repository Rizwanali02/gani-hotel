import { getCurrentUser } from '@/app/actions/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { user: null, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Auth me API error:', error)
    return NextResponse.json(
      { user: null, error: error.message },
      { status: 500 }
    )
  }
}