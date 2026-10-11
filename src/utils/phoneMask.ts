/**
 * Bangladeshi 11-digit mobile format helper (01xxxxxxxxx)
 */
export function formatBdPhoneNumber(value: string): string {
  // Extract all digits
  let digits = value.replace(/\D/g, '');

  // If pasted with country code +8801...
  if (digits.startsWith('8801')) {
    digits = digits.slice(2);
  }

  // Ensure it starts with '01'
  if (digits.length === 1 && digits !== '0') {
    digits = '0';
  } else if (digits.length >= 2 && !digits.startsWith('01')) {
    digits = '01' + digits.slice(2);
  }

  // Restrict strictly to 11 digits
  return digits.slice(0, 11);
}

export function isValidBdPhoneNumber(phone: string): boolean {
  // BD mobile operators: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits
  return /^01[3-9]\d{8}$/.test(phone.trim());
}
