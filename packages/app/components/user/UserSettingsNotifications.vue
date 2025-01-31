<script setup lang="ts">
const props = defineProps<{
  notifications: Record<string, boolean>
}>()

const emit = defineEmits<{
  submit: [Record<string, boolean>]
  'update:modelValue': [Record<string, boolean>]
}>()

const { t } = useI18n()
const notifications = useVModel(props, 'notifications', emit, {
  passive: true,
})

const TableRow = createReusableTemplate<{
  name: string
  'onUpdate:modelValue'?: (value: boolean) => void
}>()

const TableSection = createReusableTemplate<{
  title: string
  icon: string
}>()
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :label="t('button.save')"
    @submit="() => emit('submit', notifications)">

    <template #text>
      {{ t('text') }}
    </template>

    <!-- Define Row Component -->
    <TableRow.define v-slot="{ name }">
      <div class="grid grid-cols-4 items-start gap-md p-md">
        <div class="text-sm col-span-2">
          {{ name }}
        </div>
        <BaseInputToggle />
        <BaseInputToggle />
      </div>
    </TableRow.define>

    <!-- Define Header Component -->
    <TableSection.define v-slot="{ title, icon, $slots }">
      <div>
        <h3 class="flex items-center space-x-sm p-md border-y border-app bg-subtle py-sm">
          <BaseIcon :icon="icon" class="text-primary-500 size-4" />
          <span class="text-sm font-medium">{{ title }}</span>
        </h3>
        <component :is="$slots.default" />
      </div>
    </TableSection.define>

    <!-- Table -->
    <div class="border border-app rounded w-full">
      <div class="grid grid-cols-12 gap-md px-md py-sm">
        <div class="text-xs text-start text-subtle col-span-6" v-text="t('table.header.action')" />
        <div class="text-xs text-center text-subtle col-span-3" v-text="t('table.header.email')" />
        <div class="text-xs text-center text-subtle col-span-3" v-text="t('table.header.push')" />
      </div>

      <TableSection.reuse :title="t('table.section.security')" icon="i-carbon:security">
        <TableRow.reuse :name="t('table.row.failedLogin')" />
        <TableRow.reuse :name="t('table.row.passwordChanges')" />
        <TableRow.reuse :name="t('table.row.suspiciousActivity')" />
      </TableSection.reuse>

      <TableSection.reuse :title="t('table.section.general')" icon="i-carbon:notification">
        <TableRow.reuse :name="t('table.row.updates')" />
        <TableRow.reuse :name="t('table.row.tos')" />
      </TableSection.reuse>

      <TableSection.reuse :title="t('table.section.activity')" icon="i-carbon:activity">
        <TableRow.reuse :name="t('table.row.workflow')" />
        <TableRow.reuse :name="t('table.row.project')" />
        <TableRow.reuse :name="t('table.row.flow')" />
      </TableSection.reuse>
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Notification Settings
  text: Manage your notification preferences. You can choose to receive notifications via email or push notifications.
  button.save: Save Changes
  table.header.action: Action
  table.header.email: Email
  table.header.push: Push
  table.section.security: Security
  table.section.general: General
  table.section.activity: Activity
  table.row.failedLogin: Failed login attempts
  table.row.passwordChanges: Password changes
  table.row.suspiciousActivity: Suspicious activity
  table.row.updates: Updates and announcements
  table.row.tos: Terms of service updates
  table.row.workflow: Workflow activity
  table.row.project: Project activity
  table.row.flow: Flow activity
fr:
  title: Paramètres de notification
  text: Gérez vos préférences de notification. Vous pouvez choisir de recevoir des notifications par e-mail ou des notifications push.
  button.save: Enregistrer les modifications
  table.header.action: Action
  table.header.email: Email
  table.header.push: Push
  table.section.security: Sécurité
  table.section.general: Général
  table.section.activity: Activité
  table.row.failedLogin: Tentatives de connexion échouées
  table.row.passwordChanges: Modifications de mot de passe
  table.row.suspiciousActivity: Activité suspecte
  table.row.updates: Mises à jour et annonces
  table.row.tos: Mises à jour des conditions d'utilisation
  table.row.workflow: Activité du flux de travail
  table.row.project: Activité du projet
  table.row.flow: Activité du flux
de:
  title: Benachrichtigungseinstellungen
  text: Verwalten Sie Ihre Benachrichtigungseinstellungen. Sie können wählen, ob Sie Benachrichtigungen per E-Mail oder Push-Benachrichtigungen erhalten möchten.
  button.save: Änderungen speichern
  table.header.action: Aktion
  table.header.email: E-Mail
  table.header.push: Push
  table.section.security: Sicherheit
  table.section.general: Allgemein
  table.section.activity: Aktivität
  table.row.failedLogin: Fehlgeschlagene Anmeldeversuche
  table.row.passwordChanges: Passwortänderungen
  table.row.suspiciousActivity: Verdächtige Aktivitäten
  table.row.updates: Updates und Ankündigungen
  table.row.tos: Aktualisierungen der Nutzungsbedingungen
  table.row.workflow: Workflow-Aktivität
  table.row.project: Projektaktivität
  table.row.flow: Aktivität des Flusses
es:
  title: Configuración de notificaciones
  text: Administre sus preferencias de notificación. Puede elegir recibir notificaciones por correo electrónico o notificaciones push.
  button.save: Guardar cambios
  table.header.action: Acción
  table.header.email: Correo electrónico
  table.header.push: Empujar
  table.section.security: Seguridad
  table.section.general: General
  table.section.activity: Actividad
  table.row.failedLogin: Intentos de inicio de sesión fallidos
  table.row.passwordChanges: Cambios de contraseña
  table.row.suspiciousActivity: Actividad sospechosa
  table.row.updates: Actualizaciones y anuncios
  table.row.tos: Actualizaciones de los términos de servicio
  table.row.workflow: Actividad del flujo de trabajo
  table.row.project: Actividad del proyecto
  table.row.flow: Actividad del flujo
zh:
  title: 通知设置
  text: 管理您的通知首选项。您可以选择通过电子邮件或推送通知接收通知。
  button.save: 保存更改
  table.header.action: 行动
  table.header.email: 电子邮件
  table.header.push: 推送
  table.section.security: 安全
  table.section.general: 一般
  table.section.activity: 活动
  table.row.failedLogin: 登录尝试失败
  table.row.passwordChanges: 密码更改
  table.row.suspiciousActivity: 可疑活动
  table.row.updates: 更新和公告
  table.row.tos: 服务条款更新
  table.row.workflow: 工作流活动
  table.row.project: 项目活动
  table.row.flow: 流活动
</i18n>
