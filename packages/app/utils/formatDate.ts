import { format } from 'date-fns/format'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
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
  const { locale } = useI18n()
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
  const { locale } = useI18n()
  const key = locale.value ? locale.value.split('-')[0] : 'en'
  const localeObject = { de, en, fr, zh, es }[key]
  return format(date, 'PPp', { locale: localeObject })
}

/**
 * Return the formatted date according to the current locale.
 *
 * @param date The date to format.
 * @returns The formatted date.
 */
export function formatDateFromNow(date?: string): string {
  if (!date) return '-'
  const { locale } = useI18n()
  const key = locale.value ? locale.value.split('-')[0] : 'en'
  const localeObject = { de, en, fr, zh, es }[key]
  return formatDistanceToNow(date, { addSuffix: true, locale: localeObject })
}
