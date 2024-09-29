<script setup lang="ts">
definePageMeta({
  name: 'Authentication',
  path: '/auth/signin',
  alias: ['/auth/login', '/auth'],
  middleware: 'redirect-when-authenticated',
})

useSeoMeta({
  title: 'Sign-in',
  description: 'Sign-in to access your account',
})

// Sign-in form
const session = useSession()
const username = ref('')
const password = ref('')

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
        @submit.prevent="() => session.signinWithPassword({ username, password })">

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
