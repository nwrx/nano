<script setup lang="ts">
import type { McpServerArgumentObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import { useMcpServer } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
  argument: McpServerArgumentObject
}>()

// --- Model.
const { t } = useI18n()
const server = useMcpServer(props)
const isOpen = defineModel({ default: false })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:delete"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { position: argument.position, server: name })"
    :text="t('text')"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    @confirm="() => server.removeArgument(argument.position)">

    <div class="rd b b-app">
      <div class="flex items-center gap-sm p-sm mb-sm b-b b-dashed b-app">
        <div class="b b-app rd p-2">
          <BaseIcon
            :icon="argument.variable ? 'i-carbon:password' : 'i-carbon:code'"
            class="text-app"
          />
        </div>
        <div>
          <p class="text-sm font-medium">
            {{ t('info.position') }}
          </p>
          <p class="text-sm text-subtle">
            {{ argument.position }}
          </p>
        </div>
      </div>

      <!-- Variable Info -->
      <div v-if="argument.variable" class="space-y-sm">
        <div>
          <p class="text-sm font-medium">
            {{ t('info.linkedVariable') }}
          </p>
          <div class="flex items-center gap-sm text-sm text-subtle">
            <span>{{ argument.variable.vault?.name }}</span>
            <BaseIcon icon="i-carbon:arrow-right" />
            <span class="font-mono">{{ argument.variable.name }}</span>
          </div>
        </div>
      </div>

      <!-- Raw Value Info -->
      <div v-else>
        <div>
          <p class="text-sm font-medium">
            {{ t('info.rawValue') }}
          </p>
          <p class="text-sm text-subtle font-mono">
            {{ argument.value }}
          </p>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Remove argument at **position {position}** from server **{server}**
  text: Are you sure you want to remove this server argument? This action cannot be undone and may affect the server's functionality.
  confirm: Remove argument
  cancel: Cancel
  success: Argument has been removed successfully.
  info:
    position: Position
    linkedVariable: Linked Variable
    rawValue: Raw Value
fr:
  title: Supprimer l'argument à la **position {position}** du serveur **{server}**
  text: Êtes-vous sûr de vouloir supprimer cet argument de serveur ? Cette action ne peut pas être annulée et peut affecter le fonctionnement du serveur.
  confirm: Supprimer l'argument
  cancel: Annuler
  success: L'argument a été supprimé avec succès.
  info:
    position: Position
    linkedVariable: Variable liée
    rawValue: Valeur brute
de:
  title: Argument an **Position {position}** vom Server **{server}** entfernen
  text: Sind Sie sicher, dass Sie dieses Serverargument entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden und kann die Funktionalität des Servers beeinträchtigen.
  confirm: Argument entfernen
  cancel: Abbrechen
  success: Argument wurde erfolgreich entfernt.
  info:
    position: Position
    linkedVariable: Verknüpfte Variable
    rawValue: Rohwert
es:
  title: Eliminar argumento en **posición {position}** del servidor **{server}**
  text: ¿Está seguro de que desea eliminar este argumento del servidor? Esta acción no se puede deshacer y puede afectar la funcionalidad del servidor.
  confirm: Eliminar argumento
  cancel: Cancelar
  success: El argumento se ha eliminado exitosamente.
  info:
    position: Posición
    linkedVariable: Variable Vinculada
    rawValue: Valor Crudo
zh:
  title: 从服务器 **{server}** 删除 **位置 {position}** 的参数
  text: 您确定要删除此服务器参数吗？此操作无法撤消，可能会影响服务器的功能。
  confirm: 删除参数
  cancel: 取消
  success: 参数已成功删除。
  info:
    position: 位置
    linkedVariable: 链接的变量
    rawValue: 原始值
</i18n>
