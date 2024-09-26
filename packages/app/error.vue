<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const router = useRouter()
const showStack = import.meta.dev

const stack = computed(() => {
  if (!props.error) return ''
  return props.error.stack
    ?.replaceAll('\n', '\n  ')
    .replaceAll(/https?:\/\/[^:]+:\d+\/static\/@fs\//g, '/')
    .replaceAll('/home/shorwood/Workspaces/', '')
    .replaceAll(/\.pnpm\/[^/]+\/node_modules\//g, '')
})
</script>

<template>
  <NuxtLayout>
    <AppPageErrorBoundary
      :statusCode="props.error.statusCode"
      :message="props.error.message"
      :stack="showStack ? stack : undefined"
      @clearError="() => router.push('/')"
    />
  </NuxtLayout>
</template>
