import type { ModuleRunner } from '@nwrx/nano-runner'
import type { ChannelConnectOptions, RouteResponseData } from '@unserved/client'
import type { WebSocketChannel } from '@unshared/client/websocket'

/**
 * The WebSocket channel used for communication with a runner instance.
 */
export type RunnerThreadChannel = WebSocketChannel<ChannelConnectOptions<ModuleRunner, 'WS /threads'>>

/** The result data when claiming a runner. */
export type RunnerRegisterResult = RouteResponseData<ModuleRunner, 'POST /claim'>

/** The status of a runner instance. */
export type RunnerStatus = RouteResponseData<ModuleRunner, 'GET /status'>
