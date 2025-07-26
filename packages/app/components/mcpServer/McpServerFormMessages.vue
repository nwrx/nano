<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import AppPageForm from '~/components/app/AppPageForm.vue'
import { useMcpServer } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

// --- State.
const { t } = useI18n()
const server = useMcpServer(props)
onMounted(() => void server.subscribeToMessages())
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('description')">

    <!-- Logs -->
    <div class="bg-layout rd b b-app max-h-2xl overflow-auto w-full">
      <div
        v-for="(message, index) in server.messages"
        :key="index"
        class="p-md b-b b-dashed b-app">
        <div class="flex gap-2">
          <span class="text-sm text-layout font-mono whitespace-pre">{{ message }}</span>
        </div>
      </div>
    </div>
  </AppPageForm>
</template>
