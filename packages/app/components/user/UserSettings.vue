<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })
</script>

<template>
  <AppPage>

    <!-- Header -->
    <AppPageHeader
      icon="i-carbon:user"
      :title="t('title')"
      :description="t('description')"
    />

    <!-- Side menu -->
    <div class="flex w-full gap-lg py-lg">
      <AppPageNav class="shrink">
        <AppPageNavGroup>
          <AppPageNavItem :label="t('nav.settings.profile')" icon="i-carbon:user" :to="{ name: 'UserSettingsProfile' }" />
          <AppPageNavItem :label="t('nav.settings.account')" icon="i-carbon:settings" :to="{ name: 'UserSettingsAccount' }" />
          <AppPageNavItem :label="t('nav.settings.notifications')" icon="i-carbon:notification" to="/settings/notifications" />
          <AppPageNavItem :label="t('nav.settings.customizations')" icon="i-carbon:paint-brush" to="/settings/customizations" />
        </AppPageNavGroup>

        <!-- Security -->
        <AppPageNavGroup :label="t('nav.security')">
          <AppPageNavItem :label="t('nav.security.password')" icon="i-carbon:security" :to="{ name: 'UserSettingsPassword' }" />
          <AppPageNavItem :label="t('nav.security.sso')" icon="i-carbon:credentials" to="/settings/security/api-keys" />
          <AppPageNavItem :label="t('nav.security.apiKeys')" icon="i-carbon:api-key" to="/settings/security/api-keys" />
          <AppPageNavItem :label="t('nav.security.sessions')" icon="i-carbon:mobile-session" :to="{ name: 'UserSettingsSessions' }" />
        </AppPageNavGroup>

        <!-- Billing -->
        <AppPageNavGroup :label="t('nav.billing')">
          <AppPageNavItem :label="t('nav.billing.upgrade')" to="/settings/billing/upgrade" icon="i-carbon:upgrade" />
          <AppPageNavItem :label="t('nav.billing.subscription')" to="/settings/billing/subscription" icon="i-carbon:document" />
          <AppPageNavItem :label="t('nav.billing.invoices')" to="/settings/billing/invoices" icon="i-carbon:document-multiple-01" />
          <AppPageNavItem :label="t('nav.billing.usage')" to="/settings/billing/usage" icon="i-carbon:analytics" />
          <AppPageNavItem :label="t('nav.billing.paymentMethods')" to="/settings/billing/payment-methods" icon="i-carbon:money" />
        </AppPageNavGroup>

        <!-- Support -->
        <AppPageNavGroup :label="t('nav.support')">
          <AppPageNavItem :label="t('nav.support.helpCenter')" to="/settings/support/help-center" icon="i-carbon:help" />
          <AppPageNavItem :label="t('nav.support.contact')" to="/settings/support/contact" icon="i-carbon:chat" />
          <AppPageNavItem :label="t('nav.support.chat')" to="/settings/support/chat" icon="i-carbon:chat-bot" />
        </AppPageNavGroup>
      </AppPageNav>

      <!-- Content -->
      <AppPageContainer contained>
        <slot/>
      </AppPageContainer>
    </div>
  </AppPage>
</template>

