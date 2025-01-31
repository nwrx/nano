<script setup lang="ts">
const props = defineProps<{
  workspace: string
  project: string
  name: string
  title: string
  icon?: string
  imageUrl?: string
  description?: string
  isDraft?: boolean
  isDeployed?: boolean
  isRunning?: boolean
}>()

const emit = defineEmits<{
  delete: []
  duplicate: []
}>()

interface Status {
  visible: boolean
  label: string
  variant: Variant
  icon: string
  size: Size
  outlined?: boolean
}

const status = computed(() => [
  {
    visible: Math.random() > 0.5,
    variant: 'danger',
    icon: 'i-carbon:arrow-down',
    size: 'small',
  },
  {
    visible: Math.random() > 0.5,
    variant: 'danger',
    icon: 'i-carbon:timer',
    size: 'small',
  },
  {
    visible: Math.random() > 0.5,
    variant: 'danger',
    icon: 'i-carbon:code',
    size: 'small',
  },
  {
    visible: !props.isDeployed,
    label: 'Draft',
    variant: 'accent',
    icon: 'i-carbon:dot-mark',
    size: 'xsmall',
    outlined: true,
  },
  {
    visible: props.isDeployed,
    label: 'Deployed',
    variant: 'secondary',
    icon: 'i-carbon:dot-mark',
    size: 'xsmall',
  },
  {
    visible: props.isRunning,
    label: 'Running',
    variant: 'accent',
    icon: 'i-carbon:dot-mark',
    size: 'xsmall',
  },
].filter(badge => badge.visible) as Status[])

// const imageUrl = computed(() => {
//   const imageMock = [
//     'https://images.ctfassets.net/qop92tnevinq/2oekTQfw0dDMkyy63lsAKO/62b255d7a1f5210a6792464eafd7421b/Agile-roadmap-preview.png?fm=webp&q=80',
//     'https://images.ctfassets.net/qop92tnevinq/3SwucPZWH8ltJiv1iekcJC/224d76c492d597d4194062723fdbb35f/product-development-roadmap-web.png?fm=webp&q=80',
//     'https://images.ctfassets.net/qop92tnevinq/2sF7FnYVATAFPl4Gknd8k4/19a78238c3e4e55ff0c39832657b9425/One_on_One_Meeting-thumb-web.png',
//     'https://images.ctfassets.net/qop92tnevinq/36G1iEMXOc0HEWszNqNUGm/ef4bdeb33bcb218ed84881427e531135/Value_Scale-thumb-web.png',
//   ]
//   return imageMock[Math.floor(Math.random() * imageMock.length)]
// })

function getFlowRoute(workspace: string, project: string, flow: string) {
  if (!workspace || !project || !flow) return '/'
  return {
    name: 'FlowEditor',
    params: { workspace, project, flow },
  }
}
</script>

<template>
  <div
    class="
      flex items-center justify-between p-4 pr-12
      rounded space-x-4
      transition-all duration-100
      bg-transparent
      hover:bg-primary-100/30
      ring-1 ring-transparent
      hover:ring-primary-500/50
      text-opacity-80
    ">

    <!-- Image -->
    <!--
      <div
      :style="{ backgroundImage: `url(${imageUrl})` }"
      class="
      aspect-1/1 shrink-0
      w-16 bg-cover bg-center rounded
      border border-black/10
      "
      />
    -->

    <!-- Left - Name & Description -->
    <div class="w-full">

      <!-- Name & Icon -->
      <div class="flex items-center space-x-4">
        <Button
          link
          eager
          :icon="icon"
          :label="title"
          :to="getFlowRoute(workspace, project, name)"
          class="font-medium text-left whitespace-nowrap"
        />
      </div>

      <!-- Description -->
      <p class="text-sm text-black/60 text-left line-clamp-2">
        {{ description }}
      </p>

      <div class="flex flex-wrap items-center gap-2 mt-2">
        <Badge
          v-for="badge in status"
          :key="badge.label"
          :label="badge.label"
          :variant="badge.variant"
          :icon="badge.icon"
          :size="badge.size"
          :outlined="badge.outlined"
        />
      </div>
      <!-- Last changed -->
      <!--
        <p class="text-xs text-black/50">
        Last changed 2 days ago by <span class="font-medium">John Doe</span>
        </p>
      -->
    </div>

    <!-- Right - Statistics -->
    <div class="flex items-center justify-center space-x-4 shrink-0">
      <div class="flex divide-x divide-black/10 grow lt-md:hidden">
        <ProjectListItemStatistic
          name="Executions"
          trend="up"
          value="100"
          unit="runs"
        />
      </div>

      <!-- CTA -->
      <ContextMenu x="right" y="top">
        <template #menu="{ close }">
          <ContextMenuItem
            label="Edit"
            icon="i-carbon:edit"
            keybind="Ctrl + E"
            :to="getFlowRoute(workspace, project, name)"
          />
          <ContextMenuItem
            label="Delete"
            icon="i-carbon:delete"
            keybind="Backspace"
            @click="() => { emit('delete'); close() }"
          />
          <ContextMenuItem
            label="Duplicate"
            icon="i-carbon:copy"
            keybind="Ctrl + D"
            @click="() => { emit('duplicate'); close() }"
          />
          <ContextMenuDivider />
          <ContextMenuItem
            label="Export"
            icon="i-carbon:download"
            keybind="Ctrl + E"
          />
          <ContextMenuItem
            label="Publish"
            icon="i-carbon:upload"
            keybind="Ctrl + B"
          />
          <ContextMenuItem
            label="Settings"
            icon="i-carbon:settings"
            keybind="Ctrl + ,"
            @click="() => close()"
          />
        </template>
      </ContextMenu>
    </div>
  </div>
</template>
