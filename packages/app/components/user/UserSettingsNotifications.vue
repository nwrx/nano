<script setup lang="ts">
const props = defineProps<{
  notifications: Record<string, boolean>
}>()

const emit = defineEmits<{
  submit: [Record<string, boolean>]
  'update:modelValue': [Record<string, boolean>]
}>()

const notifications = useVModel(props, 'notifications', emit, {
  passive: true,
})

const TableRow = createReusableTemplate<{
  name: string
  'onUpdate:modelValue'?: (value: boolean) => void
}>()

const TableSection = createReusableTemplate<{
  title: string
  icon: string
}>()
</script>

<template>
  <AppPageForm
    title="Notification Settings"
    label="Save Changes"
    @submit="() => emit('submit', notifications)">

    <template #text>
      Manage your notification preferences. You can choose to receive notifications via email or push notifications.
    </template>

    <!-- Define Row Component -->
    <TableRow.define v-slot="{ name }">
      <div class="grid grid-cols-4 items-start gap-4 p-4">
        <div class="text-sm col-span-2">{{ name }}</div>
        <BaseInputToggle/>
        <BaseInputToggle/>
      </div>
    </TableRow.define>

    <!-- Define Header Component -->
    <TableSection.define v-slot="{ title, icon, $slots }">
      <div>
        <h3 class="flex items-center space-x-2 p-4 border-y border-black/10 bg-black/5 py-2">
          <BaseIcon :icon="icon" class="text-primary-400 w-4 h-4"/>
          <span class="text-sm font-medium">{{ title }}</span>
        </h3>
        <component :is="$slots.default"/>
      </div>
    </TableSection.define>

    <!-- Table -->
    <div class="border border-black/10 rounded w-full">
      <div class="grid grid-cols-12 gap-4 px-4 py-2">
        <div class="text-xs text-start text-black/60 col-span-6">Action</div>
        <div class="text-xs text-center text-black/60 col-span-3">Email</div>
        <div class="text-xs text-center text-black/60 col-span-3">Push</div>
      </div>

      <TableSection.reuse title="Security" icon="i-carbon:security">
        <TableRow.reuse name="Failed login attempts"/>
        <TableRow.reuse name="Password changes"/>
        <TableRow.reuse name="Suspicious activity"/>
      </TableSection.reuse>

      <TableSection.reuse title="General" icon="i-carbon:notification">
        <TableRow.reuse name="Updates and announcements"/>
        <TableRow.reuse name="Terms of service updates"/>
      </TableSection.reuse>

      <TableSection.reuse title="Activity" icon="i-carbon:activity">
        <TableRow.reuse name="Project activity"/>
        <TableRow.reuse name="Flow activity"/>
      </TableSection.reuse>
    </div>
  </AppPageForm>
</template>
