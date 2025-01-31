<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
  isSelected?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const { t } = useI18n()
</script>

<template>
  <BaseButton
    eager
    :class="{
      '!b-editor-active bg-prominent': isSelected,
      'hover:bg-prominent': !isSelected,
    }"
    class="
      flex items-center px-md py-sm space-x-sm w-full
      cursor-pointer select-none transition-colors bg-subtle
    "
    @click="() => emit('click')">

    <!-- Dot -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-5 text-prominent"
    />

    <!-- Title -->
    <p class="text-sm shrink-0">
      {{ label }}
    </p>

    <!-- Spacer -->
    <div class="grow" />

    <!-- Context -->
    <ContextMenu x="left" y="above">
      <template #default="{ open }">
        <BaseIcon
          icon="i-carbon:overflow-menu-vertical"
          class="size-5"
          @click="() => open()"
        />
      </template>

      <template #menu>
        <ContextMenuItem
          :label="t('menu.rename')"
          icon="i-carbon:edit"
        />
      </template>
    </ContextMenu>
  </BaseButton>
</template>
