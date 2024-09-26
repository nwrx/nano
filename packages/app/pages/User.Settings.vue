<script setup lang="ts">
import AppPageNav from '~/components/app/AppPageNav.vue'

definePageMeta({
  name: 'UserSettings',
  path: '/settings',
  middleware: ['protected'],
})

const user = useUser('me')

onMounted(user.refresh)
</script>

<template>
  <AppPage class="flex flex-col overflow-hidden w-full space-y-8">
    <AppPageHeader
      icon="i-carbon:settings"
      :title="user.data.displayName"
      description="Update your account settings."
    />

    <!-- Side menu -->
    <AppPageContainer class="bg-white grow">
      <div class="flex w-full gap-16">
        <AppPageNav class="shrink"/>

        <!-- Form -->
        <AppPageForm title="Public profile" class="grow">
          <template #text>
            Update your public profile information. This information will be visible to
            other users on the platform.
            <br />
            <br />
            Note that your email address is not visible to other users.
          </template>

          <InputText
            v-model="user.data.displayName"
            placeholder="Your display name"
            hint="Your display name is visible to other users."
          />

          <InputText
            v-model="user.data.bio"
            type="textarea"
            placeholder="A short bio about yourself"
          />

          <InputText
            v-model="user.data.website"
            label="Website"
            placeholder="Your personal website or blog"
          />

          <InputText
            v-model="user.data.company"
            label="Company"
            placeholder="Your current company or organization"
          />
        </AppPageForm>
      </div>
    </AppPageContainer>
  </AppPage>
</template>
