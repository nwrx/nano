import { format } from 'date-fns/format'
import { de } from 'date-fns/locale/de'
import { enUS as en } from 'date-fns/locale/en-US'
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
  return format(date, 'PP', {
    locale: { de, en, fr, zh }[locale.value],
  })
}
