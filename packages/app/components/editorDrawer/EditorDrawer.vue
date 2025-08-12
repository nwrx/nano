<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'
import type { CSSProperties } from 'vue'
import EditorDrawerGroup from './EditorDrawerGroup.vue'
import EditorDrawerMenu from './EditorDrawerMenu.vue'

const props = defineProps<{
  components?: Editor.ComponentObject[]
  componentGroups?: Editor.ComponentGroup[]
}>()

const activeGroup = ref<string>()
const menuItems = ref<HTMLDivElement>()
const menuContainer = ref<HTMLDivElement>()
const menuContainerStyle = ref<CSSProperties>({})

function getGroupComponents(name: string) {
  if (!props.components) return []
  return props.components.filter(component => component.purpose === name)
}

function getItemOffset(name?: string) {
  if (!name) return 0
  if (!menuItems.value) return 0
  const itemElement = menuItems.value.querySelector(`[data-id="${name}"]`)
  if (!itemElement) return 0
  const itemRect = itemElement.getBoundingClientRect()
  const itemsRect = menuItems.value.getBoundingClientRect()
  return itemRect.top - itemsRect.top
}

function getItemHeight(name: string) {
  if (!menuContainer.value) return 0
  const itemElement = menuContainer.value.querySelector(`[data-id="${name}"]`)
  if (!itemElement) return 0
  const itemRect = itemElement.getBoundingClientRect()
  return itemRect.height
}

function getMenuStyle(name: string): CSSProperties {
  const offset = getItemOffset(name)
  const offsetActive = getItemOffset(activeGroup.value)
  const isActive = activeGroup.value === name
  return {
    width: '100%',
    position: 'absolute',
    transform: `translateY(${offset - offsetActive}px)`,
    opacity: isActive ? 1 : 0,
    height: `${getItemHeight(name)}px`,
    pointerEvents: isActive ? 'auto' : 'none',
    transitionDuration: '150ms',
    transitionProperty: 'transform, opacity, height',
  }
}

watch(
  activeGroup,
  (activeGroup) => {
    if (!activeGroup) {
      menuContainerStyle.value.opacity = '0'
      menuContainerStyle.value.pointerEvents = 'none'
      return
    }
    const offset = getItemOffset(activeGroup)
    const height = getItemHeight(activeGroup)
    menuContainerStyle.value.opacity = '1'
    menuContainerStyle.value.pointerEvents = 'auto'
    menuContainerStyle.value.transform = `translateY(${offset}px)`
    menuContainerStyle.value.height = `${height}px`
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="flex items-start space-x-md relative"
    :class="{ 'w-16': !activeGroup }"
    @mouseleave="() => activeGroup = undefined">

    <!-- Groups -->
    <div
      ref="menuItems"
      class="bg-editor-panel rd b b-app backdrop-blur-2xl max-w-16">
      <EditorDrawerGroup
        v-for="group in componentGroups"
        :key="group.name"
        v-model="activeGroup"
        :data-id="group.name"
        :group="group"
      />
    </div>

    <!-- Container -->
    <div
      ref="menuContainer"
      :style="menuContainerStyle"
      class="
        min-w-64 max-w-96
        bg-editor-panel rd b b-app backdrop-blur-md
        transition-all duration-150 overflow-hidden
      ">

      <!-- Content -->
      <div
        v-for="group in componentGroups"
        :key="group.name"
        :style="getMenuStyle(group.name)">

        <EditorDrawerMenu
          :data-id="group.name"
          :group="group"
          :components="getGroupComponents(group.name)"
        />
      </div>
    </div>
  </div>
</template>
