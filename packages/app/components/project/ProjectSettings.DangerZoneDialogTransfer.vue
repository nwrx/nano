<script setup lang="ts">
import type { UserObject } from '@nwrx/api'

const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
  title: string
  searchUsers: (search: string) => Promise<UserObject[]>
}>()

const emit = defineEmits<{
  'submit': [value: string]
}>()

const { t } = useI18n()
const search = ref('')
const model = useVModel(props, 'modelValue', emit, { passive: true })
const items = ref<UserObject[]>([])
const username = ref<string>()

watch(search, async() => {
  if (!search.value) return
  const users = await props.searchUsers(search.value)
  items.value = users
}, { immediate: true })
</script>

<template>
  <AppDialog
    v-model="model"
    icon="i-carbon:warning"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { title })"
    :text="t('text', { workspace, project })"
    :label-cancel="t('button.cancel')"
    :label-confirm="t('button.confirm')"
    @return="() => emit('submit', username!)">

    <!-- Search -->
    <InputText
      v-model="search"
      class="mt-2"
      :label="t('search.label')"
    />

    <!-- Results -->
    <BaseCollapse vertical as="div" is-open class="transition-all mt-4 w-full">
      <div v-for="item in items" :key="item.username">
        <div class="flex items-center justify-start space-x-4 px-2 py-4 w-full">
          <img
            :src="item.avatarUrl"
            class="w-12 h-12 rounded-full">
          <div class="text-sm grow-1">
            <p class="font-medium">
              {{ item.displayName }}
            </p>
            <p class="text-sm">
              {{ item.username }}
            </p>
          </div>
          <Button
            :label="t('button.select')"
            link
            icon-append="i-carbon:add"
            size="sm"
            @click="() => username = item.username"
          />
        </div>
      </div>
    </BaseCollapse>
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Transfer the **{title}** project
  text: You are about to transfer the project to another user. By doing so, the URL **{workspace}/{project}** won't be valid anymore and this could cause issues with existing integrations. Make sure you are certain of this action before continuing.
  search.label: Select the new project owner by searching for their username.
  button.cancel: Don't transfer
  button.confirm: I understand, transfer the project
  button.select: Select
fr:
  title: Transférer le projet **{title}**
  text: Vous êtes sur le point de transférer le projet à un autre utilisateur. Ce faisant, l'URL **{workspace}/{project}** ne sera plus valide et cela pourrait poser des problèmes avec les intégrations existantes. Assurez-vous d'être certain de cette action avant de continuer.
  search.label: Sélectionnez le nouveau propriétaire du projet en recherchant son nom d'utilisateur.
  button.cancel: Ne pas transférer
  button.confirm: Je comprends, transférer le projet
  button.select: Sélectionner
de:
  title: Übertragen Sie das Projekt **{title}**
  text: Sie sind dabei, das Projekt einem anderen Benutzer zu übertragen. Dadurch wird die URL **{workspace}/{project}** nicht mehr gültig sein und dies könnte Probleme mit bestehenden Integrationen verursachen. Stellen Sie sicher, dass Sie sich dieser Aktion sicher sind, bevor Sie fortfahren.
  search.label: Wählen Sie den neuen Projekteigentümer aus, indem Sie nach seinem Benutzernamen suchen.
  button.cancel: Nicht übertragen
  button.confirm: Ich verstehe, übertragen Sie das Projekt
  button.select: Auswählen
es:
  title: Transferir el proyecto **{title}**
  text: Estás a punto de transferir el proyecto a otro usuario. Al hacerlo, la URL **{workspace}/{project}** ya no será válida y esto podría causar problemas con las integraciones existentes. Asegúrate de estar seguro de esta acción antes de continuar.
  search.label: Seleccione el nuevo propietario del proyecto buscando su nombre de usuario.
  button.cancel: No transferir
  button.confirm: Entiendo, transferir el proyecto
  button.select: Seleccionar
zh:
  title: 转移项目 **{title}**
  text: 您即将将项目转移给另一个用户。这样做后，URL **{workspace}/{project}** 将不再有效，这可能会导致现有集成出现问题。在继续之前，请确保您对此操作有把握。
  search.label: 通过搜索其用户名来选择新的项目所有者。
  button.cancel: 不要转移
  button.confirm: 我明白，转移项目
  button.select: 选择
</i18n>
