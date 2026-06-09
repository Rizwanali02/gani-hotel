'use server'

import dbConnect from '@/lib/mongodb'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { HotelRoom } from '../models/HotelRoom'

// Get all available rooms
export async function getRooms() {
  try {
    await dbConnect()

    const rooms = await HotelRoom.find({ isAvailable: true })
      .sort({ pricePerNight: 1 })
      .lean()

    return JSON.parse(JSON.stringify(rooms))
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return []
  }
}

// Get room by type
export async function getRoomsByType(roomType: string) {
  try {
    await dbConnect()

    const rooms = await HotelRoom.find({ 
      roomType, 
      isAvailable: true 
    }).lean()

    return JSON.parse(JSON.stringify(rooms))
  } catch (error) {
    console.error('Error fetching rooms by type:', error)
    return []
  }
}

// Add new room (Admin only)
export async function addRoom(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can add rooms')
  }

  await dbConnect()

  const roomType = formData.get('roomType') as string
  const roomNumber = formData.get('roomNumber') as string
  const pricePerNight = parseFloat(formData.get('pricePerNight') as string)
  const capacity = parseInt(formData.get('capacity') as string) || 2
  const description = formData.get('description') as string
  const amenitiesStr = formData.get('amenities') as string
  const amenities = amenitiesStr ? amenitiesStr.split(',').map(a => a.trim()) : []

  if (!roomType || !roomNumber || !pricePerNight) {
    throw new Error('Required fields: roomType, roomNumber, pricePerNight')
  }

  try {
    const room = await HotelRoom.create({
      roomType,
      roomNumber,
      pricePerNight,
      capacity,
      description,
      amenities,
      images: [],
      isAvailable: true,
    })

    revalidatePath('/')
    revalidatePath('/admin/rooms')

    return { 
      success: true, 
      room: JSON.parse(JSON.stringify(room)) 
    }
  } catch (error: any) {
    console.error('Error adding room:', error)
    throw new Error(error.message || 'Failed to add room')
  }
}

// Update room (Admin only)
export async function updateRoom(roomId: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can update rooms')
  }

  await dbConnect()

  const updateData: any = {}

  if (formData.get('roomType')) updateData.roomType = formData.get('roomType')
  if (formData.get('roomNumber')) updateData.roomNumber = formData.get('roomNumber')
  if (formData.get('pricePerNight')) updateData.pricePerNight = parseFloat(formData.get('pricePerNight') as string)
  if (formData.get('capacity')) updateData.capacity = parseInt(formData.get('capacity') as string)
  if (formData.get('description')) updateData.description = formData.get('description')
  if (formData.get('amenities')) {
    updateData.amenities = (formData.get('amenities') as string).split(',').map(a => a.trim())
  }

  try {
    const room = await HotelRoom.findByIdAndUpdate(
      roomId,
      { $set: updateData },
      { new: true }
    ).lean()

    if (!room) throw new Error('Room not found')

    revalidatePath('/')
    revalidatePath('/admin/rooms')

    return { 
      success: true, 
      room: JSON.parse(JSON.stringify(room)) 
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update room')
  }
}

// Delete room (Admin only)
export async function deleteRoom(roomId: string) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can delete rooms')
  }

  await dbConnect()

  await HotelRoom.findByIdAndDelete(roomId)

  revalidatePath('/')
  revalidatePath('/admin/rooms')

  return { success: true }
}

// Toggle room availability
export async function toggleRoomAvailability(roomId: string) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await dbConnect()

  const room = await HotelRoom.findById(roomId)
  if (!room) throw new Error('Room not found')

  room.isAvailable = !room.isAvailable
  await room.save()

  revalidatePath('/')
  revalidatePath('/admin/rooms')

  return { success: true, isAvailable: room.isAvailable }
}