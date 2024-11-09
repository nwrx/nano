export const ERRORS = {
  // FLOW_NO_NODE_RESOLVER: (flow: Flow) => new FlowError({
  //   code: 'E_FLOW_NO_NODE_RESOLVER',
  //   message: `Flow "${flow.meta.name}" does not have a node resolver.`,
  //   data: { flow },
  // }),
  // FLOW_NODE_RESOLVER_NO_DEFINITION: (flow: Flow, kind: string) => new FlowError({
  //   code: 'E_FLOW_NODE_RESOLVER_NO_DEFINITION',
  //   message: `Flow "${flow.meta.name}" does not have a definition for node kind "${kind}".`,
  //   data: { flow, kind },
  // }),

  // // Secrets and variables
  // FLOW_NO_SECRET_RESOLVER: (flow: Flow) => new FlowError({
  //   code: 'E_FLOW_NO_SECRET_RESOLVER',
  //   message: `Flow "${flow.meta.name}" does not have a secret resolver.`,
  //   data: { flow },
  // }),
  // FLOW_NO_VARIABLE_RESOLVER: (flow: Flow) => new FlowError({
  //   code: 'E_FLOW_NO_VARIABLE_RESOLVER',
  //   message: `Flow "${flow.meta.name}" does not have a variable resolver.`,
  //   data: { flow },
  // }),

  // // Flow lifecycle
  // FLOW_ALREADY_RUNNING: (flow: Flow) => new FlowError({
  //   code: 'E_FLOW_ALREADY_RUNNING',
  //   message: `Cannot start flow "${flow.meta.name}" because it is already running.`,
  //   data: { flow },
  // }),
  // FLOW_DESTROYED: (flow: Flow) => new FlowError({
  //   code: 'E_FLOW_DESTROYED',
  //   message: `Cannot perform operation on flow "${flow.meta.name}" because it is destroyed.`,
  //   data: { flow },
  // }),

  // // Node lifecycle
  // NODE_INSTANCE_ABORTED: (node: FlowThreadNode<any, any>) => new FlowError({
  //   code: 'E_NODE_INSTANCE_ABORTED',
  //   message: `Node instance "${node.id}" was aborted.`,
  //   data: { node },
  // }),
  // NODE_INSTANCE_MISSING_FLOW: (node: FlowThreadNode<any, any>) => new FlowError({
  //   code: 'E_NODE_INSTANCE_FLOW_NOT_BOUND',
  //   message: `Node instance "${node.id}" does not have a flow bound to it.`,
  //   data: { node },
  // }),

  // NODE_INSTANCE_MISSING_DEFINITION: (node: FlowThreadNode<any, any>) => new FlowError({
  //   code: 'E_NODE_INSTANCE_MISSING_DEFINITION',
  //   message: `Node instance "${node.id}" is missing its definition.`,
  //   data: { node },
  // }),
}
