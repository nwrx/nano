<script setup lang="ts">
import { useAlerts, useClient } from '#imports'

definePageMeta({
  name: 'AuthenticationSignin',
  path: '/auth/signin',
  alias: ['/auth/login', '/auth'],
  middleware: 'guest',
})

useSeoMeta({
  title: 'Sign-in',
  description: 'Sign-in to access your account',
})

// Sign-in form
const username = ref('')
const password = ref('')

// Sign-up with email and password
async function signinWithPassword() {
  await useClient().requestAttempt('POST /api/signin', {
    onError: error => useAlerts().error(error),
    onSuccess: async() => {
      const redirect = useRoute().query.redirect as string | undefined
      useAlerts().success('Logged in successfully')
      await useRouter().replace(redirect ?? '/flows')
    },
    data: {
      username: username.value,
      password: password.value,
    },
  })
}

// Auto-fill form in development
onMounted(() => {
  if (!import.meta.dev) return
  username.value = 'john.doe@nanoworks.io'
  password.value = 'password'
})
</script>

<template>
  <Authentication>
    <AuthenticationCard>
      <AuthenticationFormSso/>
      <AuthenticationDivider>or</AuthenticationDivider>
      <form
        class="flex flex-col space-y-2"
        @submit.prevent="() => signinWithPassword()">

        <!-- Email -->
        <InputText
          v-model="username"
          placeholder="username"
          icon="i-carbon:email"
        />

        <!-- Password -->
        <InputText
          v-model="password"
          type="password"
          placeholder="Password"
          icon="i-carbon:password"
        />

        <!-- Submit -->
        <Button
          link
          class="!mt-8 mx-auto"
          type="submit"
          variant="primary"
          label="Sign-in"
          icon-append="i-carbon:login"
        />
      </form>
    </AuthenticationCard>

    <!-- Terms of service -->
    <AuthenticationFooter
      text="Forgot your password?"
      label="Recover your account"
      :to="{ name: 'AuthenticationForgot' }"
    />

    <!-- Sign-in footer -->
    <AuthenticationFooter
      text="Don't have an account?"
      label="Sign up"
      :to="{ name: 'AuthenticationSignup' }"
    />
  </Authentication>
</template>
