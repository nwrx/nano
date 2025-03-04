import { localize } from './localize'

export const NAV_DRAWER_END = computed<NavItem[]>(() => [
  {
    items: [
      {
        icon: 'i-carbon:settings',
        to: { name: 'AdminSettingsUsers' },
        label: localize({
          en: 'Configuration',
          fr: 'Configuration',
          de: 'Konfiguration',
          es: 'Configuración',
          zh: '配置',
        }),
      },
      {
        to: '/help',
        icon: 'i-carbon:help',
        label: localize({
          en: 'Help',
          fr: 'Aide',
          de: 'Hilfe',
          es: 'Ayuda',
          zh: '帮助',
        }),
      },
      {
        to: '/support',
        icon: 'i-carbon:chat',
        label: localize({
          en: 'Support',
          fr: 'Support',
          de: 'Unterstützung',
          es: 'Soporte',
          zh: '支持',
        }),
      },
      {
        to: '/feedback',
        icon: 'i-carbon:user-feedback',
        label: localize({
          en: 'Feedback',
          fr: 'Commentaires',
          de: 'Feedback',
          es: 'Comentarios',
          zh: '反馈',
        }),
      },
    ],
  },
])
