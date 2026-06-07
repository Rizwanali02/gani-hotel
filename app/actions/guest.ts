'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const guestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  email: z.string().email().optional().or(z.literal('')),
  roomNo: z.string().min(1, 'Room number is required'),
  roomType: z.enum(['DORMITORY', 'PRIVATE', 'DELUXE', 'SUITE']),
  checkIn: z.string().min(1, 'Check-in date is required'),
  amountPaid: z.number().min(0),
  totalAmount: z.number().min(0),
  paymentStatus: z.enum(['PAID', 'PENDING', 'PARTIAL']),
  notes: z.string().optional(),
})

export async function createGuestRecord(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  const validatedFields = guestSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    roomNo: formData.get('roomNo'),
    roomType: formData.get('roomType'),
    checkIn: formData.get('checkIn'),
    amountPaid: Number(formData.get('amountPaid')),
    totalAmount: Number(formData.get('totalAmount')),
    paymentStatus: formData.get('paymentStatus'),
    notes: formData.get('notes'),
  })

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten())
    return { error: 'Invalid fields', details: validatedFields.error.flatten() }
  }

  const { name, phone, email, roomNo, roomType, checkIn, amountPaid, totalAmount, paymentStatus, notes } = validatedFields.data

  // Handle ID card upload
  const idCardFile = formData.get('idCard') as File
  let idCardUrl = null

  if (idCardFile && idCardFile.size > 0) {
    const fileName = `id-cards/${user.id}/${Date.now()}-${idCardFile.name}`
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, idCardFile)

    if (error) {
      console.error('File upload error:', error)
      throw error
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName)
    
    idCardUrl = publicUrl
  }

  const { data: guest, error } = await supabase
    .from('GuestRecord')
    .insert({
      name,
      phone,
      email: email || null,
      roomNo,
      roomType,
      checkIn: new Date(checkIn).toISOString(),
      amountPaid,
      totalAmount,
      paymentStatus,
      notes: notes || null,
      idCardUrl,
      userId: user.id,
      createdBy: user.email!,
      status: 'ACTIVE',
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw error
  }

  // Create revenue record if payment made
  if (amountPaid > 0) {
    await supabase
      .from('Revenue')
      .insert({
        amount: amountPaid,
        description: `Payment from ${name} - Room ${roomNo}`,
        category: 'ROOM_BOOKING',
        guestId: guest.id,
      })
  }

  revalidatePath('/admin/guests')
  return { success: true, guest }
}

export async function getGuests() {
  const supabase = await createClient()
  
  const { data: guests, error } = await supabase
    .from('GuestRecord')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('checkIn', { ascending: false })

  if (error) {
    console.error('Error fetching guests:', error)
    throw error
  }
  
  return guests
}

export async function checkOutGuest(guestId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('GuestRecord')
    .update({
      status: 'CHECKED_OUT',
      checkOut: new Date().toISOString(),
    })
    .eq('id', guestId)

  if (error) {
    console.error('Error checking out guest:', error)
    throw error
  }
  
  revalidatePath('/admin/guests')
  return { success: true }
}

export async function getRevenueStats() {
  const supabase = await createClient()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { data: todayRevenue, error } = await supabase
    .from('Revenue')
    .select('amount')
    .gte('date', today.toISOString())

  if (error) throw error
  
  const totalToday = todayRevenue?.reduce((sum, record) => sum + record.amount, 0) || 0
  
  const { data: pendingPayments, error: pendingError } = await supabase
    .from('GuestRecord')
    .select('totalAmount, amountPaid')
    .eq('status', 'ACTIVE')
    .in('paymentStatus', ['PENDING', 'PARTIAL'])

  if (pendingError) throw pendingError
  
  const totalPending = pendingPayments?.reduce(
    (sum, record) => sum + (record.totalAmount - record.amountPaid), 
    0
  ) || 0
  
  return { totalToday, totalPending }
}