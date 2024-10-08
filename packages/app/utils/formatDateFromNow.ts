import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
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
export function formatDateFromNow(date?: string) {
  if (!date) return '-'
  const { locale } = useI18n()
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: { de, en, fr, zh }[locale.value],
  })
}
