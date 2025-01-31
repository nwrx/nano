<script setup lang="ts">
import { vMarkdown } from '#imports'

defineProps<{
  name?: string
  content?: string
}>()

const { t } = useI18n()
</script>

<template>
  <div>
    <div class="text-xs text-emphasized">
      {{ name ?? t('assistant') }}
    </div>
    <div
      v-markdown.html="String(content)"
      class="markdown"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  assistant: Assistant
fr:
  assistant: Assistant
de:
  assistant: Assistent
es:
  assistant: Asistente
zh:
  assistant: 助手
</i18n>
