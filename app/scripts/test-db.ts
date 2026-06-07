const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔄 Testing database connection...')
    console.log('URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Try to query
    const result = await prisma.$queryRaw`SELECT current_database(), current_schema, version()`
    console.log('📊 Database info:', result)
    
  } catch (error) {
    console.error('❌ Connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()