<script setup lang="ts">
import type { WorkspaceProjectObject } from '@nwrx/api'

const props = defineProps<{
  workspace: string
  modelValue?: boolean
} & WorkspaceProjectObject>()

const emit = defineEmits<{
  delete: []
  flowCreate: []
  flowDelete: [flowSlug: string]
  flowDownload: [flowSlug: string]
  flowDuplicate: [flowSlug: string]
  'update:modelValue': [value: boolean]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})

function getProjectRoute(workspace: string, name: string, tab?: string) {
  return {
    name: 'ProjectSettings',
    params: { workspace, name },
    query: tab ? { tab } : undefined,
  }
}
</script>

<template>
  <div class="w-full">

    <!-- Header -->
    <BaseButton
      eager
      class="
        flex items-center justify-start
        p-4 pr-12 gap-4 rounded w-full
      bg-white border border-black/10
        cursor-pointer group
      "
      @click="() => { model = !model }">

      <!-- Dropdown toggle -->
      <BaseIcon
        icon="i-carbon:chevron-down"
        :class="{ 'rotate-180': model }"
        class="cursor-pointer w-8 h-8 opacity-0 group-hover:opacity-50 transition-all duration-200"
      />

      <!-- Header -->
      <div class="text-left grow">
        <h3 class="text-lg font-medium">
          {{ title }}
        </h3>
        <p class="text-sm text-black/50 line-clamp-2">
          {{ description }}
        </p>
      </div>

      <!-- Collaborators -->
      <ProjectListItemAssigments :assignments="assignments"/>

      <!-- CTA -->
      <ContextMenu x="right" y="top" @mousedown.stop>
        <template #menu="{ close }">
          <ContextMenuItem
            label="Settings"
            icon="i-carbon:settings"
            keybind="Ctrl + Shift + S"
            :to="getProjectRoute(workspace, name)"
            @click="() => close()"
          />
          <ContextMenuItem
            label="Access"
            icon="i-carbon:group"
            keybind="Ctrl + Shift + C"
            :to="getProjectRoute(workspace, name, 'access')"
            @click="() => close()"
          />
          <ContextMenuDivider />
          <ContextMenuItem
            label="Delete"
            icon="i-carbon:delete"
            keybind="Backspace"
            @click="() => { emit('delete'); close() }"
          />
        </template>
      </ContextMenu>
    </BaseButton>

    <!-- Blocks that lists the flows -->
    <BaseCollapse
      vertical
      :isOpen="model"
      :class="{ 'opacity-0': !model }"
      class="border-l border-black/10 ml-8 pl-8 transition-all duration-300 ease-in-out">

      <div class="flex flex-col space-y-2 pt-4 mb-4">
        <ProjectListItemFlow
          v-for="flow in flows"
          :key="flow.name"
          :project="name"
          :workspace="workspace"
          v-bind="flow"
          icon="i-carbon:flow"
          isRunning
          isDeployed
          class="shrink-0"
          @delete="() => emit('flowDelete', flow.name)"
          @download="() => emit('flowDownload', flow.name)"
          @duplicate="() => emit('flowDuplicate', flow.name)"
        />
      </div>

      <!-- Create flow button -->
      <Button
        link
        label="Create a new Flow in this Project"
        class="mb-8 !opacity-60 !hover:opacity-100"
        icon-prepend="i-carbon:flow"
        icon-append="i-carbon:chevron-right"
        icon-expand
        size="sm"
        @click="() => emit('flowCreate')"
      />
    </BaseCollapse>
  </div>
</template>
