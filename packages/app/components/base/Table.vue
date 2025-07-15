<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T, K extends string">
import type { BaseTableProps, BaseTableSlots } from '@unshared/vue'

const props = defineProps<BaseTableProps<T, K>>()
const slots = defineSlots<BaseTableSlots<T, K>>()
</script>

<template>
  <div class="w-full b b-app rd">
    <!-- @vue-expect-error: false-positive, generics are matching -->
    <BaseTable
      v-bind="props"
      class="w-full"
      class-header="bg-subtle"
      class-header-cell="font-medium first:pl-lg px-md last:pr-lg py-sm text-sm text-start"
      class-cell="first:pl-lg px-md last:pr-lg py-sm text-sm text-start last:text-end"
      class-row="b-t b-app hover:bg-subtle">

      <!-- Passthrough slots -->
      <template v-for="(_, name) in slots" #[name]="slot">
        <slot :name="name" v-bind="slot" />
      </template>
    </BaseTable>
  </div>
</template>
