export const NAV_DRAWER_END = computed<NavItem[]>(() => [
  {
    items: [
      {
        to: '/help',
        label: 'Help',
        icon: 'i-carbon:help',
      },
      {
        to: '/support',
        label: 'Support',
        icon: 'i-carbon:chat',
      },
      {
        to: '/feedback',
        label: 'Feedback',
        icon: 'i-carbon:user-feedback',
      },
    ],
  },
])
