import type { ProviderParameter } from './defineProviderOptions'
import { setRequestBody } from './setRequestBody'
import { setRequestHeader } from './setRequestHeader'
import { setUrlPathParameter } from './setUrlPathParameter'
import { setUrlQueryParameter } from './setUrlQueryParameter'

export interface ApplyParametersOptions {
  url: URL
  init: RequestInit
  parameters?: ProviderParameter[]
  options?: Record<string, unknown>
}

export function applyParameters(_options: ApplyParametersOptions): void {
  const { url, init, parameters = [], options = {} } = _options
  for (const parameter of parameters) {
    if (parameter.location === 'header') setRequestHeader(init, parameter, options)
    else if (parameter.location === 'body') setRequestBody(init, parameter, options)
    else if (parameter.location === 'path') setUrlPathParameter(url, parameter, options)
    else if (parameter.location === 'query') setUrlQueryParameter(url, parameter, options)
    else throw new Error(`Unsupported mapping location: ${parameter.location as string}`)
  }
}
