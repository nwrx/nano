<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const title = computed(() => t(`title.${route.name as string}`))

useHead(() => ({
  title: title.value,
  meta: [{ hid: 'description', name: 'description', content: t('description') }],
}))
</script>

<template>
  <AppLayout>
    <AppPage>

      <!-- Header -->
      <AppPageHeader
        icon="i-carbon:user"
        :title="[t('title'), title]"
        :description="t('description')"
      />

      <!-- Side menu -->
      <div class="flex w-full h-full gap-lg overflow-x-hidden overflow-y-auto">
        <AppPageNav class="shrink h-full sticky top-0 overflow-y-auto">
          <AppPageNavGroup>
            <AppPageNavItem :label="t('title.UserSettingsAccount')" icon="i-carbon:settings" :to="{ name: 'UserSettingsAccount' }" />
            <AppPageNavItem :label="t('title.UserSettingsNotifications')" icon="i-carbon:notification" to="/settings/notifications" />
            <AppPageNavItem :label="t('title.UserSettingsCustomizations')" icon="i-carbon:paint-brush" to="/settings/customizations" />
          </AppPageNavGroup>

          <!-- Security -->
          <AppPageNavGroup :label="t('title.UserSettingsSecurity')">
            <AppPageNavItem :label="t('title.UserSettingsPassword')" icon="i-carbon:security" :to="{ name: 'UserSettingsPassword' }" />
            <AppPageNavItem :label="t('title.UserSettingsSso')" icon="i-carbon:credentials" to="/settings/security/api-keys" />
            <AppPageNavItem :label="t('title.UserSettingsApiKeys')" icon="i-carbon:api-key" to="/settings/security/api-keys" />
            <AppPageNavItem :label="t('title.UserSettingsSessions')" icon="i-carbon:mobile-session" :to="{ name: 'UserSettingsSessions' }" />
          </AppPageNavGroup>

          <!-- Billing -->
          <AppPageNavGroup :label="t('title.UserSettingsBilling')">
            <AppPageNavItem :label="t('title.UserSettingsUpgrade')" to="/settings/billing/upgrade" icon="i-carbon:upgrade" />
            <AppPageNavItem :label="t('title.UserSettingsSubscription')" to="/settings/billing/subscription" icon="i-carbon:document" />
            <AppPageNavItem :label="t('title.UserSettingsInvoices')" to="/settings/billing/invoices" icon="i-carbon:document-multiple-01" />
            <AppPageNavItem :label="t('title.UserSettingsUsage')" to="/settings/billing/usage" icon="i-carbon:analytics" />
            <AppPageNavItem :label="t('title.UserSettingsPaymentMethods')" to="/settings/billing/payment-methods" icon="i-carbon:money" />
          </AppPageNavGroup>

          <!-- Support -->
          <AppPageNavGroup :label="t('title.UserSettingsSupport')">
            <AppPageNavItem :label="t('title.UserSettingsHelpCenter')" to="/settings/support/help-center" icon="i-carbon:help" />
            <AppPageNavItem :label="t('title.UserSettingsContact')" to="/settings/support/contact" icon="i-carbon:chat" />
            <AppPageNavItem :label="t('title.UserSettingsChat')" to="/settings/support/chat" icon="i-carbon:chat-bot" />
          </AppPageNavGroup>
        </AppPageNav>

        <!-- Content -->
        <AppPageContainer contained>
          <NuxtPage transition />
        </AppPageContainer>
      </div>
    </AppPage>
  </AppLayout>
</template>

<i18n lang="yaml">
en:
  title: Settings
  title.UserSettingsProfile: Profile
  title.UserSettingsAccount: Account
  title.UserSettingsNotifications: Notifications
  title.UserSettingsCustomizations: Customizations
  title.UserSettingsSecurity: Security
  title.UserSettingsPassword: Password & MFA
  title.UserSettingsSso: Single sign-on
  title.UserSettingsApiKeys: API keys
  title.UserSettingsSessions: Sessions
  title.UserSettingsBilling: Billing
  title.UserSettingsUpgrade: Upgrade
  title.UserSettingsSubscription: Plan & subscription
  title.UserSettingsInvoices: Invoices
  title.UserSettingsUsage: Usage
  title.UserSettingsPaymentMethods: Payment methods
  title.UserSettingsSupport: Support
  title.UserSettingsHelpCenter: Help center
  title.UserSettingsContact: Contact support
  title.UserSettingsChat: Direct chat
