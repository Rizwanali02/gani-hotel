'use server'

import dbConnect from '@/lib/mongodb'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { MenuItem } from '../models/MenuItem'

// Get all menu items
export async function getMenuItems() {
  try {
    await dbConnect()

    const items = await MenuItem.find({ isAvailable: true })
      .sort({ category: 1, createdAt: -1 })
      .lean()

    return JSON.parse(JSON.stringify(items))
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return []
  }
}

// Get menu items by category
export async function getMenuByCategory(category: string) {
  try {
    await dbConnect()

    const items = await MenuItem.find({ 
      category, 
      isAvailable: true 
    })
      .sort({ createdAt: -1 })
      .lean()

    return JSON.parse(JSON.stringify(items))
  } catch (error) {
    console.error('Error fetching menu by category:', error)
    return []
  }
}

// Add new menu item (Admin only)
export async function addMenuItem(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can add menu items')
  }

  await dbConnect()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const imageUrl = formData.get('imageUrl') as string || undefined

  // Validate required fields
  if (!title || !description || !price || !category) {
    throw new Error('All fields are required: title, description, price, category')
  }

  try {
    const menuItem = await MenuItem.create({
      title,
      description,
      price,
      category,
      imageUrl,
      isAvailable: true,
    })

    revalidatePath('/')
    revalidatePath('/admin/menu')

    return { 
      success: true, 
      menuItem: JSON.parse(JSON.stringify(menuItem)) 
    }
  } catch (error: any) {
    console.error('Error adding menu item:', error)
    throw new Error(error.message || 'Failed to add menu item')
  }
}

// Update menu item (Admin only)
export async function updateMenuItem(itemId: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can update menu items')
  }

  await dbConnect()

  const updateData: any = {}

  const title = formData.get('title')
  const description = formData.get('description')
  const price = formData.get('price')
  const category = formData.get('category')
  const imageUrl = formData.get('imageUrl')
  const isAvailable = formData.get('isAvailable')

  if (title) updateData.title = title
  if (description) updateData.description = description
  if (price) updateData.price = parseFloat(price as string)
  if (category) updateData.category = category
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null
  if (isAvailable !== null && isAvailable !== undefined) {
    updateData.isAvailable = isAvailable === 'true';
  }

  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      itemId,
      { $set: updateData },
      { new: true }
    ).lean()

    if (!updatedItem) {
      throw new Error('Menu item not found')
    }

    revalidatePath('/')
    revalidatePath('/admin/menu')

    return { 
      success: true, 
      menuItem: JSON.parse(JSON.stringify(updatedItem)) 
    }
  } catch (error: any) {
    console.error('Error updating menu item:', error)
    throw new Error(error.message || 'Failed to update menu item')
  }
}

// Delete menu item (Admin only)
export async function deleteMenuItem(itemId: string) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can delete menu items')
  }

  await dbConnect()

  try {
    const deletedItem = await MenuItem.findByIdAndDelete(itemId)

    if (!deletedItem) {
      throw new Error('Menu item not found')
    }

    revalidatePath('/')
    revalidatePath('/admin/menu')

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting menu item:', error)
    throw new Error(error.message || 'Failed to delete menu item')
  }
}

// Toggle menu item availability (Admin only)
export async function toggleMenuItemAvailability(itemId: string) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can update menu items')
  }

  await dbConnect()

  try {
    const item = await MenuItem.findById(itemId)

    if (!item) {
      throw new Error('Menu item not found')
    }

    item.isAvailable = !item.isAvailable
    await item.save()

    revalidatePath('/')
    revalidatePath('/admin/menu')

    return { 
      success: true, 
      isAvailable: item.isAvailable 
    }
  } catch (error: any) {
    console.error('Error toggling menu item:', error)
    throw new Error(error.message || 'Failed to toggle menu item')
  }
}

// Get all menu items including unavailable (Admin only)
export async function getAllMenuItems() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can view all menu items')
  }

  try {
    await dbConnect()

    const items = await MenuItem.find()
      .sort({ category: 1, createdAt: -1 })
      .lean()

    return JSON.parse(JSON.stringify(items))
  } catch (error) {
    console.error('Error fetching all menu items:', error)
    return []
  }
}

// Seed default menu items (Admin only - for first time setup)
export async function seedMenuItems() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admin can seed menu items')
  }

  await dbConnect()

  const defaultItems = [
    {
      title: 'Butter Chicken',
      description: 'Tender chicken in rich, creamy tomato gravy with aromatic spices',
      price: 349,
      category: 'main-course',
    },
    {
      title: 'Paneer Tikka',
      description: 'Char-grilled cottage cheese marinated in spiced yogurt',
      price: 249,
      category: 'starters',
    },
    {
      title: 'Masala Chai',
      description: 'Traditional Indian tea brewed with aromatic spices and herbs',
      price: 49,
      category: 'beverages',
    },
    {
      title: 'Gulab Jamun',
      description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
      price: 99,
      category: 'desserts',
    },
    {
      title: 'Biryani',
      description: 'Fragrant basmati rice layered with spiced vegetables or meat',
      price: 299,
      category: 'main-course',
    },
    {
      title: 'Tandoori Roti',
      description: 'Whole wheat bread baked in traditional clay oven',
      price: 25,
      category: 'main-course',
    },
    {
      title: 'Mango Lassi',
      description: 'Refreshing yogurt drink blended with sweet mango pulp',
      price: 79,
      category: 'beverages',
    },
    {
      title: 'Samosa',
      description: 'Crispy pastry filled with spiced potatoes and peas',
      price: 59,
      category: 'starters',
    },
    {
      title: 'Dal Makhani',
      description: 'Slow-cooked black lentils in rich, creamy gravy',
      price: 199,
      category: 'main-course',
    },
    {
      title: 'Naan Bread',
      description: 'Soft, buttery flatbread baked in tandoor',
      price: 35,
      category: 'main-course',
    },
  ]

  try {
    // Clear existing items (optional)
    // await MenuItem.deleteMany({})

    const items = await MenuItem.insertMany(defaultItems)

    revalidatePath('/')

    return { 
      success: true, 
      count: items.length,
      message: `${items.length} menu items seeded successfully` 
    }
  } catch (error: any) {
    console.error('Error seeding menu items:', error)
    throw new Error(error.message || 'Failed to seed menu items')
  }
}