import type { Stringtable } from './types'

export function localize(value?: string | Stringtable) {
  if (typeof value === 'string') return value
  const { locale, defaultLocale } = useI18n()
  const localeKey = locale.value.split('-')[0] as 'en'
  const defaultKey = defaultLocale.split('-')[0] as 'en'
  return value?.[localeKey] ?? value?.[defaultKey] ?? value?.en ?? ''
}
