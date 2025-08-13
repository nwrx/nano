<script setup lang="ts">
import EditorDialogButton from './EditorDialog.Button.vue'

defineProps<{
  title?: string
  description?: string
}>()

const slots = defineSlots<{
  default?: () => VNode
  menu?: () => VNode
  actions?: () => VNode
}>()

const show = defineModel('show', { default: false })
</script>

<template>
  <Dialog
    v-model="show"
    teleport="#editor"
    class-container="
      flex flex-col !w-full h-full max-w-page max-h-4xl cursor-auto
      pointer-events-auto b b-app text-app !bg-editor-node/80 overflow-hidden rd
    ">

    <!-- Header -->
    <template #container>
      <div class="flex items-center b-b b-app p-sm space-x-sm">
        <EditorDialogButton
          icon="i-carbon:close"
          @click="() => show = false"
        />

        <!-- Title -->
        <span v-if="title" class="text-base font-medium ml-md select-text">
          {{ title }}
        </span>

        <!-- Divider -->
        <template v-if="description">
          <BaseIcon icon="i-carbon:dot-mark" class="size-3" />
          <span class="text-subtle text-sm select-text">
            {{ description }}
          </span>
        </template>

        <!-- Spacer -->
        <div class="flex-1" />

        <!-- Preview -->
        <slot name="menu" />
      </div>

      <!-- Content -->
      <div class="flex grow overflow-hidden w-full h-full relative">
        <slot />
      </div>

      <!-- Confirm -->
      <div v-if="slots.actions" class="flex items-center justify-end b-t b-app p-sm space-x-sm">
        <slot name="actions" />
      </div>
    </template>
  </Dialog>
</template>
