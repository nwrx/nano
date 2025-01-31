<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
  title: string
}>()

const emit = defineEmits<{
  'submit': [value: string]
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
const name = ref('')
</script>

<template>
  <AppDialog
    v-model="model"
    icon="i-carbon:label"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { title })"
    :text="t('text', { workspace, project })"
    :label-cancel="t('button.cancel')"
    :label-confirm="t('button.confirm')"
    @confirm="() => emit('submit', name)">

    <!-- Confirmation input -->
    <InputText
      v-model="name"
      class="mt-2"
      :text-before="`api.nwrx.io/${workspace}/`"
      :placeholder="t('input.name.label')"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Rename the **{title}** project
  text: Renaming the project will change the project URL and the project name. Meaning that **{workspace}/{project}** won't be a valid URL anymore. Make sure you are certain of this action before continuing.
  input.name.label: Define the new project name0
  button.confirm: I understand, rename the project
  button.cancel: Keep the name as-is
fr:
  title: Renommer le projet **{title}**
  text: Renommer le projet changera l'URL du projet et le nom du projet. Cela signifie que **{workspace}/{project}** ne sera plus une URL valide. Assurez-vous d'être certain de cette action avant de continuer.
  input.name.label: Définir le nouveau nom du projet
  button.confirm: Je comprends, renommer le projet
  button.cancel: Conserver le nom tel quel
de:
  title: Benenne das Projekt **{title}** um
  text: Durch das Umbenennen des Projekts wird die Projekt-URL und der Projektname geändert. Das bedeutet, dass **{workspace}/{project}** keine gültige URL mehr sein wird. Stellen Sie sicher, dass Sie sich dieser Aktion sicher sind, bevor Sie fortfahren.
  input.name.label: Definieren Sie den neuen Projektnamen
  button.confirm: Ich verstehe, benenne das Projekt um
  button.cancel: Behalte den Namen wie er ist
es:
  title: Renombrar el proyecto **{title}**
  text: Renombrar el proyecto cambiará la URL del proyecto y el nombre del proyecto. Lo que significa que **{workspace}/{project}** ya no será una URL válida. Asegúrate de estar seguro de esta acción antes de continuar.
  input.name.label: Define el nuevo nombre del proyecto
  button.confirm: Entiendo, renombrar el proyecto
  button.cancel: Mantener el nombre tal cual
zh:
  title: 重命名项目 **{title}**
  text: 重命名项目将更改项目的 URL 和项目名称。这意味着 **{workspace}/{project}** 将不再是有效的 URL。在继续之前，请确保您对此操作有把握。
  input.name.label: 定义新项目名称
  button.confirm: 我明白，重命名项目
  button.cancel: 保留名称不变
</i18n>
