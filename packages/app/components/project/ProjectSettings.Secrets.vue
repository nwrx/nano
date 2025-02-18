<script setup lang="ts">
import type { ProjectSecretObject } from '@nwrx/nano-api'

const props = defineProps<{
  workspace: string
  project: string
  secrets?: ProjectSecretObject[]
}>()

const emit = defineEmits<{
  'submitCreate': [name: string, value: string]
  'submitUpdate': [name: string, value: string]
  'submitDelete': [name: string]
}>()

const { t } = useI18n()
const secrets = useVModel(props, 'secrets', emit, { passive: true })
const isDialogCreateOpen = ref(false)
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('text')">

    <!-- Secrets List -->
    <div class="w-full b b-app rd">
      <BaseTable
        :columns="['name', 'stats', 'actions']"
        class="w-full"
        class-cell="px-8 py-2"
        class-header="bg-subtle"
        class-row="b-t b-app hover:bg-subtle"
        :rows="secrets">

        <!-- Header -->
        <template #header="name">
          <div class="w-full font-medium px-lg py-sm text-sm text-start">
            {{ t(`header.${name}`) }}
          </div>
        </template>

        <!-- Cell / Name -->
        <template #cell.name="{ name }">
          <div class="flex items-center justify-start space-x-md font-normal">
            <Badge
              size="small"
              :label="name"
              icon="i-carbon:rule-locked"
              class="font-mono"
            />
          </div>
        </template>

        <!-- Cell / Stats -->
        <template #cell.stats="{ createdAt }">
          <div class="text-xs text-subtle">
            {{ t('createdAt') }} {{ formatDate(createdAt) }}
          </div>
          <div class="text-sm">
            {{ formatDateFromNow(createdAt) }}
          </div>
        </template>

        <!-- Cell / Actions -->
        <template #cell.actions="{ name }">
          <ProjectSettingsSecretsActions
            :workspace="workspace"
            :project="project"
            :name="name"
            @submit-update="(value) => emit('submitUpdate', name, value)"
            @submit-delete="() => emit('submitDelete', name)"
          />
        </template>
      </BaseTable>
    </div>

    <!-- Create Button -->
    <Hyperlink
      eager
      class="text-sm ml-auto mb-4"
      icon="i-carbon:add"
      icon-append="i-carbon:chevron-right"
      :label="t('create')"
      @click="() => isDialogCreateOpen = true"
    />

    <!-- Create Dialog -->
    <ProjectSettingsSecretsDialogCreate
      v-model="isDialogCreateOpen"
      :workspace="workspace"
      :project="project"
      @submit="(name, value) => emit('submitCreate', name, value)"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  header.name: Secret Name
  header.stats: ''
  header.actions: ''
  title: Secrets
  text: Secrets are key-value pairs that can be used in your flows. They can be used to store sensitive information that is shared across multiple flows. You can create, update, and delete secrets here.
  createdAt: Created on {createdAt}
  create: Create Secret
fr:
  header.name: Nom du secret
  header.stats: ''
  header.actions: ''
  title: Secrets
  text: Les secrets sont des paires clé-valeur qui peuvent être utilisées dans vos flux. Elles peuvent être utilisées pour stocker des informations sensibles partagées entre plusieurs flux. Vous pouvez créer, mettre à jour et supprimer des secrets ici.
  createdAt: Créé le {createdAt}
  create: Créer un secret
de:
  header.name: Geheimnisname
  header.stats: ''
  header.actions: ''
  title: Geheimnisse
  text: Geheimnisse sind Schlüssel-Wert-Paare, die in Ihren Flows verwendet werden können. Sie können verwendet werden, um sensible Informationen zu speichern, die in mehreren Flows gemeinsam genutzt werden. Sie können hier Geheimnisse erstellen, aktualisieren und löschen.
  createdAt: Erstellt am {createdAt}
  create: Geheimnis erstellen
es:
  header.name: Nombre del secreto
  header.stats: ''
  header.actions: ''
  title: Secretos
  text: Los secretos son pares clave-valor que se pueden utilizar en sus flujos. Se pueden utilizar para almacenar información sensible que se comparte entre varios flujos. Puede crear, actualizar y eliminar secretos aquí.
  createdAt: Creado el {createdAt}
  create: Crear secreto
zh:
  header.name: 秘密名称
  header.stats: ''
  header.actions: ''
  title: 秘密
  text: 秘密是可以在您的流程中使用的键值对。它们可用于存储在多个流程之间共享的敏感信息。您可以在此处创建、更新和删除秘密。
  createdAt: 创建于 {createdAt}
  create: 创建秘密
</i18n>
