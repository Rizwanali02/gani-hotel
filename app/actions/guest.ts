'use server'

import dbConnect from '@/lib/mongodb'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import path from 'path'
import { getCurrentUser } from './auth'
import { GuestRecord } from '../models/GuestRecord'
import { Revenue } from '../models/Reveune'

export async function createGuestRecord(formData: FormData) {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await dbConnect()

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const roomNo = formData.get('roomNo') as string
  const roomType = formData.get('roomType') as string
  const checkIn = new Date(formData.get('checkIn') as string)
  const amountPaid = parseFloat(formData.get('amountPaid') as string) || 0
  const totalAmount = parseFloat(formData.get('totalAmount') as string) || 0
  const paymentStatus = formData.get('paymentStatus') as string
  const notes = formData.get('notes') as string

  // Handle ID card upload
  const idCardFile = formData.get('idCard') as File
  let idCardUrl = ''

  if (idCardFile && idCardFile.size > 0) {
    const bytes = await idCardFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fileName = `id-card-${Date.now()}-${idCardFile.name}`
    const filePath = path.join(process.cwd(), 'public/uploads', fileName)
    
    await writeFile(filePath, buffer)
    idCardUrl = `/uploads/${fileName}`
  }

  const guest = await GuestRecord.create({
    name,
    phone,
    email: email || undefined,
    roomNo,
    roomType,
    checkIn,
    amountPaid,
    totalAmount,
    paymentStatus,
    notes: notes || undefined,
    idCardUrl,
    userId: user._id,
    createdBy: user.email,
  })

  // Create revenue record if payment made
  if (amountPaid > 0) {
    await Revenue.create({
      amount: amountPaid,
      description: `Payment from ${name} - Room ${roomNo}`,
      category: 'ROOM_BOOKING',
      guestId: guest._id,
    })
  }

  revalidatePath('/admin/guests')
  return { success: true, guest: JSON.parse(JSON.stringify(guest)) }
}

export async function getGuests() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await dbConnect()

  const guests = await GuestRecord.find({ status: 'ACTIVE' })
    .sort({ checkIn: -1 })
    .lean()

  return JSON.parse(JSON.stringify(guests))
}

export async function checkOutGuest(guestId: string, settlementAmount?: number) {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await dbConnect()

  const guest = await GuestRecord.findById(guestId)
  if (!guest) {
    throw new Error('Guest record not found')
  }

  if (guest.status === 'CHECKED_OUT') {
    throw new Error('Guest is already checked out')
  }

  const outstanding = guest.totalAmount - guest.amountPaid

  // If there's an outstanding balance, a settlement is required
  if (outstanding > 0) {
    if (settlementAmount === undefined || settlementAmount === null) {
      // Return payment info so the frontend can show the settlement modal
      return {
        success: false,
        requiresSettlement: true,
        outstanding,
        amountPaid: guest.amountPaid,
        totalAmount: guest.totalAmount,
        guestName: guest.name,
      }
    }

    if (settlementAmount < outstanding) {
      throw new Error(`Settlement amount (₹${settlementAmount}) is less than outstanding balance (₹${outstanding}). Full payment is required.`)
    }

    // Record the settlement payment
    const actualSettlement = Math.min(settlementAmount, outstanding)
    guest.amountPaid = guest.amountPaid + actualSettlement
    guest.paymentStatus = 'PAID'

    // Create revenue record for the settlement
    await Revenue.create({
      amount: actualSettlement,
      description: `Checkout settlement from ${guest.name} - Room ${guest.roomNo}`,
      category: 'ROOM_BOOKING',
      guestId: guest._id,
    })
  }

  // Mark as checked out
  guest.status = 'CHECKED_OUT'
  guest.checkOut = new Date()
  // Ensure paymentStatus is PAID for fully paid guests on checkout
  if (guest.amountPaid >= guest.totalAmount) {
    guest.paymentStatus = 'PAID'
  }
  await guest.save()

  revalidatePath('/admin/guests')
  revalidatePath('/admin')
  return { success: true }
}

export async function getRevenueStats() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await dbConnect()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayRevenue = await Revenue.aggregate([
    { $match: { date: { $gte: today } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ])

  const pendingGuests = await GuestRecord.find({
    status: 'ACTIVE',
    paymentStatus: { $in: ['PENDING', 'PARTIAL'] },
  })

  const totalPending = pendingGuests.reduce(
    (sum:any, guest:any) => sum + (guest.totalAmount - guest.amountPaid),
    0
  )

  const totalAllTime = await GuestRecord.countDocuments({})

  return {
    totalToday: todayRevenue[0]?.total || 0,
    totalPending,
    totalAllTime,
  }
}