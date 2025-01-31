export const NAV_DRAWER_START = computed<NavItem[]>(() => {

  // --- If user is not logged in, abort with empty array.
  const session = useSession()
  if (!session.data.username) return []

  return [
    {
      items: [
        {
          label: 'Overview',
          icon: 'i-carbon:home',
        },
        {
          label: 'Integrations',
          icon: 'i-carbon:integration',
          to: { name: 'Modules' },
        },
        {
          label: 'Storage',
          icon: 'i-carbon:db2-database',
        },
      ],
    },
    {
      label: 'Workspace',
      items: [
        {
          label: 'Workspace',
          icon: 'i-carbon:flow',
          to: { name: 'Workspace', params: { workspace: session.data.username } },
        },
        {
          label: 'Monitoring',
          icon: 'i-carbon:cloud-monitoring',
        },
        {
          label: 'Usage',
          icon: 'i-carbon:analytics',
        },
        {
          label: 'Billing',
          icon: 'i-carbon:document',
        },
      ],
    },
    {
      label: 'Settings',
      items: [
        {
          label: 'Users',
          icon: 'i-carbon:user',
          to: { name: 'AdminUsers' },
        },
        {
          label: 'Configuration',
          icon: 'i-carbon:settings',
          // to: { name: 'AdminConfiguration' },
        },
      ],
    },
  ]
})
