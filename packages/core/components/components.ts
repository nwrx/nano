import { confirm } from './confirm'
import { fetch } from './fetch'
import { gate } from './gate'
import { inference } from './inference'
import { input } from './input'
import { mcp } from './mcp'
import { message } from './message'
import { output } from './output'
import { parse } from './parse'
import { passthrough } from './passthrough'
import { provider } from './provider'
import { question } from './question'
import { script } from './script'
import { stringify } from './stringify'
import { template } from './template'

export const COMPONENTS = {
  confirm,
  fetch,
  gate,
  inference,
  input,
  script,
  mcp,
  message,
  output,
  parse,
  passthrough,
  provider,
  question,
  stringify,
  template,
} as const

export type ComponentName = keyof typeof COMPONENTS
