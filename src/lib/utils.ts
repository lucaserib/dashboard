import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('pt-BR');
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formata como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

export function getInitials(name?: string): string {
  if (!name) return '?';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Retorna tipo de dispositivo - sem emojis
export function getDeviceType(deviceType?: string): 'ios' | 'android' | 'web' | 'unknown' {
  switch (deviceType?.toLowerCase()) {
    case 'ios':
      return 'ios';
    case 'android':
      return 'android';
    case 'web':
      return 'web';
    default:
      return 'unknown';
  }
}

export function getGenderLabel(gender?: string): string {
  switch (gender?.toLowerCase()) {
    case 'masculino':
      return 'Masculino';
    case 'feminino':
      return 'Feminino';
    case 'outro':
      return 'Outro';
    default:
      return 'Não informado';
  }
}

export function getPlatformBadgeVariant(platform?: string): 'default' | 'secondary' | 'outline' {
  switch (platform?.toLowerCase()) {
    case 'ios':
      return 'default';
    case 'android':
      return 'secondary';
    default:
      return 'outline';
  }
}

// Manter funções antigas por compatibilidade temporária (serão removidas depois)
export function getDeviceTypeIcon(deviceType?: string): string {
  return getDeviceType(deviceType);
}

export function getGenderIcon(gender?: string): string {
  return getGenderLabel(gender);
}
