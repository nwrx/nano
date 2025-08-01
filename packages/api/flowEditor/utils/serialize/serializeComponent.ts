import type { Component } from '@nwrx/nano/utils'
import type { Editor } from '../types'

export function serializeComponent(component: Component): Editor.ComponentObject {
  return {
    name: component.name,
    icon: component.icon,
    title: component.title,
    description: component.description,
    inputs: component.inputs,
    outputs: component.outputs,
    purpose: component.purpose,
    version: '0.0.0',
  }
}
