<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { NuxtLink } from '#components'
import Hyperlink from '~/components/base/Hyperlink.vue'
import { useMcpServer } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
  isLink?: boolean
  inline?: boolean
}>()

const server = useMcpServer(props)
</script>

<template>
  <BaseButton
    :as="isLink ? NuxtLink : 'div'"
    :to="isLink ? server.linkTo : undefined"
    class="flex items-center space-x-md"
    :class="{ 'b b-app rd p-4 bg-subtle': !inline }">

    <!-- Status icon -->
    <BaseIcon
      class="size-4"
      :icon="server.statusIcon"
      :class="server.statusColor"
    />

    <!-- Server Name -->
    <div class="flex flex-col items-start">

      <!-- If link -->
      <Hyperlink v-if="isLink">
        <span
          class="text-sm font-medium text-app font-mono"
          v-text="server.fullName"
        />
      </Hyperlink>

      <!-- If not -->
      <span
        v-else
        class="text-sm font-medium text-app font-mono"
        v-text="server.fullName"
      />

      <!-- Server Title -->
      <span class="text-xs text-subtle">
        {{ server.data.description || server.data.title }}
      </span>
    </div>
  </BaseButton>
</template>
