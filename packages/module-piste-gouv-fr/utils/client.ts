/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/// <reference types="@unshared/types" />
import type { Client } from '@unshared/client'
import type { specifications } from './specifications'
import { createClient } from '@unshared/client'

export type Legifrance = typeof specifications
export const client = createClient<Legifrance>('https://api.piste.gouv.fr/dila/legifrance/lf-engine-app') as Client<Legifrance>
