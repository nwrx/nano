<script setup lang="ts">
import { type NuxtError } from 'nuxt/app'

defineProps<{ error: NuxtError }>()

const showStack = import.meta.env.DEV === true
</script>

<template>
  <main class="flex flex-col items-center justify-center min-h-screen py-8 -mt-24">
    <h3 class="text-64 leading-64 font-bold text-primary">
      {{ error.statusCode }}
    </h3>

    <!-- Generic error message -->
    <p class="text-xl text-center max-w-md">
      {{ error.message }}
    </p>

    <!-- Error message -->
    <pre
      v-if="showStack"
      class="bg-gray-100 p-4 rounded-lg mt-8 w-xl whitespace-pre overflow-auto"
      v-html="error.stack"
    />

    <!-- CTA -->
    <Button
      class="cta-filled-primary-600 mt-16"
      icon-prepend="carbon:home"
      icon-append="carbon:arrow-right"
      label="Retourner à l'accueil"
      to="/"
    />
  </main>
</template>
