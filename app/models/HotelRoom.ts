import mongoose from 'mongoose'

const HotelRoomSchema = new mongoose.Schema(
  {
    roomType: {
      type: String,
      enum: ['STANDARD', 'DELUXE', 'SUITE', 'FAMILY'],
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 2,
    },
    description: {
      type: String,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const HotelRoom = mongoose.models.HotelRoom || mongoose.model('HotelRoom', HotelRoomSchema)