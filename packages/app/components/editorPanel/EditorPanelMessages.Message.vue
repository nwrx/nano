<script setup lang="ts">
defineProps<{
  maxConcurrency: number
  item: EditorMessageTreeItem
}>()

const showBody = ref(false)
</script>

<template>
  <div
    :class="{
      'bg-editor-panel-data': showBody,
      '!bg-danger-400/50': item.message.event === 'nodeError',
    }"
    class="
      flex items-stretch pr-md rd relative
      ring ring-transparent hover:ring-active
    ">

    <!-- Pin -->
    <EditorPanelMessagesMessageTree
      :item="item"
      :max-concurrency="maxConcurrency"
    />

    <!-- Header -->
    <div class="w-full">
      <EditorPanelMessagesMessageHeader
        class="cursor-pointer select-none"
        :item="item"
        @mousedown="() => showBody = !showBody"
      />

      <!-- Body -->
      <Collapse v-model="showBody">
        <div class="pt-sm pb-md">
          <DataSheet v-if="item.message.event === 'nodeDone'" :model-value="item.message.data[1]" />
          <DataSheet v-if="item.message.event === 'nodeStart'" :model-value="item.message.data[1]" />
          <div v-if="item.message.event === 'nodeOutput'">

            <!-- ID -->
            <div class="flex items-center space-x-md">
              <Badge class="badge-success space-x-sm">
                <span class="font-mono text-sm text-subtle">ID:</span>
                <span class="font-mono text-sm">{{ item.message.data[0] }}</span>
              </Badge>
              <Badge class="badge-success space-x-sm">
                <span class="font-mono text-sm text-subtle">Name:</span>
                <span class="font-mono text-sm">{{ item.message.data[1] }}</span>
              </Badge>
            </div>

            <!-- Value -->
            <DataSheet :model-value="item.message.data[2]" />
          </div>
        </div>

        <!-- Error -->
        <div v-if="item.message.event === 'nodeError'" class="p-md bg-error">
          <pre class="text-error">
            {{ item.message.data }}
          </pre>
        </div>
      </Collapse>
    </div>
  </div>
</template>
