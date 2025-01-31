export const NAV_BAR_END = computed<NavItem[]>(() => [
  { to: '/help', label: 'Help' },
  { to: '/support', label: 'Support' },
  { to: '/feedback', label: 'Feedback' },
])
