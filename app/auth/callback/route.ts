import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    console.error('Auth callback error:', error, searchParams.get('error_description'))
    return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`)
  }

  if (code) {
    const supabase = await createClient()
    
    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`)
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Manually create/update user in our table
        try {
          const { error: upsertError } = await supabase
            .from('User')
            .upsert({
              id: user.id,  // Supabase auth user ID (UUID)
              email: user.email!,
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Guest',
              avatarUrl: user.user_metadata?.avatar_url || null,
              role: 'USER',
              updatedAt: new Date().toISOString(),
            }, {
              onConflict: 'email',
            })

          if (upsertError) {
            console.error('User upsert error:', upsertError)
            // Don't fail - user can still use the app
          }
        } catch (dbError) {
          console.error('Database error:', dbError)
          // Continue anyway - user is authenticated
        }

        // Check if admin
        const { data: userData } = await supabase
          .from('User')
          .select('role')
          .eq('email', user.email)
          .maybeSingle()

        if (userData?.role === 'ADMIN') {
          return NextResponse.redirect(`${origin}/admin`)
        }

        // Regular user - go to home
        return NextResponse.redirect(`${origin}/`)
      }
    } catch (err) {
      console.error('Unexpected callback error:', err)
      return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/signin?error=no_code`)
}