<script setup lang="ts">
const props = defineProps<{
  username: string
}>()

const emit = defineEmits<{
  submit: [{ username: string }]
}>()

const username = useVModel(props, 'username', emit, { passive: true })

function onSubmit() {
  emit('submit', {
    username: username.value,
  })
}
</script>

<template>
  <AppPageForm
    vertical
    title="General"
    label="Save Changes"
    @submit="() => onSubmit()">
    <template #text>
      Update your username. This is your unique identifier and will be used for logging in and other interactions.
      <br>
      <br>
      Note that changing your username might affect how other users recognize you. For more information, please
      refer to the <Button link variant="primary" href="#">documentation</Button>.

    </template>
    <InputText
      v-model="username"
      icon="i-carbon:user"
      class="w-full"
      placeholder="Username"
    />
  </AppPageForm>
</template>
