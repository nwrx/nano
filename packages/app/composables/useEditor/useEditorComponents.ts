import type { Editor } from '@nwrx/nano-api'

export interface UseEditorComponentsOptions {
  workspace: string
  project: string
  name: string
}

export const useEditorComponents = createCachedComposable(
  (parameters: UseEditorComponentsOptions) => {
    const { workspace, project, name } = parameters
    const client = useClient()
    const data = ref({ components: [], groups: [] }) as Ref<{
      components: Editor.ComponentObject[]
      groups: Editor.ComponentGroup[]
    }>

    return toReactive({
      data,

      /**
       * Fetches the components and groups for the specified flow.
       */
      fetchComponents: async() => {
        await client.requestAttempt(
          'GET /api/workspaces/:workspace/projects/:project/flows/:name/components',
          {
            parameters: { workspace, project, name },
            onData: (components) => { data.value = components },
          },
        )
      },
    })
  },
  {
    cacheKey: ({ workspace, project, name }) => [workspace, project, name].join('/'),
  },
)
