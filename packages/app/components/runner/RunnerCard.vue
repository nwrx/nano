<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { NuxtLink } from '#components'
import Hyperlink from '~/components/base/Hyperlink.vue'

const props = defineProps<{
  runner: ThreadRunnerObject
  isLink?: boolean
  inline?: boolean
}>()

const linkTo = computed(() => ({
  name: 'AdminSettingsRunner',
  params: { identity: props.runner.identity },
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
      :icon="runner.disabledAt ? 'i-carbon:dot-mark' : 'i-carbon:dot-mark'"
      :class="runner.disabledAt ? 'text-danger' : 'text-success'"
    />

    <!-- Identity & Address -->
    <div class="flex flex-col items-start">

      <!-- If link -->
      <Hyperlink v-if="isLink">
        <span
          class="text-sm font-medium text-app font-mono"
          v-text="runner.identity"
        />
      </Hyperlink>

      <!-- If not -->
      <span
        v-else
        class="text-sm font-medium text-app font-mono"
        v-text="runner.identity"
      />

      <!-- Address -->
      <span
        class="text-xs text-subtle font-mono"
        v-text="runner.address"
      />
    </div>
  </BaseButton>
</template>
