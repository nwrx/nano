/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { ObjectLike } from '@unshared/types'
import { createClient } from '@unshared/client'
import { randomUUID } from 'node:crypto'
import { defineComponent } from '../utils/defineComponent'

export interface EventFetchRequest {
  id: string
  url: string
  body: ObjectLike
  query: ObjectLike
  method: string
  headers: ObjectLike
  parameters: ObjectLike
}

export interface EventFetchResponse {
  id: string
  status: number
  statusText: string
}

export interface EventFetchError {
  id: string
  status: number
  statusText: string
}

export type EventMapFetch = {
  'nodeFetchRequest': [nodeId: string, event: EventFetchRequest]
  'nodeFetchResponse': [nodeId: string, event: EventFetchResponse]
  'nodeFetchError': [nodeId: string, event: EventFetchError]
  'nodeFetchCancel': [nodeId: string, fetchId: string]
}

export const fetch = defineComponent(
  {
    isTrusted: true,
    inputs: {
      url: {
        'type': 'string',
        'title': 'URL',
        'description': 'The URL of the endpoint to make the request to.',
        'x-control': 'text',
        'example': 'https://api.example.com/v1/',
      },
      method: {
        'title': 'Method',
        'description': 'The HTTP method to use for the API call.',
        'default': 'get',
        'example': 'get',
        'x-control': 'select',
        'enum': [
          'get',
          'post',
          'patch',
          'delete',
          'put',
          'head',
          'options',
        ] as const,
        'x-enum-labels': [
          'GET',
          'POST',
          'PATCH',
          'DELETE',
          'PUT',
          'HEAD',
          'OPTIONS',
        ],
        'x-enum-descriptions': [
          'Retrieve data from the API endpoint.',
          'Create a new resource at the API endpoint.',
          'Update an existing resource at the API endpoint.',
          'Delete an existing resource at the API endpoint.',
          'Replace an existing resource at the API endpoint.',
          'Retrieve the response headers.',
          'Retrieve the supported HTTP methods.',
        ],
        'x-enum-icons': [
          'https://api.iconify.design/carbon:download.svg',
          'https://api.iconify.design/carbon:upload.svg',
          'https://api.iconify.design/carbon:edit.svg',
          'https://api.iconify.design/carbon:delete.svg',
          'https://api.iconify.design/carbon:replace.svg',
          'https://api.iconify.design/carbon:header.svg',
          'https://api.iconify.design/carbon:method.svg',
        ],
      },
      parameters: {
        'type': 'object',
        'title': 'Parameters',
        'description': 'Key-value pairs to be sent as query parameters in the API call.',
        'additionalProperties': { type: 'string' },
        'default': {},
        'x-control': 'table',
      },
      query: {
        'type': 'object',
        'title': 'Query',
        'description': 'Key-value pairs to be sent as query parameters in the API call.',
        'default': {},
        'additionalProperties': { type: 'string' },
        'x-control': 'table',
      },
      body: {
        'type': 'object',
        'title': 'Body',
        'default': {},
        'additionalProperties': { type: 'string' },
        'description': 'Key-value pairs to be sent as the body in the API call.',
        'x-control': 'table',
      },
      headers: {
        'type': 'object',
        'title': 'Headers',
        'description': 'Key-value pairs to be sent as headers in the API call.',
        'additionalProperties': { type: 'string' },
        'default': {},
        'x-control': 'table',
      },
    },
    outputs: {
      stream: {
        'x-type': 'stream',
        'name': 'Stream',
        'description': 'The response body returned as a stream.',
      },
      text: {
        type: 'string',
        name: 'Text',
        description: 'The response body returned as a string.',
      },
      json: {
        type: 'object',
        name: 'JSON',
        description: 'The response body parsed as a JSON object.',
      },
      headers: {
        type: 'object',
        name: 'Headers',
        description: 'The response headers returned as a JSON object.',
      },
    },
  },

  // @ts-expect-error: The return type is respected.
  async({ data, thread, nodeId }) => {
    const { url, method, query, body, headers = {}, parameters = {} } = data

    const client = createClient({
      signal: thread.abortController.signal,
    })

    // --- Fetch the data from the API endpoint.
    const id = randomUUID()
    thread.dispatch('nodeFetchRequest', nodeId, { id, url, method, query, body, headers, parameters })
    const response = await client.fetch(url, { method, query, body, headers })
    const { ok, status, statusText } = response

    // --- Handle errors and return the response body.
    if (!ok) {
      thread.dispatch('nodeFetchError', nodeId, { id, status, statusText })
      throw new Error(`Failed to fetch: ${statusText}`)
    }

    thread.dispatch('nodeFetchResponse', nodeId, { id, status, statusText })
    return new Proxy({}, {
      get(target, key) {
        if (key === 'text') return response.text()
        if (key === 'json') return response.json()
        if (key === 'headers') return Object.fromEntries(response.headers.entries())
        if (key === 'stream') return response.body
      },
    })
  },
)
