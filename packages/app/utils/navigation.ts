export const NAV_DRAWER_START = asyncComputed<NavItem[]>(async() => {
  const { username } = await useSession().refresh()
  return [
    {
      items: [
        {
          to: '/',
          label: 'Overview',
          icon: 'i-carbon:home',
        },
        {
          to: { name: 'Workspace', params: { workspace: username } },
          label: 'Workspace',
          icon: 'i-carbon:flow',
        },
        {
          to: '/modules',
          label: 'Modules',
          icon: 'i-carbon:box',
        },
        {
          to: '/integrations',
          label: 'Integrations',
          icon: 'i-carbon:integration',
        },
        {
          to: '/storage',
          label: 'Storage',
          icon: 'i-carbon:db2-database',
        },
        {
          to: '/keys',
          label: 'API Keys',
          icon: 'i-carbon:api-key',
        },
      ],
    },
    {
      label: 'Organization',
      items: [
        {
          to: '/members',
          label: 'Members',
          icon: 'i-carbon:user',
        },
        {
          to: '/settings',
          label: 'Settings',
          icon: 'i-carbon:settings',
        },
        {
          to: '/monitoring',
          label: 'Monitoring',
          icon: 'i-carbon:cloud-monitoring',
        },
        {
          to: '/usage',
          label: 'Usage',
          icon: 'i-carbon:analytics',
        },
        {
          to: '/billing',
          label: 'Billing',
          icon: 'i-carbon:document',
        },
      ],
    },
  ]
})

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

export const NAV_BAR_START = computed<NavItem[]>(() => [
])

export const NAV_BAR_END = computed<NavItem[]>(() => [
  { to: '/help', label: 'Help' },
  { to: '/support', label: 'Support' },
  { to: '/feedback', label: 'Feedback' },
])
