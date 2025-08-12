import { createError } from '@unserved/server'

export const ERRORS = {
  THREAD_NOT_FOUND: (workspace: string, project: string, flow: string, id: string) => createError({
    name: 'E_THREAD_NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Thread **${workspace}/${project}/${flow}/${id}** not found`,
    data: { workspace, project, flow, id },
  }),
  THREAD_SESSION_NOT_FOUND_FOR_PEER: (peerId: string) => createError({
    name: 'E_THREAD_SESSION_NOT_FOUND_FOR_PEER',
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Thread session not found for peer **${peerId}**, please ensure the thread is open and the peer is connected.`,
    data: { peerId },
  }),
}
