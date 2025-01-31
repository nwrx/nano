<script setup lang="ts">
import type { ProjectPermission } from '@nwrx/nano-api'

const props = defineProps<{
  modelValue?: boolean
  workspace?: string
  project?: string
  title?: string
  username?: string
  userDisplayName?: string
  permissions?: ProjectPermission[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [value: ProjectPermission[]]
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })
const role = ref<ProjectPermission>('Read')
const access = ref<ProjectPermission[]>([])

const { t } = useI18n()

watch(() => props.permissions, (permissions) => {
  if (!permissions) return
  role.value = permissions.find(x => ['Read', 'Write', 'Owner'].includes(x)) ?? 'Read'
  access.value = permissions.filter(x => !['Read', 'Write', 'Owner'].includes(x))
}, { immediate: true })
</script>

<template>
  <AppDialog
    v-model="model"
    icon="i-carbon:label"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { userDisplayName })"
    :text="t('text')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => emit('submit', [role, ...access])">

    <div class="space-y-4">
      <AppDialogToggle
        v-model="role"
        value="Owner"
        :label="t('owner.label')"
        :text="t('owner.text')"
        type="radio"
      />
      <AppDialogToggle
        v-model="role"
        value="Write"
        :label="t('editor.label')"
        :text="t('editor.text')"
        type="radio"
      />
      <AppDialogToggle
        v-model="role"
        value="Read"
        :label="t('member.label')"
        :text="t('member.text')"
        type="radio"
      />
    </div>

    <!-- Access -->
    <div class="space-y-4 mt-8 pt-8 border-t border-app">
      <AppDialogToggle
        v-model="access"
        value="WriteVariables"
        :label="t('variables.label')"
        :text="t('variables.text')"
        type="checkbox"
      />
      <AppDialogToggle
        v-model="access"
        value="WriteSecrets"
        :label="t('secrets.label')"
        :text="t('secrets.text')"
        type="checkbox"
      />
      <AppDialogToggle
        v-model="access"
        value="WriteApiKeys"
        :label="t('apiKeys.label')"
        :text="t('apiKeys.text')"
        type="checkbox"
      />
    </div>
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Manage project access of for **{userDisplayName}**
  text: Members with the **Owner** role have full access to the project, including the ability to manage the project settings and members of the project. Be careful when assigning this role to a team member.
  owner.label: Owner
  owner.text: Gives full access to the project, including the ability to manage members.
  editor.label: Editor
  editor.text: Can access and edit the project settings and the flows.
  member.label: Member
  member.text: Can view the project, flows, and the variables but cannot edit them.
  variables.label: Variables
  variables.text: Can view and edit the variables of the project.
  secrets.label: Secrets
  secrets.text: Can edit the secrets of the project.
  apiKeys.label: API Keys
  apiKeys.text: Can create API keys to access the project from external services.
  confirm: Apply permissions
  cancel: Keep the current permissions
fr:
  title: Gérer l'accès au projet pour **{userDisplayName}**
  text: Les membres avec le rôle **Propriétaire** ont un accès complet au projet, y compris la possibilité de gérer les paramètres du projet et les membres du projet. Soyez prudent lors de l'attribution de ce rôle à un membre de l'équipe.
  owner.label: Propriétaire
  owner.text: Donne un accès complet au projet, y compris la possibilité de gérer les membres.
  editor.label: Éditeur
  editor.text: Peut accéder et modifier les paramètres du projet et les flux.
  member.label: Membre
  member.text: Peut voir le projet, les flux et les variables mais ne peut pas les modifier.
  variables.label: Variables
  variables.text: Peut voir et modifier les variables du projet.
  secrets.label: Secrets
  secrets.text: Peut modifier les secrets du projet.
  apiKeys.label: Clés API
  apiKeys.text: Peut créer des clés API pour accéder au projet depuis des services externes.
  confirm: Appliquer les permissions
  cancel: Conserver les autorisations actuelles
de:
  title: Projektzugriff für **{userDisplayName}** verwalten
  text: Mitglieder mit der Rolle **Eigentümer** haben vollen Zugriff auf das Projekt, einschließlich der Möglichkeit, die Projekteinstellungen und Mitglieder des Projekts zu verwalten. Seien Sie vorsichtig, wenn Sie diese Rolle einem Teammitglied zuweisen.
  owner.label: Eigentümer
  owner.text: Gibt vollen Zugriff auf das Projekt, einschließlich der Möglichkeit, Mitglieder zu verwalten.
  editor.label: Redakteur
  editor.text: Kann auf die Projekteinstellungen und die Flows zugreifen und diese bearbeiten.
  member.label: Mitglied
  member.text: Kann das Projekt, die Flows und die Variablen anzeigen, aber nicht bearbeiten.
  variables.label: Variablen
  variables.text: Kann die Variablen des Projekts anzeigen und bearbeiten.
  secrets.label: Geheimnisse
  secrets.text: Kann die Geheimnisse des Projekts bearbeiten.
  apiKeys.label: API-Schlüssel
  apiKeys.text: Kann API-Schlüssel erstellen, um von externen Diensten auf das Projekt zuzugreifen.
  confirm: Berechtigungen anwenden
  cancel: Aktuelle Berechtigungen beibehalten
es:
  title: Gestionar el acceso al proyecto para **{userDisplayName}**
  text: Los miembros con el rol de **Propietario** tienen acceso completo al proyecto, incluida la capacidad de gestionar la configuración del proyecto y los miembros del proyecto. Tenga cuidado al asignar este rol a un miembro del equipo.
  owner.label: Propietario
  owner.text: Da acceso completo al proyecto, incluida la capacidad de gestionar miembros.
  editor.label: Editor
  editor.text: Puede acceder y editar la configuración del proyecto y los flujos.
  member.label: Miembro
  member.text: Puede ver el proyecto, los flujos y las variables, pero no puede editarlos.
  variables.label: Variables
  variables.text: Puede ver y editar las variables del proyecto.
  secrets.label: Secretos
  secrets.text: Puede editar los secretos del proyecto.
  apiKeys.label: Claves API
  apiKeys.text: Puede crear claves API para acceder al proyecto desde servicios externos.
  confirm: Aplicar permisos
  cancel: Mantener los permisos actuales
zh:
  title: 管理 **{userDisplayName}** 的项目访问权限
  text: 拥有 **所有者** 角色的成员对项目拥有完全访问权限，包括管理项目设置和项目成员的能力。分配此角色给团队成员时请小心。
  owner.label: 所有者
  owner.text: 赋予对项目的完全访问权限，包括管理成员的能力。
  editor.label: 编辑者
  editor.text: 可以访问和编辑项目设置和流程。
  member.label: 成员
  member.text: 可以查看项目、流程和变量，但不能编辑它们。
  variables.label: 变量
  variables.text: 可以查看和编辑项目的变量。
  secrets.label: 秘密
  secrets.text: 可以编辑项目的秘密。
  apiKeys.label: API 密钥
  apiKeys.text: 可以创建 API 密钥以从外部服务访问项目。
  confirm: 应用权限
  cancel: 保留当前权限
</i18n>
