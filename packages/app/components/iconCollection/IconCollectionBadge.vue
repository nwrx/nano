<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { IconCollectionObject } from '@nwrx/nano-api'
import { toCamelCase } from '@unshared/string/toCamelCase'
import Badge from '~/components/base/Badge.vue'
import { getIconCollectionStatusBadge, getIconCollectionStatusIcon } from '~/composables/useIcon'

defineProps<{
  collection: IconCollectionObject
}>()

const { t } = useI18n()
</script>

<template>
  <Badge
    v-if="!collection.disabledAt"
    class="badge-sm"
    :class="getIconCollectionStatusBadge(collection)"
    :icon="getIconCollectionStatusIcon(collection)"
    :label="t(toCamelCase('status', collection.status))"
  />
  <Badge
    v-else
    class="badge-danger badge-sm"
    icon="i-carbon:pause"
    :label="t('disabled')"
  />
</template>

<i18n lang="yaml">
en:
  statusInstalled: Installed
  statusInstalling: Installing
  statusNotInstalled: Not Installed
  statusOutdated: Outdated
  disabled: Disabled
fr:
  statusInstalled: Installé
  statusInstalling: Installation
  statusNotInstalled: Non Installé
  statusOutdated: Obsolète
  disabled: Désactivé
de:
  statusInstalled: Installiert
  statusInstalling: Installieren
  statusNotInstalled: Nicht Installiert
  statusOutdated: Veraltet
  disabled: Deaktiviert
es:
  statusInstalled: Instalado
  statusInstalling: Instalando
  statusNotInstalled: No Instalado
  statusOutdated: Desactualizado
  disabled: Deshabilitado
zh:
  statusInstalled: 已安装
  statusInstalling: 安装中
  statusNotInstalled: 未安装
  statusOutdated: 过时
  disabled: 已禁用
</i18n>
