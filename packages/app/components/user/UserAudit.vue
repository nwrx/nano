<script setup lang="ts">
import UserAvatar from './UserAvatar.vue'

defineProps<{
  createdAt?: string
  createdBy?: { username: string }
  updatedAt?: string
  updatedBy?: { username: string }
  disabledAt?: string
  disabledBy?: { username: string }
}>()

const { t } = useI18n()
const classAvatar = 'size-6 rd-full'
const classText = 'text-xs font-normal text-subtle line-clamp-1 text-end'
</script>

<template>
  <div class="flex justify-end items-center space-x-sm">

    <!-- Disabled By -->
    <template v-if="disabledAt">
      <div>
        <span :class="classText">{{ t('disabledAt') }}</span>
        <span :class="classText"> {{ formatDateFromNow(disabledAt) }}</span>
      </div>
      <UserAvatar
        v-if="disabledBy"
        :class="classAvatar"
        :username="disabledBy.username"
      />
    </template>

    <!-- Updated By -->
    <template v-else-if="updatedAt">
      <div>
        <span :class="classText">{{ t('updatedAt') }}</span>
        <span :class="classText"> {{ formatDateFromNow(updatedAt) }}</span>
      </div>
      <UserAvatar
        v-if="updatedBy"
        :class="classAvatar"
        :username="updatedBy.username"
      />
    </template>

    <!-- Created By -->
    <template v-else-if="createdAt">
      <div>
        <span :class="classText">{{ t('createdAt') }}</span>
        <span :class="classText"> {{ formatDateFromNow(createdAt) }}</span>
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
