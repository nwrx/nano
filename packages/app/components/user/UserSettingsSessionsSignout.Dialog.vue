<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  sessionsLength: number
}>()

const emit = defineEmits<{
  'submit': []
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})
</script>

<template>
  <AppDialog v-model="model">
    <template #title>
      Sign-out from {{ sessionsLength - 1 }} device(s)
    </template>

    <!-- Message -->
    <p type="error">
      You are about to sign out from all device(s) including this one.
    </p>

    <!-- Confirm -->
    <template #cta="{ close }">
      <AppDialogActions
        label="I understand, let me out"
        variant="danger"
        manual-close
        @close="() => close()"
        @confirm="() => emit('submit')"
      />
    </template>
  </AppDialog>
</template>
