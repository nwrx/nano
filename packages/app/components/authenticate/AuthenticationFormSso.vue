<script setup lang="ts">
const emit = defineEmits<{
  submit: [type: string]
}>()
</script>

<template>
  <div class="space-y-2">
    <AuthenticationFormSsoButton type="microsoft" @click="() => emit('submit', 'microsoft')"/>
    <AuthenticationFormSsoButton type="google" @click="() => emit('submit', 'google')"/>
    <AuthenticationFormSsoButton type="github" @click="() => emit('submit', 'github')"/>
    <AuthenticationFormSsoButton type="linkedin" @click="() => emit('submit', 'linkedin')"/>
  </div>
</template>
