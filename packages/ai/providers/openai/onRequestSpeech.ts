import type { SpeechCreateParams } from 'openai/resources/audio'
import type { Speech } from '../../speech'

export function onRequestSpeech(context: Speech.Context): void {
  context.init.body = JSON.stringify({
    model: context.request.model,
    input: context.request.input,
  } as SpeechCreateParams)
}
