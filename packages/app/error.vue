<script setup lang="ts">
import type { NuxtError } from '#app'
import { NuxtLayout } from '#components'
import AppPageErrorBoundary from './components/app/AppPage.ErrorBoundary.vue'

const props = defineProps<{
  error: NuxtError
}>()

const router = useRouter()
const showStack = import.meta.dev
</script>

<template>
  <NuxtLayout>
    <AppPageErrorBoundary
      :status-code="props.error.statusCode"
      :message="props.error.message"
      :stack="showStack ? props.error.stack : undefined"
      @clear-error="() => router.push('/')"
    />
  </NuxtLayout>
</template>
