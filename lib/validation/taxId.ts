const WEIGHTS = [1, 2, 1, 2, 1, 2, 4, 1] as const;

// Taiwan business tax ID (統一編號) checksum: multiply each digit by its
// weight, fold any two-digit product into a single digit (add its tens and
// ones), then sum. Valid when the sum is a multiple of 10 — except a
// long-standing carve-out for IDs whose 7th digit is 7, which are also
// accepted when (sum + 1) is a multiple of 10.
export function isValidTaxId(taxId: string): boolean {
  if (!/^\d{8}$/.test(taxId)) return false;

  const digits = taxId.split("").map(Number);
  const sum = digits.reduce((acc, digit, i) => {
    const product = digit * WEIGHTS[i];
    return acc + Math.floor(product / 10) + (product % 10);
  }, 0);

  if (sum % 10 === 0) return true;
  if (digits[6] === 7 && (sum + 1) % 10 === 0) return true;
  return false;
}
