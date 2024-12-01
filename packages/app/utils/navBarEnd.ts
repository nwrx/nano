export const NAV_BAR_END = computed<NavItem[]>(() => [
  {
    to: '/help',
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
    label: localize({
      en: 'Feedback',
      fr: 'Commentaires',
      de: 'Feedback',
      es: 'Comentarios',
      zh: '反馈',
    }),
  },
])
