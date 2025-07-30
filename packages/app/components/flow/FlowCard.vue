<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import { BaseButton } from '@unshared/vue/BaseButton'
import { NuxtLink } from '#components'
import Hyperlink from '~/components/base/Hyperlink.vue'
import { useFlow } from '~/composables/useFlow'

const props = defineProps<{
  workspace: string
  project: string
  name: string
  isLink?: boolean
  inline?: boolean
}>()

const flow = useFlow(props)
const fullName = computed(() => `${props.workspace}/${props.project}/${props.name}`)

onMounted(() => {
  void flow.fetchFlow()
})
</script>

<template>
  <BaseButton
    :as="isLink ? NuxtLink : 'div'"
    :to="isLink ? flow.links.editor : undefined"
    class="flex items-center space-x-md"
    :class="{ 'b b-app rd p-4 bg-subtle': !inline }">

    <!-- Status icon -->
    <!--
      <BaseIcon
      class="size-4"
      :icon="statusIcon"
      :class="statusColor"
      />
    -->

    <!-- Flow Name -->
    <div class="flex flex-col items-start">

      <!-- If link -->
      <Hyperlink v-if="isLink">
        <span
          class="text-sm font-medium text-app font-mono"
          v-text="flow.data.title || name"
        />
      </Hyperlink>

      <!-- If not -->
      <span
        v-else
        class="text-sm font-medium text-app font-mono"
        v-text="flow.data.title || name"
      />

      <!-- Flow Title/Description -->
      <span class="text-sm text-subtle font-mono">
        {{ fullName }}
      </span>
    </div>
  </BaseButton>
</template>
