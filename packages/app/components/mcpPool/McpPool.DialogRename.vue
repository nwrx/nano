<script setup lang="ts">
import type { McpPoolObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'

const props = defineProps<{
  pool: McpPoolObject
  workspace: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const name = ref('')

async function renamePool() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/pools/:pool/name', {
    data: {
      workspace: props.workspace,
      pool: props.pool.name,
      name: name.value,
    },
    onSuccess: () => {
      alerts.success(t('success', { name: name.value }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = defineModel({ default: false })
watch(isOpen, () => name.value = props.pool.name, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { name: pool.name })"
    :text="t('text', { name: pool.name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="name === pool.name"
    @confirm="() => renamePool()">
    <InputText
      v-model="name"
      class="mt-2"
      :text-before="`${CONSTANTS.appHost}/${workspace}/context/`"
      :placeholder="t('placeholder')"
      :hint="t('hint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Rename pool **{name}**
  text: Update the pool name and endpoint URL. This may temporarily interrupt server connectivity and require client reconnection.
  placeholder: Enter new pool name
  hint: The new name for the pool
  cancel: Cancel
  confirm: Rename Pool
  success: Pool renamed to **{name}**.
fr:
  title: Renommer le pool **{name}**
  text: Mettre à jour le nom du pool et l'URL du point de terminaison. Cela peut temporairement interrompre la connectivité des serveurs et nécessiter une reconnexion du client.
  placeholder: Entrez le nouveau nom du pool
  hint: Le nouveau nom pour le pool
  cancel: Annuler
  confirm: Renommer le Pool
  success: Pool renommé en **{name}**.
de:
  title: Pool **{name}** umbenennen
  text: Aktualisieren Sie den Pool-Namen und die Endpunkt-URL. Dies kann die Server-Konnektivität vorübergehend unterbrechen und eine Client-Wiederverbindung erfordern.
  placeholder: Neuen Pool-Namen eingeben
  hint: Der neue Name für den Pool
  cancel: Abbrechen
  confirm: Pool Umbenennen
  success: Pool umbenannt in **{name}**.
es:
  title: Renombrar pool **{name}**
  text: Actualizar el nombre del pool y la URL del endpoint. Esto puede interrumpir temporalmente la conectividad del servidor y requerir reconexión del cliente.
  placeholder: Ingrese el nuevo nombre del pool
  hint: El nuevo nombre para el pool
  cancel: Cancelar
  confirm: Renombrar Pool
  success: Pool renombrado a **{name}**.
zh:
  title: 重命名池 **{name}**
  text: 更新池名称和端点URL。这可能会暂时中断服务器连接并需要客户端重新连接。
  placeholder: 输入新的池名称
  hint: 池的新名称
  cancel: 取消
  confirm: 重命名池
  success: 池已重命名为 **{name}**。
</i18n>
