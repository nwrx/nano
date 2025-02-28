<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
}>()

const emit = defineEmits<{
  'submit': [value: string]
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
const name = ref(props.workspace)
</script>

<template>
  <AppDialog
    v-model="model"
    icon="i-carbon:label"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace })"
    :text="t('text', { workspace })"
    :label-cancel="t('button.cancel')"
    :label-confirm="t('button.confirm')"
    @confirm="() => emit('submit', name)">

    <InputText
      v-model="name"
      class="mt-2"
      text-before="api.nwrx.io/"
      :placeholder="t('input.name.label')"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Rename the **{workspace}** workspace
  text: Renaming the workspace will change the workspace URL. This means that **{workspace}** won't be a valid URL anymore. Make sure you are certain of this action before continuing.
  input.name.label: Define the new workspace name
  button.confirm: I understand, rename the workspace
  button.cancel: Keep the name as-is
fr:
  title: Renommer l'espace **{workspace}**
  text: Renommer l'espace changera l'URL de l'espace. Cela signifie que **{workspace}** ne sera plus une URL valide. Assurez-vous d'être certain de cette action avant de continuer.
  input.name.label: Définir le nouveau nom de l'espace
  button.confirm: Je comprends, renommer l'espace
  button.cancel: Conserver le nom tel quel
de:
  title: Benennen Sie das Projekt **{workspace}** um
  text: Durch das Umbenennen des Projekts wird die Projekt-URL und der Projektname geändert. Das bedeutet, dass **{workspace}** keine gültige URL mehr sein wird. Stellen Sie sicher, dass Sie sich dieser Aktion sicher sind, bevor Sie fortfahren.
  input.name.label: Definieren Sie den neuen Projektnamen
  button.confirm: Ich verstehe, benenne das Projekt um
  button.cancel: Behalte den Namen wie er ist
es:
  title: Renombrar el espacio **{workspace}**
  text: Al renombrar el espacio, se cambiará la URL del espacio. Esto significa que **{workspace}** ya no será una URL válida. Asegúrate de estar seguro de esta acción antes de continuar.
  input.name.label: Define el nuevo nombre del espacio
  button.confirm: Entiendo, renombrar el espacio
  button.cancel: Mantener el nombre tal cual
zh:
  title: 重命名 **{workspace}** 工作区
  text: 重命名工作区将更改工作区 URL。这意味着 **{workspace}** 将不再是有效的 URL。在继续之前，请确保您对此操作有把握。
  input.name.label: 定义新工作区名称
  button.confirm: 我明白，重命名工作区
  button.cancel: 保持名称不变
</i18n>
