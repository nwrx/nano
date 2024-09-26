<script setup lang="ts">
import type { UserObject } from '@nwrx/api'

const props = defineProps<{
  modelValue: boolean
  owner: string
  slug: string
  searchUsers: (search: string) => Promise<UserObject[]>
}>()

const emit = defineEmits<{
  'submit': [value: string]
}>()

const ownerSlug = computed(() => `${props.owner}/${props.slug}`)

const search = ref('')
const model = useVModel(props, 'modelValue', emit, { passive: true })
const items = ref<UserObject[]>([])
const username = ref<string>()

watch(search, async() => {
  if (!search.value) return
  const users = await props.searchUsers(search.value)
  items.value = users
}, { immediate: true })
</script>

<template>
  <AppDialog v-model="model" :title="`Rename the ${ownerSlug} project`">
    <AppPageHint type="error">
      Transferring the project will change the project URL and may cause issues with integrations.
      Make sure you are certain about this action before proceeding.
    </AppPageHint>

    <!-- Repeat the name before deleting -->
    <p class="text-sm mt-8">
      Select the new project owner by searching for their username or email.
    </p>

    <!-- Confirmation input -->
    <!--
      <InputText
      v-model="confirm"
      class="mt-2"
      :placeholder="slug"
      />
    -->

    <!-- Search -->
    <InputText
      v-model="search"
      class="mt-2"
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
            @click="() => username = item.username"
          />
        </div>
      </div>
    </BaseCollapse>

    <!-- Confirm -->
    <template #cta="{ close }">
      <AppDialogActions
        label="I understand, transfer the project"
        variant="danger"
        :disabled="!username"
        manualClose
        @close="() => close()"
        @confirm="() => emit('submit', username!)"
      />
    </template>
  </AppDialog>
</template>
