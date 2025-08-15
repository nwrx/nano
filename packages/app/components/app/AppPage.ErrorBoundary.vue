<!-- eslint-disable sonarjs/slow-regex -->
<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import Pattern from '~/components/base/Pattern.vue'
const props = withDefaults(
  defineProps<{
    constructorName?: string
    name?: string
    stack?: string
    message?: unknown
    statusCode?: number
    statusMessage?: string
    isErrorBoundary?: boolean
  }>(),
  {
    constructorName: () => 'Error',
    isErrorBoundary: () => false,
  },
)

const emit = defineEmits<{
  clearError: []
}>()

const { t } = useI18n()
const errorMessage = computed(() => (
  typeof props.message === 'object' && props.message !== null && 'message' in props.message
    ? props.message.message
    : props.message
))

const constructorName = computed(() => {
  if (props.constructorName === 'Error') return
  if (props.constructorName === 'H3Error') return
  return props.constructorName
})

interface StackLine {
  name: string
  path: string
  line: number
  column: number
  internal?: boolean
}

const EXP_SERVER_ERROR = /^\s*at\s+(.+?)\s+\(file:\/\/(.+?):(\d+):(\d+)\)$/
const EXP_CLIENT_ERROR = /^(.+?)@(.+?):(\d+):(\d+)$/

function parseServerError(match: RegExpExecArray): StackLine {
  const [, name, url, line, column] = match
  const path = url
    .replace(/^.*\/nano-ce\/packages/, '.') // Remove absolute path prefix
    .replace(/\?.*$/, '')
  return {
    name: name || '<anonymous>',
    path,
    line: Number.parseInt(line),
    column: Number.parseInt(column),
    internal: path.includes('node_modules') || path.includes('@vue') || path.includes('@nuxt'),
  }
}

function parseClientError(match: RegExpExecArray): StackLine {
  const [, name, url, line, column] = match
  const path = url
    .replace(globalThis.location.origin, '')
    .replace(/^\/static\//, '')
    .replace(/\?.*$/, '')
  return {
    name: name.includes('_sfc_render') ? '<script setup>' : name || '<anonymous>',
    path,
    line: Number.parseInt(line),
    column: Number.parseInt(column),
    internal: path.includes('node_modules') || path.includes('@vue') || path.includes('@nuxt'),
  }
}

const stack = computed(() => {
  if (!props.stack) return []

  return props.stack.split('\n').map((line) => {
    const trimmedLine = line.trim()
    if (!trimmedLine) return
    if (trimmedLine.includes('node_modules')) return
    if (trimmedLine.startsWith('Error: ')) return

    // Match H3/server stack trace format: at function (file://path:line:column)
    const matchH3 = EXP_SERVER_ERROR.exec(trimmedLine)
    if (matchH3) return parseServerError(matchH3)

    // Match browser stack trace format: function@url:line:column
    const matchNuxt = EXP_CLIENT_ERROR.exec(trimmedLine)
    if (matchNuxt) return parseClientError(matchNuxt)

    // Fallback for unparseable lines
    return {
      name: '<unknown>',
      path: trimmedLine,
      line: 0,
      column: 0,
      raw: trimmedLine,
      internal: false,
    }
  }).filter(Boolean) as StackLine[]
})
</script>

<template>
  <Pattern class="absolute inset-0 flex items-center justify-center b-0">

    <!-- Name / Status -->
    <div class="max-w-5xl sm:w-3xl lt-sm:w-full flex flex-col space-y-md px-md">
      <div class="bg-app text-app text-layout rd b b-app w-full">

        <!-- Name -->
        <p class="flex items-center bg-subtle text-app  font-mono font-semibold p-md rd-t">
          <span class="text-2xl space-x-sm">
            <span v-if="constructorName">[{{ constructorName }}]</span>
            <span>{{ name }}</span>
          </span>
          <span class="grow" />
          <span class="text-2xl space-x-md">
            <span v-if="statusCode" class="text-subtle">{{ statusCode }}</span>
          </span>
        </p>

        <!-- Message -->
        <p class="text-xl p-md text-app b-t b-app">
          {{ errorMessage ?? t('defaultMessage') }}
        </p>

        <!-- Stack -->
        <div class="b-app p-md pt-0 lt-sm:hidden">
          <div
            v-if="stack"
            class="
              stack rd b b-app
              text-sm p-md font-mono dark:bg-primary-950 bg-primary-50
              whitespace-pre overflow-auto max-h-96
            ">
            <div v-for="(line, index) in stack" :key="index">

              <!-- Stack index -->
              <div class="inline-block text-subtle w-8">
                {{ index + 1 }}.
              </div>

              <!-- Name & Path -->
              <span class="space-x-xs">
                <span class="text-warning">{{ line.path }}</span>
                <span class="text-app">→</span>
                <span class="text-danger">{{ line.name }}</span>
              </span>

              <!-- Location -->
              <span class="text-app">
                <span>:</span>
                <span>{{ line.line }}</span>
                <span>:</span>
                <span>{{ line.column }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Clear Error Button -->
      <div class="flex items-center space-x-md">
        <Button
          :label="isErrorBoundary ? t('goBack') : t('clearError')"
          class="button-lg button-success ml-auto"
          icon-prepend="i-carbon:error-outline"
          icon-append="i-carbon:arrow-right"
          icon-expand
          @click="() => emit('clearError')"
        />
      </div>
    </div>
  </Pattern>
</template>

<i18n lang="yaml">
en:
  goBack: Go Back
  clearError: Clear Error
  defaultMessage: An unexpected error occurred
fr:
  goBack: Retour
  clearError: Effacer l'erreur
  defaultMessage: Une erreur inattendue s'est produite
de:
  goBack: Zurück
  clearError: Fehler löschen
  defaultMessage: Ein unerwarteter Fehler ist aufgetreten
es:
  goBack: Volver
  clearError: Borrar error
  defaultMessage: Ocurrió un error inesperado
zh:
  goBack: 返回
  clearError: 清除错误
  defaultMessage: 发生了意外错误
</i18n>
