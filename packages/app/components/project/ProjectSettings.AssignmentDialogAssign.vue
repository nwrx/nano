<script setup lang="ts">
import type { UserObject } from '@nwrx/api'

const props = defineProps<{
  modelValue: boolean
  searchUsers: (search: string) => Promise<UserObject[]>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [userName: string]
}>()

const search = ref('')
const model = useVModel(props, 'modelValue', emit, { passive: true })
const items = ref<UserObject[]>([])
const userName = ref<string>()

watch(search, async() => {
  if (!search.value) return
  const users = await props.searchUsers(search.value)
  items.value = users
}, { immediate: true })
</script>

<template>
  <AppDialog
    v-model="model"
    title="Assign a new team member">

    <!-- Search -->
    <InputText
      v-model="search"
      icon="i-carbon:user"
      placeholder="Search by username or email"
    />

    <!-- Results -->
    <BaseCollapse vertical as="div" :isOpen="true" class="transition-all mt-4 w-full">
      <div v-for="item in items" :key="item.username">
        <div class="flex items-center justify-start space-x-4 py-4 w-full">

          <!-- Image -->
          <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <BaseIcon icon="i-carbon:user" class="w-6 h-6" />
          </div>

          <!-- Name -->
          <div class="text-sm grow-1">
            <p class="font-medium">{{ item.displayName }}</p>
            <p class="text-sm">{{ item.username }}</p>
          </div>

          <!-- CTA -->
          <Button
            label="Assign"
            link
            icon-append="i-carbon:add"
            size="sm"
            @click="() => userName = item.username"
          />

        </div>
      </div>
    </BaseCollapse>

    <!-- Confirm -->
    <template #cta="{ close }">
      <AppDialogActions
        label="Confirm"
        @close="() => close()"
        @confirm="() => emit('submit', userName!)"
      />
    </template>
  </AppDialog>
</template>
