import mongoose from 'mongoose'

const GuestRecordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    idCardUrl: {
      type: String,
      default: '',
    },
    roomNo: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      enum: ['STANDARD', 'DELUXE', 'SUITE', 'FAMILY'],
      default: 'STANDARD',
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PENDING', 'PARTIAL'],
      default: 'PENDING',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'CHECKED_OUT'],
      default: 'ACTIVE',
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

export const GuestRecord = mongoose.models.GuestRecord || mongoose.model('GuestRecord', GuestRecordSchema)