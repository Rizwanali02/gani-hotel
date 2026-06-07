import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check database connection
    await prisma.$connect()
    
    // Get table counts
    const userCount = await prisma.user.count()
    const guestCount = await prisma.guestRecord.count()
    const menuCount = await prisma.menuItem.count()
    const roomCount = await prisma.hostelRoom.count()
    const revenueCount = await prisma.revenue.count()

    // Get database info
    const dbInfo = await prisma.$queryRaw`SELECT current_database(), version(), now()`

    return NextResponse.json({
      status: 'success',
      message: '✅ Database connected successfully!',
      timestamp: new Date().toISOString(),
      database: {
        name: (dbInfo as any)[0]?.current_database || 'Unknown',
        version: (dbInfo as any)[0]?.version || 'Unknown',
        serverTime: (dbInfo as any)[0]?.now || new Date(),
      },
      tables: {
        User: { count: userCount, exists: true },
        GuestRecord: { count: guestCount, exists: true },
        MenuItem: { count: menuCount, exists: true },
        HostelRoom: { count: roomCount, exists: true },
        Revenue: { count: revenueCount, exists: true },
      },
      environment: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
        hasDirectUrl: !!process.env.DIRECT_URL,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    })
  } catch (error: any) {
    console.error('Database connection error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: '❌ Database connection failed!',
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        meta: error.meta,
      },
      troubleshooting: {
        step1: 'Check if DATABASE_URL is correctly set in .env file',
        step2: 'Verify Supabase project is not paused',
        step3: 'Ensure database password is correct',
        step4: 'Run: npx prisma db push',
        step5: 'Check if IP is allowed in Supabase settings',
      },
      environment: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlSample: process.env.DATABASE_URL?.substring(0, 30) + '...',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      }
    }, { 
      status: 500,
      statusText: 'Database Connection Failed'
    })
  } finally {
    await prisma.$disconnect()
  }
}