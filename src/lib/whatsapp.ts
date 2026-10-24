/**
 * WhatsApp Redirect Utility
 * Generates official WhatsApp click-to-chat links without exposing raw mobile numbers on the screen.
 * Format: https://wa.me/<phone>?text=<message>
 */
export function getWhatsAppRedirectUrl(phone?: string, prefillMessage?: string): string {
  if (!phone) return '';
  
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';

  // If 10 digits (standard Indian mobile without country prefix), prepend 91
  const cleanPhone = digits.length === 10 ? `91${digits}` : digits;
  const messageParam = prefillMessage ? `?text=${encodeURIComponent(prefillMessage.trim())}` : '';

  return `https://wa.me/${cleanPhone}${messageParam}`;
}
