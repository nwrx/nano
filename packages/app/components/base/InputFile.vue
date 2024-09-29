<script setup lang="ts">
import type { BaseInputFileProps } from '@unshared/vue'

const props = defineProps<{
  label?: string
  clearable?: boolean
} & BaseInputFileProps>()

const model = useVModel(props, 'modelValue', undefined, { passive: true })
</script>

<template>
  <BaseInputFile
    v-slot="{ thumbnails, openDialog }"
    v-bind="props"
    v-model="model"
    :class="{ 'opacity-50 pointer-events-none': disabled }"
    class="
      relative group w-full h-full p-4 cursor-pointer
      border border-black/10 rounded
      hover:bg-primary-200/10
      hover:border-primary-500/50
    ">

    <!-- Dashed square -->
    <div
      v-if="thumbnails.length === 0"
      class="
        flex flex-col items-center justify-center w-full h-full
        rounded border-dashed border-2 border-black/20
        group-hover:opacity-100 opacity-60 p-8
      "
      @click="() => openDialog()">

      <!-- Default content -->
      <slot>
        <BaseIcon icon="i-carbon:upload" class="text-black/50 text-5xl p-4" />
        <div class="font-medium text-center">{{ label }}</div>
      </slot>
    </div>

    <!-- Thumbnails -->
    <div v-else class="relative flex items-stretch flex-wrap gap-4 w-full h-full">
      <div
        v-for="(thumbnail, index) in thumbnails"
        :key="thumbnail"
        class="rounded bg-cover bg-center w-full h-full"
        :style="{ backgroundImage: `url(${thumbnail})` }"
        @click="() => openDialog()">
      </div>
    </div>
  </BaseInputFile>
</template>
