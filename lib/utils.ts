// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// export function isValidNZPhoneNumber(phone: string): boolean {
//     // Remove all non-digit characters
//     const cleanedNumber = phone.replace(/\D/g, '');
  
//     // Check if the number starts with the country code (64 or +64)
//     const hasCountryCode = cleanedNumber.startsWith('64');
  
//     // Remove the country code if present
//     const numberWithoutCountryCode = hasCountryCode ? cleanedNumber.slice(2) : cleanedNumber;
  
//     // Check if the remaining number is 9 digits long (standard for NZ mobile numbers)
//     if (numberWithoutCountryCode.length !== 9) {
//       return false;
//     }
  
//     // Check if the number starts with 02 (NZ mobile prefix)
//     return numberWithoutCountryCode.startsWith('2');
//   }

// export function formatNZPhoneNumber(phone: string): string {
//   const digits = phone.replace(/\D/g, '')
//   if (digits.length === 9) {
//     return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
//   } else if (digits.length === 10) {
//     return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
//   }
//   return phone
// }

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidNZPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters
  const cleanedNumber = phone.replace(/\D/g, '');

  // Check if the number starts with the country code (64 or +64) or 0
  const hasCountryCode = cleanedNumber.startsWith('64');
  const startsWithZero = cleanedNumber.startsWith('0');

  // Remove the country code or leading zero if present
  const numberWithoutPrefix = hasCountryCode ? cleanedNumber.slice(2) : (startsWithZero ? cleanedNumber.slice(1) : cleanedNumber);

  // Check if the remaining number is 9 digits long (standard for NZ mobile numbers)
  if (numberWithoutPrefix.length !== 9) {
    return false;
  }

  // Check if the number starts with 2 (NZ mobile prefix)
  return numberWithoutPrefix.startsWith('2');
}

export function formatNZPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleanedNumber = phone.replace(/\D/g, '');

  // Remove leading zero if present
  const numberWithoutZero = cleanedNumber.startsWith('0') ? cleanedNumber.slice(1) : cleanedNumber;

  // Add country code if not present
  const formattedNumber = numberWithoutZero.startsWith('64') ? numberWithoutZero : `64${numberWithoutZero}`;

  return formattedNumber;
}