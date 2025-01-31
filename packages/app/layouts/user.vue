<script setup lang="ts">
import { NAV_USER_SETTINGS } from '~/utils/navUserSettings'

const session = useSession()
const user = useUser(session.username, {
  withProfile: true,
})

onMounted(async() => {
  await session.refresh()
  await user.refresh()
})
</script>

<template>
  <NuxtLayout name="default">
    <AppPage class="flex flex-col overflow-hidden w-full space-y-8">
      <AppPageHeader
        icon="i-carbon:settings"
        :title="user.data.displayName"
        description="Update your account settings."
      />

      <!-- Side menu -->
      <AppPageContainer class="bg-white grow">
        <div class="flex w-full gap-16">
          <AppPageNav :groups="NAV_USER_SETTINGS" class="shrink"/>

          <!-- Content -->
          <NuxtPage/>
        </div>
      </AppPageContainer>
    </AppPage>
  </NuxtLayout>
</template>
