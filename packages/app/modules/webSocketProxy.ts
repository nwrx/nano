/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { ProxyServer, ProxyServerOptions } from 'httpxy'
import type { IncomingMessage, OutgoingMessage, Server } from 'node:http'
import { defineNuxtModule } from '@nuxt/kit'
import { createProxyServer } from 'httpxy'

// --- Custom nuxt module for adding websocket proxy support locally. The official support does not work yet,
// --- see https://github.com/nuxt/cli/issues/107 and https://github.com/nuxt/cli/issues/108.
export default defineNuxtModule({
  setup(_, nuxt) {
    if (!nuxt.options.dev) return
    if (!nuxt.options.nitro) return
    if (!nuxt.options.nitro.devProxy) return
    if (typeof nuxt.options.nitro.devProxy !== 'object') return
    if (nuxt.options.nitro.devProxy === null) return

    // --- Iterate over the Nuxt devProxy rules and filter out the
    // --- ones that have websocket proxying enabled.
    const wsProxyServers: Array<[string, ProxyServer]> = []
    for (const key in nuxt.options.nitro.devProxy) {
      const rule = nuxt.options.nitro.devProxy[key] as ProxyServerOptions
      if (rule.ws !== true) continue
      const proxyServer = createProxyServer(rule)
      wsProxyServers.push([key, proxyServer])
    }

    // --- Replace the nuxt server with our own version that uses
    // --- the configured proxy servers or delegates.
    if (!wsProxyServers) return
    nuxt.hook('ready', () => {
      nuxt.server = {
        ...nuxt.server,
        upgrade: (request: IncomingMessage, socket: OutgoingMessage, head?: Buffer) => {
          const proxy = wsProxyServers.find(([key]) => request.url?.startsWith(key))?.[1]
          return proxy ? proxy.ws(request, socket, {}, head) : nuxt.server.upgrade(request, socket, head)
        },
      } as Server
    })
  },
})
