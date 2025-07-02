/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-thenable */
/* eslint-disable sonarjs/no-duplicate-string */

export const MCP_MANAGER_SCHEMA = {
  openapi: '3.1.0',
  info: {
    title: 'NMCP',
    summary: 'Kubernetes operator for managing MCP servers',
    version: '',
  },
  paths: {
    '/api/v1/servers': {
      get: {
        tags: [
          'Server',
        ],
        summary: 'Search Servers',
        description: 'Retrieves a list of all `MCPServer` resources in the current namespace. Returns detailed information about each server, including its configuration, current status, and associated pool.',
        operationId: 'searchServers',
        responses: {
          200: {
            description: 'The `MCPServer`s were found successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/MCPServerBody',
                  },
                },
                example: [
                  {
                    args: null,
                    command: null,
                    env: [],
                    id: '551cc3e7-0a04-4b08-b0ad-f48cf2f06d96',
                    idleTimeout: 60,
                    image: 'mcp/fetch:latest',
                    name: 'example-server',
                    pool: 'default',
                    status: {
                      conditions: [],
                      currentConnections: 0,
                      lastRequestAt: null,
                      phase: 'Idle',
                      startedAt: null,
                      stoppedAt: null,
                      totalRequests: 0,
                    },
                    transport: {
                      type: 'stdio',
                    },
                  },
                  {
                    args: null,
                    command: null,
                    env: [],
                    id: '87c79f52-6cdd-4658-8827-ca021061b921',
                    idleTimeout: 60,
                    image: 'mcp/fetch:latest',
                    name: 'example-server',
                    pool: 'default',
                    status: {
                      conditions: [],
                      currentConnections: 0,
                      lastRequestAt: null,
                      phase: 'Idle',
                      startedAt: null,
                      stoppedAt: null,
                      totalRequests: 0,
                    },
                    transport: {
                      type: 'stdio',
                    },
                  },
                ],
              },
            },
          },
        },
      },
      post: {
        tags: [
          'Server',
        ],
        summary: 'Create Server',
        description: 'Creates a new `MCPServer` resource with the specified name and configuration. This initiates deployment of a Kubernetes Pod and, if applicable, a Service based on the server\'s transport type (SSE or STDIO).',
        operationId: 'createServer',
        requestBody: {
          description: 'Request body for creating a new pool',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateBody',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'The `MCPServer` was created successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MCPServerBody',
                },
                example: {
                  args: null,
                  command: null,
                  env: [],
                  id: '41436d80-3f72-4d3b-961d-8661855c2a86',
                  idleTimeout: 60,
                  image: 'mcp/fetch:latest',
                  name: 'example-server',
                  pool: 'default',
                  status: {
                    conditions: [],
                    currentConnections: 0,
                    lastRequestAt: null,
                    phase: 'Idle',
                    startedAt: null,
                    stoppedAt: null,
                    totalRequests: 0,
                  },
                  transport: {
                    type: 'stdio',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/servers/{name}': {
      get: {
        tags: [
          'Server',
        ],
        summary: 'Get Server',
        description: 'Retrieves a specific `MCPServer` by name, returning its complete configuration and current status. This includes the server\'s pool assignment, container details, transport configuration, and running state.',
        operationId: 'getServerByName',
        responses: {
          200: {
            description: 'The `MCPServer` was found successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MCPServerBody',
                },
                example: {
                  args: null,
                  command: null,
                  env: [],
                  id: 'abd1c8b5-c19c-4d42-8ab6-071f3a47f826',
                  idleTimeout: 60,
                  image: 'mcp/fetch:latest',
                  name: 'example-server',
                  pool: 'default',
                  status: {
                    conditions: [],
                    currentConnections: 0,
                    lastRequestAt: null,
                    phase: 'Idle',
                    startedAt: null,
                    stoppedAt: null,
                    totalRequests: 0,
                  },
                  transport: {
                    type: 'stdio',
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: [
          'Server',
        ],
        summary: 'Delete Server',
        description: 'Removes an `MCPServer` and cleans up all its associated Kubernetes resources. This includes terminating the server Pod and deleting any associated Service resources, ensuring complete cleanup.',
        operationId: 'deleteServer',
        responses: {
          200: {
            description: 'The MCPServer was deleted successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MCPServerBody',
                },
                example: {
                  args: null,
                  command: null,
                  env: [],
                  id: '99923bb6-a35d-471d-83ca-47abfcad9ff5',
                  idleTimeout: 60,
                  image: 'mcp/fetch:latest',
                  name: 'example-server',
                  pool: 'default',
                  status: {
                    conditions: [],
                    currentConnections: 0,
                    lastRequestAt: null,
                    phase: 'Idle',
                    startedAt: null,
                    stoppedAt: null,
                    totalRequests: 0,
                  },
                  transport: {
                    type: 'stdio',
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        tags: [
          'Server',
        ],
        summary: 'Patch Server',
        description: 'Updates the configuration of an existing `MCPServer`. This allows modifying the container image, arguments, environment variables, transport configuration, and other settings while maintaining the server\'s identity.',
        operationId: 'patchServerByName',
        requestBody: {
          description: '`MCPServer` custom resource definition',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MCPServerSpec',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'The `MCPServer` was patched successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MCPServerBody',
                },
                example: {
                  args: null,
                  command: null,
                  env: [],
                  id: '0118e0f4-f5d5-4fa5-9c20-dccff7a101ba',
                  idleTimeout: 60,
                  image: 'mcp/fetch:latest',
                  name: 'example-server',
                  pool: 'default',
                  status: {
                    conditions: [],
                    currentConnections: 0,
                    lastRequestAt: null,
                    phase: 'Idle',
                    startedAt: null,
                    stoppedAt: null,
                    totalRequests: 0,
                  },
                  transport: {
                    type: 'stdio',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/pools': {
      get: {
        tags: [
          'Pool',
        ],
        summary: 'Search Pools',
        description: 'Retrieves a list of all `MCPPool` resources in the current namespace, including their specifications and statuses. Pools manage server limits and default configurations.',
        operationId: 'searchPools',
        responses: {
          200: {
            description: 'The `MCPPool`s were found successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/MCPPoolBody',
                  },
                },
                example: [
                  {
                    defaultIdleTimeout: 60,
                    defaultResources: {},
                    id: 'd550d162-6b76-4aa4-8fff-0206a4b6bc9f',
                    maxServersActive: 100,
                    maxServersLimit: 100,
                    name: 'example-pool',
                    status: {
                      activeServersCount: 0,
                      managedServersCount: 0,
                      pendingServersCount: 0,
                      totalServersCount: 0,
                      unmanagedServersCount: 0,
                    },
                  },
                  {
                    defaultIdleTimeout: 60,
                    defaultResources: {},
                    id: '653b90bc-8493-4392-9d6c-c0066ca67bee',
                    maxServersActive: 100,
                    maxServersLimit: 100,
                    name: 'example-pool',
                    status: {
                      activeServersCount: 0,
                      managedServersCount: 0,
                      pendingServersCount: 0,
                      totalServersCount: 0,
                      unmanagedServersCount: 0,
                    },
                  },
                ],
              },
            },
          },
        },
      },
      post: {
        tags: [
          'Pool',
        ],
        summary: 'Create Pool',
        description: 'Creates a new `MCPPool` resource with the specified name and configurations. The pool defines server limits, resource allocations, and idle timeout settings that apply to all servers within it.',
        operationId: 'createPool',
        requestBody: {
          description: 'Request body for creating a new pool',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateBody2',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'The `MCPPool` was created successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MCPPoolBody',
                },
                example: {
                  defaultIdleTimeout: 60,
                  defaultResources: {},
                  id: '8870b78c-e256-4487-b87f-8e2554315c86',
                  maxServersActive: 100,
                  maxServersLimit: 100,
                  name: 'example-pool',
                  status: {
                    activeServersCount: 0,
                    managedServersCount: 0,
                    pendingServersCount: 0,
                    totalServersCount: 0,
                    unmanagedServersCount: 0,
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/pools/{name}': {
      get: {
        tags: [
          'Pool',
        ],
        summary: 'Get Pool',
        description: 'Retrieves a specific `MCPPool` by name, returning its complete specifications, status, and configuration. This includes server limits, resource requirements, and idle timeout settings.',
        operationId: 'getPoolByName',
        responses: {
          200: {
            description: 'The `MCPPool` was retrieved successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MCPPoolBody',
                },
                example: {
                  defaultIdleTimeout: 60,
                  defaultResources: {},
                  id: '75f621a8-ab1d-4dca-b11c-07ed125be476',
                  maxServersActive: 100,
                  maxServersLimit: 100,
                  name: 'example-pool',
                  status: {
                    activeServersCount: 0,
                    managedServersCount: 0,
                    pendingServersCount: 0,
                    totalServersCount: 0,
                    unmanagedServersCount: 0,
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: [
          'Pool',
        ],
        summary: 'Delete Pool',
        description: 'Removes an `MCPPool` and cleans up all associated resources. The deletion process uses Kubernetes finalizers to ensure proper cleanup of dependent resources before removing the pool completely. This includes stopping server pods, deleting server services, and verifying all cleanup operations.',
        operationId: 'deletePoolByName',
        responses: {
          200: {
            description: 'The `MCPPool` was deleted successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MCPPoolBody',
                },
                example: {
                  defaultIdleTimeout: 60,
                  defaultResources: {},
                  id: '6a4a342b-1b3e-4eb6-9f37-3a705125b734',
                  maxServersActive: 100,
                  maxServersLimit: 100,
                  name: 'example-pool',
                  status: {
                    activeServersCount: 0,
                    managedServersCount: 0,
                    pendingServersCount: 0,
                    totalServersCount: 0,
                    unmanagedServersCount: 0,
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        tags: [
          'Pool',
        ],
        summary: 'Patch Pool',
        description: 'Updates the configuration of an existing `MCPPool`. This allows modifying server limits, resource allocations, and idle timeout settings without recreating the pool.',
        operationId: 'patchPoolByName',
        requestBody: {
          description: '`McpPool` custom resource definition',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MCPPoolSpec',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: 'The `MCPPool` was patched successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MCPPoolBody',
                },
                example: {
                  defaultIdleTimeout: 60,
                  defaultResources: {},
                  id: '55a5e856-bf78-4f97-8eb1-89cd8dd9951c',
                  maxServersActive: 100,
                  maxServersLimit: 100,
                  name: 'example-pool',
                  status: {
                    activeServersCount: 0,
                    managedServersCount: 0,
                    pendingServersCount: 0,
                    totalServersCount: 0,
                    unmanagedServersCount: 0,
                  },
                },
              },
            },
          },
        },
      },
    },
    '/health/status': {
      get: {
        tags: [
          'Health',
        ],
        summary: 'Health Status',
        description: 'Retrieves the health status of the manager service, including version information and current timestamp. This endpoint provides a comprehensive health check that includes service availability and metadata.',
        operationId: 'getHealthStatus',
        responses: {
          200: {
            description: 'The service is healthy and operational.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ManagerStatus',
                },
                example: {
                  ok: true,
                  system: {
                    arch: 'x86_64',
                    availableParallelismv: 32,
                    availmem: 83580698624,
                    cpus: [
                      {
                        frequency: 5600,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5600,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5661,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5660,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5700,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5700,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5600,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5699,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5700,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5600,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5600,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5600,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 5600,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 4400,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 4369,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 4398,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 4391,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 4408,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 4410,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 4400,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                      {
                        frequency: 800,
                        model: 'Intel(R) Core(TM) i9-14900K',
                        usage: 0,
                      },
                    ],
                    family: 'unix',
                    freemem: 70920318976,
                    loadavg: [
                      0.25,
                      0.51,
                      0.62,
                    ],
                    platform: 'linux',
                    release: 'Linux (NixOS 24.11)',
                    totalmem: 101001527296,
                    uptime: 11666,
                    version: 'Linux 6.6.88',
                  },
                  uptime: 0,
                  version: '0.2.1',
                },
              },
            },
          },
        },
      },
    },
    '/health/ping': {
      get: {
        tags: [
          'Health',
        ],
        summary: 'Health Ping',
        description: 'Simple health check endpoint that returns a basic HTTP 204 status. This lightweight endpoint is ideal for load balancers, monitoring systems, and automated health checks that only need to verify service availability.',
        operationId: 'pingHealth',
        responses: {
          204: {
            description: 'The service is alive and responding to requests.',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      'ApiKeyLocation': {
        type: 'string',
        enum: [
          'query',
          'header',
          'cookie',
        ],
      },
      'Components': {
        description: 'Holds a set of reusable objects for different aspects of the OAS. All objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.',
        type: 'object',
        properties: {
          callbacks: {
            description: 'An object to hold reusable Callback Objects.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Map_of_ReferenceOr_for_PathItem',
            },
          },
          examples: {
            description: 'An object to hold reusable Example Objects.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Example',
            },
          },
          headers: {
            description: 'An object to hold reusable Header Objects.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Header',
            },
          },
          links: {
            description: 'An object to hold reusable Link Objects.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Link',
            },
          },
          parameters: {
            description: 'An object to hold reusable Parameter Objects.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Parameter',
            },
          },
          pathItems: {
            description: 'An object to hold reusable Path Item Objects.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_PathItem',
            },
          },
          requestBodies: {
            description: 'An object to hold reusable Request Body Objects.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_RequestBody',
            },
          },
          responses: {
            description: 'An object to hold reusable Response Objects.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Response',
            },
          },
          schemas: {
            description: 'An object to hold reusable Schema Objects.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/SchemaObject',
            },
          },
          securitySchemes: {
            description: 'An object to hold reusable Security Scheme Objects.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_SecurityScheme',
            },
          },
        },
        additionalProperties: true,
      },
      'Contact': {
        description: 'Contact information for the exposed API.',
        type: 'object',
        properties: {
          email: {
            description: 'The email address of the contact person/organization. This MUST be in the format of an email address.',
            type: [
              'string',
              'null',
            ],
          },
          name: {
            description: 'The identifying name of the contact person/organization.',
            type: [
              'string',
              'null',
            ],
          },
          url: {
            description: 'The URL pointing to the contact information. This MUST be in the format of a URL.',
            type: [
              'string',
              'null',
            ],
          },
        },
        additionalProperties: true,
      },
      'CookieStyle': {
        type: 'string',
        enum: [
          'form',
        ],
      },
      'CreateBody': {
        description: 'Request body for creating a new pool',
        type: 'object',
        required: [
          'name',
        ],
        properties: {
          args: {
            description: 'The arguments to pass to the server\'s command. This will be used to configure the server\'s runtime behavior, such as specifying the configuration file to use or enabling/disabling certain features.',
            default: null,
            type: [
              'array',
              'null',
            ],
            items: {
              type: 'string',
            },
          },
          command: {
            description: 'The command to run the server. This will be used to start the server\'s process inside the container.',
            default: null,
            type: [
              'array',
              'null',
            ],
            items: {
              type: 'string',
            },
          },
          env: {
            default: [],
            type: 'array',
            items: {
              $ref: '#/components/schemas/io.k8s.api.core.v1.EnvVar',
            },
          },
          idleTimeout: {
            description: 'The time in seconds that a server is allowed to run without receiving any requests before it\'s terminated. This helps to conserve resources by shutting down idle servers.',
            default: 60,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          image: {
            description: 'Container image to use for the server. This image will be pulled from the container registry and used to create the server\'s pod.',
            default: 'mcp/fetch:latest',
            type: 'string',
          },
          name: {
            description: 'Name of the pool to be created. This is a required field and should be unique within the namespace.',
            type: 'string',
          },
          pool: {
            description: 'Name of the `MCPPool` this server belongs to. This will be used to determine in which pool the server is running, thus allowing the controller to manage the server\'s lifecycle based on the pool\'s specifications.',
            default: 'default',
            type: 'string',
          },
          transport: {
            description: 'The type of transport used by the server internally. This will be used to determine how the server communicates with the container and allow us to interact with it through. This field does not affect the server\'s external communication, which is only done through HTTP/SSE protocols.\n\nThe transport type can be either `stdio` or `sse`. The `stdio` transport type is used for standard input/output communication, while the `sse` transport type is used for server-sent events. The `sse` transport type requires a port to be specified.\n\nIf you\'re unsure which transport type to use, check the documentation for the image you\'re using. Most images will support both transport types, but some may have specific requirements or limitations.',
            default: {
              type: 'stdio',
            },
            $ref: '#/components/schemas/MCPServerTransport',
          },
        },
      },
      'CreateBody2': {
        description: 'Request body for creating a new pool',
        type: 'object',
        required: [
          'name',
        ],
        properties: {
          defaultIdleTimeout: {
            description: 'The default time in seconds that a server is allowed to run without receiving any requests before it\'s terminated. This helps to conserve resources by shutting down idle servers.',
            default: 60,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          defaultResources: {
            description: 'The default resource requirements for each server in the pool. This will be used to determine the resource limits and requests for each server\'s pod. This is to ensure that each server has the necessary resources to run efficiently and effectively. This is also to prevent the pool from overwhelming the system with too many servers at once.',
            default: {},
            $ref: '#/components/schemas/io.k8s.api.core.v1.ResourceRequirements',
          },
          maxServersActive: {
            description: 'The maxcimum number of concurrent active servers that can be created in the pool. After this limit is reached, the overflow servers will be marked as "waiting" and no Pod or Service resources will be created for them until Pod and Service resources are deleted by the operator.',
            default: 100,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          maxServersLimit: {
            description: 'Maximum amount of `MCPServer` resources that can be managed by this `MCPPool`. After this limit is reached, the overflow servers will be marked as "ignored" and no Pod or Service resources will be created for them until older `MCPServer` resources are deleted.\n\nTODO: Deprecated in favor of `maxActiveServers`.',
            default: 100,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          name: {
            description: 'Name of the pool to be created. This is a required field and should be unique within the namespace.',
            type: 'string',
          },
        },
      },
      'Encoding': {
        description: 'A single encoding definition applied to a single schema property.',
        type: 'object',
        properties: {
          allowReserved: {
            description: 'Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986 :/?#[]@!$&\'()*+,;= to be included without percent-encoding. The default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded or multipart/form-data. If a value is explicitly defined, then the value of `contentType` (implicit or explicit) SHALL be ignored.',
            type: 'boolean',
          },
          contentType: {
            description: 'The Content-Type for encoding a specific property. Default value depends on the property type: for object - application/json; for array – the default is defined based on the inner type. for all other cases the default is `application/octet-stream`. The value can be a specific media type (e.g. application/json), a wildcard media type (e.g. image/*), or a comma-separated list of the two types.',
            type: [
              'string',
              'null',
            ],
          },
          explode: {
            description: 'When this is true, property values of type array or object generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this property has no effect. When style is form, the default value is true. For all other styles, the default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded or multipart/form-data. If a value is explicitly defined, then the value of `contentType` (implicit or explicit) SHALL be ignored.\n\nIn this Library this value defaults to false always despite the specification.',
            type: 'boolean',
          },
          headers: {
            description: 'A map allowing additional information to be provided as headers, for example Content-Disposition. Content-Type is described separately and SHALL be ignored in this section. This property SHALL be ignored if the request body media type is not a multipart.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Header',
            },
          },
          style: {
            description: 'Describes how a specific property value will be serialized depending on its type. See Parameter Object for details on the style property. The behavior follows the same values as query parameters, including default values. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded  or multipart/form-data. If a value is explicitly defined, then the value of `contentType` (implicit or explicit) SHALL be ignored.',
            anyOf: [
              {
                $ref: '#/components/schemas/QueryStyle',
              },
              {
                type: 'null',
              },
            ],
          },
        },
        additionalProperties: true,
      },
      'Example': {
        type: 'object',
        properties: {
          description: {
            description: 'Long description for the example. CommonMark syntax MAY be used for rich text representation.',
            type: [
              'string',
              'null',
            ],
          },
          externalValue: {
            description: 'A URI that points to the literal example. This provides the capability to reference examples that cannot easily be included in JSON or YAML documents. The `value` field and `externalValue` field are mutually exclusive. See the rules for resolving Relative References.',
            type: [
              'string',
              'null',
            ],
          },
          summary: {
            description: 'Short description for the example.',
            type: [
              'string',
              'null',
            ],
          },
          value: {
            description: 'Embedded literal example. The `value` field and `externalValue` field are mutually exclusive. To represent examples of media types that cannot naturally represented in JSON or YAML, use a string value to contain the example, escaping where necessary.',
          },
        },
        additionalProperties: true,
      },
      'ExternalDocumentation': {
        description: 'Allows referencing an external resource for extended documentation.',
        type: 'object',
        required: [
          'url',
        ],
        properties: {
          description: {
            description: 'A description of the target documentation. CommonMark syntax MAY be used for rich text representation.',
            type: [
              'string',
              'null',
            ],
          },
          url: {
            description: 'REQUIRED. The URL for the target documentation. This MUST be in the format of a URL.',
            type: 'string',
          },
        },
        additionalProperties: true,
      },
      'Header': {
        description: 'The Header Object follows the structure of the Parameter Object with the following changes:\n\n1) name MUST NOT be specified, it is given in the corresponding headers map. 2) in MUST NOT be specified, it is implicitly in header. 3) All traits that are affected by the location MUST be applicable to a location of header (for example, style).',
        type: 'object',
        oneOf: [
          {
            description: 'The schema defining the type used for the parameter.',
            type: 'object',
            required: [
              'schema',
            ],
            properties: {
              schema: {
                $ref: '#/components/schemas/SchemaObject',
              },
            },
            additionalProperties: false,
          },
          {
            description: 'A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry.',
            type: 'object',
            required: [
              'content',
            ],
            properties: {
              content: {
                type: 'object',
                additionalProperties: {
                  $ref: '#/components/schemas/MediaType',
                },
              },
            },
            additionalProperties: false,
          },
        ],
        properties: {
          deprecated: {
            description: 'Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.',
            type: [
              'boolean',
              'null',
            ],
          },
          description: {
            description: 'A brief description of the parameter. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.',
            type: [
              'string',
              'null',
            ],
          },
          example: true,
          examples: {
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Example',
            },
          },
          required: {
            description: 'Determines whether this parameter is mandatory. If the parameter location is "path", this property is REQUIRED and its value MUST be true. Otherwise, the property MAY be included and its default value is false.',
            type: 'boolean',
          },
          style: {
            default: 'simple',
            $ref: '#/components/schemas/HeaderStyle',
          },
        },
        additionalProperties: true,
      },
      'HeaderStyle': {
        type: 'string',
        enum: [
          'simple',
        ],
      },
      'Info': {
        description: 'The object provides metadata about the API. The metadata MAY be used by the clients if needed, and MAY be presented in editing or documentation generation tools for convenience.',
        type: 'object',
        required: [
          'title',
          'version',
        ],
        properties: {
          contact: {
            description: 'The contact information for the exposed API.',
            anyOf: [
              {
                $ref: '#/components/schemas/Contact',
              },
              {
                type: 'null',
              },
            ],
          },
          description: {
            description: 'A description of the API. CommonMark syntax MAY be used for rich text representation.',
            type: [
              'string',
              'null',
            ],
          },
          license: {
            description: 'The license information for the exposed API.',
            anyOf: [
              {
                $ref: '#/components/schemas/License',
              },
              {
                type: 'null',
              },
            ],
          },
          summary: {
            description: 'A short summary of the API.',
            type: [
              'string',
              'null',
            ],
          },
          termsOfService: {
            description: 'A URL to the Terms of Service for the API. This MUST be in the format of a URL.',
            type: [
              'string',
              'null',
            ],
          },
          title: {
            description: 'REQUIRED. The title of the application.',
            type: 'string',
          },
          version: {
            description: 'REQUIRED. The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API implementation version).',
            type: 'string',
          },
        },
        additionalProperties: true,
      },
      'InstanceType': {
        description: 'The possible types of values in JSON Schema documents.\n\nSee [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).',
        type: 'string',
        enum: [
          'null',
          'boolean',
          'object',
          'array',
          'number',
          'string',
          'integer',
        ],
      },
      'License': {
        description: 'License information for the exposed API.',
        type: 'object',
        required: [
          'name',
        ],
        properties: {
          identifier: {
            description: 'An [SPDX](https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60) license expression for the API. The `identifier` field is mutually exclusive of the `url` field.',
            type: [
              'string',
              'null',
            ],
          },
          name: {
            description: 'REQUIRED. The license name used for the API.',
            type: 'string',
          },
          url: {
            description: 'A URL to the license used for the API. This MUST be in the form of a URL. The `url` field is mutually exclusive of the `identifier` field.',
            type: [
              'string',
              'null',
            ],
          },
        },
        additionalProperties: true,
      },
      'Link': {
        description: 'The Link object represents a possible design-time link for a response. The presence of a link does not guarantee the caller\'s ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.\n\nUnlike dynamic links (i.e. links provided in the response payload), the OAS linking mechanism does not require link information in the runtime response.\n\nFor computing links, and providing instructions to execute them, a runtime expression is used for accessing values in an operation and using them as parameters while invoking the linked operation.',
        type: 'object',
        oneOf: [
          {
            description: 'A relative or absolute reference to an OAS operation. This field is mutually exclusive of the operationId field, and MUST point to an Operation Object. Relative operationRef values MAY be used to locate an existing Operation Object in the OpenAPI definition. See the rules for resolving Relative References.',
            type: 'object',
            required: [
              'operationRef',
            ],
            properties: {
              operationRef: {
                type: 'string',
              },
            },
            additionalProperties: false,
          },
          {
            description: 'The name of an existing, resolvable OAS operation, as defined with a unique operationId. This field is mutually exclusive of the operationRef field.',
            type: 'object',
            required: [
              'operationId',
            ],
            properties: {
              operationId: {
                type: 'string',
              },
            },
            additionalProperties: false,
          },
        ],
        properties: {
          description: {
            description: 'A description of the link. CommonMark syntax MAY be used for rich text representation.',
            type: [
              'string',
              'null',
            ],
          },
          parameters: {
            description: 'A map representing parameters to pass to an operation as specified with operationId or identified via operationRef. The key is the parameter name to be used, whereas the value can be a constant or an expression to be evaluated and passed to the linked operation. The parameter name can be qualified using the parameter location [{in}.]{name} for operations that use the same parameter name in different locations (e.g. path.id).',
            type: 'object',
            additionalProperties: true,
          },
          requestBody: {
            description: 'A literal value or {expression} to use as a request body when calling the target operation.',
          },
          server: {
            description: 'A server object to be used by the target operation.',
            anyOf: [
              {
                $ref: '#/components/schemas/Server',
              },
              {
                type: 'null',
              },
            ],
          },
        },
        additionalProperties: true,
      },
      'MCPPoolBody': {
        description: '`McpPool` custom resource definition',
        type: 'object',
        required: [
          'id',
          'name',
          'status',
        ],
        properties: {
          defaultIdleTimeout: {
            description: 'The default time in seconds that a server is allowed to run without receiving any requests before it\'s terminated. This helps to conserve resources by shutting down idle servers.',
            default: 60,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          defaultResources: {
            description: 'The default resource requirements for each server in the pool. This will be used to determine the resource limits and requests for each server\'s pod. This is to ensure that each server has the necessary resources to run efficiently and effectively. This is also to prevent the pool from overwhelming the system with too many servers at once.',
            default: {},
            $ref: '#/components/schemas/io.k8s.api.core.v1.ResourceRequirements',
          },
          id: {
            description: 'Unique identifier for the pool. This corresponds to the metadata.uid field of the Kubernetes resource associated with this pool and is used to uniquely identify the pool within the Kubernetes cluster.',
            type: 'string',
          },
          maxServersActive: {
            description: 'The maxcimum number of concurrent active servers that can be created in the pool. After this limit is reached, the overflow servers will be marked as "waiting" and no Pod or Service resources will be created for them until Pod and Service resources are deleted by the operator.',
            default: 100,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          maxServersLimit: {
            description: 'Maximum amount of `MCPServer` resources that can be managed by this `MCPPool`. After this limit is reached, the overflow servers will be marked as "ignored" and no Pod or Service resources will be created for them until older `MCPServer` resources are deleted.\n\nTODO: Deprecated in favor of `maxActiveServers`.',
            default: 100,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          name: {
            description: 'Name of the `MCPPool`. This is a human-readable name for the pool and is used to identify the pool in user interfaces and logs. It is not guaranteed to be unique across different namespaces.',
            type: 'string',
          },
          status: {
            description: 'Status of the `MCPPool`. This provides information about the current state of the pool, including the number of active, pending, unmanaged, and managed servers, as well as the total number of servers in the pool.',
            $ref: '#/components/schemas/MCPPoolStatus',
          },
        },
      },
      'MCPPoolSpec': {
        description: '`McpPool` custom resource definition',
        type: 'object',
        properties: {
          defaultIdleTimeout: {
            description: 'The default time in seconds that a server is allowed to run without receiving any requests before it\'s terminated. This helps to conserve resources by shutting down idle servers.',
            default: 60,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          defaultResources: {
            description: 'The default resource requirements for each server in the pool. This will be used to determine the resource limits and requests for each server\'s pod. This is to ensure that each server has the necessary resources to run efficiently and effectively. This is also to prevent the pool from overwhelming the system with too many servers at once.',
            default: {},
            $ref: '#/components/schemas/io.k8s.api.core.v1.ResourceRequirements',
          },
          maxServersActive: {
            description: 'The maxcimum number of concurrent active servers that can be created in the pool. After this limit is reached, the overflow servers will be marked as "waiting" and no Pod or Service resources will be created for them until Pod and Service resources are deleted by the operator.',
            default: 100,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          maxServersLimit: {
            description: 'Maximum amount of `MCPServer` resources that can be managed by this `MCPPool`. After this limit is reached, the overflow servers will be marked as "ignored" and no Pod or Service resources will be created for them until older `MCPServer` resources are deleted.\n\nTODO: Deprecated in favor of `maxActiveServers`.',
            default: 100,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
        },
      },
      'MCPPoolStatus': {
        description: 'Status of the `MCPPool` custom resource',
        type: 'object',
        required: [
          'activeServersCount',
          'managedServersCount',
          'pendingServersCount',
          'totalServersCount',
          'unmanagedServersCount',
        ],
        properties: {
          activeServersCount: {
            description: 'Number of servers currently in use (active) in the pool. Meaning that the server is running and has a pod and service created.',
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          managedServersCount: {
            description: 'Number of servers that are currently managed by the `MCPPool` controller. Meaning that the server that do not overflow the `max_servers_limit` and are being managed by the `MCPPool` controller.',
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          pendingServersCount: {
            description: 'Number of servers waiting to be created in the pool. Meaning that the server is waiting for a pod and service to be created.',
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          totalServersCount: {
            description: 'Total number of servers in the pool. This is the sum of all servers that are currently in use, waiting, ignored and managed by the `MCPPool` controller.',
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          unmanagedServersCount: {
            description: 'Number of servers that are currently unmanaged by the pool. Meaning that the they overflow the `max_servers_limit` and are not being managed by the `MCPPool` controller.',
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
        },
      },
      'MCPServerBody': {
        description: '`MCPServer` custom resource definition',
        type: 'object',
        required: [
          'id',
          'name',
          'status',
        ],
        properties: {
          args: {
            description: 'The arguments to pass to the server\'s command. This will be used to configure the server\'s runtime behavior, such as specifying the configuration file to use or enabling/disabling certain features.',
            default: null,
            type: [
              'array',
              'null',
            ],
            items: {
              type: 'string',
            },
          },
          command: {
            description: 'The command to run the server. This will be used to start the server\'s process inside the container.',
            default: null,
            type: [
              'array',
              'null',
            ],
            items: {
              type: 'string',
            },
          },
          env: {
            default: [],
            type: 'array',
            items: {
              $ref: '#/components/schemas/io.k8s.api.core.v1.EnvVar',
            },
          },
          id: {
            description: 'Unique identifier for the server',
            type: 'string',
          },
          idleTimeout: {
            description: 'The time in seconds that a server is allowed to run without receiving any requests before it\'s terminated. This helps to conserve resources by shutting down idle servers.',
            default: 60,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          image: {
            description: 'Container image to use for the server. This image will be pulled from the container registry and used to create the server\'s pod.',
            default: 'mcp/fetch:latest',
            type: 'string',
          },
          name: {
            description: 'Name of the server',
            type: 'string',
          },
          pool: {
            description: 'Name of the `MCPPool` this server belongs to. This will be used to determine in which pool the server is running, thus allowing the controller to manage the server\'s lifecycle based on the pool\'s specifications.',
            default: 'default',
            type: 'string',
          },
          status: {
            description: 'Status of the server',
            $ref: '#/components/schemas/MCPServerStatus',
          },
          transport: {
            description: 'The type of transport used by the server internally. This will be used to determine how the server communicates with the container and allow us to interact with it through. This field does not affect the server\'s external communication, which is only done through HTTP/SSE protocols.\n\nThe transport type can be either `stdio` or `sse`. The `stdio` transport type is used for standard input/output communication, while the `sse` transport type is used for server-sent events. The `sse` transport type requires a port to be specified.\n\nIf you\'re unsure which transport type to use, check the documentation for the image you\'re using. Most images will support both transport types, but some may have specific requirements or limitations.',
            default: {
              type: 'stdio',
            },
            $ref: '#/components/schemas/MCPServerTransport',
          },
        },
      },
      'MCPServerPhase': {
        description: '`MCPServerPhase` represents the current lifecycle phase of the server',
        oneOf: [
          {
            description: 'Server is not running and has no traffic',
            type: 'string',
            enum: [
              'Idle',
            ],
          },
          {
            description: 'The server has been requested to be started but is not yet running (e.g., waiting for resources to be created).',
            type: 'string',
            enum: [
              'Requested',
            ],
          },
          {
            description: 'Server is currently running and processing requests. Meaning it\'s Pod and Service are up and running.',
            type: 'string',
            enum: [
              'Running',
            ],
          },
          {
            description: 'Server is starting up and not yet ready to process requests (e.g., waiting for resources to be created or initialized).',
            type: 'string',
            enum: [
              'Starting',
            ],
          },
          {
            description: 'Server is shutting down and not processing requests (e.g., waiting for resources to be deleted or cleaned up).',
            type: 'string',
            enum: [
              'Stopping',
            ],
          },
          {
            description: 'Server is in an error state and not processing requests (e.g., due to a failure in the server or its resources).',
            type: 'string',
            enum: [
              'Failed',
            ],
          },
        ],
      },
      'MCPServerSpec': {
        description: '`MCPServer` custom resource definition',
        type: 'object',
        properties: {
          args: {
            description: 'The arguments to pass to the server\'s command. This will be used to configure the server\'s runtime behavior, such as specifying the configuration file to use or enabling/disabling certain features.',
            default: null,
            type: [
              'array',
              'null',
            ],
            items: {
              type: 'string',
            },
          },
          command: {
            description: 'The command to run the server. This will be used to start the server\'s process inside the container.',
            default: null,
            type: [
              'array',
              'null',
            ],
            items: {
              type: 'string',
            },
          },
          env: {
            default: [],
            type: 'array',
            items: {
              $ref: '#/components/schemas/io.k8s.api.core.v1.EnvVar',
            },
          },
          idleTimeout: {
            description: 'The time in seconds that a server is allowed to run without receiving any requests before it\'s terminated. This helps to conserve resources by shutting down idle servers.',
            default: 60,
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          image: {
            description: 'Container image to use for the server. This image will be pulled from the container registry and used to create the server\'s pod.',
            default: 'mcp/fetch:latest',
            type: 'string',
          },
          pool: {
            description: 'Name of the `MCPPool` this server belongs to. This will be used to determine in which pool the server is running, thus allowing the controller to manage the server\'s lifecycle based on the pool\'s specifications.',
            default: 'default',
            type: 'string',
          },
          transport: {
            description: 'The type of transport used by the server internally. This will be used to determine how the server communicates with the container and allow us to interact with it through. This field does not affect the server\'s external communication, which is only done through HTTP/SSE protocols.\n\nThe transport type can be either `stdio` or `sse`. The `stdio` transport type is used for standard input/output communication, while the `sse` transport type is used for server-sent events. The `sse` transport type requires a port to be specified.\n\nIf you\'re unsure which transport type to use, check the documentation for the image you\'re using. Most images will support both transport types, but some may have specific requirements or limitations.',
            default: {
              type: 'stdio',
            },
            $ref: '#/components/schemas/MCPServerTransport',
          },
        },
      },
      'MCPServerStatus': {
        description: '`MCPServer` status',
        type: 'object',
        required: [
          'currentConnections',
          'phase',
          'totalRequests',
        ],
        properties: {
          conditions: {
            description: 'Conditions observed on the server, following Kubernetes conditions pattern',
            default: [],
            type: 'array',
            items: {
              $ref: '#/components/schemas/io.k8s.apimachinery.pkg.apis.meta.v1.Condition',
            },
          },
          currentConnections: {
            description: 'Number of current connections to the server',
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          lastRequestAt: {
            description: 'Time of the last received request',
            type: [
              'string',
              'null',
            ],
            format: 'date-time',
          },
          phase: {
            description: 'Current phase of the server lifecycle',
            $ref: '#/components/schemas/MCPServerPhase',
          },
          startedAt: {
            description: 'Time when the server was started',
            type: [
              'string',
              'null',
            ],
            format: 'date-time',
          },
          stoppedAt: {
            description: 'Time when the server was stopped',
            type: [
              'string',
              'null',
            ],
            format: 'date-time',
          },
          totalRequests: {
            description: 'Total number of requests processed by the server',
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
        },
      },
      'MCPServerTransport': {
        title: 'MCPServer Transport Configuration',
        description: 'Configuration for the MCP server transport layer',
        type: 'object',
        required: [
          'type',
        ],
        properties: {
          port: {
            description: 'Port number for SSE transport, required when type is \'sse\'',
            type: 'integer',
          },
          type: {
            description: 'Transport type',
            type: 'string',
            enum: [
              'stdio',
              'sse',
            ],
          },
        },
      },
      'ManagerStatus': {
        description: 'Represents the health status of the manager service.',
        type: 'object',
        required: [
          'ok',
          'system',
          'uptime',
          'version',
        ],
        properties: {
          ok: {
            description: 'Indicates if the system is operational.',
            type: 'boolean',
          },
          system: {
            description: 'Optional system information.',
            $ref: '#/components/schemas/StatusSystem',
          },
          uptime: {
            description: 'The uptime of the application in seconds.',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          version: {
            description: 'The version of the application.',
            type: 'string',
          },
        },
      },
      'MediaType': {
        type: 'object',
        properties: {
          encoding: {
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/Encoding',
            },
          },
          example: true,
          examples: {
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Example',
            },
          },
          schema: {
            anyOf: [
              {
                $ref: '#/components/schemas/SchemaObject',
              },
              {
                type: 'null',
              },
            ],
          },
        },
        additionalProperties: true,
      },
      'OAuth2Flows': {
        type: 'object',
        oneOf: [
          {
            type: 'object',
            required: [
              'implicit',
            ],
            properties: {
              implicit: {
                type: 'object',
                required: [
                  'authorizationUrl',
                ],
                properties: {
                  authorizationUrl: {
                    type: 'string',
                  },
                  refreshUrl: {
                    type: [
                      'string',
                      'null',
                    ],
                  },
                  scopes: {
                    default: {},
                    type: 'object',
                    additionalProperties: {
                      type: 'string',
                    },
                  },
                },
              },
            },
            additionalProperties: false,
          },
          {
            type: 'object',
            required: [
              'password',
            ],
            properties: {
              password: {
                type: 'object',
                required: [
                  'tokenUrl',
                ],
                properties: {
                  refreshUrl: {
                    type: [
                      'string',
                      'null',
                    ],
                  },
                  scopes: {
                    default: {},
                    type: 'object',
                    additionalProperties: {
                      type: 'string',
                    },
                  },
                  tokenUrl: {
                    type: 'string',
                  },
                },
              },
            },
            additionalProperties: false,
          },
          {
            type: 'object',
            required: [
              'clientCredentials',
            ],
            properties: {
              clientCredentials: {
                type: 'object',
                required: [
                  'tokenUrl',
                ],
                properties: {
                  refreshUrl: {
                    type: [
                      'string',
                      'null',
                    ],
                  },
                  scopes: {
                    default: {},
                    type: 'object',
                    additionalProperties: {
                      type: 'string',
                    },
                  },
                  tokenUrl: {
                    type: 'string',
                  },
                },
              },
            },
            additionalProperties: false,
          },
          {
            type: 'object',
            required: [
              'authorizationCode',
            ],
            properties: {
              authorizationCode: {
                type: 'object',
                required: [
                  'authorizationUrl',
                  'tokenUrl',
                ],
                properties: {
                  authorizationUrl: {
                    type: 'string',
                  },
                  refreshUrl: {
                    type: [
                      'string',
                      'null',
                    ],
                  },
                  scopes: {
                    default: {},
                    type: 'object',
                    additionalProperties: {
                      type: 'string',
                    },
                  },
                  tokenUrl: {
                    type: 'string',
                  },
                },
              },
            },
            additionalProperties: false,
          },
        ],
      },
      'OpenApi': {
        type: 'object',
        required: [
          'info',
          'openapi',
        ],
        properties: {
          components: {
            description: 'An element to hold various schemas for the document.',
            anyOf: [
              {
                $ref: '#/components/schemas/Components',
              },
              {
                type: 'null',
              },
            ],
          },
          externalDocs: {
            description: 'Additional external documentation.',
            anyOf: [
              {
                $ref: '#/components/schemas/ExternalDocumentation',
              },
              {
                type: 'null',
              },
            ],
          },
          info: {
            description: 'REQUIRED. Provides metadata about the API. The metadata MAY be used by tooling as required.',
            $ref: '#/components/schemas/Info',
          },
          jsonSchemaDialect: {
            description: 'The default value for the `$schema` keyword within Schema Objects contained within this OAS document. This MUST be in the form of a URI.',
            type: [
              'string',
              'null',
            ],
          },
          openapi: {
            type: 'string',
          },
          paths: {
            description: 'The available paths and operations for the API.',
            anyOf: [
              {
                $ref: '#/components/schemas/Paths',
              },
              {
                type: 'null',
              },
            ],
          },
          security: {
            description: 'A declaration of which security mechanisms can be used across the API. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. Individual operations can override this definition. Global security settings may be overridden on a per-path basis.',
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
          servers: {
            description: 'An array of Server Objects, which provide connectivity information to a target server. If the servers property is not provided, or is an empty array, the default value would be a Server Object with a url value of /.',
            type: 'array',
            items: {
              $ref: '#/components/schemas/Server',
            },
          },
          tags: {
            description: 'A list of tags used by the document with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags that are not declared MAY be organized randomly or based on the tool\'s logic. Each tag name in the list MUST be unique.',
            type: 'array',
            items: {
              $ref: '#/components/schemas/Tag',
            },
          },
          webhooks: {
            description: 'The incoming webhooks that MAY be received as part of this API and that the API consumer MAY choose to implement. Closely related to the `callbacks` feature, this section describes requests initiated other than by an API call, for example by an out of band registration. The key name is a unique string to refer to each webhook, while the (optionally referenced) Path Item Object describes a request that may be initiated by the API provider and the expected responses.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_PathItem',
            },
          },
        },
        additionalProperties: true,
      },
      'Operation': {
        description: 'Describes a single API operation on a path.',
        type: 'object',
        properties: {
          callbacks: {
            description: 'Callbacks for the operation.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Map_of_ReferenceOr_for_PathItem',
            },
          },
          deprecated: {
            description: 'Declares this operation to be deprecated.Default value is false.',
            type: 'boolean',
          },
          description: {
            description: 'A verbose explanation of the operation behavior. CommonMark syntax MAY be used for rich text representation.',
            type: [
              'string',
              'null',
            ],
          },
          externalDocs: {
            description: 'Additional external documentation for this operation.',
            anyOf: [
              {
                $ref: '#/components/schemas/ExternalDocumentation',
              },
              {
                type: 'null',
              },
            ],
          },
          operationId: {
            description: 'Unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.',
            type: [
              'string',
              'null',
            ],
          },
          parameters: {
            description: 'A list of parameters that are applicable for this operation. If a parameter is already defined at the Path Item, the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the OpenAPI Object\'s components/parameters.',
            type: 'array',
            items: {
              $ref: '#/components/schemas/ReferenceOr_for_Parameter',
            },
          },
          requestBody: {
            description: 'The request body applicable for this operation. The requestBody is fully supported in HTTP methods where the HTTP 1.1 specification RFC7231 has explicitly defined semantics for request bodies. In other cases where the HTTP spec is vague (such as [GET](https://tools.ietf.org/html/rfc7231#section-4.3.1), [HEAD](https://tools.ietf.org/html/rfc7231#section-4.3.2) and [DELETE](https://tools.ietf.org/html/rfc7231#section-4.3.5)), requestBody is permitted but does not have well-defined semantics and SHOULD be avoided if possible.',
            anyOf: [
              {
                $ref: '#/components/schemas/ReferenceOr_for_RequestBody',
              },
              {
                type: 'null',
              },
            ],
          },
          responses: {
            description: 'The list of possible responses as they are returned from executing this operation.',
            anyOf: [
              {
                $ref: '#/components/schemas/Responses',
              },
              {
                type: 'null',
              },
            ],
          },
          security: {
            description: 'A declaration of which security mechanisms can be used for this operation. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. This definition overrides any declared top-level security. To remove a top-level security declaration, an empty array can be used.',
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
          servers: {
            description: 'An alternative server array to service this operation. If an alternative server object is specified at the Path Item Object or Root level, it will be overridden by this value.',
            type: 'array',
            items: {
              $ref: '#/components/schemas/Server',
            },
          },
          summary: {
            description: 'A short summary of what the operation does.',
            type: [
              'string',
              'null',
            ],
          },
          tags: {
            description: 'A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.',
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: true,
      },
      'Parameter': {
        oneOf: [
          {
            description: 'Describes a single operation parameter.\n\nA unique parameter is defined by a combination of a name and location.',
            type: 'object',
            oneOf: [
              {
                description: 'The schema defining the type used for the parameter.',
                type: 'object',
                required: [
                  'schema',
                ],
                properties: {
                  schema: {
                    $ref: '#/components/schemas/SchemaObject',
                  },
                },
                additionalProperties: false,
              },
              {
                description: 'A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry.',
                type: 'object',
                required: [
                  'content',
                ],
                properties: {
                  content: {
                    type: 'object',
                    additionalProperties: {
                      $ref: '#/components/schemas/MediaType',
                    },
                  },
                },
                additionalProperties: false,
              },
            ],
            required: [
              'in',
              'name',
            ],
            properties: {
              allow_empty_value: {
                description: 'Sets the ability to pass empty-valued parameters. This is valid only for query parameters and allows sending a parameter with an empty value. Default value is false. If style is used, and if behavior is n/a (cannot be serialized), the value of allowEmptyValue SHALL be ignored.',
                type: [
                  'boolean',
                  'null',
                ],
              },
              allow_reserved: {
                description: 'Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986 :/?#[]@!$&\'()*+,;= to be included without percent-encoding. This property only applies to parameters with an in value of query. The default value is false.',
                type: 'boolean',
              },
              deprecated: {
                description: 'Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.',
                type: [
                  'boolean',
                  'null',
                ],
              },
              description: {
                description: 'A brief description of the parameter. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.',
                type: [
                  'string',
                  'null',
                ],
              },
              example: true,
              examples: {
                type: 'object',
                additionalProperties: {
                  $ref: '#/components/schemas/ReferenceOr_for_Example',
                },
              },
              explode: {
                type: [
                  'boolean',
                  'null',
                ],
              },
              in: {
                type: 'string',
                enum: [
                  'query',
                ],
              },
              name: {
                description: 'REQUIRED. The name of the parameter. Parameter names are case sensitive. If in is "path", the name field MUST correspond to the associated path segment from the path field in the Paths Object. See Path Templating for further information.\n\nIf in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.\n\nFor all other cases, the name corresponds to the parameter name used by the in property.',
                type: 'string',
              },
              required: {
                description: 'Determines whether this parameter is mandatory. If the parameter location is "path", this property is REQUIRED and its value MUST be true. Otherwise, the property MAY be included and its default value is false.',
                type: 'boolean',
              },
              style: {
                description: 'Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form.',
                default: 'form',
                $ref: '#/components/schemas/QueryStyle',
              },
            },
            additionalProperties: true,
          },
          {
            description: 'Describes a single operation parameter.\n\nA unique parameter is defined by a combination of a name and location.',
            type: 'object',
            oneOf: [
              {
                description: 'The schema defining the type used for the parameter.',
                type: 'object',
                required: [
                  'schema',
                ],
                properties: {
                  schema: {
                    $ref: '#/components/schemas/SchemaObject',
                  },
                },
                additionalProperties: false,
              },
              {
                description: 'A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry.',
                type: 'object',
                required: [
                  'content',
                ],
                properties: {
                  content: {
                    type: 'object',
                    additionalProperties: {
                      $ref: '#/components/schemas/MediaType',
                    },
                  },
                },
                additionalProperties: false,
              },
            ],
            required: [
              'in',
              'name',
            ],
            properties: {
              deprecated: {
                description: 'Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.',
                type: [
                  'boolean',
                  'null',
                ],
              },
              description: {
                description: 'A brief description of the parameter. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.',
                type: [
                  'string',
                  'null',
                ],
              },
              example: true,
              examples: {
                type: 'object',
                additionalProperties: {
                  $ref: '#/components/schemas/ReferenceOr_for_Example',
                },
              },
              explode: {
                type: [
                  'boolean',
                  'null',
                ],
              },
              in: {
                type: 'string',
                enum: [
                  'header',
                ],
              },
              name: {
                description: 'REQUIRED. The name of the parameter. Parameter names are case sensitive. If in is "path", the name field MUST correspond to the associated path segment from the path field in the Paths Object. See Path Templating for further information.\n\nIf in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.\n\nFor all other cases, the name corresponds to the parameter name used by the in property.',
                type: 'string',
              },
              required: {
                description: 'Determines whether this parameter is mandatory. If the parameter location is "path", this property is REQUIRED and its value MUST be true. Otherwise, the property MAY be included and its default value is false.',
                type: 'boolean',
              },
              style: {
                description: 'Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form.',
                default: 'simple',
                $ref: '#/components/schemas/HeaderStyle',
              },
            },
            additionalProperties: true,
          },
          {
            description: 'Describes a single operation parameter.\n\nA unique parameter is defined by a combination of a name and location.',
            type: 'object',
            oneOf: [
              {
                description: 'The schema defining the type used for the parameter.',
                type: 'object',
                required: [
                  'schema',
                ],
                properties: {
                  schema: {
                    $ref: '#/components/schemas/SchemaObject',
                  },
                },
                additionalProperties: false,
              },
              {
                description: 'A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry.',
                type: 'object',
                required: [
                  'content',
                ],
                properties: {
                  content: {
                    type: 'object',
                    additionalProperties: {
                      $ref: '#/components/schemas/MediaType',
                    },
                  },
                },
                additionalProperties: false,
              },
            ],
            required: [
              'in',
              'name',
            ],
            properties: {
              deprecated: {
                description: 'Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.',
                type: [
                  'boolean',
                  'null',
                ],
              },
              description: {
                description: 'A brief description of the parameter. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.',
                type: [
                  'string',
                  'null',
                ],
              },
              example: true,
              examples: {
                type: 'object',
                additionalProperties: {
                  $ref: '#/components/schemas/ReferenceOr_for_Example',
                },
              },
              explode: {
                type: [
                  'boolean',
                  'null',
                ],
              },
              in: {
                type: 'string',
                enum: [
                  'path',
                ],
              },
              name: {
                description: 'REQUIRED. The name of the parameter. Parameter names are case sensitive. If in is "path", the name field MUST correspond to the associated path segment from the path field in the Paths Object. See Path Templating for further information.\n\nIf in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.\n\nFor all other cases, the name corresponds to the parameter name used by the in property.',
                type: 'string',
              },
              required: {
                description: 'Determines whether this parameter is mandatory. If the parameter location is "path", this property is REQUIRED and its value MUST be true. Otherwise, the property MAY be included and its default value is false.',
                type: 'boolean',
              },
              style: {
                description: 'Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form.',
                default: 'simple',
                $ref: '#/components/schemas/PathStyle',
              },
            },
            additionalProperties: true,
          },
          {
            description: 'Describes a single operation parameter.\n\nA unique parameter is defined by a combination of a name and location.',
            type: 'object',
            oneOf: [
              {
                description: 'The schema defining the type used for the parameter.',
                type: 'object',
                required: [
                  'schema',
                ],
                properties: {
                  schema: {
                    $ref: '#/components/schemas/SchemaObject',
                  },
                },
                additionalProperties: false,
              },
              {
                description: 'A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry.',
                type: 'object',
                required: [
                  'content',
                ],
                properties: {
                  content: {
                    type: 'object',
                    additionalProperties: {
                      $ref: '#/components/schemas/MediaType',
                    },
                  },
                },
                additionalProperties: false,
              },
            ],
            required: [
              'in',
              'name',
            ],
            properties: {
              deprecated: {
                description: 'Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.',
                type: [
                  'boolean',
                  'null',
                ],
              },
              description: {
                description: 'A brief description of the parameter. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.',
                type: [
                  'string',
                  'null',
                ],
              },
              example: true,
              examples: {
                type: 'object',
                additionalProperties: {
                  $ref: '#/components/schemas/ReferenceOr_for_Example',
                },
              },
              explode: {
                type: [
                  'boolean',
                  'null',
                ],
              },
              in: {
                type: 'string',
                enum: [
                  'cookie',
                ],
              },
              name: {
                description: 'REQUIRED. The name of the parameter. Parameter names are case sensitive. If in is "path", the name field MUST correspond to the associated path segment from the path field in the Paths Object. See Path Templating for further information.\n\nIf in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.\n\nFor all other cases, the name corresponds to the parameter name used by the in property.',
                type: 'string',
              },
              required: {
                description: 'Determines whether this parameter is mandatory. If the parameter location is "path", this property is REQUIRED and its value MUST be true. Otherwise, the property MAY be included and its default value is false.',
                type: 'boolean',
              },
              style: {
                description: 'Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form.',
                default: 'form',
                $ref: '#/components/schemas/CookieStyle',
              },
            },
            additionalProperties: true,
          },
        ],
      },
      'PathItem': {
        description: 'Describes the operations available on a single path. A Path Item MAY be empty, due to ACL constraints. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.',
        type: 'object',
        properties: {
          $ref: {
            description: 'Allows for a referenced definition of this path item. The referenced structure MUST be in the form of a Path Item Object.  In case a Path Item Object field appears both in the defined object and the referenced object, the behavior is undefined. See the rules for resolving Relative References.',
            type: [
              'string',
              'null',
            ],
          },
          delete: {
            anyOf: [
              {
                $ref: '#/components/schemas/Operation',
              },
              {
                type: 'null',
              },
            ],
          },
          description: {
            description: 'An optional, string description, intended to apply to all operations in this path. CommonMark syntax MAY be used for rich text representation.',
            type: [
              'string',
              'null',
            ],
          },
          get: {
            anyOf: [
              {
                $ref: '#/components/schemas/Operation',
              },
              {
                type: 'null',
              },
            ],
          },
          head: {
            anyOf: [
              {
                $ref: '#/components/schemas/Operation',
              },
              {
                type: 'null',
              },
            ],
          },
          options: {
            anyOf: [
              {
                $ref: '#/components/schemas/Operation',
              },
              {
                type: 'null',
              },
            ],
          },
          parameters: {
            description: 'A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the OpenAPI Object\'s components/parameters.',
            type: 'array',
            items: {
              $ref: '#/components/schemas/ReferenceOr_for_Parameter',
            },
          },
          patch: {
            anyOf: [
              {
                $ref: '#/components/schemas/Operation',
              },
              {
                type: 'null',
              },
            ],
          },
          post: {
            anyOf: [
              {
                $ref: '#/components/schemas/Operation',
              },
              {
                type: 'null',
              },
            ],
          },
          put: {
            anyOf: [
              {
                $ref: '#/components/schemas/Operation',
              },
              {
                type: 'null',
              },
            ],
          },
          servers: {
            description: 'An alternative server array to service all operations in this path.',
            type: 'array',
            items: {
              $ref: '#/components/schemas/Server',
            },
          },
          summary: {
            description: 'An optional, string summary, intended to apply to all operations in this path.',
            type: [
              'string',
              'null',
            ],
          },
          trace: {
            anyOf: [
              {
                $ref: '#/components/schemas/Operation',
              },
              {
                type: 'null',
              },
            ],
          },
        },
        additionalProperties: true,
      },
      'PathStyle': {
        type: 'string',
        enum: [
          'matrix',
          'label',
          'simple',
        ],
      },
      'Paths': {
        description: 'Holds the relative paths to the individual endpoints and their operations. The path is appended to the URL from the Server Object in order to construct the full URL. The Paths MAY be empty, due to Access Control List (ACL) constraints.',
        type: 'object',
        additionalProperties: true,
      },
      'QueryStyle': {
        type: 'string',
        enum: [
          'form',
          'spaceDelimited',
          'pipeDelimited',
          'deepObject',
        ],
      },
      'ReferenceOr_for_Example': {
        anyOf: [
          {
            type: 'object',
            required: [
              '$ref',
            ],
            properties: {
              $ref: {
                description: 'REQUIRED. The reference identifier. This MUST be in the form of a URI.',
                type: 'string',
              },
              description: {
                description: 'A description which by default SHOULD override that of the referenced component. CommonMark syntax MAY be used for rich text representation. If the referenced object-type does not allow a `description` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
              summary: {
                description: 'A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a `summary` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
            },
          },
          {
            $ref: '#/components/schemas/Example',
          },
        ],
      },
      'ReferenceOr_for_Header': {
        anyOf: [
          {
            type: 'object',
            required: [
              '$ref',
            ],
            properties: {
              $ref: {
                description: 'REQUIRED. The reference identifier. This MUST be in the form of a URI.',
                type: 'string',
              },
              description: {
                description: 'A description which by default SHOULD override that of the referenced component. CommonMark syntax MAY be used for rich text representation. If the referenced object-type does not allow a `description` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
              summary: {
                description: 'A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a `summary` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
            },
          },
          {
            $ref: '#/components/schemas/Header',
          },
        ],
      },
      'ReferenceOr_for_Link': {
        anyOf: [
          {
            type: 'object',
            required: [
              '$ref',
            ],
            properties: {
              $ref: {
                description: 'REQUIRED. The reference identifier. This MUST be in the form of a URI.',
                type: 'string',
              },
              description: {
                description: 'A description which by default SHOULD override that of the referenced component. CommonMark syntax MAY be used for rich text representation. If the referenced object-type does not allow a `description` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
              summary: {
                description: 'A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a `summary` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
            },
          },
          {
            $ref: '#/components/schemas/Link',
          },
        ],
      },
      'ReferenceOr_for_Map_of_ReferenceOr_for_PathItem': {
        anyOf: [
          {
            type: 'object',
            required: [
              '$ref',
            ],
            properties: {
              $ref: {
                description: 'REQUIRED. The reference identifier. This MUST be in the form of a URI.',
                type: 'string',
              },
              description: {
                description: 'A description which by default SHOULD override that of the referenced component. CommonMark syntax MAY be used for rich text representation. If the referenced object-type does not allow a `description` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
              summary: {
                description: 'A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a `summary` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
            },
          },
          {
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_PathItem',
            },
          },
        ],
      },
      'ReferenceOr_for_Parameter': {
        anyOf: [
          {
            type: 'object',
            required: [
              '$ref',
            ],
            properties: {
              $ref: {
                description: 'REQUIRED. The reference identifier. This MUST be in the form of a URI.',
                type: 'string',
              },
              description: {
                description: 'A description which by default SHOULD override that of the referenced component. CommonMark syntax MAY be used for rich text representation. If the referenced object-type does not allow a `description` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
              summary: {
                description: 'A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a `summary` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
            },
          },
          {
            $ref: '#/components/schemas/Parameter',
          },
        ],
      },
      'ReferenceOr_for_PathItem': {
        anyOf: [
          {
            type: 'object',
            required: [
              '$ref',
            ],
            properties: {
              $ref: {
                description: 'REQUIRED. The reference identifier. This MUST be in the form of a URI.',
                type: 'string',
              },
              description: {
                description: 'A description which by default SHOULD override that of the referenced component. CommonMark syntax MAY be used for rich text representation. If the referenced object-type does not allow a `description` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
              summary: {
                description: 'A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a `summary` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
            },
          },
          {
            $ref: '#/components/schemas/PathItem',
          },
        ],
      },
      'ReferenceOr_for_RequestBody': {
        anyOf: [
          {
            type: 'object',
            required: [
              '$ref',
            ],
            properties: {
              $ref: {
                description: 'REQUIRED. The reference identifier. This MUST be in the form of a URI.',
                type: 'string',
              },
              description: {
                description: 'A description which by default SHOULD override that of the referenced component. CommonMark syntax MAY be used for rich text representation. If the referenced object-type does not allow a `description` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
              summary: {
                description: 'A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a `summary` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
            },
          },
          {
            $ref: '#/components/schemas/RequestBody',
          },
        ],
      },
      'ReferenceOr_for_Response': {
        anyOf: [
          {
            type: 'object',
            required: [
              '$ref',
            ],
            properties: {
              $ref: {
                description: 'REQUIRED. The reference identifier. This MUST be in the form of a URI.',
                type: 'string',
              },
              description: {
                description: 'A description which by default SHOULD override that of the referenced component. CommonMark syntax MAY be used for rich text representation. If the referenced object-type does not allow a `description` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
              summary: {
                description: 'A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a `summary` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
            },
          },
          {
            $ref: '#/components/schemas/Response',
          },
        ],
      },
      'ReferenceOr_for_SecurityScheme': {
        anyOf: [
          {
            type: 'object',
            required: [
              '$ref',
            ],
            properties: {
              $ref: {
                description: 'REQUIRED. The reference identifier. This MUST be in the form of a URI.',
                type: 'string',
              },
              description: {
                description: 'A description which by default SHOULD override that of the referenced component. CommonMark syntax MAY be used for rich text representation. If the referenced object-type does not allow a `description` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
              summary: {
                description: 'A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a `summary` field, then this field has no effect.',
                type: [
                  'string',
                  'null',
                ],
              },
            },
          },
          {
            $ref: '#/components/schemas/SecurityScheme',
          },
        ],
      },
      'RequestBody': {
        type: 'object',
        properties: {
          content: {
            description: 'REQUIRED. The content of the request body. The key is a media type or media type range and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/MediaType',
            },
          },
          description: {
            description: 'A brief description of the request body. This could contain examples of use. CommonMark syntax MAY be used for rich text representation.',
            type: [
              'string',
              'null',
            ],
          },
          required: {
            description: 'Determines if the request body is required in the request. Defaults to false.',
            type: 'boolean',
          },
        },
        additionalProperties: true,
      },
      'Response': {
        type: 'object',
        required: [
          'description',
        ],
        properties: {
          content: {
            description: 'A map containing descriptions of potential response payloads. The key is a media type or media type range and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/MediaType',
            },
          },
          description: {
            description: 'REQUIRED. A description of the response. CommonMark syntax MAY be used for rich text representation.',
            type: 'string',
          },
          headers: {
            description: 'Maps a header name to its definition. RFC7230 states header names are case insensitive. If a response header is defined with the name "Content-Type", it SHALL be ignored.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Header',
            },
          },
          links: {
            description: 'A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for Component Objects.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ReferenceOr_for_Link',
            },
          },
        },
        additionalProperties: true,
      },
      'Responses': {
        type: 'object',
        properties: {
          default: {
            description: 'The documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses.',
            anyOf: [
              {
                $ref: '#/components/schemas/ReferenceOr_for_Response',
              },
              {
                type: 'null',
              },
            ],
          },
        },
        additionalProperties: true,
      },
      'Schema': {
        description: 'A JSON Schema.',
        anyOf: [
          {
            description: 'A trivial boolean JSON Schema.\n\nThe schema `true` matches everything (always passes validation), whereas the schema `false` matches nothing (always fails validation).',
            type: 'boolean',
          },
          {
            description: 'A JSON Schema object.',
            $ref: '#/components/schemas/SchemaObject2',
          },
        ],
      },
      'SchemaObject': {
        description: 'A JSON Schema.',
        type: 'object',
        anyOf: [
          {
            description: 'A trivial boolean JSON Schema.\n\nThe schema `true` matches everything (always passes validation), whereas the schema `false` matches nothing (always fails validation).',
            type: 'boolean',
          },
          {
            description: 'A JSON Schema object.',
            $ref: '#/components/schemas/SchemaObject2',
          },
        ],
        properties: {
          example: {
            description: 'A free-form property to include an example of an instance for this schema. To represent examples that cannot be naturally represented in JSON or YAML, a string value can be used to contain the example with escaping where necessary. **Deprecated:** The `example` property has been deprecated in favor of the JSON Schema `examples` keyword. Use of `example` is discouraged, and later versions of this specification may remove it.',
          },
          externalDocs: {
            description: 'Additional external documentation for this schema.',
            anyOf: [
              {
                $ref: '#/components/schemas/ExternalDocumentation',
              },
              {
                type: 'null',
              },
            ],
          },
        },
      },
      'SchemaObject2': {
        description: 'A JSON Schema object.',
        type: 'object',
        properties: {
          $id: {
            description: 'The `$id` keyword.\n\nSee [JSON Schema 8.2.2. The "$id" Keyword](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.2).',
            type: [
              'string',
              'null',
            ],
          },
          $ref: {
            description: 'The `$ref` keyword.\n\nSee [JSON Schema 8.2.4.1. Direct References with "$ref"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.4.1).',
            type: [
              'string',
              'null',
            ],
          },
          additionalItems: {
            description: 'The `additionalItems` keyword.\n\nSee [JSON Schema 9.3.1.2. "additionalItems"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.2).',
            anyOf: [
              {
                $ref: '#/components/schemas/Schema',
              },
              {
                type: 'null',
              },
            ],
          },
          additionalProperties: {
            description: 'The `additionalProperties` keyword.\n\nSee [JSON Schema 9.3.2.3. "additionalProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.3).',
            anyOf: [
              {
                $ref: '#/components/schemas/Schema',
              },
              {
                type: 'null',
              },
            ],
          },
          allOf: {
            description: 'The `allOf` keyword.\n\nSee [JSON Schema 9.2.1.1. "allOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.1).',
            type: [
              'array',
              'null',
            ],
            items: {
              $ref: '#/components/schemas/Schema',
            },
          },
          anyOf: {
            description: 'The `anyOf` keyword.\n\nSee [JSON Schema 9.2.1.2. "anyOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.2).',
            type: [
              'array',
              'null',
            ],
            items: {
              $ref: '#/components/schemas/Schema',
            },
          },
          const: {
            description: 'The `const` keyword.\n\nSee [JSON Schema Validation 6.1.3. "const"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.3)',
          },
          contains: {
            description: 'The `contains` keyword.\n\nSee [JSON Schema 9.3.1.4. "contains"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.4).',
            anyOf: [
              {
                $ref: '#/components/schemas/Schema',
              },
              {
                type: 'null',
              },
            ],
          },
          default: {
            description: 'The `default` keyword.\n\nSee [JSON Schema Validation 9.2. "default"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.2).',
          },
          deprecated: {
            description: 'The `deprecated` keyword.\n\nSee [JSON Schema Validation 9.3. "deprecated"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.3).',
            type: 'boolean',
          },
          description: {
            description: 'The `description` keyword.\n\nSee [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).',
            type: [
              'string',
              'null',
            ],
          },
          else: {
            description: 'The `else` keyword.\n\nSee [JSON Schema 9.2.2.3. "else"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.3).',
            anyOf: [
              {
                $ref: '#/components/schemas/Schema',
              },
              {
                type: 'null',
              },
            ],
          },
          enum: {
            description: 'The `enum` keyword.\n\nSee [JSON Schema Validation 6.1.2. "enum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.2)',
            type: [
              'array',
              'null',
            ],
            items: true,
          },
          examples: {
            description: 'The `examples` keyword.\n\nSee [JSON Schema Validation 9.5. "examples"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.5).',
            type: 'array',
            items: true,
          },
          exclusiveMaximum: {
            description: 'The `exclusiveMaximum` keyword.\n\nSee [JSON Schema Validation 6.2.3. "exclusiveMaximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.3).',
            type: [
              'number',
              'null',
            ],
            format: 'double',
          },
          exclusiveMinimum: {
            description: 'The `exclusiveMinimum` keyword.\n\nSee [JSON Schema Validation 6.2.5. "exclusiveMinimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.5).',
            type: [
              'number',
              'null',
            ],
            format: 'double',
          },
          format: {
            description: 'The `format` keyword.\n\nSee [JSON Schema Validation 7. A Vocabulary for Semantic Content With "format"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-7).',
            type: [
              'string',
              'null',
            ],
          },
          if: {
            description: 'The `if` keyword.\n\nSee [JSON Schema 9.2.2.1. "if"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.1).',
            anyOf: [
              {
                $ref: '#/components/schemas/Schema',
              },
              {
                type: 'null',
              },
            ],
          },
          items: {
            description: 'The `items` keyword.\n\nSee [JSON Schema 9.3.1.1. "items"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.1).',
            anyOf: [
              {
                $ref: '#/components/schemas/SingleOrVec_for_Schema',
              },
              {
                type: 'null',
              },
            ],
          },
          maxItems: {
            description: 'The `maxItems` keyword.\n\nSee [JSON Schema Validation 6.4.1. "maxItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.1).',
            type: [
              'integer',
              'null',
            ],
            format: 'uint32',
            minimum: 0,
          },
          maxLength: {
            description: 'The `maxLength` keyword.\n\nSee [JSON Schema Validation 6.3.1. "maxLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.1).',
            type: [
              'integer',
              'null',
            ],
            format: 'uint32',
            minimum: 0,
          },
          maxProperties: {
            description: 'The `maxProperties` keyword.\n\nSee [JSON Schema Validation 6.5.1. "maxProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.1).',
            type: [
              'integer',
              'null',
            ],
            format: 'uint32',
            minimum: 0,
          },
          maximum: {
            description: 'The `maximum` keyword.\n\nSee [JSON Schema Validation 6.2.2. "maximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.2).',
            type: [
              'number',
              'null',
            ],
            format: 'double',
          },
          minItems: {
            description: 'The `minItems` keyword.\n\nSee [JSON Schema Validation 6.4.2. "minItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.2).',
            type: [
              'integer',
              'null',
            ],
            format: 'uint32',
            minimum: 0,
          },
          minLength: {
            description: 'The `minLength` keyword.\n\nSee [JSON Schema Validation 6.3.2. "minLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.2).',
            type: [
              'integer',
              'null',
            ],
            format: 'uint32',
            minimum: 0,
          },
          minProperties: {
            description: 'The `minProperties` keyword.\n\nSee [JSON Schema Validation 6.5.2. "minProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.2).',
            type: [
              'integer',
              'null',
            ],
            format: 'uint32',
            minimum: 0,
          },
          minimum: {
            description: 'The `minimum` keyword.\n\nSee [JSON Schema Validation 6.2.4. "minimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.4).',
            type: [
              'number',
              'null',
            ],
            format: 'double',
          },
          multipleOf: {
            description: 'The `multipleOf` keyword.\n\nSee [JSON Schema Validation 6.2.1. "multipleOf"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.1).',
            type: [
              'number',
              'null',
            ],
            format: 'double',
          },
          not: {
            description: 'The `not` keyword.\n\nSee [JSON Schema 9.2.1.4. "not"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.4).',
            anyOf: [
              {
                $ref: '#/components/schemas/Schema',
              },
              {
                type: 'null',
              },
            ],
          },
          oneOf: {
            description: 'The `oneOf` keyword.\n\nSee [JSON Schema 9.2.1.3. "oneOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.3).',
            type: [
              'array',
              'null',
            ],
            items: {
              $ref: '#/components/schemas/Schema',
            },
          },
          pattern: {
            description: 'The `pattern` keyword.\n\nSee [JSON Schema Validation 6.3.3. "pattern"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.3).',
            type: [
              'string',
              'null',
            ],
          },
          patternProperties: {
            description: 'The `patternProperties` keyword.\n\nSee [JSON Schema 9.3.2.2. "patternProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.2).',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/Schema',
            },
          },
          properties: {
            description: 'The `properties` keyword.\n\nSee [JSON Schema 9.3.2.1. "properties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.1).',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/Schema',
            },
          },
          propertyNames: {
            description: 'The `propertyNames` keyword.\n\nSee [JSON Schema 9.3.2.5. "propertyNames"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.5).',
            anyOf: [
              {
                $ref: '#/components/schemas/Schema',
              },
              {
                type: 'null',
              },
            ],
          },
          readOnly: {
            description: 'The `readOnly` keyword.\n\nSee [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).',
            type: 'boolean',
          },
          required: {
            description: 'The `required` keyword.\n\nSee [JSON Schema Validation 6.5.3. "required"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.3).',
            type: 'array',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
          then: {
            description: 'The `then` keyword.\n\nSee [JSON Schema 9.2.2.2. "then"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.2).',
            anyOf: [
              {
                $ref: '#/components/schemas/Schema',
              },
              {
                type: 'null',
              },
            ],
          },
          title: {
            description: 'The `title` keyword.\n\nSee [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).',
            type: [
              'string',
              'null',
            ],
          },
          type: {
            description: 'The `type` keyword.\n\nSee [JSON Schema Validation 6.1.1. "type"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.1) and [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).',
            anyOf: [
              {
                $ref: '#/components/schemas/SingleOrVec_for_InstanceType',
              },
              {
                type: 'null',
              },
            ],
          },
          uniqueItems: {
            description: 'The `uniqueItems` keyword.\n\nSee [JSON Schema Validation 6.4.3. "uniqueItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.3).',
            type: [
              'boolean',
              'null',
            ],
          },
          writeOnly: {
            description: 'The `writeOnly` keyword.\n\nSee [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).',
            type: 'boolean',
          },
        },
        additionalProperties: true,
      },
      'SecurityScheme': {
        description: 'Defines a security scheme that can be used by the operations. Supported schemes are HTTP authentication, an API key (either as a header or as a query parameter), OAuth2\'s common flows (implicit, password, application and access code) as defined in RFC6749, and OpenID Connect Discovery.',
        oneOf: [
          {
            type: 'object',
            required: [
              'in',
              'name',
              'type',
            ],
            properties: {
              description: {
                type: [
                  'string',
                  'null',
                ],
              },
              in: {
                $ref: '#/components/schemas/ApiKeyLocation',
              },
              name: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: [
                  'apiKey',
                ],
              },
            },
            additionalProperties: true,
          },
          {
            type: 'object',
            required: [
              'scheme',
              'type',
            ],
            properties: {
              bearerFormat: {
                type: [
                  'string',
                  'null',
                ],
              },
              description: {
                type: [
                  'string',
                  'null',
                ],
              },
              scheme: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: [
                  'http',
                ],
              },
            },
            additionalProperties: true,
          },
          {
            type: 'object',
            required: [
              'flows',
              'type',
            ],
            properties: {
              description: {
                type: [
                  'string',
                  'null',
                ],
              },
              flows: {
                $ref: '#/components/schemas/OAuth2Flows',
              },
              type: {
                type: 'string',
                enum: [
                  'oauth2',
                ],
              },
            },
            additionalProperties: true,
          },
          {
            type: 'object',
            required: [
              'openIdConnectUrl',
              'type',
            ],
            properties: {
              description: {
                type: [
                  'string',
                  'null',
                ],
              },
              openIdConnectUrl: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: [
                  'openIdConnect',
                ],
              },
            },
            additionalProperties: true,
          },
          {
            type: 'object',
            required: [
              'type',
            ],
            properties: {
              description: {
                type: [
                  'string',
                  'null',
                ],
              },
              type: {
                type: 'string',
                enum: [
                  'mutualTLS',
                ],
              },
            },
            additionalProperties: true,
          },
        ],
      },
      'Server': {
        description: 'An object representing a Server.',
        type: 'object',
        required: [
          'url',
        ],
        properties: {
          description: {
            description: 'An optional string describing the host designated by the URL. CommonMark syntax MAY be used for rich text representation.',
            type: [
              'string',
              'null',
            ],
          },
          url: {
            description: 'REQUIRED. A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenAPI document is being served. Variable substitutions will be made when a variable is named in {brackets}.',
            type: 'string',
          },
          variables: {
            description: 'A map between a variable name and its value. The value is used for substitution in the server\'s URL template.',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/ServerVariable',
            },
          },
        },
        additionalProperties: true,
      },
      'ServerVariable': {
        description: 'An object representing a Server Variable for server URL template substitution.',
        type: 'object',
        required: [
          'default',
        ],
        properties: {
          default: {
            description: 'REQUIRED. The default value to use for substitution, and to send, if an alternate value is not supplied. Unlike the Schema Object\'s default, this value MUST be provided by the consumer.',
            type: 'string',
          },
          description: {
            description: 'An optional description for the server variable. CommonMark syntax MAY be used for rich text representation.',
            type: [
              'string',
              'null',
            ],
          },
          enum: {
            description: 'An enumeration of string values to be used if the substitution options are from a limited set.',
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: true,
      },
      'SingleOrVec_for_InstanceType': {
        description: 'A type which can be serialized as a single item, or multiple items.\n\nIn some contexts, a `Single` may be semantically distinct from a `Vec` containing only item.',
        anyOf: [
          {
            $ref: '#/components/schemas/InstanceType',
          },
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/InstanceType',
            },
          },
        ],
      },
      'SingleOrVec_for_Schema': {
        description: 'A type which can be serialized as a single item, or multiple items.\n\nIn some contexts, a `Single` may be semantically distinct from a `Vec` containing only item.',
        anyOf: [
          {
            $ref: '#/components/schemas/Schema',
          },
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Schema',
            },
          },
        ],
      },
      'StatusSystem': {
        type: 'object',
        required: [
          'arch',
          'availableParallelismv',
          'availmem',
          'cpus',
          'family',
          'freemem',
          'loadavg',
          'platform',
          'release',
          'totalmem',
          'uptime',
          'version',
        ],
        properties: {
          arch: {
            description: 'The architecture of the CPU (e.g., `x86_64`, `arm64`).',
            type: 'string',
          },
          availableParallelismv: {
            description: 'The number of available parallelism threads.',
            type: 'integer',
            format: 'uint',
            minimum: 0,
          },
          availmem: {
            description: 'The amount of available memory in bytes (total memory - free memory).',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          cpus: {
            description: 'A list of CPU information.',
            type: 'array',
            items: {
              $ref: '#/components/schemas/StatusSystemCpu',
            },
          },
          family: {
            description: 'The family of the CPU architecture (e.g., `x86`, `arm`).',
            type: 'string',
          },
          freemem: {
            description: 'The amount of free memory in bytes.',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          loadavg: {
            description: 'The load average over the last 1, 5, and 15 minutes.',
            type: 'array',
            items: {
              type: 'number',
              format: 'double',
            },
            maxItems: 3,
            minItems: 3,
          },
          platform: {
            description: 'The platform the system is running on (e.g., `linux`, `windows`, `darwin`).',
            type: 'string',
          },
          release: {
            description: 'The release version of the operating system.',
            type: 'string',
          },
          totalmem: {
            description: 'The total amount of memory in bytes.',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          uptime: {
            description: 'The uptime of the system in seconds.',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          version: {
            description: 'The version of the kernel.',
            type: 'string',
          },
        },
      },
      'StatusSystemCpu': {
        type: 'object',
        required: [
          'frequency',
          'model',
          'usage',
        ],
        properties: {
          frequency: {
            description: 'The frequency of the CPU in MHz.',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          model: {
            description: 'The model of the CPU (e.g., `Intel(R) Core(TM) i7-9700K CPU @ 3.60GHz`).',
            type: 'string',
          },
          usage: {
            description: 'The CPU usage percentage.',
            type: 'number',
            format: 'float',
          },
        },
      },
      'Tag': {
        description: 'Adds metadata to a single tag that is used by the Operation Object. It is not mandatory to have a Tag Object per tag defined in the Operation Object instances.',
        type: 'object',
        required: [
          'name',
        ],
        properties: {
          description: {
            description: 'A description for the tag. CommonMark syntax MAY be used for rich text representation.',
            type: [
              'string',
              'null',
            ],
          },
          externalDocs: {
            description: 'Additional external documentation for this tag.',
            anyOf: [
              {
                $ref: '#/components/schemas/ExternalDocumentation',
              },
              {
                type: 'null',
              },
            ],
          },
          name: {
            description: 'REQUIRED. The name of the tag.',
            type: 'string',
          },
        },
        additionalProperties: true,
      },
      'io.k8s.api.core.v1.ConfigMapKeySelector': {
        description: 'Selects a key from a ConfigMap.',
        type: 'object',
        required: [
          'key',
          'name',
        ],
        properties: {
          key: {
            description: 'The key to select.',
            type: 'string',
          },
          name: {
            description: 'Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names',
            type: 'string',
          },
          optional: {
            description: 'Specify whether the ConfigMap or its key must be defined',
            type: 'boolean',
          },
        },
      },
      'io.k8s.api.core.v1.EnvVar': {
        description: 'EnvVar represents an environment variable present in a Container.',
        type: 'object',
        required: [
          'name',
        ],
        properties: {
          name: {
            description: 'Name of the environment variable. Must be a C_IDENTIFIER.',
            type: 'string',
          },
          value: {
            description: 'Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".',
            type: 'string',
          },
          valueFrom: {
            description: 'Source for the environment variable\'s value. Cannot be used if value is not empty.',
            $ref: '#/components/schemas/io.k8s.api.core.v1.EnvVarSource',
          },
        },
      },
      'io.k8s.api.core.v1.EnvVarSource': {
        description: 'EnvVarSource represents a source for the value of an EnvVar.',
        type: 'object',
        properties: {
          configMapKeyRef: {
            description: 'Selects a key of a ConfigMap.',
            $ref: '#/components/schemas/io.k8s.api.core.v1.ConfigMapKeySelector',
          },
          fieldRef: {
            description: 'Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels[\'<KEY>\']`, `metadata.annotations[\'<KEY>\']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.',
            $ref: '#/components/schemas/io.k8s.api.core.v1.ObjectFieldSelector',
          },
          resourceFieldRef: {
            description: 'Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.',
            $ref: '#/components/schemas/io.k8s.api.core.v1.ResourceFieldSelector',
          },
          secretKeyRef: {
            description: 'Selects a key of a secret in the pod\'s namespace',
            $ref: '#/components/schemas/io.k8s.api.core.v1.SecretKeySelector',
          },
        },
      },
      'io.k8s.api.core.v1.ObjectFieldSelector': {
        description: 'ObjectFieldSelector selects an APIVersioned field of an object.',
        type: 'object',
        required: [
          'fieldPath',
        ],
        properties: {
          apiVersion: {
            description: 'Version of the schema the FieldPath is written in terms of, defaults to "v1".',
            type: 'string',
          },
          fieldPath: {
            description: 'Path of the field to select in the specified API version.',
            type: 'string',
          },
        },
      },
      'io.k8s.api.core.v1.ResourceClaim': {
        description: 'ResourceClaim references one entry in PodSpec.ResourceClaims.',
        type: 'object',
        required: [
          'name',
        ],
        properties: {
          name: {
            description: 'Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.',
            type: 'string',
          },
        },
      },
      'io.k8s.api.core.v1.ResourceFieldSelector': {
        description: 'ResourceFieldSelector represents container resources (cpu, memory) and their output format',
        type: 'object',
        required: [
          'resource',
        ],
        properties: {
          containerName: {
            description: 'Container name: required for volumes, optional for env vars',
            type: 'string',
          },
          divisor: {
            description: 'Specifies the output format of the exposed resources, defaults to "1"',
            $ref: '#/components/schemas/io.k8s.apimachinery.pkg.api.resource.Quantity',
          },
          resource: {
            description: 'Required: resource to select',
            type: 'string',
          },
        },
      },
      'io.k8s.api.core.v1.ResourceRequirements': {
        description: 'ResourceRequirements describes the compute resource requirements.',
        type: 'object',
        properties: {
          claims: {
            description: 'Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.\n\nThis is an alpha field and requires enabling the DynamicResourceAllocation feature gate.\n\nThis field is immutable. It can only be set for containers.',
            type: 'array',
            items: {
              $ref: '#/components/schemas/io.k8s.api.core.v1.ResourceClaim',
            },
          },
          limits: {
            description: 'Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/io.k8s.apimachinery.pkg.api.resource.Quantity',
            },
          },
          requests: {
            description: 'Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/',
            type: 'object',
            additionalProperties: {
              $ref: '#/components/schemas/io.k8s.apimachinery.pkg.api.resource.Quantity',
            },
          },
        },
      },
      'io.k8s.api.core.v1.SecretKeySelector': {
        description: 'SecretKeySelector selects a key of a Secret.',
        type: 'object',
        required: [
          'key',
          'name',
        ],
        properties: {
          key: {
            description: 'The key of the secret to select from.  Must be a valid secret key.',
            type: 'string',
          },
          name: {
            description: 'Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names',
            type: 'string',
          },
          optional: {
            description: 'Specify whether the Secret or its key must be defined',
            type: 'boolean',
          },
        },
      },
      'io.k8s.apimachinery.pkg.api.resource.Quantity': {
        description: 'Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.\n\nThe serialization format is:\n\n``` <quantity>        ::= <signedNumber><suffix>\n\n\t(Note that <suffix> may be empty, from the "" case in <decimalSI>.)\n\n<digit>           ::= 0 | 1 | ... | 9 <digits>          ::= <digit> | <digit><digits> <number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> <sign>            ::= "+" | "-" <signedNumber>    ::= <number> | <sign><number> <suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> <binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei\n\n\t(International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)\n\n<decimalSI>       ::= m | "" | k | M | G | T | P | E\n\n\t(Note that 1024 = 1Ki but 1000 = 1k; I didn\'t choose the capitalization.)\n\n<decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber> ```\n\nNo matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.\n\nWhen a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.\n\nBefore serializing, Quantity will be put in "canonical form". This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:\n\n- No precision is lost - No fractional digits will be emitted - The exponent (or suffix) is as large as possible.\n\nThe sign will be omitted unless the number is negative.\n\nExamples:\n\n- 1.5 will be serialized as "1500m" - 1.5Gi will be serialized as "1536Mi"\n\nNote that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.\n\nNon-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don\'t diff.)\n\nThis format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.',
        type: 'string',
      },
      'io.k8s.apimachinery.pkg.apis.meta.v1.Condition': {
        description: 'Condition contains details for one aspect of the current state of this API Resource.',
        type: 'object',
        required: [
          'lastTransitionTime',
          'message',
          'reason',
          'status',
          'type',
        ],
        properties: {
          lastTransitionTime: {
            description: 'lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.',
            $ref: '#/components/schemas/io.k8s.apimachinery.pkg.apis.meta.v1.Time',
          },
          message: {
            description: 'message is a human readable message indicating details about the transition. This may be an empty string.',
            type: 'string',
          },
          observedGeneration: {
            description: 'observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.',
            type: 'integer',
            format: 'int64',
          },
          reason: {
            description: 'reason contains a programmatic identifier indicating the reason for the condition\'s last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.',
            type: 'string',
          },
          status: {
            description: 'status of the condition, one of True, False, Unknown.',
            type: 'string',
          },
          type: {
            description: 'type of condition in CamelCase or in foo.example.com/CamelCase.',
            type: 'string',
          },
        },
      },
      'io.k8s.apimachinery.pkg.apis.meta.v1.Time': {
        description: 'Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.',
        type: 'string',
        format: 'date-time',
      },
    },
  },
  tags: [
    {
      name: 'Server',
      description: 'Operations related to the `MCPServer` resources.',
    },
    {
      name: 'Pool',
      description: 'Operations related to the `MCPPool` resources.',
    },
  ],
} as const
