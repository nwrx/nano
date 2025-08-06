<script setup lang="ts">
import type { RunnerObject } from '@nwrx/nano-api'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { NuxtLink } from '#components'
import Hyperlink from '~/components/base/Hyperlink.vue'
import UserAudit from '~/components/user/UserAudit.vue'

const props = defineProps<{
  runner: RunnerObject
  isLink?: boolean
  inline?: boolean
}>()

const linkTo = computed(() => ({
  name: 'AdminSettingsRunner',
  params: { name: props.runner.name },
}))
</script>

<template>
  <BaseButton
    :as="isLink ? NuxtLink : 'div'"
    :to="isLink ? linkTo : undefined"
    class="flex items-center space-x-md"
    :class="{ 'b b-app rd p-4 bg-subtle': !inline }">

    <!-- Status icon -->
    <BaseIcon
      class="size-4"
      :icon="runner.disabledAt ? 'i-carbon:dot-mark' : 'i-carbon:dot-mark'"
      :class="runner.disabledAt ? 'text-danger' : 'text-success'"
    />

    <!-- Name & Address -->
    <div class="flex flex-col items-start">

      <!-- If link -->
      <Hyperlink v-if="isLink">
        <span class="text-sm font-medium text-app font-mono">
          {{ runner.name }}
        </span>
      </Hyperlink>

      <!-- If not -->
      <span v-else class="text-sm font-medium text-app font-mono">
        {{ runner.name }}
      </span>

      <!-- Address -->
      <span class="text-xs text-subtle font-mono">
        {{ runner.address }}
      </span>
    </div>

    <!-- Spacer -->
    <template v-if="!inline">
      <div class="grow" />

      <!-- Metadata -->
      <UserAudit
        :created-at="runner.createdAt"
        :created-by="runner.createdBy"
        :updated-at="runner.updatedAt"
        :updated-by="runner.updatedBy"
        :disabled-at="runner.disabledAt"
        :disabled-by="runner.disabledBy"
      />
    </template>
  </BaseButton>
</template>
