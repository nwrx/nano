<script setup lang="ts">
interface Props {
  enum?: string[]
}

const props = defineProps<Props>()
const value = defineModel()
</script>

<template>
  <!-- If the value has predefined values, show a select dropdown. -->
  <select
    v-if="props.enum"
    v-model="value"
    :class="{ 'text-editor-node italic': !value }"
    class="cursor-pointer w-0 grow w-full h-full outline-none bg-transparent text-sm px-sm">

    <!-- Default -->
    <option value="" disabled>
      Select a value...
    </option>

    <!-- Options -->
    <option
      v-for="option in props.enum"
      :key="option"
      :value="option">
      {{ option }}
    </option>
  </select>

  <!-- If value has no predefined values. -->
  <input
    v-else
    v-model="value"
    :class="{ 'text-editor-node italic': !value }"
    class="cursor-text w-0 grow w-full h-full outline-none bg-transparent text-sm px-sm">
</template>