<i18n lang="yaml">
  en:
    title: User Settings
    description: Manage and review your account settings and security configurations.
    nav.settings: Settings
    nav.settings.profile: Profile
    nav.settings.account: Account
    nav.settings.notifications: Notifications
    nav.settings.customizations: Customizations
    nav.security: Security
    nav.security.password: Password & MFA
    nav.security.sso: Single sign-on
    nav.security.apiKeys: API keys
    nav.security.sessions: Sessions
    nav.billing: Billing
    nav.billing.upgrade: Upgrade
    nav.billing.subscription: Plan & subscription
    nav.billing.invoices: Invoices
    nav.billing.usage: Usage
    nav.billing.paymentMethods: Payment methods
    nav.support: Support
    nav.support.helpCenter: Help center
    nav.support.contact: Contact support
    nav.support.chat: Direct chat
  fr:
    title: Paramètres utilisateur
    description: Gérez et consultez vos paramètres de compte et configurations de sécurité.
    nav.settings: Paramètres
    nav.settings.profile: Profil
    nav.settings.account: Compte
    nav.settings.notifications: Notifications
    nav.settings.customizations: Personnalisation
    nav.security: Sécurité
    nav.security.password: Mot de passe & MFA
    nav.security.sso: Authentification unique
    nav.security.apiKeys: Clés API
    nav.security.sessions: Sessions
    nav.billing: Facturation
    nav.billing.upgrade: Mise à niveau
    nav.billing.subscription: Plan & abonnement
    nav.billing.invoices: Factures
    nav.billing.usage: Utilisation
    nav.billing.paymentMethods: Moyens de paiement
    nav.support: Support
    nav.support.helpCenter: Centre d'aide
    nav.support.contact: Contacter le support
    nav.support.chat: Chat direct
  de:
    title: Benutzereinstellungen
    description: Verwalten und überprüfen Sie Ihre Kontoeinstellungen und Sicherheitskonfigurationen.
    nav.settings: Einstellungen
    nav.settings.profile: Profil
    nav.settings.account: Konto
    nav.settings.notifications: Benachrichtigungen
    nav.settings.customizations: Anpassungen
    nav.security: Sicherheit
    nav.security.password: Passwort & MFA
    nav.security.sso: Single Sign-On
    nav.security.apiKeys: API-Schlüssel
    nav.security.sessions: Sitzungen
    nav.billing: Abrechnung
    nav.billing.upgrade: Upgrade
    nav.billing.subscription: Plan & Abonnement
    nav.billing.invoices: Rechnungen
    nav.billing.usage: Nutzung
    nav.billing.paymentMethods: Zahlungsmethoden
    nav.support: Support
    nav.support.helpCenter: Hilfe-Center
    nav.support.contact: Support kontaktieren
    nav.support.chat: Direkter Chat
  es:
    title: Configuración de usuario
    description: Administre y revise la configuración de su cuenta y las configuraciones de seguridad.
    nav.settings: Configuraciones
    nav.settings.profile: Perfil
    nav.settings.account: Cuenta
    nav.settings.notifications: Notificaciones
    nav.settings.customizations: Personalizaciones
    nav.security: Seguridad
    nav.security.password: Contraseña y MFA
    nav.security.sso: Inicio de sesión único
    nav.security.apiKeys: Claves API
    nav.security.sessions: Sesiones
    nav.billing: Facturación
    nav.billing.upgrade: Actualización
    nav.billing.subscription: Plan y suscripción
    nav.billing.invoices: Facturas
    nav.billing.usage: Uso
    nav.billing.paymentMethods: Métodos de pago
    nav.support: Soporte
    nav.support.helpCenter: Centro de ayuda
    nav.support.contact: Contactar soporte
    nav.support.chat: Chat directo
  zh:
    title: 用户设置
    description: 管理和查看您的帐户设置和安全配置。
    nav.settings: 设置
    nav.settings.profile: 档案
    nav.settings.account: 帐户
    nav.settings.notifications: 通知
    nav.settings.customizations: 自定义
    nav.security: 安全
    nav.security.password: 密码 & MFA
    nav.security.sso: 单点登录
    nav.security.apiKeys: API 密钥
    nav.security.sessions: 会话
    nav.billing: 计费
    nav.billing.upgrade: 升级
    nav.billing.subscription: 计划 & 订阅
    nav.billing.invoices: 发票
    nav.billing.usage: 使用情况
    nav.billing.paymentMethods: 付款方式
    nav.support: 支持
    nav.support.helpCenter: 帮助中心
    nav.support.contact: 联系支持
    nav.support.chat: 直接聊天
</i18n>
