<script setup lang="ts">
import UserAvatar from './UserAvatar.vue'

const props = defineProps<{
  inline?: boolean
  createdAt?: string
  createdBy?: { username: string }
  updatedAt?: string
  updatedBy?: { username: string }
  disabledAt?: string
  disabledBy?: { username: string }
}>()

const { t } = useI18n()
const classAvatar = computed(() => ({
  'size-6 rd-full': props.inline,
  'size-8 rd-full': !props.inline,
}))

const classText = computed(() => ({
  'text-xs font-normal text-subtle line-clamp-1 text-end': !props.inline,
  'hidden': props.inline,
}))

const classDate = computed(() => ({
  'text-xs font-normal text-app line-clamp-1': !props.inline,
  'text-sm font-normal text-app': props.inline,
}))

const classTextContainer = computed(() => ({
  'flex flex-col items-end': !props.inline,
  'flex items-center space-x-1': props.inline,
}))
</script>

<template>
  <div class="flex justify-end items-center space-x-sm">

    <!-- Disabled By -->
    <template v-if="disabledAt && disabledBy">
      <div :class="classTextContainer">
        <span :class="classText">{{ t('disabledAt') }}</span>
        <span :class="classDate"> {{ formatDateFromNow(disabledAt) }}</span>
      </div>
      <UserAvatar
        v-if="disabledBy"
        :class="classAvatar"
        :username="disabledBy.username"
      />
    </template>

    <!-- Updated By -->
    <template v-else-if="updatedAt && updatedBy">
      <div :class="classTextContainer">
        <span :class="classText">{{ t('updatedAt') }}</span>
        <span :class="classDate"> {{ formatDateFromNow(updatedAt) }}</span>
      </div>
      <UserAvatar
        v-if="updatedBy"
        :class="classAvatar"
        :username="updatedBy.username"
      />
    </template>

    <!-- Created By -->
    <template v-else-if="createdAt && createdBy">
      <div :class="classTextContainer">
        <span :class="classText">{{ t('createdAt') }}</span>
        <span :class="classDate"> {{ formatDateFromNow(createdAt) }}</span>
      </div>
      <UserAvatar
        v-if="createdBy"
        :class="classAvatar"
        :username="createdBy.username"
      />
    </template>
  </div>
</template>

<i18n lang="yaml">
en:
  createdAt: Created
  updatedAt: Updated
  disabledAt: Disabled
fr:
  createdAt: Créé
  updatedAt: Mis à jour
  disabledAt: Désactivé
de:
  createdAt: Erstellt
  updatedAt: Aktualisiert
  disabledAt: Deaktiviert
es:
  createdAt: Creado
  updatedAt: Actualizado
  disabledAt: Deshabilitado
zh:
  createdAt: 创建于
  updatedAt: 更新于
  disabledAt: 禁用
</i18n>
