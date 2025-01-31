<script setup lang="ts">
import { type NuxtError } from 'nuxt/app'

const props = defineProps<{ error: NuxtError }>()

const showStack = import.meta.dev
const stack = computed(() => {
  if (!props.error) return ''
  return props.error.stack
    ?.replaceAll('\n', '\n  ')
    .replaceAll(/https?:\/\/[^:]+:\d+\/_nuxt\//g, '/_nuxt/')
})
</script>

<template>
  <main class="flex flex-col items-center justify-center min-h-screen py-8 -mt-24">
    <h3 class="text-64 leading-64 font-bold text-primary">
      {{ error.statusCode }}
    </h3>

    <!-- Generic error message -->
    <p class="text-2xl text-center max-w-md">
      {{ error.message }}
    </p>

    <!-- Error message -->
    <pre
      v-if="showStack"
      class="bg-primary-900 text-white p-4 rounded-lg mt-8 w-4xl whitespace-pre overflow-x-auto"
      v-text="stack"
    />

    <!-- CTA -->
    <Button
      outlined
      variant="primary"
      class="mt-16"
      icon-prepend="i-carbon:home"
      icon-append="i-carbon:arrow-right"
      label="Retourner à l'accueil"
      to="/flows"
    />
  </main>
</template>
