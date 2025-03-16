<!-- eslint-disable sonarjs/no-nested-assignment -->
<script setup lang="ts">
import type { NodeState } from '@nwrx/nano'
import type { application, EditorNodeObject } from '@nwrx/nano-api'
import type { ThreadServerMessage } from '@nwrx/nano-runner'
import type { ChannelConnectOptions } from '@unserved/client'
import type { WebSocketChannel } from '@unshared/client/websocket'
import { vMarkdown } from '#imports'

type Channel = WebSocketChannel<ChannelConnectOptions<
  typeof application,
  'WS /ws/workspaces/:workspace/projects/:project/flows/:flow/thread/:thread?'
>>

const props = defineProps<{
  editor: Editor
}>()

const client = useClient()
const channel = ref<Channel>()
const messages = ref<ThreadServerMessage[]>([])

async function start() {
  if (!channel.value) {
    channel.value = await client.connect('WS /ws/workspaces/:workspace/projects/:project/flows/:flow/thread/:thread?', {
      data: {
        workspace: props.editor.options.workspace,
        project: props.editor.options.project,
        flow: props.editor.options.name,
      },
      onMessage: (message: ThreadServerMessage) => {
        messages.value.push(message)
      },
    }) as Channel
    await new Promise(resolve => channel.value?.on('message', resolve))
  }

  // --- Send the inputs to the flow.
  messages.value = []
  channel.value.send({ event: 'start', data: {} })
}

const tree = computed(() => {
  const items: EditorMessageTreeItem[] = []
  const nodes = props.editor.model.nodes
  const messagesAll = messages.value
  const outputs: Record<string, string> = {}
  const nodesTree = new Map<number, EditorNodeObject | undefined>()
  const nodesDepth = new Map<string, number>()
  const nodesRunning = new Map<string, EditorNodeObject>()
  let maxConcurrency = 1

  // --- Collect all the node states.
  for (const message of messagesAll) {
    let id: string
    let state: NodeState

    if (message.event === 'nodeStart') { [id] = message.data; state = 'starting' }
    else if (message.event === 'nodeDone') { [id] = message.data; state = 'done' }
    else if (message.event === 'nodeError') { [id] = message.data; state = 'error' }
    else if (message.event === 'nodeOutput') {
      const [, name, value] = message.data
      outputs[name] = String(value)
      continue
    }
    else if (message.event === 'nodeOutputDeltaStart') {
      const [, name] = message.data
      outputs[name] = ''
      continue
    }
    else if (message.event === 'nodeOutputDelta') {
      const [, name, value] = message.data
      outputs[name] += value
      continue
    }
    // else if (message.event === 'nodeState') {
    //   [id, state] = message.data
    // }
    else {
      // items.push({ message })
      continue
    }

    // --- Find the node.
    const node = nodes.find(node => node.id === id)
    if (!node) throw new Error(`Node not found: ${id}`)

    const concurrency = nodesRunning.size + 1
    const depth = nodesDepth.get(id) ?? concurrency
    maxConcurrency = Math.max(maxConcurrency, concurrency - 1)
    if (state === 'starting') {
      nodesRunning.set(id, node)
      nodesTree.set(depth, node)
      nodesDepth.set(id, concurrency)
    }

    // --- Create the tree items.
    const tree = [...nodesTree.values()].map((_, depth) => {
      const nodeAtDepth = nodesTree.get(depth + 1)
      const color = nodeAtDepth ? getNodeColor(nodeAtDepth) : 'transparent'
      const showPin = nodeAtDepth === node
      const isConcurrent = (depth > 0 && concurrency > 0)

      let showLine: EditorMessageTreeItemLine = 'straight'
      if (nodeAtDepth === node) {
        if (state === 'starting') showLine = isConcurrent ? 'open' : 'start'
        if (state === 'done') showLine = isConcurrent ? 'close' : 'end'
        if (state === 'error') showLine = isConcurrent ? 'close' : 'end'
      }
      return { color, showPin, showLine }
    })
    items.push({ message, node, tree })

    if (state === 'done') {
      nodesTree.set(depth, undefined)
      nodesRunning.delete(id)
      nodesDepth.delete(id)
    }
  }

  // --- Before returning, force the last treeItem to all have `showLine: 'end'`.
  if (items.length > 0) {
    const lastTreeItem = items.at(-1)!
    lastTreeItem.tree = lastTreeItem.tree?.map(x => ({ ...x, showLine: 'end' }))
  }

  return { items, maxConcurrency, outputs }
})
</script>

<template>
  <div class="flex flex-col h-full select-text relative p-md">

    <Button label="start" @click="() => start()" />

    <div class="mt-md rd">
      <EditorPanelMessagesMessage
        v-for="(item, index) in tree.items"
        :key="index"
        :editor="editor"
        :item="item"
        :max-concurrency="tree.maxConcurrency"
      />
      <p v-for="(o, i) in tree.outputs" :key="i" v-markdown="o" />
    </div>
  </div>
</template>
