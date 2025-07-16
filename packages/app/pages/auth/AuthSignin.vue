<!-- eslint-disable sonarjs/no-hardcoded-passwords -->
<script setup lang="ts">
import AuthBackground from '~/components/auth/AuthBackground.vue'
import AuthCard from '~/components/auth/AuthCard.vue'
import AuthDivider from '~/components/auth/AuthDivider.vue'
import AuthFooter from '~/components/auth/AuthFooter.vue'
import AuthFormSso from '~/components/auth/AuthFormSso.vue'
import Button from '~/components/base/Button.vue'
import InputText from '~/components/base/InputText.vue'

definePageMeta({
  name: 'Authentication',
  path: '/login',
  alias: ['/signin', '/sign-in'],
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
  <AuthBackground>
    <AuthCard>
      <AuthFormSso />
      <AuthDivider>or</AuthDivider>
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
          class="!mt-8 mx-auto button-lg"
          type="submit"
          variant="primary"
          label="Sign-in"
          icon-append="i-carbon:login"
        />
      </form>
    </AuthCard>
    <!-- Terms of service -->
    <AuthFooter
      text="Forgot your password?"
      label="Recover your account"
      :to="{ name: 'AuthenticationForgot' }"
    />
    <!-- Sign-in footer -->
    <AuthFooter
      text="Don't have an account?"
      label="Sign up"
      :to="{ name: 'AuthenticationSignup' }"
    />
  </AuthBackground>
</template>
