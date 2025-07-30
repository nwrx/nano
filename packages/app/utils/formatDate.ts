import { format } from 'date-fns/format'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { formatDuration as fnsFormatDuration } from 'date-fns/formatDuration'
import { de } from 'date-fns/locale/de'
import { enUS as en } from 'date-fns/locale/en-US'
import { es } from 'date-fns/locale/es'
import { fr } from 'date-fns/locale/fr'
import { zhCN as zh } from 'date-fns/locale/zh-CN'

/**
 * Return the formatted date according to the current locale.
 *
 * @param date The date to format.
 * @returns The formatted date.
 */
export function formatDate(date?: Date | number | string): string {
  if (!date) return '-'
  const { locale } = useLocale()
  const key = locale.value ? locale.value.split('-')[0] : 'en'
  const localeObject = { de, en, fr, zh, es }[key]
  return format(date, 'PP', { locale: localeObject })
}

/**
 * Return the formatted date and time according to the current locale.
 *
 * @param date The date to format.
 * @returns The formatted date and time.
 */
export function formatDateTime(date?: Date | number | string): string {
  if (!date) return '-'
  const { locale } = useLocale()
  const key = locale.value ? locale.value.split('-')[0] : 'en'
  const localeObject = { de, en, fr, zh, es }[key]
  return format(date, 'PPp', { locale: localeObject })
}

/**
 * Return the formatted date according to the current locale.
 *
 * @param date The date to format.
 * @param fallback The fallback value to return if the date is not provided.
 * @returns The formatted date.
 */
export function formatDateFromNow(date?: string, fallback = '-'): string {
  if (!date) return fallback
  const { locale } = useLocale()
  const key = locale.value ? locale.value.split('-')[0] : 'en'
  const localeObject = { de, en, fr, zh, es }[key]
  return formatDistanceToNow(date, { addSuffix: true, locale: localeObject })
}

/**
 * Return the formated duration in seconds.
 *
 * @param seconds The duration in seconds.
 * @returns The formatted duration.
 * @example formatDuration(60) // "1 minute"
 */
export function formatDuration(seconds?: number): string {
  if (!seconds || seconds < 0) return '-'
  const { locale } = useLocale()
  const key = locale.value ? locale.value.split('-')[0] : 'en'
  const localeObject = { de, en, fr, zh, es }[key]
  const duration = {
    seconds: seconds % 60,
    minutes: Math.floor(seconds / 60) % 60,
    hours: Math.floor(seconds / 3600) % 24,
    days: Math.floor(seconds / 86400) % 30,
    months: Math.floor(seconds / 2592000) % 12,
    years: Math.floor(seconds / 31536000),
  }
  return fnsFormatDuration(duration, { locale: localeObject, zero: false })
}
