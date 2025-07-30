<script setup lang="ts">
import InputList from '~/components/base/InputList.vue'
import InputText from '~/components/base/InputText.vue'

const { t } = useI18n()
const search = defineModel('search', { default: '' })
const sortBy = defineModel('sortBy', { default: 'name' })
const sortDirection = defineModel('sortDirection', { default: 'ASC' })
const showCreateDialog = defineModel('showCreateDialog', { default: false })

const SORT_BY_OPTIONS = [
  { value: 'name', label: 'sortByName', icon: 'i-carbon:label' },
  { value: 'title', label: 'sortByTitle', icon: 'i-carbon:label' },
  { value: 'createdAt', label: 'sortByCreatedAt', icon: 'i-carbon:calendar' },
  { value: 'updatedAt', label: 'sortByUpdatedAt', icon: 'i-carbon:calendar' },
]

const SORT_DIRECTION_OPTIONS = [
  { value: 'ASC', label: 'sortAsc', icon: 'i-carbon:sort-ascending' },
  { value: 'DESC', label: 'sortDesc', icon: 'i-carbon:sort-descending' },
]

const sortByIcon = computed(() => {
  const option = SORT_BY_OPTIONS.find(x => x.value === sortBy.value)
  return option ? option.icon : 'i-carbon:label'
})

const sortDirectionIcon = computed(() => {
  const option = SORT_DIRECTION_OPTIONS.find(x => x.value === sortDirection.value)
  return option ? option.icon : 'i-carbon:sort-ascending'
})
</script>

<template>
  <div class="flex flex-col sm:flex-row items-start gap-4">
    <!-- Search -->
    <InputText
      v-model="search"
      :placeholder="t('searchProjects')"
      icon="i-carbon:search"
      class="w-full max-w-xs"
    />

    <!-- Sort By -->
    <InputList
      v-model="sortBy"
      :options="SORT_BY_OPTIONS"
      :placeholder="t('sortBy')"
      class="w-full max-w-48"
      :icon="sortByIcon"
      subtle
      :option-label="(option) => t(option.label)"
      :option-value="(option) => option.value"
      :option-icon="(option) => option.icon"
    />

    <!-- Sort Direction -->
    <InputList
      v-model="sortDirection"
      :options="SORT_DIRECTION_OPTIONS"
      :placeholder="t('sortDirection')"
      class="w-full max-w-48"
      :icon="sortDirectionIcon"
      subtle
      :option-label="(option) => t(option.label)"
      :option-value="(option) => option.value"
      :option-icon="(option) => option.icon"
    />

    <!-- Spacer -->
    <div class="grow" />

    <!-- Create new -->
    <Button
      class="button-success"
      icon-append="i-carbon:chevron-right"
      icon-expand
      :label="t('createNewProject')"
      @click="() => showCreateDialog = true"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  searchProjects: Find a projects...
  createNewProject: Create a new Project
  sortBy: Sort By
  sortByName: Name
  sortByTitle: Title
  sortByCreatedAt: Created At
  sortByUpdatedAt: Updated At
  sortAsc: Ascending
  sortDesc: Descending
fr:
  searchProjects: Trouver un projet...
  createNewProject: Créer un nouveau projet
  sortBy: Trier par
  sortByName: Nom
  sortByTitle: Titre
  sortByCreatedAt: Créé le
  sortByUpdatedAt: Mis à jour le
  sortAsc: Ascendant
  sortDesc: Descendant
de:
  searchProjects: Projekte finden...
  createNewProject: Neues Projekt erstellen
  sortBy: Sortieren nach
  sortByName: Name
  sortByTitle: Titel
  sortByCreatedAt: Erstellt am
  sortByUpdatedAt: Aktualisiert am
  sortAsc: Aufsteigend
  sortDesc: Absteigend
es:
  searchProjects: Encontrar un proyecto...
  createNewProject: Crear un nuevo proyecto
  sortBy: Ordenar por
  sortByName: Nombre
  sortByTitle: Título
  sortByCreatedAt: Creado el
  sortByUpdatedAt: Actualizado el
  sortAsc: Ascendente
  sortDesc: Descendente
zh:
  searchProjects: 查找项目...
  createNewProject: 创建新项目
  sortBy: 排序方式
  sortByName: 名称
  sortByTitle: 标题
  sortByCreatedAt: 创建时间
  sortByUpdatedAt: 更新时间
  sortAsc: 升序
  sortDesc: 降序
</i18n>
