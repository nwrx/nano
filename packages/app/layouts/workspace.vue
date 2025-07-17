<!-- eslint-disable unicorn/prevent-abbreviations -->
<script setup lang="ts">
import AppLayout from '~/components/app/AppLayout.vue'
import AppPage from '~/components/app/AppPage.vue'
import WorkspaceHeader from '~/components/workspace/WorkspaceHeader.vue'
</script>

<template>
  <AppLayout>
    <AppPage>
      <WorkspaceHeader />

      <!-- Content -->
      <div class="flex w-full h-full overflow-x-hidden overflow-y-auto divide-x divide-app">
        <div class="relative w-full">
          <NuxtPage />
        </div>
      </div>
    </AppPage>
  </AppLayout>
</template>
