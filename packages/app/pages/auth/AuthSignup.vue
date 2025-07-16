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
  name: 'AuthenticationSignup',
  path: '/register',
  alias: ['/signup', '/sign-up'],
  middleware: 'redirect-when-authenticated',
})

useSeoMeta({
  title: 'Sign-up',
  description: 'Sign-up to access your account',
})

// Sign-up form
const session = useSession()
const email = ref('' as `${string}@${string}`)
const username = ref('')
const password = ref('')
const passwordConfirm = ref('')

// Auto-fill form in development
onMounted(() => {
  if (!import.meta.dev) return
  email.value = 'john.doe@nanoworks.io'
  username.value = 'john-doe'
  password.value = 'password'
  passwordConfirm.value = 'password'
})
</script>

<template>
  <AuthBackground>
    <AuthCard>
      <AuthFormSso />
      <AuthDivider>or</AuthDivider>
      <form
        class="flex flex-col space-y-2"
        @submit.prevent="() => session.signupWithPassword({ email, username, password, passwordConfirm })">

        <!-- Username -->
        <InputText
          v-model="email"
          placeholder="Email"
          icon="i-carbon:user"
        />

        <!-- Email -->
        <InputText
          v-model="username"
          placeholder="Username"
          icon="i-carbon:email"
        />

        <!-- Password -->
        <InputText
          v-model="password"
          type="password"
          placeholder="Password"
          icon="i-carbon:password"
        />

        <!-- Password Confirmation -->
        <InputText
          v-model="passwordConfirm"
          type="password"
          placeholder="Confirm password"
          icon="i-carbon:password"
        />

        <!-- Submit -->
        <Button
          link
          class="!mt-8 mx-auto"
          type="submit"
          variant="primary"
          label="Sign-up"
          icon-append="i-carbon:login"
        />
      </form>
    </AuthCard>

    <!-- Terms of service -->
    <AuthFooter
      text="By signing up, you agree to our"
      label="Terms of Service"
      to="/terms"
    />

    <!-- Sign-in footer -->
    <AuthFooter
      text="Already have an account?"
      label="Sign in"
      :to="{ name: 'Authentication' }"
    />
  </AuthBackground>
</template>
