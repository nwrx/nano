import type { InputSocket, OutputSocket } from '../module'
import { ThreadError } from './createError'

export const ERRORS = {

  NODE_SCHEMA_VALUE_MISSING: (socket: InputSocket | OutputSocket) => new ThreadError({
    name: 'E_NODE_SCHEMA_VALUE_MISSING',
    message: `The value of "${socket.name}" is required but was not provided. Please check your node configuration.`,
    context: { socket },
  }),

  NODE_SCHEMA_NOT_ITERABLE: (socket: InputSocket | OutputSocket) => new ThreadError({
    name: 'E_NODE_SCHEMA_NOT_ITERABLE',
    message: `The value for the socket "${socket.name}" should be an array. Please ensure the correct data type is used.`,
    context: { socket },
  }),

  // FLOW_NO_NODE_RESOLVER: (flow: Flow) => new ThreadError({
  //   code: 'E_FLOW_NO_NODE_RESOLVER',
  //   message: `The flow "${flow.meta.name}" does not have a node resolver. Please define a node resolver for this flow.`,
  //   data: { flow },
  // }),
  // FLOW_NODE_RESOLVER_NO_DEFINITION: (flow: Flow, kind: string) => new ThreadError({
  //   code: 'E_FLOW_NODE_RESOLVER_NO_DEFINITION',
  //   message: `The flow "${flow.meta.name}" does not have a definition for the node kind "${kind}". Please provide a definition.`,
  //   data: { flow, kind },
  // }),

  // // Secrets and variables
  // FLOW_NO_SECRET_RESOLVER: (flow: Flow) => new ThreadError({
  //   code: 'E_FLOW_NO_SECRET_RESOLVER',
  //   message: `The flow "${flow.meta.name}" does not have a secret resolver. Please define a secret resolver.`,
  //   data: { flow },
  // }),
  // FLOW_NO_VARIABLE_RESOLVER: (flow: Flow) => new ThreadError({
  //   code: 'E_FLOW_NO_VARIABLE_RESOLVER',
  //   message: `The flow "${flow.meta.name}" does not have a variable resolver. Please define a variable resolver.`,
  //   data: { flow },
  // }),

  // // Flow lifecycle
  // FLOW_ALREADY_RUNNING: (flow: Flow) => new ThreadError({
  //   code: 'E_FLOW_ALREADY_RUNNING',
  //   message: `The flow "${flow.meta.name}" is already running. Please stop the current flow before starting a new one.`,
  //   data: { flow },
  // }),
  // FLOW_DESTROYED: (flow: Flow) => new ThreadError({
  //   code: 'E_FLOW_DESTROYED',
  //   message: `The flow "${flow.meta.name}" has been destroyed and cannot be operated on.`,
  //   data: { flow },
  // }),

  // // Node lifecycle
  // NODE_INSTANCE_ABORTED: (node: FlowThreadNode<any, any>) => new ThreadError({
  //   code: 'E_NODE_INSTANCE_ABORTED',
  //   message: `The node instance "${node.id}" was aborted. Please check the node configuration and try again.`,
  //   data: { node },
  // }),
  // NODE_INSTANCE_MISSING_FLOW: (node: FlowThreadNode<any, any>) => new ThreadError({
  //   code: 'E_NODE_INSTANCE_FLOW_NOT_BOUND',
  //   message: `The node instance "${node.id}" does not have a flow bound to it. Please bind a flow to the node instance.`,
  //   data: { node },
  // }),

  // NODE_INSTANCE_MISSING_DEFINITION: (node: FlowThreadNode<any, any>) => new ThreadError({
  //   code: 'E_NODE_INSTANCE_MISSING_DEFINITION',
  //   message: `The node instance "${node.id}" is missing its definition. Please provide a definition for the node instance.`,
  //   data: { node },
  // }),
}
