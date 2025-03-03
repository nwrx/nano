<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsBillingPayment',
  path: '/:workspace/settings/billing/payment',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-billing',
  icon: 'i-carbon:creditcard',
  title: {
    en: 'Payment Methods',
    fr: 'Moyens de paiement',
    de: 'Zahlungsmethoden',
    es: 'Métodos de pago',
    zh: '支付方式',
  },
  description: {
    en: 'Manage your payment methods and billing information.',
    fr: 'Gérez vos moyens de paiement et vos informations de facturation.',
    de: 'Verwalten Sie Ihre Zahlungsmethoden und Rechnungsdaten.',
    es: 'Administre sus métodos de pago e información de facturación.',
    zh: '管理您的支付方式和账单信息。',
  },
})

// --- Route and i18n.
const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)

// --- Data and actions.
const { data, getWorkspace } = useWorkspace(workspace)
onMounted(getWorkspace)
</script>

<template>
  <AppPageContainer contained>
    <AppPageForm
      :title="t('billing.payment.title')"
      :text="t('billing.payment.text')">
      <!-- Payment method management UI will go here -->
    </AppPageForm>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  billing:
    payment:
      title: Payment Methods
      text: Manage your payment methods and billing information.
</i18n>
