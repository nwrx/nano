<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useRunner } from '~/composables/useRunner'

const props = defineProps<{
  name: string
}>()

const { t } = useI18n()
const runner = useRunner(props)
const newName = ref<string>('')
const isOpen = defineModel({ default: false })
watch(isOpen, () => newName.value = runner.data.name || props.name, { immediate: true })

onMounted(() => {
  void runner.fetch()
})
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { name })"
    :text="t('text', { name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!newName || newName === name"
    @confirm="() => runner.rename(newName)">

    <InputText
      v-model="newName"
      :label="t('nameLabel')"
      :placeholder="t('namePlaceholder')"
      :hint="t('nameHint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Rename runner
  text: Change the name of runner **{name}** to a new identifier.
  nameLabel: Runner name
  namePlaceholder: Enter the new runner name
  nameHint: The new name for the runner (must be unique)
  cancel: Cancel
  confirm: Rename runner
  success: Runner **{name}** renamed successfully.
fr:
  title: Renommer le serveur d'exécution
  text: Changer le nom du serveur d'exécution **{name}** vers un nouvel identifiant.
  nameLabel: Nom du serveur d'exécution
  namePlaceholder: Entrez le nouveau nom du serveur d'exécution
  nameHint: Le nouveau nom du serveur d'exécution (doit être unique)
  cancel: Annuler
  confirm: Renommer le serveur d'exécution
  success: Le serveur d'exécution **{name}** a été renommé avec succès.
de:
  title: Ausführungsserver umbenennen
  text: Ändern Sie den Namen des Ausführungsservers **{name}** zu einem neuen Bezeichner.
  nameLabel: Ausführungsserver-Name
  namePlaceholder: Geben Sie den neuen Ausführungsserver-Namen ein
  nameHint: Der neue Name für den Ausführungsserver (muss eindeutig sein)
  cancel: Abbrechen
  confirm: Ausführungsserver umbenennen
  success: Ausführungsserver **{name}** erfolgreich umbenannt.
es:
  title: Renombrar servidor de ejecución
  text: Cambiar el nombre del servidor de ejecución **{name}** a un nuevo identificador.
  nameLabel: Nombre del servidor de ejecución
  namePlaceholder: Introduce el nuevo nombre del servidor de ejecución
  nameHint: El nuevo nombre del servidor de ejecución (debe ser único)
  cancel: Cancelar
  confirm: Renombrar servidor de ejecución
  success: Servidor de ejecución **{name}** renombrado con éxito.
zh:
  title: 重命名执行服务器
  text: 将执行服务器 **{name}** 的名称更改为新标识符。
  nameLabel: 执行服务器名称
  namePlaceholder: 输入新的执行服务器名称
  nameHint: 执行服务器的新名称（必须唯一）
  cancel: 取消
  confirm: 重命名执行服务器
  success: 成功重命名执行服务器 **{name}**。
</i18n>
