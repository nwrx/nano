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
import { question } from './question'
import { stringify } from './stringify'
import { template } from './template'

export const COMPONENTS = {
  confirm,
  fetch,
  gate,
  inference,
  input,
  mcp,
  message,
  output,
  parse,
  passthrough,
  question,
  stringify,
  template,
} as const
