<script setup lang="ts">
import type { McpManagerObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import McpManagerCard from './McpManagerCard.vue'

const props = defineProps<{
  modelValue?: boolean
  manager: McpManagerObject
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

async function enableManager() {
  await client.requestAttempt('POST /mcp/:identity/enable', {
    data: { identity: props.manager.identity },
    onSuccess: () => {
      alerts.success(t('enableSuccess', { identity: props.manager.identity }))
      emit('submit')
    },
  })
}

async function disableManager() {
  await client.requestAttempt('POST /mcp/:identity/disable', {
    data: { identity: props.manager.identity },
    onSuccess: () => {
      alerts.success(t('disableSuccess', { identity: props.manager.identity }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
const isDisabled = computed(() => !props.manager.disabledAt)
const identity = computed(() => props.manager.identity)
</script>

<template>
  <Dialog
    v-model="isOpen"
    :icon="isDisabled ? 'i-carbon:pause' : 'i-carbon:play'"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="isDisabled ? t('disableTitle', { identity }) : t('enableTitle', { identity })"
    :text="isDisabled ? t('disableText', { identity }) : t('enableText', { identity })"
    :label-cancel="t('cancel')"
    :label-confirm="isDisabled ? t('disableConfirm') : t('enableConfirm')"
    @confirm="() => isDisabled ? disableManager() : enableManager()">

    <!-- Manager -->
    <McpManagerCard :manager="manager" />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  enableTitle: Enable manager
  enableText: Enable manager **{identity}** to allow it to accept and coordinate new MCP resources.
  enableConfirm: Enable
  enableSuccess: Manager **{identity}** has been enabled.
  disableTitle: Disable manager
  disableText: Disable manager **{identity}** to prevent it from accepting new resources. Active gateways will continue to operate.
  disableConfirm: Disable
  disableSuccess: Manager **{identity}** has been disabled.
  cancel: Cancel
fr:
  enableTitle: Activer le gestionnaire
  enableText: Activer le gestionnaire **{identity}** pour lui permettre d'accepter et de coordonner de nouvelles ressources MCP.
  enableConfirm: Activer
  enableSuccess: Le gestionnaire **{identity}** a été activé.
  disableTitle: Désactiver le gestionnaire
  disableText: Désactiver le gestionnaire **{identity}** pour l'empêcher d'accepter de nouvelles ressources. Les passerelles actives continueront à fonctionner.
  disableConfirm: Désactiver
  disableSuccess: Le gestionnaire **{identity}** a été désactivé.
  cancel: Annuler
de:
  enableTitle: Manager aktivieren
  enableText: Aktivieren Sie den Manager **{identity}**, um ihm zu erlauben, neue MCP-Ressourcen zu akzeptieren und zu koordinieren.
  enableConfirm: Aktivieren
  enableSuccess: Manager **{identity}** wurde aktiviert.
  disableTitle: Manager deaktivieren
  disableText: Deaktivieren Sie den Manager **{identity}**, um zu verhindern, dass er neue Ressourcen akzeptiert. Aktive Gateways werden weiterhin funktionieren.
  disableConfirm: Deaktivieren
  disableSuccess: Manager **{identity}** wurde deaktiviert.
  cancel: Abbrechen
es:
  enableTitle: Habilitar administrador
  enableText: Habilitar el administrador **{identity}** para permitirle aceptar y coordinar nuevos recursos MCP.
  enableConfirm: Habilitar
  enableSuccess: El administrador **{identity}** ha sido habilitado.
  disableTitle: Deshabilitar administrador
  disableText: Deshabilitar el administrador **{identity}** para evitar que acepte nuevos recursos. Las puertas de enlace activas continuarán operando.
  disableConfirm: Deshabilitar
  disableSuccess: El administrador **{identity}** ha sido deshabilitado.
  cancel: Cancelar
zh:
  enableTitle: 启用管理器
  enableText: 启用管理器 **{identity}** 以允许其接受和协调新的MCP资源。
  enableConfirm: 启用
  enableSuccess: 管理器 **{identity}** 已启用。
  disableTitle: 禁用管理器
  disableText: 禁用管理器 **{identity}** 以防止其接受新资源。活动网关将继续运行。
  disableConfirm: 禁用
  disableSuccess: 管理器 **{identity}** 已禁用。
  cancel: 取消
</i18n>