fr:
  title: Paramètres
  title.UserSettingsProfile: Profil
  title.UserSettingsAccount: Compte
  title.UserSettingsNotifications: Notifications
  title.UserSettingsCustomizations: Personnalisation
  title.UserSettingsSecurity: Sécurité
  title.UserSettingsPassword: Mot de passe & MFA
  title.UserSettingsSso: Authentification unique
  title.UserSettingsApiKeys: Clés API
  title.UserSettingsSessions: Sessions
  title.UserSettingsBilling: Facturation
  title.UserSettingsUpgrade: Mise à niveau
  title.UserSettingsSubscription: Plan & abonnement
  title.UserSettingsInvoices: Factures
  title.UserSettingsUsage: Utilisation
  title.UserSettingsPaymentMethods: Moyens de paiement
  title.UserSettingsSupport: Support
  title.UserSettingsHelpCenter: Centre d'aide
  title.UserSettingsContact: Contacter le support
  title.UserSettingsChat: Chat direct
de:
  title: Einstellungen
  title.UserSettingsProfile: Profil
  title.UserSettingsAccount: Konto
  title.UserSettingsNotifications: Benachrichtigungen
  title.UserSettingsCustomizations: Anpassungen
  title.UserSettingsSecurity: Sicherheit
  title.UserSettingsPassword: Passwort & MFA
  title.UserSettingsSso: Single Sign-On
  title.UserSettingsApiKeys: API-Schlüssel
  title.UserSettingsSessions: Sitzungen
  title.UserSettingsBilling: Abrechnung
  title.UserSettingsUpgrade: Upgrade
  title.UserSettingsSubscription: Plan & Abonnement
  title.UserSettingsInvoices: Rechnungen
  title.UserSettingsUsage: Nutzung
  title.UserSettingsPaymentMethods: Zahlungsmethoden
  title.UserSettingsSupport: Support
  title.UserSettingsHelpCenter: Hilfe-Center
  title.UserSettingsContact: Support kontaktieren
  title.UserSettingsChat: Direkter Chat
es:
  title: Ajustes
  title.UserSettingsProfile: Perfil
  title.UserSettingsAccount: Cuenta
  title.UserSettingsNotifications: Notificaciones
  title.UserSettingsCustomizations: Personalizaciones
  title.UserSettingsSecurity: Seguridad
  title.UserSettingsPassword: Contraseña y MFA
  title.UserSettingsSso: Inicio de sesión único
  title.UserSettingsApiKeys: Claves API
  title.UserSettingsSessions: Sesiones
  title.UserSettingsBilling: Facturación
  title.UserSettingsUpgrade: Actualización
  title.UserSettingsSubscription: Plan y suscripción
  title.UserSettingsInvoices: Facturas
  title.UserSettingsUsage: Uso
  title.UserSettingsPaymentMethods: Métodos de pago
  title.UserSettingsSupport: Soporte
  title.UserSettingsHelpCenter: Centro de ayuda
  title.UserSettingsContact: Contactar soporte
  title.UserSettingsChat: Chat directo
zh:
  title: 设置
  title.UserSettingsProfile: 档案
  title.UserSettingsAccount: 帐户
  title.UserSettingsNotifications: 通知
  title.UserSettingsCustomizations: 自定义
  title.UserSettingsSecurity: 安全
  title.UserSettingsPassword: 密码 & MFA
  title.UserSettingsSso: 单点登录
  title.UserSettingsApiKeys: API 密钥
  title.UserSettingsSessions: 会话
  title.UserSettingsBilling: 计费
  title.UserSettingsUpgrade: 升级
  title.UserSettingsSubscription: 计划 & 订阅
  title.UserSettingsInvoices: 发票
  title.UserSettingsUsage: 使用情况
  title.UserSettingsPaymentMethods: 付款方式
  title.UserSettingsSupport: 支持
  title.UserSettingsHelpCenter: 帮助中心
  title.UserSettingsContact: 联系支持
  title.UserSettingsChat: 直接聊天
</i18n>
