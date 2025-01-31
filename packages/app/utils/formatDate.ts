import { format } from 'date-fns/format'
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
export function formatDate(date?: string) {
  if (!date) return '-'
  const { locale } = useI18n()
  const localeObject = { de, en, fr, zh, es }[locale.value.split('-')[0]]
  return format(date, 'PP', { locale: localeObject })
}
