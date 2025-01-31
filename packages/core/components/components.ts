import * as core from './core'
import * as inference from './inference'
import * as models from './models'
import * as services from './services'
import * as shell from './shell'

export const components = {

  // Core
  ask: core.ask,
  client: core.client,
  confirm: core.confirm,
  gate: core.gate,
  input: core.input,
  output: core.output,
  parse: core.parse,
  passthrough: core.passthrough,
  stringify: core.stringify,
  template: core.template,

  // Inference
  message: inference.message,
  messages: inference.messages,
  inference: inference.inference,

  // Models
  groq: models.groq,
  // ollama: models.ollama,
  openai: models.openai,
  anthropic: models.anthropic,
  mistralai: models.mistralai,

  // Services
  weather: services.weather,

  // Shell
  execute: shell.execute,
}
