import { COMPONENTS } from '@nwrx/nano/components'
import { serializeComponent } from '../serialize/serializeComponent'

export const CORE_COMPONENTS = Object
  .values(COMPONENTS)
  .map(x => serializeComponent(x))
