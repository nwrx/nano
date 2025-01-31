import type { Component } from '@nwrx/nano'
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

export function serializeComponent(component: Component): ComponentJSON {
  return {
    kind: component.kind,
    icon: component.icon ?? 'https://api.iconify.design/carbon:unknown.svg',
    name: component.name ?? component.kind,
    description: component.description ?? 'No description available.',
    categoryKind: component.category?.kind ?? 'uncategorized',
    categoryName: component.category?.name ?? 'Uncategorized',
    categoryIcon: component.category?.icon ?? 'https://api.iconify.design/carbon:unknown.svg',
    categoryColor: component.category?.color ?? '#000000',
    categoryDescription: component.category?.description ?? 'No description available.',
    inputSchema: serializeInputSchema(component.inputSchema),
    outputSchema: serializeOutputSchema(component.outputSchema),
  }
}
