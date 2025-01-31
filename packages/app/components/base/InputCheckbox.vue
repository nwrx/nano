<script setup lang="ts">
const props = defineProps<{
  id?: string
  hint?: string
  label?: string
  value?: string
  modelValue?: boolean | string | string[]
  type?: 'checkbox' | 'radio' | 'switch'
  compact?: boolean
}>()

const model = useVModel(props, 'modelValue')
</script>

<template>
  <BaseInputToggle
    :id="id"
    v-slot="{ isActive }"
    v-model="model"
    as="div"
    :type="type ?? 'checkbox'"
    :value="value"
    class="
      flex items-center space-x-6 cursor-pointer
      w-full px-6 py-3 min-h-10
      transition-all duration-100
      rounded border-1 group

      border-primary-600/20

      selected:bg-primary-300
      selected:border-primary-600

      hover:bg-primary-200
      hover:border-primary-600/50
    ">

    <!-- Circle when active -->
    <div
      class="
        flex items-center justify-center shrink-0
        transition-all duration-100 ease-in-out
        text-primary-50 border-1

        border-primary-600/20
        group-hover:border-primary-600/50
      "
      :class="{
        'w-8 h-8': compact !== true,
        'w-4 h-4': compact === true,
        'bg-primary-600/60': isActive === true,
        'rounded-full': type === 'radio',
        'rounded': type !== 'radio',
      }">
      <BaseIcon v-if="isActive === true" icon="i-carbon:checkmark" />
      <BaseIcon v-if="isActive === 'mixed'" icon="i-carbon:close" />
    </div>

    <!-- Label -->
    <div v-if="!compact" class="flex flex-col space-y-1 pointer-events-none">
      <label
        v-if="label"
        :for="id"
        class="text-lg font-medium transition-opacity duration-100 ease-in-out"
        :class="{
          'opacity-80': isActive === true,
          'opacity-60': isActive === false,
        }"
        v-text="label">
      </label>

      <!-- Hint -->
      <div
        v-if="hint"
        class="text-sm transition-opacity duration-100 ease-in-out"
        :class="{
          'opacity-60': isActive === true,
          'opacity-40': isActive === false,
        }"
        v-text="hint">
      </div>
    </div>
  </BaseInputToggle>
</template>
