<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
  title?: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

const { t } = useI18n({ useScope: 'local' })
const slug = computed(() => `${props.workspace}/${props.project}`)
const model = useVModel(props, 'modelValue', emit, { passive: true })
const confirm = ref('')
</script>

<template>
  <AppDialog
    v-model="model"
    icon="i-carbon:trash-can"
    class-hint="hint-danger"
    :title="t('title', { title: title || project, slug })"
    :text="t('hint', { slug })"
    :labelCancel="t('cancel')"
    :labelConfirm="t('confirm')"
    :disabled="confirm !== slug"
    @confirm="() => emit('submit')">

    <!-- Confirmation input -->
    <InputText
      v-model="confirm"
      :label="t('message')"
      :placeholder="slug"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
  en:
    title: Delete the **{title}** project?
    hint: You are about to delete the project. This action is irreversible and will permanently delete all data associated with the project. Please confirm that you understand the consequences of this action.
    message: Confirm by typing the project name below.
    cancel: Keep the project
    confirm: I understand, delete the project
  fr:
    title: Supprimer le projet **{title}** ?
    hint: Vous êtes sur le point de supprimer le projet. Cette action est irréversible et supprimera définitivement toutes les données associées au projet. Veuillez confirmer que vous comprenez les conséquences de cette action.
    message: Confirmez en tapant le nom du projet ci-dessous.
    cancel: Conserver le projet
    confirm: Je comprends, supprimer le projet
  de:
    title: Löschen des Projekts **{title}**?
    hint: Sie sind dabei, das Projekt zu löschen. Diese Aktion ist nicht rückgängig zu machen und löscht alle mit dem Projekt verbundenen Daten dauerhaft. Bitte bestätigen Sie, dass Sie die Konsequenzen dieser Aktion verstehen.
    message: Bestätigen Sie, indem Sie den Projektnamen unten eingeben.
    cancel: Projekt behalten
    confirm: Ich verstehe, das Projekt löschen
  es:
    title: ¿Eliminar el proyecto **{title}**?
    hint: Estás a punto de eliminar el proyecto. Esta acción es irreversible y eliminará permanentemente todos los datos asociados con el proyecto. Por favor, confirma que entiendes las consecuencias de esta acción.
    message: Confirma escribiendo el nombre del proyecto a continuación.
    cancel: Mantener el proyecto
    confirm: Entiendo, eliminar el proyecto
  zh:
    title: 删除项目 **{title}**？
    hint: 您即将删除项目。此操作是不可逆的，将永久删除与项目关联的所有数据。请确认您理解此操作的后果。
    message: 通过在下面输入项目名称来确认。
    cancel: 保留项目
    confirm: 我明白，删除项目
</i18n>
