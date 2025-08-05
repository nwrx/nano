import type { Component } from '../utils'
import { confirm } from './confirm'
import { fetch } from './fetch'
import { gate } from './gate'
import { input } from './input'
import { mcp } from './mcp'
import { message } from './message'
import { modelChat } from './modelChat'
import { output } from './output'
import { parse } from './parse'
import { passthrough } from './passthrough'
import { provider } from './provider'
import { question } from './question'
import { script } from './script'
import { stringify } from './stringify'
import { template } from './template'

export const COMPONENTS = [
  confirm,
  fetch,
  gate,
  modelChat,
  /* modelEmbed */
  /* modelTranscript */
  /* modelTranslate */
  /* modelSpeech */
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
] as const satisfies Component[]
