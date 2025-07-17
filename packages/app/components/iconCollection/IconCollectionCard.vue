<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import Badge from '~/components/base/Badge.vue'
import { useIconCollection } from '~/composables/useIcon'

const props = defineProps<{
  name: string
  isLink?: boolean
  inline?: boolean
}>()

const { t } = useI18n()
const collection = useIconCollection(props)
const isDisabled = computed(() => Boolean(collection.data.disabledAt))
onMounted(collection.fetchCollection)
</script>

<template>
  <BaseButton
    :as="isLink ? 'a' : 'div'"
    class="flex flex-col overflow-hidden"
    :class="{
      'aspect-[4/3] bg-subtle b b-app rd p-4': !inline,
      'cursor-pointer hover:bg-hover': isLink,
    }">

    <!-- Header with status and name -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <BaseIcon
          class="size-4 shrink-0"
          :icon="collection.statusIcon"
          :class="collection.statusColor"
        />
        <span class="text-sm font-medium text-app font-mono truncate">
          {{ collection.data.name }}
        </span>
      </div>

      <!-- Disabled badge -->
      <Badge
        v-if="isDisabled"
        class="badge-warning shrink-0"
        icon="i-carbon:pause"
        :label="t('disabled')"
      />
    </div>

    <!-- Collection title and version -->
    <div class="flex-1 min-h-0 mb-3">
      <h3 class="text-base font-semibold text-app mb-1 line-clamp-2">
        {{ collection.data.title || collection.data.name }}
      </h3>
      <div class="flex items-center space-x-2 text-xs text-subtle mb-2">
        <span>v{{ collection.data.version }}</span>
      </div>
    </div>

    <!-- Footer with author and license -->
    <div class="flex items-center justify-between text-xs text-subtle">
      <span v-if="collection.data.author" class="truncate">
        {{ collection.data.author }}
      </span>
      <span v-if="collection.data.license" class="shrink-0 ml-2">
        {{ collection.data.license }}
      </span>
    </div>
  </BaseButton>
</template>

<i18n lang="yaml">
en:
  disabled: Disabled
  icons: icons
fr:
  disabled: Désactivé
  icons: icônes
de:
  disabled: Deaktiviert
  icons: Symbole
es:
  disabled: Deshabilitado
  icons: iconos
zh:
  disabled: 已禁用
  icons: 图标
</i18n>
