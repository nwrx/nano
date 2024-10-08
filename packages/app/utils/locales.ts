import type { LocaleObject } from '@nuxtjs/i18n'

export const LOCALES = [
  {
    language: 'en',
    name: 'English',
    code: 'en-US',
    icon: 'i-flag:us-4x3',
  },
  {
    language: 'fr',
    code: 'fr-FR',
    icon: 'i-flag:fr-4x3',
    name: 'Français',
  },
  {
    language: 'de',
    name: 'Deutsch',
    code: 'de-DE',
    icon: 'i-flag:de-4x3',
  },
  {
    language: 'es',
    name: 'Español',
    code: 'es-ES',
    icon: 'i-flag:es-4x3',
  },
  {
    language: 'zh',
    name: '中文',
    code: 'zh-CN',
    icon: 'i-flag:cn-4x3',
  },
] as const satisfies LocaleObject[]
