export const NAV_DRAWER_START = computed<NavItem[]>(() => {

  // --- If user is not logged in, abort with empty array.
  const session = useSession()
  if (!session.data.username) return []

  return [
    {
      items: [
        {
          to: '/',
          label: 'Overview',
          icon: 'i-carbon:home',
        },
        {
          to: { name: 'Workspace', params: { workspace: session.data.username } },
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
          label: 'UserSettings',
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
