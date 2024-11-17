<script setup lang="ts">
const props = defineProps<{
  stack?: string
  message?: string
  statusCode?: number
  onClearError?: () => void
}>()

const emit = defineEmits<{
  clearError: []
}>()

const { t } = useI18n()
</script>

<template>
  <div
    class="
      absolute inset-0 space-y-md
      flex flex-col items-center justify-center
      rd-app b b-app bg-app p-md
      bg-banknote-primary-850
      dark
  ">

    <!-- Status Code -->

    <!-- Error Message -->
    <div>
      <p
        class="inline-flex text-5xl text-layout font-mono bg-app text-app px-md py-sm rd-t b b-b-0 b-app"
        v-text="statusCode || '500'"
      />
      <p class="text-xl text-center font-mono bg-app text-app p-md rd rd-tl-0 b b-app max-w-page">
        {{ message }}
      </p>
    </div>

    <!-- Stack -->
    <pre v-if="stack" class="stack text-xs text-left p-sm bg-app text-app rd b b-app">
      {{ stack }}
    </pre>

    <!-- Clear Error Button -->
    <Button
      link
      :label="t('goBack')"
      icon-append="i-carbon:arrow-right"
      icon-expand
      @click="() => emit('clearError')"
    />
  </div>
</template>

<style>
.stack.internal {
  opacity: 0.5;
}
</style>

<i18n lang="yaml">
en:
  goBack: Go back to the home page
fr:
  goBack: Retourner à la page d'accueil
de:
  goBack: Zurück zur Startseite
es:
  goBack: Volver a la página de inicio
zh:
  goBack: 返回主页
</i18n>
