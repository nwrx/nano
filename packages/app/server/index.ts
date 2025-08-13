import { createError, defineEventHandler } from 'h3'
import { application } from '../../api'

/**
 * Create the handler for the application. If `NUXT_PUBLIC_API_URL` is set, we won't
 * initialize the API and will use the provided URL instead. This allows us to have
 * multiple infrastructure setups while keeping the same codebase.
 *
 * @returns The handler for the application.
 */
async function createHandler() {

  // --- If `NUXT_PUBLIC_API_URL` is set, make sure `` throws a 404 error.
  const apiUrl = useRuntimeConfig().public.apiUrl
  if (apiUrl) return defineEventHandler(() => { throw createError({ status: 404 }) })

  // --- Otherwise, serve the application from `@nwrx/nano-api`.
  await application.initialize()
  return application.createApp().handler
}

export default await createHandler()
