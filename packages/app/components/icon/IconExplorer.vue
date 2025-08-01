<script setup lang="ts">
import InputText from '~/components/base/InputText.vue'
import { useIcons } from '~/composables/useIcon'
import IconDynamic from './IconDynamic.vue'

const props = defineProps<{
  isDark?: boolean
}>()

const { t } = useI18n()
const icon = defineModel<string>()
const icons = useIcons()
icons.options.limit = 95

watchThrottled(
  () => icons.options.search,
  () => icons.searchIcons(),
  { throttle: 100 },
)

onMounted(() => {
  void icons.searchIcons(true)
})

const localSettings = useLocalSettings()
const isDark = computed(() => props.isDark ?? localSettings.value.themeColor === 'dark')
const iconsWithSelection = computed(() => {
  if (!icon.value) return icons.data
  if (icons.data.includes(icon.value)) return icons.data
  return [...icons.data, icon.value]
})
</script>

<template>
  <div class="flex flex-row items-center gap-md mb-md">

    <!-- Current Icon -->
    <IconDynamic
      v-if="icon"
      :name="icon"
      class="size-9 shrink-0 p-xs rd-sm b b-app"
      :color="isDark ? 'white' : 'black'"
      :size="24"
      @click="() => icon = ''"
    />

    <!-- No icon selected placeholder -->
    <div
      v-else
      class="size-9 shrink-0 p-xs rd-sm b b-app flex items-center justify-center"
      :class="isDark ? 'text-white' : 'text-black'"
    />

    <!-- Search -->
    <InputText
      v-model="icons.options.search"
      :placeholder="t('searchIcon')"
    />
  </div>

  <!-- Explorer -->
  <div class="flex flex-wrap justify-center gap-2.5">
    <IconDynamic
      v-for="iconName in iconsWithSelection"
      :key="iconName"
      :name="iconName"
      :title="iconName"
      class="
        size-8 shrink-0 p-0.5 rd-sm
        b cursor-pointer
      "
      :class="{
        'b-active op-100': icon === iconName,
        ' b-transparent hover:b-active op-60 hover:op-100': icon !== iconName,
      }"
      :color="isDark ? 'white' : 'black'"
      :size="24"
      @click="() => icon = iconName"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  searchIcon: Search for an icon...
fr:
  searchIcon: Rechercher une icône...
de:
  searchIcon: Nach einem Symbol suchen...
es:
  searchIcon: Buscar un icono...
zh:
  searchIcon: 搜索图标...
</i18n>
