/**
 * Formats a given size in bytes into a human-readable string.
 *
 * @param size The size in bytes to format.
 * @returns A string representing the formatted size in bytes, kilobytes, megabytes, or gigabytes.
 * @example formatDataVolume(1024) // "1.00 KB"
 */
export function formatDataVolume(size?: number): string {
  if (size === undefined || size === null) return '-'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

/**
 * Formats a given frequency in MHz into a human-readable string.
 *
 * @param mhz The frequency in MHz to format.
 * @returns A string representing the formatted frequency in MHz or GHz.
 * @example formatFrequency(500) // "500 MHz"
 */
export function formatFrequency(mhz?: number): string {
  if (mhz === undefined || mhz === null) return '-'
  if (mhz < 1000) return `${mhz} MHz`
  return `${(mhz / 1000).toFixed(2)} GHz`
}
