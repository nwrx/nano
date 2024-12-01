<script setup lang="ts">
defineProps<{ permissions: string[] }>()

const { t } = useI18n()
</script>

<template>
  <div v-if="permissions" class="flex items-center space-x-2">
    <Badge
      v-if="permissions.includes('WriteVariables')"
      icon="i-carbon:label"
      variant="primary"
      size="xsmall"
      light
    />
    <Badge
      v-if="permissions.includes('WriteSecrets')"
      icon="i-carbon:password"
      variant="primary"
      size="xsmall"
      light
    />
    <Badge
      v-if="permissions.includes('WriteApiKeys')"
      icon="i-carbon:api-key"
      variant="primary"
      size="xsmall"
      light
    />
    <Badge
      v-if="permissions.includes('Owner')"
      icon="i-carbon:user-certification"
      :label="t('permission.owner')"
      size="xsmall"
      variant="primary"
      outlined
    />
    <Badge
      v-else-if="permissions.includes('Write')"
      icon="i-carbon:edit"
      :label="t('permission.write')"
      size="xsmall"
      variant="primary"
      filled
    />
    <Badge
      v-else-if="permissions.includes('Read')"
      icon="i-carbon:view"
      :label="t('permission.read')"
      size="xsmall"
      variant="primary"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  permission.write: Write
  permission.read: Read
  permission.owner: Owner
fr:
  permission.write: Écrire
  permission.read: Lire
  permission.owner: Propriétaire
de:
  permission.write: Schreiben
  permission.read: Lesen
  permission.owner: Besitzer
es:
  permission.write: Escribir
  permission.read: Leer
  permission.owner: Propietario
zh:
  permission.write: 写
  permission.read: 读
  permission.owner: 所有者
</i18n>
