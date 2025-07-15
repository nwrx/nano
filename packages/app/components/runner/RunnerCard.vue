<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { NuxtLink } from '#components'
import Hyperlink from '~/components/base/Hyperlink.vue'

const props = defineProps<{
  runner: ThreadRunnerObject
  isLink?: boolean
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
    class="flex items-center space-x-md">

    <!-- Status icon -->
    <BaseIcon
      class="size-4"
      :icon="runner.disabledAt ? 'i-carbon:dot-mark' : 'i-carbon:dot-mark'"
      :class="runner.disabledAt ? 'text-danger' : 'text-success'"
    />

    <!-- Identity & Address -->
    <div class="flex flex-col items-start">
      <Hyperlink class="text-sm font-medium text-app">
        <span v-text="runner.identity" />
      </Hyperlink>
      <span class="text-xs text-subtle" v-text="runner.address" />
    </div>
  </BaseButton>
</template>
