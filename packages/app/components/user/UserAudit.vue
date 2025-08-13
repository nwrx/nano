<script setup lang="ts">
import UserAvatar from './UserAvatar.vue'

const props = defineProps<{
  inline?: boolean
  createdAt?: string
  createdBy?: { username: string }
  updatedAt?: string
  updatedBy?: { username: string }
  disabledAt?: null | string
  disabledBy?: { username: string }
  classText?: string
  classDate?: string
  classAvatar?: string
}>()

const { t } = useI18n()
const classAvatar = computed(() => ({
  'size-5 rd-full': props.inline,
  'size-8 rd-full': !props.inline,
}))

const classText = computed(() => ({
  'text-xs font-normal text-subtle line-clamp-1 text-end': !props.inline,
  'hidden': props.inline,
}))

const classTextContainer = computed(() => ({
  'flex flex-col items-end': !props.inline,
  'flex items-center space-x-1': props.inline,
}))

const auditInfo = computed(() => {
  if (props.disabledAt && props.disabledBy) {
    return {
      label: t('disabledAt'),
      user: props.disabledBy,
      date: props.disabledAt,
    }
  }

  if (props.updatedAt && props.updatedBy) {
    return {
      label: t('updatedAt'),
      user: props.updatedBy,
      date: props.updatedAt,
    }
  }

  if (props.createdAt && props.createdBy) {
    return {
      label: t('createdAt'),
      user: props.createdBy,
      date: props.createdAt,
    }
  }
})
</script>

<template>
  <div class="flex justify-end items-center space-x-sm">
    <template v-if="auditInfo">
      <div :class="classTextContainer">

        <!-- Audit Label -->
        <span :class="[classText, props.classText]">
          {{ auditInfo.label }}
        </span>

        <!-- Duration from now -->
        <span
          class="text-xs font-normal text-app line-clamp-1"
          :class="props.classDate">
          {{ formatDateFromNow(auditInfo.date) }}
        </span>
      </div>

      <!-- User Avatar -->
      <UserAvatar
        v-if="auditInfo.user"
        :class="[classAvatar, props.classAvatar]"
        :username="auditInfo.user.username"
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
