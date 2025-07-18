<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { NuxtLink } from '#components'
import Hyperlink from '~/components/base/Hyperlink.vue'
import { useMcpPool } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  name: string
  isLink?: boolean
  inline?: boolean
}>()

const pool = useMcpPool(props)
</script>

<template>
  <BaseButton
    :as="isLink ? NuxtLink : 'div'"
    :to="isLink ? pool.linkTo : undefined"
    class="flex items-center space-x-md"
    :class="{ 'b b-app rd p-4 bg-subtle': !inline }">

    <!-- Status icon -->
    <BaseIcon
      class="size-4 text-app"
      icon="i-carbon:folder"
    />

    <!-- Pool Name -->
    <div class="flex flex-col items-start">

      <!-- If link -->
      <Hyperlink v-if="isLink">
        <span
          class="text-sm font-medium text-app font-mono"
          v-text="pool.data.name"
        />
      </Hyperlink>

      <!-- If not -->
      <span
        v-else
        class="text-sm font-medium text-app font-mono"
        v-text="pool.data.name"
      />

      <!-- Pool Description -->
      <span class="text-xs text-subtle">
        {{ pool.data.description || pool.data.title }}
      </span>
    </div>
  </BaseButton>
</template>
