<script setup lang="ts">
import type {
  EditorSessionClientMessage,
  EditorSessionServerMessage,
  FlowNodeObject,
  FlowObject,
  ParticipantObject,
  RegistryCategoryObject,
} from '@nwrx/nano-api'
import Button from '~/components/base/Button.vue'
import DataSheet from '~/components/base/DataSheet.vue'
import TabsItem from '~/components/base/Tabs.Item.vue'
import Collapse from '../base/Collapse.vue'

defineProps<{
  view?: EditorView
  flow?: FlowObject
  nodes?: FlowNodeObject[]
  messagesClient?: EditorSessionClientMessage[]
  messagesServer?: EditorSessionServerMessage[]
  participants?: ParticipantObject[]
  categories: RegistryCategoryObject[]
}>()

const emit = defineEmits<{
  'syncronize': []
  'clearMessagesServer': []
  'clearMessagesClient': []
}>()

const { t } = useI18n()
const settings = useLocalSettings()
const TABS = [
  { value: 'view', icon: 'i-carbon:view' },
  { value: 'flow', icon: 'i-carbon:flow' },
  { value: 'nodes', icon: 'i-carbon:box' },
  { value: 'participants', icon: 'i-carbon:group' },
  { value: 'categories', icon: 'i-carbon:category' },
  { value: 'messagesClient', icon: 'i-carbon:upload' },
  { value: 'messagesServer', icon: 'i-carbon:download' },
]
</script>

<template>
  <div
    class="
      relative flex flex-col w-full
      bg-editor-panel b b-editor rd backdrop-blur-2xl z-10
    ">

    <!-- Tabs -->
    <div
      class="
        shrink-0 sticky top-0 flex items-center pr-xs
        b-b b-editor z-10 overflow-hidden rd-t
      ">
      <TabsItem
        v-for="{ value, icon } in TABS"
        :key="value"
        v-model="settings.editorConsoleTab"
        :label="t(`tab.${value}`)"
        :value="value"
        :icon="icon"
        class-tab="!rd-0 tab-sm"
        type="radio"
        @click="() => settings.editorConsoleShow = true"
      />

      <div class="flex-grow" />

      <Button
        :icon="settings.editorConsoleShow ? 'i-carbon:chevron-down' : 'i-carbon:chevron-up'"
        class="button-sm"
        :class="{
          'button-success': settings.editorConsoleShow,
          'button-light': !settings.editorConsoleShow,
        }"
        @click="() => settings.editorConsoleShow = !settings.editorConsoleShow"
      />
    </div>

    <Collapse :model-value="settings.editorConsoleShow">
      <KeepAlive :key="settings.editorConsoleTab">
        <div class="p-md overflow-y-auto h-96">
          <div v-if="settings.editorConsoleTab === 'view'">
            <DataSheet
              v-if="view"
              :model-value="Object.entries(view!).filter(([key, value]) => typeof value !== 'function')"
              :row-name="(entry) => entry[0]"
              :row-value="(entry) => entry[1]"
            />
          </div>

          <div v-else-if="settings.editorConsoleTab === 'flow'">
            <Button class="mb-md" @click="() => emit('syncronize')">
              Syncronize
            </Button>
            <DataSheet :model-value="flow" />
          </div>

          <div v-else-if="settings.editorConsoleTab === 'nodes'">
            <DataSheet
              :model-value="nodes"
              :row-name="(node) => `${node.id} (${node.name})`"
            />
          </div>

          <div v-else-if="settings.editorConsoleTab === 'participants'">
            <DataSheet :model-value="participants" />
          </div>

          <div v-else-if="settings.editorConsoleTab === 'categories'">
            <DataSheet
              :model-value="categories"
              :row-name="(category, key) => `${category.name}`"
            />
          </div>

          <div v-else-if="settings.editorConsoleTab === 'messagesClient'">
            <Button class="mb-md" @click="() => emit('clearMessagesClient')">
              Clear
            </Button>
            <DataSheet
              :model-value="messagesClient"
              :row-name="(event) => event.event"
              :row-value="(entry) => Array.isArray(entry.data) && entry.data.length > 1 ? entry.data : entry.data[0]"
            />
          </div>

          <div v-else-if="settings.editorConsoleTab === 'messagesServer'">
            <Button class="mb-md" @click="() => emit('clearMessagesServer')">
              Clear
            </Button>
            <DataSheet
              :model-value="messagesServer"
              :row-name="(event) => event.event"
              :row-value="(entry) => entry.data"
            />
          </div>
        </div>
      </KeepAlive>
    </Collapse>
  </div>
</template>

<i18n lang="yaml">
en:
  tab:
    view: View
    flow: Flow
    nodes: Nodes
    participants: Participants
    categories: Categories
    messagesClient: Client
    messagesServer: Server
</i18n>
