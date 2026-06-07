import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919XXXXXXXXX'

export function generateBookingMessage(
  roomType: string,
  userName?: string,
  userEmail?: string
): string {
  let message = `Hello! I am interested in booking the ${roomType}.\n`
  if (userName) message += `Name: ${userName}\n`
  if (userEmail) message += `Email: ${userEmail}\n`
  message += 'Please provide availability and pricing details.'
  return message
}