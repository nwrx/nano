<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpServer } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

// --- State.
const { t } = useI18n()
const newName = ref('')
const isOpen = defineModel({ default: false })
const server = useMcpServer(props)
const isDisabled = computed(() => newName.value.trim().length === 0)

// --- Lifecycle.
watch(isOpen, () => newName.value = props.name, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { pool, name })"
    :text="t('text', { name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="isDisabled"
    @confirm="() => server.renameServer(newName)">

    <!-- New name input field -->
    <InputText
      v-model="newName"
      class="mt-2"
      :text-before="`${CONSTANTS.appHost}/${workspace}/pools/${pool}/servers`"
      :placeholder="t('placeholder')"
      :hint="t('hint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Rename server **{pool}/{name}**
  text: Update the server name and endpoint URL. This may temporarily interrupt connectivity and require client reconnection.
  placeholder: Enter new server name
  hint: The new name for the server
  cancel: Cancel
  confirm: Rename Server
fr:
  title: Renommer le serveur **{pool}/{name}**
  text: Mettre à jour le nom du serveur et l'URL du point de terminaison. Cela peut temporairement interrompre la connectivité et nécessiter une reconnexion du client.
  placeholder: Entrez le nouveau nom du serveur
  hint: Le nouveau nom pour le serveur
  cancel: Annuler
  confirm: Renommer le Serveur
de:
  title: Server **{pool}/{name}** umbenennen
  text: Aktualisieren Sie den Servernamen und die Endpunkt-URL. Dies kann die Konnektivität vorübergehend unterbrechen und eine Client-Wiederverbindung erfordern.
  placeholder: Neuen Servernamen eingeben
  hint: Der neue Name für den Server
  cancel: Abbrechen
  confirm: Server Umbenennen
es:
  title: Renombrar servidor **{pool}/{name}**
  text: Actualizar el nombre del servidor y la URL del endpoint. Esto puede interrumpir temporalmente la conectividad y requerir reconexión del cliente.
  placeholder: Ingrese el nuevo nombre del servidor
  hint: El nuevo nombre para el servidor
  cancel: Cancelar
  confirm: Renombrar Servidor
zh:
  title: 重命名服务器 **{pool}/{name}**
  text: 更新服务器名称和端点URL。这可能会暂时中断连接并需要客户端重新连接。
  placeholder: 输入新的服务器名称
  hint: 服务器的新名称
  cancel: 取消
  confirm: 重命名服务器
</i18n>
