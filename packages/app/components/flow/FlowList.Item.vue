<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { FlowObject } from '@nwrx/nano-api'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import UserAudit from '~/components/user/UserAudit.vue'
import { useFlow } from '~/composables/useFlow'
import Hyperlink from '../base/Hyperlink.vue'
import FlowActions from './FlowActions.vue'

const props = defineProps<{
  workspace: string
  project: string
  flow: FlowObject
}>()

const { links } = useFlow({
  workspace: props.workspace,
  project: props.project,
  name: props.flow.name,
})
</script>

<template>
  <div
    class="
      flex items-center justify-between h-9 px-md space-x-md
      bg-subtle hover:bg-emphasized last:rd-b first:rd-t
       b b-app hover:b-emphasized transition group
       not-last:b-b-transparent hover:not-last:b-b-emphasized
    ">

    <!-- Status Dot -->
    <BaseIcon
      icon="i-carbon:dot-mark"
      class="size-4 text-success"
    />

    <!-- Icon -->
    <!--
      <BaseIcon
      icon="i-carbon:flow"
      class="size-4 text-app"
      />
    -->

    <!-- Left - Name & Description -->
    <div class="flex gap-md w-full">
      <Hyperlink
        :to="links.editor"
        :label="flow.title || flow.name"
        class="text-sm text-left font-semibold text-app line-clamp-1 shrink-0"
      />

      <!-- Description -->
      <p class="text-sm text-subtle text-left line-clamp-1 shrink">
        {{ flow.description }}
      </p>

      <!-- Status -->
      <!-- <ProjectFlowBadges v-bind="props" /> -->
    </div>

    <!-- Right - Statistics -->
    <div class="flex items-center justify-center space-x-md shrink-0">
      <!--
        <div class="flex divide-x divide-app grow lt-md:hidden">
        <ProjectListItemStatistic
        v-for="(statistic, key) in statistics"
        :key="key"
        :name="key"
        :trend="statistic.trend"
        :value="statistic.value"
        class="not-first:pl-lg not-last:pr-lg"
        />
        </div>
      -->

      <!-- User -->
      <UserAudit
        class="shrink-0 op-0 group-hover:op-100 transition"
        :created-by="flow.createdBy"
        :created-at="flow.createdAt"
        :updated-by="flow.updatedBy"
        :updated-at="flow.updatedAt"
        inline
      />

      <!-- CTA -->
      <FlowActions
        compact
        class="shrink-0 op-0 group-hover:op-100 transition"
        :workspace="workspace"
        :project="project"
        :name="flow.name"
      />
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  menu.chat: Chat
  menu.edit: Edit
  menu.delete: Delete
  menu.duplicate: Duplicate
  menu.export: Export
  menu.publish: Publish
  menu.settings: Settings
fr:
  menu.chat: Chat
  menu.edit: Modifier
  menu.delete: Supprimer
  menu.duplicate: Dupliquer
  menu.export: Exporter
  menu.publish: Publier
  menu.settings: Paramètres
de:
  menu.chat: Chat
  menu.edit: Bearbeiten
  menu.delete: Löschen
  menu.duplicate: Duplizieren
  menu.export: Exportieren
  menu.publish: Veröffentlichen
  menu.settings: Einstellungen
es:
  menu.chat: Chat
  menu.edit: Editar
  menu.delete: Eliminar
  menu.duplicate: Duplicar
  menu.export: Exportar
  menu.publish: Publicar
  menu.settings: Ajustes
zh:
  menu.chat: Chat
  menu.edit: 编辑
  menu.delete: 删除
  menu.duplicate: 复制
  menu.export: 导出
  menu.publish: 发布
  menu.settings: 设置
</i18n>
