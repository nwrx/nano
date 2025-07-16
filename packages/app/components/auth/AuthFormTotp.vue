<script setup lang="ts">
const emit = defineEmits<{
  submit: [totp: string]
}>()

const totp = ref('')
const totpElement = ref<HTMLInputElement>()

// --- Parse the TOTP to only allow numbers and a maximum of 6 characters.
function parseTotp(value: string) {
  return value.replaceAll(/\D/g, '').slice(0, 6)
}

// --- Automatically submit once the user has entered the TOTP.
watch(totp, (value) => {
  if (value.length === 6) emit('submit', value)
  if (!totpElement.value) return
})
</script>

<template>
  <form @submit.prevent="() => emit('submit', totp)">
    <div class="flex flex-col space-y-4">

      <InputText
        ref="totpElement"
        v-model="totp"
        autocomplete="one-time-code"
        placeholder="Enter your MFA code"
        icon="i-carbon:security"
        :parse="parseTotp"
      />

      <Button
        link
        class="!mt-8 mx-auto"
        type="submit"
        variant="primary"
        label="Submit"
        icon-append="i-carbon:arrow-right"
        icon-expand
      />
    </div>
  </form>
</template>
