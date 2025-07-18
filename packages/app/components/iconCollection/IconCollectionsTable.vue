<script setup lang="ts">
import { toCamelCase } from '@unshared/string/toCamelCase'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Button from '~/components/base/Button.vue'
import Table from '~/components/base/Table.vue'
import UserAudit from '~/components/user/UserAudit.vue'
import { useIconCollections } from '~/composables/useIcon'
import IconCollectionActions from './IconCollectionActions.vue'
import IconCollectionBadge from './IconCollectionBadge.vue'
import IconCollectionTableCard from './IconCollectionsTable.Card.vue'

// --- State.
const { t } = useI18n()
const collections = useIconCollections()
collections.options.page = 0
collections.options.limit = 16
collections.options.withIconsCount = true
collections.options.withCreatedBy = true
collections.options.withUpdatedBy = true
collections.options.withDisabledBy = true

onMounted(() => {
  void collections.searchCollections(true)
  void collections.subscribeToEvents()
})

watchThrottled(
  () => collections.options.search,
  () => collections.searchCollections(),
  { throttle: 100 },
)

onBeforeRouteLeave(() => {
  void collections.unsubscribeFromEvents()
})
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('text')">

    <!-- Table -->
    <Table
      v-model:search="collections.options.search"
      show-search
      :rows="collections.data"
      :columns="['name', 'status', 'metadata', 'actions']"
      @load-more="() => collections.loadMoreCollections()">

      <!-- Header -->
      <template #header="name">
        {{ t(toCamelCase('header', name)) }}
      </template>

      <!-- Name -->
      <template #cell.name="collection">
        <IconCollectionTableCard :collection="collection" />
      </template>

      <!-- Status -->
      <template #cell.status="collection">
        <div class="flex flex-col items-start space-y-xs">
          <IconCollectionBadge :collection="collection" />
          <div class="flex items-center space-x-xs text-xs font-normal text-subtle">
            <span>{{ collection.iconCountInstalled }}</span>
            <span>/</span>
            <span>{{ collection.iconCountTotal }}</span>
          </div>
        </div>
      </template>

      <!-- Metadata -->
      <template #cell.metadata="collection">
        <UserAudit
          :created-at="collection.createdAt"
          :created-by="collection.createdBy"
          :updated-at="collection.updatedAt"
          :updated-by="collection.updatedBy"
          :disabled-at="collection.disabledAt"
          :disabled-by="collection.disabledBy"
        />
      </template>

      <!-- Actions -->
      <template #cell.actions="collection">
        <IconCollectionActions
          :key="collection.name"
          :collection="collection"
        />
      </template>
    </Table>

    <div class="flex items-center justify-between">

      <!-- Refresh button -->
      <Button
        icon="i-carbon:download"
        variant="secondary"
        :label="t('refreshCollections')"
        @click="() => collections.refreshCollections()"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Icon Library
  text: Explore, install, and manage comprehensive icon collections for your users. Enable your users to add visual flair to their projects and records by providing professionally curated icon sets. Browse available collections, monitor installation progress, and ensure your users have access to the icons they need for better visual organization and customization.
  headerName: Collection
  headerStatus: Status & Progress
  headerMetadata: ''
  headerActions: ''
  refreshCollections: Refresh Collections
fr:
  title: Bibliothèque d'Icônes
  text: Explorez, installez et gérez des collections d'icônes complètes pour vos utilisateurs. Permettez à vos utilisateurs d'ajouter une touche visuelle à leurs projets et enregistrements en fournissant des ensembles d'icônes professionnellement sélectionnés. Parcourez les collections disponibles, surveillez les progrès d'installation et assurez-vous que vos utilisateurs ont accès aux icônes dont ils ont besoin pour une meilleure organisation visuelle et personnalisation.
  headerName: Collection
  headerStatus: Statut et Progression
  headerMetadata: ''
  headerActions: ''
  refreshCollections: Actualiser les Collections
de:
  title: Icon-Bibliothek
  text: Erkunden, installieren und verwalten Sie umfassende Icon-Sammlungen für Ihre Benutzer. Ermöglichen Sie Ihren Benutzern, ihren Projekten und Datensätzen visuellen Charme zu verleihen, indem Sie professionell kuratierte Icon-Sets bereitstellen. Durchsuchen Sie verfügbare Sammlungen, überwachen Sie Installationsfortschritte und stellen Sie sicher, dass Ihre Benutzer Zugang zu den Icons haben, die sie für bessere visuelle Organisation und Anpassung benötigen.
  headerName: Sammlung
  headerStatus: Status & Fortschritt
  headerMetadata: ''
  headerActions: ''
  refreshCollections: Sammlungen Aktualisieren
es:
  title: Biblioteca de Iconos
  text: Explora, instala y gestiona colecciones completas de iconos para tus usuarios. Permite a tus usuarios añadir atractivo visual a sus proyectos y registros proporcionando conjuntos de iconos profesionalmente seleccionados. Navega por las colecciones disponibles, monitorea el progreso de instalación y asegúrate de que tus usuarios tengan acceso a los iconos que necesitan para mejor organización visual y personalización.
  headerName: Colección
  headerStatus: Estado y Progreso
  headerMetadata: ''
  headerActions: ''
  refreshCollections: Actualizar Colecciones
zh:
  title: 图标库
  text: 为您的用户探索、安装和管理全面的图标集合。通过提供专业策划的图标集，让您的用户能够为他们的项目和记录添加视觉魅力。浏览可用的集合、监控安装进度，并确保您的用户能够访问他们所需的图标，以实现更好的视觉组织和定制化。
  headerName: 集合
  headerStatus: 状态与进度
  headerMetadata: ''
  headerActions: ''
  refreshCollections: 刷新集合
</i18n>
