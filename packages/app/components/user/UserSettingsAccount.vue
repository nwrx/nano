
<script setup lang="ts">
const props = defineProps<{
  email: string
  password: string
}>()

const emit = defineEmits<{
  'update:email': [value: string]
  'update:password': [value: string]
  submit: [{ email: string, password: string }]
}>()

const email = useVModel(props, 'email', emit, { passive: true })
const password = ref('')

function onSubmit() {
  emit('submit', {
    email: email.value,
    password: password.value,
  })
}
</script>

<template>
  <AppPageForm
    title="Account Settings"
    label="Save Changes"
    @submit="() => onSubmit()">
    <template #text>
      Update your account information. This includes your email and password.
    </template>
    <InputText
      v-model="email"
      icon="i-carbon:email"
      class="w-full"
      placeholder="Email"
    />
    <InputText
      v-model="password"
      icon="i-carbon:password"
      class="w-full"
      placeholder="New Password"
      type="password"
    />
  </AppPageForm>
</template>
