import { z } from "zod";

/**
 * Phone number validation schema
 * Allows only + and digits (0-9), minimum 9 characters, maximum 20 characters
 */
export const phoneNumberSchema = z
  .string()
  .regex(
    /^[+0-9]{9,20}$/,
    'Phone number must contain only + and digits (0-9), minimum 9 characters'
  )
  .min(9, 'Phone number must be at least 9 characters')
  .max(20, 'Phone number cannot exceed 20 characters');

/**
 * Optional phone number validation
 * Can be empty string or valid phone number
 */
export const optionalPhoneNumberSchema = z
  .string()
  .regex(/^[+0-9]*$/, 'Phone number must contain only + and digits')
  .refine(
    (val) => val === '' || val.length >= 9,
    { message: 'Phone number must be at least 9 characters' }
  )
  .optional()
  .or(z.literal(''));

/**
 * Utility function to sanitize phone input (remove non-allowed characters)
 * Only keeps + and digits (0-9)
 * @param value - Input string to sanitize
 * @returns Sanitized string with only + and digits
 */
export const sanitizePhoneInput = (value: string): string => {
  return value.replace(/[^+0-9]/g, '');
};

/**
 * Utility function to validate phone number
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  return /^[+0-9]{9,20}$/.test(phone);
};
