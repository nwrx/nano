<script setup lang="ts">
defineProps<{
  show: boolean
  isEmpty?: boolean
  isLoading?: boolean
}>()

const { t } = useI18n()
const isLoadingRef = ref(false)
const isLoadingDebounced = refDebounced(isLoadingRef, 100)
</script>

<template>
  <Transition
    enter-active-class="transition duration-100"
    enter-from-class="-translate-y-lg op-0"
    enter-to-class="translate-y-0 op-100"
    leave-active-class="transition duration-100"
    leave-from-class="translate-y-0 op-100"
    leave-to-class="-translate-y-lg op-0">
    <div
      v-if="show"
      ref="list"
      class="
        absolute left-0 w-full top-full
        bg-editor-panel backdrop-blur-2xl
        p-sm rounded space-y-xs rd
        b b-editor z-10 mt-sm
        overflow-y-auto overflow-x-hidden
        max-h-128
      "
      @wheel.stop>

      <!-- When no options are available, show a message. -->
      <p v-if="isEmpty" class="text-xs text-subtle">
        {{ isLoadingDebounced ? t('loading') : t('empty') }}
      </p>

      <!-- Otherwise, show the list of options. -->
      <slot v-else />
    </div>
  </Transition>
</template>

<i18n lang="yaml">
en:
  loading: Loading...
  empty: No options available.
</i18n>
