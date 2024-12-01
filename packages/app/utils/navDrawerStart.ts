import { localize } from './localize'

function getUserWorkspaceLink() {
  const session = useSession()
  if (!session.data.username) return { name: 'Home' }
  return { name: 'Workspace', params: { workspace: session.data.username } }
}

export const NAV_DRAWER_START = computed<NavItem[]>(() => {

  // --- If user is not logged in, abort with empty array.
  const session = useSession()
  if (!session.data.username) return []

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
          to: { name: 'Modules' },
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
      items: [
        {
          icon: 'i-carbon:flow',
          to: getUserWorkspaceLink(),
          label: localize({
            en: 'Workspace',
            fr: 'Espace de travail',
            de: 'Arbeitsbereich',
            es: 'Espacio de trabajo',
            zh: '工作区',
          }),
        },
        {
          icon: 'i-carbon:cloud-monitoring',
          to: { name: 'WorkspaceMonitoring', params: { workspace: session.data.username } },
          label: localize({
            en: 'Monitoring',
            fr: 'Surveillance',
            de: 'Überwachung',
            es: 'Monitoreo',
            zh: '监控',
          }),
        },
        {
          icon: 'i-carbon:analytics',
          label: localize({
            en: 'Usage',
            fr: 'Utilisation',
            de: 'Nutzung',
            es: 'Uso',
            zh: '用法',
          }),
        },
        {
          icon: 'i-carbon:document',
          label: localize({
            en: 'Billing',
            fr: 'Facturation',
            de: 'Abrechnung',
            es: 'Facturación',
            zh: '计费',
          }),
        },
      ],
    },
    {
      label: localize({
        en: 'Settings',
        fr: 'Paramètres',
        de: 'Einstellungen',
        es: 'Configuración',
        zh: '设置',
      }),
      items: [
        {
          icon: 'i-carbon:user',
          to: { name: 'AdminUsers' },
          label: localize({
            en: 'Users',
            fr: 'Utilisateurs',
            de: 'Benutzer',
            es: 'Usuarios',
            zh: '用户',
          },)
        },
        {
          icon: 'i-carbon:settings',
          // to: { name: 'AdminConfiguration' },
          label: localize({
            en: 'Configuration',
            fr: 'Configuration',
            de: 'Konfiguration',
            es: 'Configuración',
            zh: '配置',
          },)
        },
      ],
    },
  ]
})
