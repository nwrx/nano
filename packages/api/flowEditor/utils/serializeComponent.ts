import type { Component } from '@nwrx/nano/utils'
import type { InputJSON } from './serializeInputSchema'
import type { OutputJSON } from './serializeOutputSchema'
import { serializeInputSchema } from './serializeInputSchema'
import { serializeOutputSchema } from './serializeOutputSchema'

export interface ComponentJSON {
  kind: string
  name: string
  icon: string
  categoryKind: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  categoryDescription: string
  description: string
  inputSchema: InputJSON[]
  outputSchema: OutputJSON[]
}

export function serializeComponent(specifier: string, component: Component): ComponentJSON {
  return {
    kind: specifier,
    icon: component.icon ?? 'https://api.iconify.design/carbon:unknown.svg',
    name: component.title ?? specifier,
    description: component.description ?? 'No description available.',
    categoryKind: 'uncategorized',
    categoryName: 'Uncategorized',
    categoryIcon: 'https://api.iconify.design/carbon:unknown.svg',
    categoryColor: '#000000',
    categoryDescription: 'No description available.',
    inputSchema: serializeInputSchema(component.inputs),
    outputSchema: serializeOutputSchema(component.outputs),
  }
}
