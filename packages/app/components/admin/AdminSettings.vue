<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const title = computed(() => t(`title.${route.name as string}`))
const description = computed(() => t(`description.${route.name as string}`))

useHead(() => ({
  title: title.value,
  meta: [{ hid: 'description', name: 'description', content: description.value }],
}))
</script>

<template>
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
          <AppPageNavItem :label="t('title.AdminAdministators')" icon="i-carbon:user-admin" to="/admin/administrators" />
          <AppPageNavItem :label="t('title.AdminAnnouncements')" icon="i-carbon:volume-down" to="/admin/announcements" />
          <AppPageNavItem :label="t('title.AdminOrganizations')" icon="i-carbon:building" to="/admin/organizations" />
          <AppPageNavItem :label="t('title.AdminFeatures')" icon="i-carbon:checkbox-checked" to="/admin/features" />
        </AppPageNavGroup>

        <!-- Server -->
        <AppPageNavGroup :label="t('title.AdminServer')">
          <AppPageNavItem :label="t('title.AdminServerSettings')" icon="i-carbon:settings" to="/admin/settings" />
          <AppPageNavItem :label="t('title.AdminServerRunners')" icon="i-carbon:bare-metal-server-02" to="/admin/runner" />
          <AppPageNavItem :label="t('title.AdminServerBilling')" icon="i-carbon:currency" to="/admin/billing" />
          <AppPageNavItem :label="t('title.AdminServerInvoice')" icon="i-carbon:document" to="/admin/invoice" />
          <AppPageNavItem :label="t('title.AdminServerLicenses')" icon="i-carbon:license" to="/admin/licenses" />
        </AppPageNavGroup>

        <!-- Users -->
        <AppPageNavGroup :label="t('title.AdminUsers')">
          <AppPageNavItem :label="t('title.AdminUsers')" icon="i-carbon:user" :to="{ name: 'AdminUsers' }" />
          <AppPageNavItem :label="t('title.AdminUsersPolicies')" icon="i-carbon:security" to="/admin/policies" />
          <AppPageNavItem :label="t('title.AdminUsersSocialProviders')" icon="i-carbon:share" to="/admin/social" />
          <AppPageNavItem :label="t('title.AdminUsersIdentityProviders')" icon="i-carbon:credentials" to="/admin/providers" />
        </AppPageNavGroup>

        <!-- Registry -->
        <AppPageNavGroup :label="t('title.AdminRegistry')">
          <AppPageNavItem :label="t('title.AdminRegistrySettings')" icon="i-carbon:settings" to="/admin/registry" />
          <AppPageNavItem :label="t('title.AdminInferenceProviders')" icon="i-carbon:ai-label" to="/admin/inference" />
          <AppPageNavItem :label="t('title.AdminInferencePrices')" icon="i-carbon:currency" to="/admin/prices" />
        </AppPageNavGroup>

        <!-- Analytics -->
        <AppPageNavGroup :label="t('title.AdminAnalytics')">
          <AppPageNavItem :label="t('title.AdminAnalytics')" icon="i-carbon:analytics" to="/admin/analytics" />
          <AppPageNavItem :label="t('title.AdminAudit')" icon="i-carbon:cloud-auditing" to="/admin/audit" />
          <AppPageNavItem :label="t('title.AdminLogs')" icon="i-carbon:catalog" to="/admin/logs" />
          <AppPageNavItem :label="t('title.AdminAlerts')" icon="i-carbon:notification" to="/admin/alerts" />
        </AppPageNavGroup>
      </AppPageNav>

      <!-- Content -->
      <AppPageContainer contained>
        <slot />
      </AppPageContainer>
    </div>
  </AppPage>
</template>

<i18n lang="yaml">
fr:
  title: Administration
  title.AdminAdministators: Administrateurs
  title.AdminOrganizations: Organisations
  title.AdminAnnouncements: Annonces
  title.AdminFeatures: Fonctionnalités
  title.AdminUsers: Utilisateurs
  title.AdminUsersPolicies: Politiques
  title.AdminUsersSocialProviders: Fournisseurs sociaux
  title.AdminUsersIdentityProviders: Fournisseurs d'identité
  title.AdminServer: Serveur
  title.AdminServerSettings: Paramètres
  title.AdminServerRunners: Travailleurs
  title.AdminServerBilling: Facturation
  title.AdminServerInvoice: Factures
  title.AdminServerLicenses: Licences
  title.AdminRegistry: Registre
  title.AdminRegistrySettings: Paramètres
  title.AdminInferenceProviders: Fournisseurs d'inférence
  title.AdminInferencePrices: Tableau des prix
  title.AdminAnalytics: Analytique
  title.AdminAudit: Audit
  title.AdminLogs: Journaux
  title.AdminAlerts: Alertes
en:
  title: Administration
  title.AdminAdministators: Administrators
  title.AdminOrganizations: Organizations
  title.AdminAnnouncements: Announcements
  title.AdminFeatures: Features
  title.AdminUsers: Users
  title.AdminUsersPolicies: Policies
  title.AdminUsersSocialProviders: Social Providers
  title.AdminUsersIdentityProviders: Identity Providers
  title.AdminServer: Server
  title.AdminServerSettings: Settings
  title.AdminServerRunners: Runners
  title.AdminServerBilling: Billing
  title.AdminServerInvoice: Invoice
  title.AdminServerLicenses: Licenses
  title.AdminRegistry: Registry
  title.AdminRegistrySettings: Settings
  title.AdminInferenceProviders: Inference Providers
  title.AdminInferencePrices: Prices
  title.AdminAnalytics: Analytics
  title.AdminAudit: Audit
  title.AdminLogs: Logs
  title.AdminAlerts: Alerts
</i18n>
