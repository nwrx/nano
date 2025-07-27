<script setup lang="ts">
import type { NmcpManager } from '@nwrx/nano-api'
import Badge from '~/components/base/Badge.vue'

const props = defineProps<{
  phase?: NmcpManager.ServerStatus['phase']
}>()

const { t } = useI18n()

const icon = computed(() => {
  if (props.phase === 'Idle') return 'i-carbon:pause'
  if (props.phase === 'Ready') return 'i-carbon:checkmark'
  if (props.phase === 'Starting') return 'i-line-md:loading-loop'
  if (props.phase === 'Stopping') return 'i-line-md:loading-loop'
  if (props.phase === 'Degraded') return 'i-carbon:error'
  if (props.phase === 'Requested') return 'i-carbon:help'
  return 'i-carbon:help'
})

const classes = computed(() => {
  if (props.phase === 'Ready') return 'badge-success'
  if (props.phase === 'Stopping') return 'badge-warning'
  if (props.phase === 'Degraded') return 'badge-danger'
  if (props.phase === 'Requested') return 'badge-warning'
  return ''
})
</script>

<template>
  <Badge
    :label="phase ? t(phase) : t('Unknown')"
    :icon="icon"
    :class="classes"
  />
</template>

<i18n lang="yaml">
en:
  Unknown: Not Available
  Ready: Ready
  Starting: Starting
  Stopping: Stopping
  Failed: Failed
  Idle: Idle
  Requested: Requested
fr:
  Unknown: Non disponible
  Ready: Prêt
  Starting: Démarrage
  Stopping: Arrêt
  Failed: Échoué
  Idle: Inactif
  Requested: Demandé
de:
  Unknown: Nicht verfügbar
  Ready: Bereit
  Starting: Startet
  Stopping: Stoppt
  Failed: Fehlgeschlagen
  Idle: Im Leerlauf
  Requested: Angefordert
es:
  Unknown: No disponible
  Ready: Listo
  Starting: Iniciando
  Stopping: Deteniendo
  Failed: Fallido
  Idle: Inactivo
  Requested: Solicitado
zh:
  Unknown: 不可用
  Ready: 就绪
  Starting: 启动中
  Stopping: 停止中
  Failed: 失败
  Idle: 空闲
  Requested: 已请求
</i18n>
