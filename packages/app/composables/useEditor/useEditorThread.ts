/* eslint-disable sonarjs/no-commented-code */
import type { ThreadInputObject } from '@nwrx/nano'
import type { application, Editor } from '@nwrx/nano-api'
import type { ThreadServerMessage } from '@nwrx/nano-runner'
import type { ChannelConnectOptions } from '@unserved/client'
import type { WebSocketChannel } from '@unshared/client/websocket'

type Channel = WebSocketChannel<ChannelConnectOptions<
  typeof application,
  'WS /ws/workspaces/:workspace/projects/:project/flows/:flow/thread/:thread?'
>>

export interface UseEditorThreadOptions {
  workspace: string
  project: string
  flow: string
  nodes: Ref<Editor.NodeObject[]>
}

export function useEditorThread(options: UseEditorThreadOptions) {
  const { workspace, project, flow, nodes = ref([]) } = options
  const client = useClient()
  const alerts = useAlerts()
  const channel = ref<Channel>()
  const messages = ref<ThreadServerMessage[]>([])

  async function createThread(thread?: string) {
    if (channel.value) await channel.value.close()

    // --- Connect to the thread server via WebSocket.
    channel.value = await client.connect('WS /ws/workspaces/:workspace/projects/:project/flows/:flow/thread/:thread?', {
      data: { workspace, project, flow, thread },
      autoReconnect: true,
      reconnectDelay: 1000,
      reconnectLimit: 5,
      onMessage: (message: ThreadServerMessage) => {
        messages.value.push(message)
        if (message.event === 'error') {
          const [error] = message.data
          alerts.error({ text: error.message, title: error.name })
        }
        if (message.event === 'nodeError') {
          const [, error] = message.data
          alerts.error({ text: error.message, title: error.name })
        }
        else if (message.event === 'nodeState') {
          const [id, state] = message.data
          const node = nodes.value.find(node => node.id === id)
          if (!node) return
          node.state = state
          nodes.value = [...nodes.value]
        }
      },
    }).open() as Channel

    // --- Wait for the first message to be received.
    await new Promise((resolve, reject) => {
      channel.value!.on('error', reject)
      channel.value!.on('message', resolve)
    })
  }

  async function start(inputs: ThreadInputObject = {}) {
    if (!channel.value) await createThread()
    messages.value = []
    channel.value!.send({ event: 'workerStart', data: [inputs] })
  }

  return toReactive({
    messages,
    start,
    createThread,
    clearMessages: () => messages.value = [],
  })
}

// const tree = computed(() => {
//   const items: EditorMessageTreeItem[] = []
//   const nodes = props.editor.model.nodes
//   const messagesAll = messages.value
//   const outputs: Record<string, string> = {}
//   const nodesTree = new Map<number, FlowNodeObject | undefined>()
//   const nodesDepth = new Map<string, number>()
//   const nodesRunning = new Map<string, FlowNodeObject>()
//   let maxConcurrency = 1

//   // --- Collect all the node states.
//   for (const message of messagesAll) {
//     let id: string
//     let state: NodeState

//     if (message.event === 'nodeStart') { [id] = message.data; state = 'starting' }
//     else if (message.event === 'nodeDone') { [id] = message.data; state = 'done' }
//     else if (message.event === 'nodeError') { [id] = message.data; state = 'error' }
//     else if (message.event === 'nodeOutput') {
//       const [, name, value] = message.data
//       outputs[name] = String(value)
//       continue
//     }
//     else if (message.event === 'nodeOutputDeltaStart') {
//       const [, name] = message.data
//       outputs[name] = ''
//       continue
//     }
//     else if (message.event === 'nodeOutputDelta') {
//       const [, name, value] = message.data
//       outputs[name] += value
//       continue
//     }
//     // else if (message.event === 'nodeState') {
//     //   [id, state] = message.data
//     // }
//     else {
//       // items.push({ message })
//       continue
//     }

//     // --- Find the node.
//     const node = nodes.find(node => node.id === id)
//     if (!node) throw new Error(`Node not found: ${id}`)

//     const concurrency = nodesRunning.size + 1
//     const depth = nodesDepth.get(id) ?? concurrency
//     maxConcurrency = Math.max(maxConcurrency, concurrency - 1)
//     if (state === 'starting') {
//       nodesRunning.set(id, node)
//       nodesTree.set(depth, node)
//       nodesDepth.set(id, concurrency)
//     }

//     // --- Create the tree items.
//     const tree = [...nodesTree.values()].map((_, depth) => {
//       const nodeAtDepth = nodesTree.get(depth + 1)
//       const color = nodeAtDepth ? getNodeColor(nodeAtDepth) : 'transparent'
//       const showPin = nodeAtDepth === node
//       const isConcurrent = (depth > 0 && concurrency > 0)

//       let showLine: EditorMessageTreeItemLine = 'straight'
//       if (nodeAtDepth === node) {
//         if (state === 'starting') showLine = isConcurrent ? 'open' : 'start'
//         if (state === 'done') showLine = isConcurrent ? 'close' : 'end'
//         if (state === 'error') showLine = isConcurrent ? 'close' : 'end'
//       }
//       return { color, showPin, showLine }
//     })
//     items.push({ message, node, tree })

//     if (state === 'done') {
//       nodesTree.set(depth, undefined)
//       nodesRunning.delete(id)
//       nodesDepth.delete(id)
//     }
//   }

//   // --- Before returning, force the last treeItem to all have `showLine: 'end'`.
//   if (items.length > 0) {
//     const lastTreeItem = items.at(-1)!
//     lastTreeItem.tree = lastTreeItem.tree?.map(x => ({ ...x, showLine: 'end' }))
//   }

//   return { items, maxConcurrency, outputs }
// })
