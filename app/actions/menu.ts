'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMenuItems() {
  const supabase = await createClient()
  
  const { data: items, error } = await supabase
    .from('MenuItem')
    .select('*')
    .eq('isAvailable', true)
    .order('category')

  if (error) {
    console.error('Error fetching menu items:', error)
    return [] // Return empty array instead of throwing
  }
  
  return items
}

export async function addMenuItem(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string

  const { error } = await supabase
    .from('MenuItem')
    .insert({
      title,
      description,
      price,
      category,
    })

  if (error) throw error
  
  revalidatePath('/')
  revalidatePath('/admin/menu')
  return { success: true }
}