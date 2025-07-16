<script setup lang="ts">
import type { McpManagerObject } from '@nwrx/nano-api'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { NuxtLink } from '#components'
import Hyperlink from '~/components/base/Hyperlink.vue'

const props = defineProps<{
  manager: McpManagerObject
  isLink?: boolean
  inline?: boolean
}>()

const linkTo = computed(() => ({
  name: 'AdminSettingsMcpManager',
  params: { manager: props.manager.identity },
}))
</script>

<template>
  <BaseButton
    :as="isLink ? NuxtLink : 'div'"
    :to="isLink ? linkTo : undefined"
    class="flex items-center space-x-md"
    :class="{
      'b b-app rd p-4 bg-subtle': !inline,
    }">

    <!-- Status icon -->
    <BaseIcon
      class="size-4"
      :icon="manager.disabledAt ? 'i-carbon:dot-mark' : 'i-carbon:dot-mark'"
      :class="manager.disabledAt ? 'text-danger' : 'text-success'"
    />

    <!-- Identity & Address -->
    <div class="flex flex-col items-start">

      <!-- If link -->
      <Hyperlink v-if="isLink">
        <span
          class="text-sm font-medium text-app font-mono"
          v-text="manager.identity"
        />
      </Hyperlink>

      <!-- If not -->
      <span
        v-else
        class="text-sm font-medium text-app font-mono"
        v-text="manager.identity"
      />

      <!-- Address -->
      <span
        class="text-xs text-subtle font-mono"
        v-text="manager.address"
      />
    </div>
  </BaseButton>
</template>
