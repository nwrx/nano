<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'

const props = defineProps<{
  workspace: string
  project: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- State.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const name = ref('')
const isOpen = defineModel({ default: false })
watch(isOpen, () => { name.value = props.project }, { immediate: true })

async function renameProject() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project/name', {
    parameters: {
      workspace: props.workspace,
      project: props.project,
    },
    body: {
      name: name.value,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success', { workspace: props.workspace, project: name.value }))
    },
  })
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:label"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace, project })"
    :text="t('text', { workspace, project })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => renameProject()">

    <!-- Input for new project name -->
    <InputText
      v-model="name"
      class="mt-2"
      :text-before="`${CONSTANTS.appHost}/${workspace}/`"
      :placeholder="t('nameLabel')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Rename project **{workspace}/{project}**
  text: Renaming your project will update its URL and may break existing integrations. Ensure you communicate this change to your team and update any dependent services.
  cancel: Cancel
  confirm: Rename
  nameLabel: Enter new project name
  success: Project **{workspace}/{project}** has been renamed.
fr:
  title: Renommer le projet **{workspace}/{project}**
  text: Le renommage de votre projet mettra à jour son URL et pourrait interrompre les intégrations existantes. Assurez-vous de communiquer ce changement à votre équipe et de mettre à jour les services dépendants.
  cancel: Annuler
  confirm: Renommer
  nameLabel: Saisissez le nouveau nom du projet
  success: Le projet **{workspace}/{project}** a été renommé.
de:
  title: Projekt **{workspace}/{project}** umbenennen
  text: Die Umbenennung Ihres Projekts aktualisiert dessen URL und kann bestehende Integrationen unterbrechen. Stellen Sie sicher, dass Sie diese Änderung Ihrem Team mitteilen und abhängige Dienste aktualisieren.
  cancel: Abbrechen
  confirm: Umbenennen
  nameLabel: Neuen Projektnamen eingeben
  success: Projekt **{workspace}/{project}** wurde umbenannt.
es:
  title: Renombrar proyecto **{workspace}/{project}**
  text: Renombrar su proyecto actualizará su URL y puede interrumpir integraciones existentes. Asegúrese de comunicar este cambio a su equipo y actualizar cualquier servicio dependiente.
  cancel: Cancelar
  confirm: Renombrar
  nameLabel: Ingrese el nuevo nombre del proyecto
  success: El proyecto **{workspace}/{project}** ha sido renombrado.
zh:
  title: 重命名项目 **{workspace}/{project}**
  text: 重命名项目将更新其URL，并可能破坏现有集成。请确保向团队传达此更改，并更新任何依赖的服务。
  cancel: 取消
  confirm: 重命名
  nameLabel: 输入新的项目名称
  success: 项目 **{workspace}/{project}** 已被重命名。
</i18n>
