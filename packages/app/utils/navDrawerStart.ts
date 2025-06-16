import { localize } from './localize'

export const NAV_DRAWER_START = computed<NavItem[]>(() => {

  // --- If user is not logged in, abort with empty array.
  const session = useSession()
  if (!session.data.username) return []

  const groupNavWorkspace = useRouteGroup('nav-items-workspace')

  return [
    {
      items: [
        {
          to: '/',
          icon: 'i-carbon:home',
          label: localize({
            en: 'Overview',
            fr: 'Vue d\'ensemble',
            de: 'Übersicht',
            es: 'Resumen',
            zh: '概览',
          }),
        },
        {
          icon: 'i-carbon:integration',
          to: { name: 'Registry' },
          label: localize({
            en: 'Integrations',
            fr: 'Intégrations',
            de: 'Integrationen',
            es: 'Integraciones',
            zh: '集成',
          }),
        },
        {
          icon: 'i-carbon:db2-database',
          label: localize({
            en: 'Storage',
            fr: 'Stockage',
            de: 'Speicher',
            es: 'Almacenamiento',
            zh: '存储',
          }),
        },
      ],
    },
    {
      label: localize({
        en: 'Workspace',
        fr: 'Espace de travail',
        de: 'Arbeitsbereich',
        es: 'Espacio de trabajo',
        zh: '工作区',
      }),
      items: groupNavWorkspace.map(item => ({
        icon: item.meta.icon,
        label: localize(item.meta.title),
        to: { name: item.name, params: { workspace: session.data.username } },
      })),
    },
  ]
})
