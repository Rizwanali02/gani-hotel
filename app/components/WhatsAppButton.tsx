"use client"

import { Button } from "@/components/ui/button"
import { generateWhatsAppLink, WHATSAPP_NUMBER } from "@/lib/utils"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  roomType?: string
  userName?: string
  userEmail?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function WhatsAppButton({
  roomType = "Room",
  userName,
  userEmail,
  variant = "default",
  size = "default",
  className,
}: WhatsAppButtonProps) {
  const message = userName && userEmail 
    ? `Hello! ${userName} (${userEmail}) here. I'm interested in staying at Gani Hostel.`
    : `Hello! I am interested in the ${roomType}. Please provide details.`
  
  const link = generateWhatsAppLink(WHATSAPP_NUMBER, message)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      type="button"
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Book via WhatsApp
    </Button>
  )
}