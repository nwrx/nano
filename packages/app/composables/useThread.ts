import type { ThreadInputObject } from '@nwrx/nano'
import type { application } from '@nwrx/nano-api'
import type { ThreadServerMessage } from '@nwrx/nano-runner'
import type { ChannelConnectOptions } from '@unserved/client'
import type { WebSocketChannel } from '@unshared/client/websocket'

type Channel = WebSocketChannel<ChannelConnectOptions<
  typeof application,
  'WS /ws/workspaces/:workspace/projects/:project/flows/:flow/thread/:thread?'
>>

export function useThread(workspace: string, project: string, flow: string) {
  const client = useClient()
  const channel = ref<Channel>()
  const messages = ref<ThreadServerMessage[]>([])

  async function connect(thread?: string) {
    channel.value = await client.connect('WS /ws/workspaces/:workspace/projects/:project/flows/:flow/thread/:thread?', {
      data: { workspace, project, flow, thread },
      onMessage: (message: ThreadServerMessage) => messages.value.push(message),
    }) as Channel

    // --- Wait for the first message to be received.
    await new Promise((resolve, reject) => {
      channel.value!.on('error', reject)
      channel.value!.on('message', resolve)
    })
  }

  function start(inputs: ThreadInputObject = {}) {
    if (!channel.value) throw new Error('The channel is not initialized.')
    messages.value = []
    channel.value.send({ event: 'workerStart', data: [inputs] })
  }

  return {
    messages,
    start,
    connect,
    clearMessages: () => messages.value = [],
  }
}
