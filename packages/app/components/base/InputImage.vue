<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseInputFileProps } from '@unshared/vue/BaseInputFile'
import { BaseInputFile } from '@unshared/vue/BaseInputFile'

const props = defineProps<BaseInputFileProps & {
  label?: string
  clearable?: boolean
  circular?: boolean
}>()

const model = useVModel(props, 'modelValue', undefined, { passive: true })
</script>

<template>
  <BaseInputFile
    v-slot="{ thumbnails, openDialog }"
    v-bind="props"
    v-model="model"
    :class="{
      'op-50 pointer-events-none': disabled,
      'rd-full aspect-1/1': circular,
      'rd': !circular,
    }"
    class="
      relative group w-full h-full p-4 cursor-pointer
      b b-app hover:bg-subtle
    ">

    <!-- Dashed square -->
    <div
      v-if="thumbnails.length === 0"
      class="
        flex flex-col items-center justify-center w-full h-full
        b-dashed b-4 b-app group-hover:op-100 op-60 p-8
      "
      :class="{
        'rd-full': circular,
        'rd': !circular,
      }"
      @click="() => openDialog()">

      <!-- Default content -->
      <slot>
        <BaseIcon icon="i-carbon:upload" class="text-app text-5xl p-4" />
        <div class="font-medium text-center">
          {{ label }}
        </div>
      </slot>
    </div>

    <!-- Thumbnails -->
    <div v-else class="flex items-stretch flex-wrap gap-4 w-full h-full">
      <div
        v-for="thumbnail in thumbnails"
        :key="thumbnail"
        :class="{
          'rounded-full': circular,
          'rounded': !circular,
        }"
        class="bg-cover bg-center w-full h-full"
        :style="{ backgroundImage: `url(${thumbnail})` }"
        @click="() => openDialog()"
      />
    </div>
  </BaseInputFile>
</template>
