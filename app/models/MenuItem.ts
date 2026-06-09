import mongoose from 'mongoose'

const MenuItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['starters', 'main-course', 'beverages', 'desserts'],
    },
    imageUrl: {
      type: String,
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

export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema)