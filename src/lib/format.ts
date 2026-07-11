/**
 * Money / number formatting helpers.
 *
 * Revoras operates in India, so all monetary values are displayed in INR (₹)
 * with the Indian digit grouping (e.g. 1,24,500 / 12,54,900).
 */

/**
 * Format a value as Indian Rupees, e.g. 12540 -> "₹12,540", 124500 -> "₹1,24,500".
 * Accepts numbers or numeric strings; non-finite input renders as "₹0".
 * Pass `decimals` (default 0) for paise precision, e.g. formatINR(499.5, 2) -> "₹499.50".
 */
export function formatINR(
  value: number | string | null | undefined,
  decimals = 0
): string {
  const n = typeof value === "string" ? parseFloat(value) : value ?? 0;
  const safe = Number.isFinite(n) ? (n as number) : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safe);
}

/** Format a plain number with Indian grouping, e.g. 125000 -> "1,25,000". */
export function formatIndianNumber(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? parseFloat(value) : value ?? 0;
  const safe = Number.isFinite(n) ? (n as number) : 0;
  return new Intl.NumberFormat("en-IN").format(safe);
}
