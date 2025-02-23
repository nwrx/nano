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
            en: 'Projects',
            fr: 'Projets',
            de: 'Projekte',
            es: 'Proyectos',
            zh: '项目',
          }),
        },
        {
          icon: 'i-carbon:chat-bot',
          to: { name: 'WorkspaceChat', params: { workspace: session.data.username, project: 'default', flow: 'default', thread: 'new' } },
          label: localize({
            en: 'Chat',
            fr: 'Chat',
            de: 'Chat',
            es: 'Chat',
            zh: '聊天',
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
          icon: 'i-carbon:checkmark-outline',
          label: localize({
            en: 'Testing',
            fr: 'Tests',
            de: 'Tests',
            es: 'Pruebas',
            zh: '测试',
          }),
        },
        {
          icon: 'i-carbon:currency',
          label: localize({
            en: 'Cost Management',
            fr: 'Gestion des coûts',
            de: 'Kostenmanagement',
            es: 'Gestión de costos',
            zh: '成本管理',
          }),
        },
      ],
    },
  ]
})
