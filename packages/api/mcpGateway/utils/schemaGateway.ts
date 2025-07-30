/* eslint-disable unicorn/no-thenable */
/* eslint-disable sonarjs/no-duplicate-string */

export const MCP_GATEWAY_SCHEMA = {
  openapi: '3.1.0',
  info: {
    title: 'NMCP',
    summary: 'Kubernetes operator for managing MCP servers',
    version: '0.2.1',
  },
  paths: {
    '/{name}/sse': {
      get: {
        tags: [
          'Server',
        ],
        summary: 'Server SSE',
        description: 'Establishes a Server-Sent Events (SSE) connection to the server. This allows for real-time updates and notifications from the server. Returns a stream of JSON messages.',
        operationId: 'getServerSse',
        parameters: [
          {
            in: 'query',
            name: 'timeout',
            description: 'The maximum time to wait for the server to be ready before sending the message.',
            schema: {
              description: 'The maximum time to wait for the server to be ready before sending the message.',
              type: [
                'integer',
                'null',
              ],
              format: 'uint64',
              minimum: 0,
            },
            style: 'form',
          },
        ],
      },
    },
    '/{name}/logs': {
      get: {
        tags: [
          'Server',
        ],
        summary: 'Get Server Logs',
        description: 'Retrieves the logs for the server. This is useful for debugging and monitoring server activity.',
        operationId: 'getServerLogs',
        responses: {
          200: {
            description: 'plain text',
            content: {
              'text/plain; charset=utf-8': {},
            },
          },
        },
      },
    },
    '/{name}/message': {
      post: {
        tags: [
          'Server',
        ],
        summary: 'Post SSE Message',
        description: 'Sends a message to the server. The server will process the message and return a response.',
        operationId: 'postServerSseMessage',
        parameters: [
          {
            in: 'query',
            name: 'sessionId',
            description: 'The ID of the session to which the message should be sent.',
            required: true,
            schema: {
              description: 'The ID of the session to which the message should be sent.',
              type: 'string',
            },
            style: 'form',
          },
          {
            in: 'query',
            name: 'timeout',
            description: 'The maximum time to wait for the server to be ready before sending the message.',
            schema: {
              description: 'The maximum time to wait for the server to be ready before sending the message.',
              type: [
                'integer',
                'null',
              ],
              format: 'uint64',
              minimum: 0,
            },
            style: 'form',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/JsonRpcMessage_for_ClientRequest_and_ClientResult_and_ClientNotification',
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: '',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/JsonRpcMessage_for_ServerRequest_and_ServerResult_and_ServerNotification',
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
          'Get Status',
        ],
        summary: 'Health',
        description: 'Retrieves the health status of the gateway service, including version information and current timestamp. This endpoint provides a comprehensive health check that includes service availability and metadata.',
        operationId: 'getHealthStatus',
        responses: {
          204: {
            description: 'The gateway service is healthy and operational.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/GatewayStatus',
                },
                example: {
                  ok: true,
                  system: {
                    arch: 'x86_64',
                    availableParallelism: 32,
                    cpuAverageLoad: [
                      1.74,
                      2.48,
                      4.79,
                    ],
                    cpuAverageSpeed: 4156,
                    cpus: [
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5600,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5601,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5600,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5652,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5600,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 800,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5600,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5177,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5600,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5600,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5600,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5548,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5466,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5600,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5600,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 5599,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 4398,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 4371,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 4398,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 4421,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 800,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 800,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 800,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 4400,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 4334,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 4393,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 4446,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 800,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 4399,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 800,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 800,
                        usage: 0,
                      },
                      {
                        model: 'Intel(R) Core(TM) i9-14900K',
                        speed: 4401,
                        usage: 0,
                      },
                    ],
                    family: 'unix',
                    memoryAvailable: 75049664512,
                    memoryFree: 64664113152,
                    memoryTotal: 101004070912,
                    memoryUsed: 25954406400,
                    platform: 'linux',
                    release: 'Linux (NixOS 24.11)',
                    uptime: 198792,
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
        summary: 'Ping',
        description: 'Simple health check endpoint that returns a basic HTTP 200 status. This lightweight endpoint is ideal for load balancers, monitoring systems, and automated health checks that only need to verify gateway service availability.',
        operationId: 'ping',
        responses: {
          204: {
            description: 'The gateway service is alive and responding to requests.',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Annotated_for_RawContent: {
        type: 'object',
        oneOf: [
          {
            type: 'object',
            required: [
              'text',
              'type',
            ],
            properties: {
              text: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: [
                  'text',
                ],
              },
            },
          },
          {
            type: 'object',
            required: [
              'data',
              'mimeType',
              'type',
            ],
            properties: {
              data: {
                description: 'The base64-encoded image',
                type: 'string',
              },
              mimeType: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: [
                  'image',
                ],
              },
            },
          },
          {
            type: 'object',
            required: [
              'resource',
              'type',
            ],
            properties: {
              resource: {
                $ref: '#/components/schemas/ResourceContents',
              },
              type: {
                type: 'string',
                enum: [
                  'resource',
                ],
              },
            },
          },
          {
            type: 'object',
            required: [
              'data',
              'mimeType',
              'type',
            ],
            properties: {
              annotations: {
                anyOf: [
                  {
                    $ref: '#/components/schemas/Annotations',
                  },
                  {
                    type: 'null',
                  },
                ],
              },
              data: {
                type: 'string',
              },
              mimeType: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: [
                  'audio',
                ],
              },
            },
          },
        ],
        properties: {
          annotations: {
            anyOf: [
              {
                $ref: '#/components/schemas/Annotations',
              },
              {
                type: 'null',
              },
            ],
          },
        },
      },
      Annotated_for_RawEmbeddedResource: {
        type: 'object',
        required: [
          'resource',
        ],
        properties: {
          annotations: {
            anyOf: [
              {
                $ref: '#/components/schemas/Annotations',
              },
              {
                type: 'null',
              },
            ],
          },
          resource: {
            $ref: '#/components/schemas/ResourceContents',
          },
        },
      },
      Annotated_for_RawResource: {
        description: 'Represents a resource in the extension with metadata',
        type: 'object',
        required: [
          'name',
          'uri',
        ],
        properties: {
          annotations: {
            anyOf: [
              {
                $ref: '#/components/schemas/Annotations',
              },
              {
                type: 'null',
              },
            ],
          },
          description: {
            description: 'Optional description of the resource',
            type: [
              'string',
              'null',
            ],
          },
          mimeType: {
            description: 'MIME type of the resource content ("text" or "blob")',
            type: [
              'string',
              'null',
            ],
          },
          name: {
            description: 'Name of the resource',
            type: 'string',
          },
          size: {
            description: 'The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.\n\nThis can be used by Hosts to display file sizes and estimate context window us',
            type: [
              'integer',
              'null',
            ],
            format: 'uint32',
            minimum: 0,
          },
          uri: {
            description: 'URI representing the resource location (e.g., "file:///path/to/file" or "str:///content")',
            type: 'string',
          },
        },
      },
      Annotated_for_RawResourceTemplate: {
        type: 'object',
        required: [
          'name',
          'uriTemplate',
        ],
        properties: {
          annotations: {
            anyOf: [
              {
                $ref: '#/components/schemas/Annotations',
              },
              {
                type: 'null',
              },
            ],
          },
          description: {
            type: [
              'string',
              'null',
            ],
          },
          mimeType: {
            type: [
              'string',
              'null',
            ],
          },
          name: {
            type: 'string',
          },
          uriTemplate: {
            type: 'string',
          },
        },
      },
      Annotations: {
        type: 'object',
        properties: {
          audience: {
            type: [
              'array',
              'null',
            ],
            items: {
              $ref: '#/components/schemas/Role',
            },
          },
          priority: {
            type: [
              'number',
              'null',
            ],
            format: 'float',
          },
          timestamp: {
            type: [
              'string',
              'null',
            ],
            format: 'date-time',
          },
        },
      },
      ApiKeyLocation: {
        type: 'string',
        enum: [
          'query',
          'header',
          'cookie',
        ],
      },
      ArgumentInfo: {
        type: 'object',
        required: [
          'name',
          'value',
        ],
        properties: {
          name: {
            type: 'string',
          },
          value: {
            type: 'string',
          },
        },
      },
      CallToolRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'tools/call',
      },
      CallToolRequestParam: {
        type: 'object',
        required: [
          'name',
        ],
        properties: {
          arguments: {
            type: [
              'object',
              'null',
            ],
            additionalProperties: true,
          },
          name: {
            type: 'string',
          },
        },
      },
      CallToolResult: {
        type: 'object',
        required: [
          'content',
        ],
        properties: {
          content: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Annotated_for_RawContent',
            },
          },
          isError: {
            type: [
              'boolean',
              'null',
            ],
          },
        },
      },
      CancelledNotificationMethod: {
        type: 'string',
        format: 'const',
        const: 'notifications/cancelled',
      },
      CancelledNotificationParam: {
        type: 'object',
        required: [
          'requestId',
        ],
        properties: {
          reason: {
            type: [
              'string',
              'null',
            ],
          },
          requestId: {
            $ref: '#/components/schemas/NumberOrString',
          },
        },
      },
      ClientCapabilities: {
        title: 'Builder',
        description: '```rust # use rmcp::model::ClientCapabilities; let cap = ClientCapabilities::builder() .enable_experimental() .enable_roots() .enable_roots_list_changed() .build(); ```',
        type: 'object',
        properties: {
          experimental: {
            type: [
              'object',
              'null',
            ],
            additionalProperties: {
              type: 'object',
              additionalProperties: true,
            },
          },
          roots: {
            anyOf: [
              {
                $ref: '#/components/schemas/RootsCapabilities',
              },
              {
                type: 'null',
              },
            ],
          },
          sampling: {
            type: [
              'object',
              'null',
            ],
            additionalProperties: true,
          },
        },
      },
      ClientResult: {
        anyOf: [
          {
            $ref: '#/components/schemas/CreateMessageResult',
          },
          {
            $ref: '#/components/schemas/ListRootsResult',
          },
          {
            $ref: '#/components/schemas/EmptyObject',
          },
        ],
      },
      CompleteRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'completion/complete',
      },
      CompleteRequestParam: {
        type: 'object',
        required: [
          'argument',
          'ref',
        ],
        properties: {
          argument: {
            $ref: '#/components/schemas/ArgumentInfo',
          },
          ref: {
            $ref: '#/components/schemas/Reference',
          },
        },
      },
      CompleteResult: {
        type: 'object',
        required: [
          'completion',
        ],
        properties: {
          completion: {
            $ref: '#/components/schemas/CompletionInfo',
          },
        },
      },
      CompletionInfo: {
        type: 'object',
        required: [
          'values',
        ],
        properties: {
          hasMore: {
            type: [
              'boolean',
              'null',
            ],
          },
          total: {
            type: [
              'integer',
              'null',
            ],
            format: 'uint32',
            minimum: 0,
          },
          values: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
      Components: {
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
      Contact: {
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
      ContextInclusion: {
        type: 'string',
        enum: [
          'allServers',
          'none',
          'thisServer',
        ],
      },
      CookieStyle: {
        type: 'string',
        enum: [
          'form',
        ],
      },
      CreateMessageRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'sampling/createMessage',
      },
      CreateMessageRequestParam: {
        type: 'object',
        required: [
          'maxTokens',
          'messages',
        ],
        properties: {
          includeContext: {
            anyOf: [
              {
                $ref: '#/components/schemas/ContextInclusion',
              },
              {
                type: 'null',
              },
            ],
          },
          maxTokens: {
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          messages: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/SamplingMessage',
            },
          },
          metadata: true,
          modelPreferences: {
            anyOf: [
              {
                $ref: '#/components/schemas/ModelPreferences',
              },
              {
                type: 'null',
              },
            ],
          },
          stopSequences: {
            type: [
              'array',
              'null',
            ],
            items: {
              type: 'string',
            },
          },
          systemPrompt: {
            type: [
              'string',
              'null',
            ],
          },
          temperature: {
            type: [
              'number',
              'null',
            ],
            format: 'float',
          },
        },
      },
      CreateMessageResult: {
        type: 'object',
        required: [
          'content',
          'model',
          'role',
        ],
        properties: {
          content: {
            $ref: '#/components/schemas/Annotated_for_RawContent',
          },
          model: {
            type: 'string',
          },
          role: {
            $ref: '#/components/schemas/Role',
          },
          stopReason: {
            type: [
              'string',
              'null',
            ],
          },
        },
      },
      EmptyObject: {
        type: 'object',
      },
      Encoding: {
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
      ErrorData: {
        description: 'Error information for JSON-RPC error responses.',
        type: 'object',
        required: [
          'code',
          'message',
        ],
        properties: {
          code: {
            description: 'The error type that occurred.',
            type: 'integer',
            format: 'int32',
          },
          data: {
            description: 'Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).',
          },
          message: {
            description: 'A short description of the error. The message SHOULD be limited to a concise single sentence.',
            type: 'string',
          },
        },
      },
      Example: {
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
      ExternalDocumentation: {
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
      GatewayStatus: {
        description: 'Represents the health status of the gateway service.',
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
            $ref: '#/components/schemas/SystemStatus',
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
      GetPromptRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'prompts/get',
      },
      GetPromptRequestParam: {
        type: 'object',
        required: [
          'name',
        ],
        properties: {
          arguments: {
            type: [
              'object',
              'null',
            ],
            additionalProperties: true,
          },
          name: {
            type: 'string',
          },
        },
      },
      GetPromptResult: {
        type: 'object',
        required: [
          'messages',
        ],
        properties: {
          description: {
            type: [
              'string',
              'null',
            ],
          },
          messages: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PromptMessage',
            },
          },
        },
      },
      Header: {
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
      HeaderStyle: {
        type: 'string',
        enum: [
          'simple',
        ],
      },
      Implementation: {
        type: 'object',
        required: [
          'name',
          'version',
        ],
        properties: {
          name: {
            type: 'string',
          },
          version: {
            type: 'string',
          },
        },
      },
      Info: {
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
      InitializeRequestParam: {
        type: 'object',
        required: [
          'capabilities',
          'clientInfo',
          'protocolVersion',
        ],
        properties: {
          capabilities: {
            $ref: '#/components/schemas/ClientCapabilities',
          },
          clientInfo: {
            $ref: '#/components/schemas/Implementation',
          },
          protocolVersion: {
            $ref: '#/components/schemas/ProtocolVersion',
          },
        },
      },
      InitializeResult: {
        type: 'object',
        required: [
          'capabilities',
          'protocolVersion',
          'serverInfo',
        ],
        properties: {
          capabilities: {
            $ref: '#/components/schemas/ServerCapabilities',
          },
          instructions: {
            type: [
              'string',
              'null',
            ],
          },
          protocolVersion: {
            $ref: '#/components/schemas/ProtocolVersion',
          },
          serverInfo: {
            $ref: '#/components/schemas/Implementation',
          },
        },
      },
      InitializeResultMethod: {
        type: 'string',
        format: 'const',
        const: 'initialize',
      },
      InitializedNotificationMethod: {
        type: 'string',
        format: 'const',
        const: 'notifications/initialized',
      },
      InstanceType: {
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
      JsonRpcBatchRequestItem_for_ClientRequest_and_ClientNotification: {
        anyOf: [
          {
            $ref: '#/components/schemas/JsonRpcRequest_for_ClientRequest',
          },
          {
            $ref: '#/components/schemas/JsonRpcNotification_for_ClientNotification',
          },
        ],
      },
      JsonRpcBatchRequestItem_for_ServerRequest_and_ServerNotification: {
        anyOf: [
          {
            $ref: '#/components/schemas/JsonRpcRequest_for_ServerRequest',
          },
          {
            $ref: '#/components/schemas/JsonRpcNotification_for_ServerNotification',
          },
        ],
      },
      JsonRpcBatchResponseItem_for_ClientResult: {
        anyOf: [
          {
            $ref: '#/components/schemas/JsonRpcResponse_for_ClientResult',
          },
          {
            $ref: '#/components/schemas/JsonRpcError',
          },
        ],
      },
      JsonRpcBatchResponseItem_for_ServerResult: {
        anyOf: [
          {
            $ref: '#/components/schemas/JsonRpcResponse_for_ServerResult',
          },
          {
            $ref: '#/components/schemas/JsonRpcError',
          },
        ],
      },
      JsonRpcError: {
        type: 'object',
        required: [
          'error',
          'id',
          'jsonrpc',
        ],
        properties: {
          error: {
            $ref: '#/components/schemas/ErrorData',
          },
          id: {
            $ref: '#/components/schemas/NumberOrString',
          },
          jsonrpc: {
            $ref: '#/components/schemas/JsonRpcVersion2_0',
          },
        },
      },
      JsonRpcMessage_for_ClientRequest_and_ClientResult_and_ClientNotification: {
        anyOf: [
          {
            $ref: '#/components/schemas/JsonRpcRequest_for_ClientRequest',
          },
          {
            $ref: '#/components/schemas/JsonRpcResponse_for_ClientResult',
          },
          {
            $ref: '#/components/schemas/JsonRpcNotification_for_ClientNotification',
          },
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/JsonRpcBatchRequestItem_for_ClientRequest_and_ClientNotification',
            },
          },
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/JsonRpcBatchResponseItem_for_ClientResult',
            },
          },
          {
            $ref: '#/components/schemas/JsonRpcError',
          },
        ],
      },
      JsonRpcMessage_for_ServerRequest_and_ServerResult_and_ServerNotification: {
        anyOf: [
          {
            $ref: '#/components/schemas/JsonRpcRequest_for_ServerRequest',
          },
          {
            $ref: '#/components/schemas/JsonRpcResponse_for_ServerResult',
          },
          {
            $ref: '#/components/schemas/JsonRpcNotification_for_ServerNotification',
          },
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/JsonRpcBatchRequestItem_for_ServerRequest_and_ServerNotification',
            },
          },
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/JsonRpcBatchResponseItem_for_ServerResult',
            },
          },
          {
            $ref: '#/components/schemas/JsonRpcError',
          },
        ],
      },
      JsonRpcNotification_for_ClientNotification: {
        type: 'object',
        anyOf: [
          {
            $ref: '#/components/schemas/Notification_for_CancelledNotificationMethod_and_CancelledNotificationParam',
          },
          {
            $ref: '#/components/schemas/Notification_for_ProgressNotificationMethod_and_ProgressNotificationParam',
          },
          {
            $ref: '#/components/schemas/NotificationNoParam_for_InitializedNotificationMethod',
          },
          {
            $ref: '#/components/schemas/NotificationNoParam_for_RootsListChangedNotificationMethod',
          },
        ],
        required: [
          'jsonrpc',
        ],
        properties: {
          jsonrpc: {
            $ref: '#/components/schemas/JsonRpcVersion2_0',
          },
        },
      },
      JsonRpcNotification_for_ServerNotification: {
        type: 'object',
        anyOf: [
          {
            $ref: '#/components/schemas/Notification_for_CancelledNotificationMethod_and_CancelledNotificationParam',
          },
          {
            $ref: '#/components/schemas/Notification_for_ProgressNotificationMethod_and_ProgressNotificationParam',
          },
          {
            $ref: '#/components/schemas/Notification_for_LoggingMessageNotificationMethod_and_LoggingMessageNotificationParam',
          },
          {
            $ref: '#/components/schemas/Notification_for_ResourceUpdatedNotificationMethod_and_ResourceUpdatedNotificationParam',
          },
          {
            $ref: '#/components/schemas/NotificationNoParam_for_ResourceListChangedNotificationMethod',
          },
          {
            $ref: '#/components/schemas/NotificationNoParam_for_ToolListChangedNotificationMethod',
          },
          {
            $ref: '#/components/schemas/NotificationNoParam_for_PromptListChangedNotificationMethod',
          },
        ],
        required: [
          'jsonrpc',
        ],
        properties: {
          jsonrpc: {
            $ref: '#/components/schemas/JsonRpcVersion2_0',
          },
        },
      },
      JsonRpcRequest_for_ClientRequest: {
        type: 'object',
        anyOf: [
          {
            $ref: '#/components/schemas/RequestNoParam_for_PingRequestMethod',
          },
          {
            $ref: '#/components/schemas/Request_for_InitializeResultMethod_and_InitializeRequestParam',
          },
          {
            $ref: '#/components/schemas/Request_for_CompleteRequestMethod_and_CompleteRequestParam',
          },
          {
            $ref: '#/components/schemas/Request_for_SetLevelRequestMethod_and_SetLevelRequestParam',
          },
          {
            $ref: '#/components/schemas/Request_for_GetPromptRequestMethod_and_GetPromptRequestParam',
          },
          {
            $ref: '#/components/schemas/RequestOptionalParam_for_ListPromptsRequestMethod_and_PaginatedRequestParam',
          },
          {
            $ref: '#/components/schemas/RequestOptionalParam_for_ListResourcesRequestMethod_and_PaginatedRequestParam',
          },
          {
            $ref: '#/components/schemas/RequestOptionalParam_for_ListResourceTemplatesRequestMethod_and_PaginatedRequestParam',
          },
          {
            $ref: '#/components/schemas/Request_for_ReadResourceRequestMethod_and_ReadResourceRequestParam',
          },
          {
            $ref: '#/components/schemas/Request_for_SubscribeRequestMethod_and_SubscribeRequestParam',
          },
          {
            $ref: '#/components/schemas/Request_for_UnsubscribeRequestMethod_and_UnsubscribeRequestParam',
          },
          {
            $ref: '#/components/schemas/Request_for_CallToolRequestMethod_and_CallToolRequestParam',
          },
          {
            $ref: '#/components/schemas/RequestOptionalParam_for_ListToolsRequestMethod_and_PaginatedRequestParam',
          },
        ],
        required: [
          'id',
          'jsonrpc',
        ],
        properties: {
          id: {
            $ref: '#/components/schemas/NumberOrString',
          },
          jsonrpc: {
            $ref: '#/components/schemas/JsonRpcVersion2_0',
          },
        },
      },
      JsonRpcRequest_for_ServerRequest: {
        type: 'object',
        anyOf: [
          {
            $ref: '#/components/schemas/RequestNoParam_for_PingRequestMethod',
          },
          {
            $ref: '#/components/schemas/Request_for_CreateMessageRequestMethod_and_CreateMessageRequestParam',
          },
          {
            $ref: '#/components/schemas/RequestNoParam_for_ListRootsRequestMethod',
          },
        ],
        required: [
          'id',
          'jsonrpc',
        ],
        properties: {
          id: {
            $ref: '#/components/schemas/NumberOrString',
          },
          jsonrpc: {
            $ref: '#/components/schemas/JsonRpcVersion2_0',
          },
        },
      },
      JsonRpcResponse_for_ClientResult: {
        type: 'object',
        required: [
          'id',
          'jsonrpc',
          'result',
        ],
        properties: {
          id: {
            $ref: '#/components/schemas/NumberOrString',
          },
          jsonrpc: {
            $ref: '#/components/schemas/JsonRpcVersion2_0',
          },
          result: {
            $ref: '#/components/schemas/ClientResult',
          },
        },
      },
      JsonRpcResponse_for_ServerResult: {
        type: 'object',
        required: [
          'id',
          'jsonrpc',
          'result',
        ],
        properties: {
          id: {
            $ref: '#/components/schemas/NumberOrString',
          },
          jsonrpc: {
            $ref: '#/components/schemas/JsonRpcVersion2_0',
          },
          result: {
            $ref: '#/components/schemas/ServerResult',
          },
        },
      },
      JsonRpcVersion2_0: {
        type: 'string',
        format: 'const',
        const: '2.0',
      },
      License: {
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
      Link: {
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
      ListPromptsRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'prompts/list',
      },
      ListPromptsResult: {
        type: 'object',
        required: [
          'prompts',
        ],
        properties: {
          nextCursor: {
            type: [
              'string',
              'null',
            ],
          },
          prompts: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Prompt',
            },
          },
        },
      },
      ListResourceTemplatesRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'resources/templates/list',
      },
      ListResourceTemplatesResult: {
        type: 'object',
        required: [
          'resourceTemplates',
        ],
        properties: {
          nextCursor: {
            type: [
              'string',
              'null',
            ],
          },
          resourceTemplates: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Annotated_for_RawResourceTemplate',
            },
          },
        },
      },
      ListResourcesRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'resources/list',
      },
      ListResourcesResult: {
        type: 'object',
        required: [
          'resources',
        ],
        properties: {
          nextCursor: {
            type: [
              'string',
              'null',
            ],
          },
          resources: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Annotated_for_RawResource',
            },
          },
        },
      },
      ListRootsRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'roots/list',
      },
      ListRootsResult: {
        type: 'object',
        required: [
          'roots',
        ],
        properties: {
          roots: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Root',
            },
          },
        },
      },
      ListToolsRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'tools/list',
      },
      ListToolsResult: {
        type: 'object',
        required: [
          'tools',
        ],
        properties: {
          nextCursor: {
            type: [
              'string',
              'null',
            ],
          },
          tools: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Tool',
            },
          },
        },
      },
      LoggingLevel: {
        type: 'string',
        enum: [
          'debug',
          'info',
          'notice',
          'warning',
          'error',
          'critical',
          'alert',
          'emergency',
        ],
      },
      LoggingMessageNotificationMethod: {
        type: 'string',
        format: 'const',
        const: 'notifications/message',
      },
      LoggingMessageNotificationParam: {
        type: 'object',
        required: [
          'data',
          'level',
        ],
        properties: {
          data: true,
          level: {
            $ref: '#/components/schemas/LoggingLevel',
          },
          logger: {
            type: [
              'string',
              'null',
            ],
          },
        },
      },
      MediaType: {
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
      MessageQuery: {
        type: 'object',
        required: [
          'sessionId',
        ],
        properties: {
          sessionId: {
            description: 'The ID of the session to which the message should be sent.',
            type: 'string',
          },
          timeout: {
            description: 'The maximum time to wait for the server to be ready before sending the message.',
            type: [
              'integer',
              'null',
            ],
            format: 'uint64',
            minimum: 0,
          },
        },
      },
      ModelHint: {
        type: 'object',
        properties: {
          name: {
            type: [
              'string',
              'null',
            ],
          },
        },
      },
      ModelPreferences: {
        type: 'object',
        properties: {
          costPriority: {
            type: [
              'number',
              'null',
            ],
            format: 'float',
          },
          hints: {
            type: [
              'array',
              'null',
            ],
            items: {
              $ref: '#/components/schemas/ModelHint',
            },
          },
          intelligencePriority: {
            type: [
              'number',
              'null',
            ],
            format: 'float',
          },
          speedPriority: {
            type: [
              'number',
              'null',
            ],
            format: 'float',
          },
        },
      },
      NotificationNoParam_for_InitializedNotificationMethod: {
        type: 'object',
        required: [
          'method',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/InitializedNotificationMethod',
          },
        },
      },
      NotificationNoParam_for_PromptListChangedNotificationMethod: {
        type: 'object',
        required: [
          'method',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/PromptListChangedNotificationMethod',
          },
        },
      },
      NotificationNoParam_for_ResourceListChangedNotificationMethod: {
        type: 'object',
        required: [
          'method',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/ResourceListChangedNotificationMethod',
          },
        },
      },
      NotificationNoParam_for_RootsListChangedNotificationMethod: {
        type: 'object',
        required: [
          'method',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/RootsListChangedNotificationMethod',
          },
        },
      },
      NotificationNoParam_for_ToolListChangedNotificationMethod: {
        type: 'object',
        required: [
          'method',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/ToolListChangedNotificationMethod',
          },
        },
      },
      Notification_for_CancelledNotificationMethod_and_CancelledNotificationParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/CancelledNotificationMethod',
          },
          params: {
            $ref: '#/components/schemas/CancelledNotificationParam',
          },
        },
      },
      Notification_for_LoggingMessageNotificationMethod_and_LoggingMessageNotificationParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/LoggingMessageNotificationMethod',
          },
          params: {
            $ref: '#/components/schemas/LoggingMessageNotificationParam',
          },
        },
      },
      Notification_for_ProgressNotificationMethod_and_ProgressNotificationParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/ProgressNotificationMethod',
          },
          params: {
            $ref: '#/components/schemas/ProgressNotificationParam',
          },
        },
      },
      Notification_for_ResourceUpdatedNotificationMethod_and_ResourceUpdatedNotificationParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/ResourceUpdatedNotificationMethod',
          },
          params: {
            $ref: '#/components/schemas/ResourceUpdatedNotificationParam',
          },
        },
      },
      NumberOrString: {
        oneOf: [
          {
            type: 'number',
          },
          {
            type: 'string',
          },
        ],
      },
      OAuth2Flows: {
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
      OpenApi: {
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
      Operation: {
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
      PaginatedRequestParam: {
        type: 'object',
        properties: {
          cursor: {
            type: [
              'string',
              'null',
            ],
          },
        },
      },
      Parameter: {
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
      PathItem: {
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
      PathStyle: {
        type: 'string',
        enum: [
          'matrix',
          'label',
          'simple',
        ],
      },
      Paths: {
        description: 'Holds the relative paths to the individual endpoints and their operations. The path is appended to the URL from the Server Object in order to construct the full URL. The Paths MAY be empty, due to Access Control List (ACL) constraints.',
        type: 'object',
        additionalProperties: true,
      },
      PingRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'ping',
      },
      ProgressNotificationMethod: {
        type: 'string',
        format: 'const',
        const: 'notifications/progress',
      },
      ProgressNotificationParam: {
        type: 'object',
        required: [
          'progress',
          'progressToken',
        ],
        properties: {
          message: {
            description: 'An optional message describing the current progress.',
            type: [
              'string',
              'null',
            ],
          },
          progress: {
            description: 'The progress thus far. This should increase every time progress is made, even if the total is unknown.',
            type: 'integer',
            format: 'uint32',
            minimum: 0,
          },
          progressToken: {
            $ref: '#/components/schemas/NumberOrString',
          },
          total: {
            description: 'Total number of items to process (or total progress required), if known',
            type: [
              'integer',
              'null',
            ],
            format: 'uint32',
            minimum: 0,
          },
        },
      },
      Prompt: {
        description: 'A prompt that can be used to generate text from a model',
        type: 'object',
        required: [
          'name',
        ],
        properties: {
          arguments: {
            description: 'Optional arguments that can be passed to customize the prompt',
            type: [
              'array',
              'null',
            ],
            items: {
              $ref: '#/components/schemas/PromptArgument',
            },
          },
          description: {
            description: 'Optional description of what the prompt does',
            type: [
              'string',
              'null',
            ],
          },
          name: {
            description: 'The name of the prompt',
            type: 'string',
          },
        },
      },
      PromptArgument: {
        description: 'Represents a prompt argument that can be passed to customize the prompt',
        type: 'object',
        required: [
          'name',
        ],
        properties: {
          description: {
            description: 'A description of what the argument is used for',
            type: [
              'string',
              'null',
            ],
          },
          name: {
            description: 'The name of the argument',
            type: 'string',
          },
          required: {
            description: 'Whether this argument is required',
            type: [
              'boolean',
              'null',
            ],
          },
        },
      },
      PromptListChangedNotificationMethod: {
        type: 'string',
        format: 'const',
        const: 'notifications/prompts/list_changed',
      },
      PromptMessage: {
        description: 'A message in a prompt conversation',
        type: 'object',
        required: [
          'content',
          'role',
        ],
        properties: {
          content: {
            description: 'The content of the message',
            $ref: '#/components/schemas/PromptMessageContent',
          },
          role: {
            description: 'The role of the message sender',
            $ref: '#/components/schemas/PromptMessageRole',
          },
        },
      },
      PromptMessageContent: {
        description: 'Content types that can be included in prompt messages',
        oneOf: [
          {
            description: 'Plain text content',
            type: 'object',
            required: [
              'text',
              'type',
            ],
            properties: {
              text: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: [
                  'text',
                ],
              },
            },
          },
          {
            description: 'Image content with base64-encoded data',
            type: 'object',
            required: [
              'data',
              'mimeType',
              'type',
            ],
            properties: {
              annotations: {
                anyOf: [
                  {
                    $ref: '#/components/schemas/Annotations',
                  },
                  {
                    type: 'null',
                  },
                ],
              },
              data: {
                description: 'The base64-encoded image',
                type: 'string',
              },
              mimeType: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: [
                  'image',
                ],
              },
            },
          },
          {
            description: 'Embedded server-side resource',
            type: 'object',
            required: [
              'resource',
              'type',
            ],
            properties: {
              resource: {
                $ref: '#/components/schemas/Annotated_for_RawEmbeddedResource',
              },
              type: {
                type: 'string',
                enum: [
                  'resource',
                ],
              },
            },
          },
        ],
      },
      PromptMessageRole: {
        description: 'Represents the role of a message sender in a prompt conversation',
        type: 'string',
        enum: [
          'user',
          'assistant',
        ],
      },
      PromptsCapability: {
        type: 'object',
        properties: {
          listChanged: {
            type: [
              'boolean',
              'null',
            ],
          },
        },
      },
      ProtocolVersion: {
        type: 'string',
      },
      QueryStyle: {
        type: 'string',
        enum: [
          'form',
          'spaceDelimited',
          'pipeDelimited',
          'deepObject',
        ],
      },
      ReadResourceRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'resources/read',
      },
      ReadResourceRequestParam: {
        type: 'object',
        required: [
          'uri',
        ],
        properties: {
          uri: {
            type: 'string',
          },
        },
      },
      ReadResourceResult: {
        type: 'object',
        required: [
          'contents',
        ],
        properties: {
          contents: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ResourceContents',
            },
          },
        },
      },
      Reference: {
        oneOf: [
          {
            type: 'object',
            required: [
              'type',
              'uri',
            ],
            properties: {
              type: {
                type: 'string',
                enum: [
                  'reference/resource',
                ],
              },
              uri: {
                type: 'string',
              },
            },
          },
          {
            type: 'object',
            required: [
              'name',
              'type',
            ],
            properties: {
              name: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: [
                  'reference/prompt',
                ],
              },
            },
          },
        ],
      },
      ReferenceOr_for_Example: {
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
      ReferenceOr_for_Header: {
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
      ReferenceOr_for_Link: {
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
      ReferenceOr_for_Map_of_ReferenceOr_for_PathItem: {
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
      ReferenceOr_for_Parameter: {
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
      ReferenceOr_for_PathItem: {
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
      ReferenceOr_for_RequestBody: {
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
      ReferenceOr_for_Response: {
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
      ReferenceOr_for_SecurityScheme: {
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
      RequestBody: {
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
      RequestNoParam_for_ListRootsRequestMethod: {
        type: 'object',
        required: [
          'method',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/ListRootsRequestMethod',
          },
        },
      },
      RequestNoParam_for_PingRequestMethod: {
        type: 'object',
        required: [
          'method',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/PingRequestMethod',
          },
        },
      },
      RequestOptionalParam_for_ListPromptsRequestMethod_and_PaginatedRequestParam: {
        type: 'object',
        required: [
          'method',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/ListPromptsRequestMethod',
          },
          params: {
            anyOf: [
              {
                $ref: '#/components/schemas/PaginatedRequestParam',
              },
              {
                type: 'null',
              },
            ],
          },
        },
      },
      RequestOptionalParam_for_ListResourceTemplatesRequestMethod_and_PaginatedRequestParam: {
        type: 'object',
        required: [
          'method',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/ListResourceTemplatesRequestMethod',
          },
          params: {
            anyOf: [
              {
                $ref: '#/components/schemas/PaginatedRequestParam',
              },
              {
                type: 'null',
              },
            ],
          },
        },
      },
      RequestOptionalParam_for_ListResourcesRequestMethod_and_PaginatedRequestParam: {
        type: 'object',
        required: [
          'method',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/ListResourcesRequestMethod',
          },
          params: {
            anyOf: [
              {
                $ref: '#/components/schemas/PaginatedRequestParam',
              },
              {
                type: 'null',
              },
            ],
          },
        },
      },
      RequestOptionalParam_for_ListToolsRequestMethod_and_PaginatedRequestParam: {
        type: 'object',
        required: [
          'method',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/ListToolsRequestMethod',
          },
          params: {
            anyOf: [
              {
                $ref: '#/components/schemas/PaginatedRequestParam',
              },
              {
                type: 'null',
              },
            ],
          },
        },
      },
      Request_for_CallToolRequestMethod_and_CallToolRequestParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/CallToolRequestMethod',
          },
          params: {
            $ref: '#/components/schemas/CallToolRequestParam',
          },
        },
      },
      Request_for_CompleteRequestMethod_and_CompleteRequestParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/CompleteRequestMethod',
          },
          params: {
            $ref: '#/components/schemas/CompleteRequestParam',
          },
        },
      },
      Request_for_CreateMessageRequestMethod_and_CreateMessageRequestParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/CreateMessageRequestMethod',
          },
          params: {
            $ref: '#/components/schemas/CreateMessageRequestParam',
          },
        },
      },
      Request_for_GetPromptRequestMethod_and_GetPromptRequestParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/GetPromptRequestMethod',
          },
          params: {
            $ref: '#/components/schemas/GetPromptRequestParam',
          },
        },
      },
      Request_for_InitializeResultMethod_and_InitializeRequestParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/InitializeResultMethod',
          },
          params: {
            $ref: '#/components/schemas/InitializeRequestParam',
          },
        },
      },
      Request_for_ReadResourceRequestMethod_and_ReadResourceRequestParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/ReadResourceRequestMethod',
          },
          params: {
            $ref: '#/components/schemas/ReadResourceRequestParam',
          },
        },
      },
      Request_for_SetLevelRequestMethod_and_SetLevelRequestParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/SetLevelRequestMethod',
          },
          params: {
            $ref: '#/components/schemas/SetLevelRequestParam',
          },
        },
      },
      Request_for_SubscribeRequestMethod_and_SubscribeRequestParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/SubscribeRequestMethod',
          },
          params: {
            $ref: '#/components/schemas/SubscribeRequestParam',
          },
        },
      },
      Request_for_UnsubscribeRequestMethod_and_UnsubscribeRequestParam: {
        type: 'object',
        required: [
          'method',
          'params',
        ],
        properties: {
          method: {
            $ref: '#/components/schemas/UnsubscribeRequestMethod',
          },
          params: {
            $ref: '#/components/schemas/UnsubscribeRequestParam',
          },
        },
      },
      ResourceContents: {
        anyOf: [
          {
            type: 'object',
            required: [
              'text',
              'uri',
            ],
            properties: {
              mime_type: {
                type: [
                  'string',
                  'null',
                ],
              },
              text: {
                type: 'string',
              },
              uri: {
                type: 'string',
              },
            },
          },
          {
            type: 'object',
            required: [
              'blob',
              'uri',
            ],
            properties: {
              blob: {
                type: 'string',
              },
              mime_type: {
                type: [
                  'string',
                  'null',
                ],
              },
              uri: {
                type: 'string',
              },
            },
          },
        ],
      },
      ResourceListChangedNotificationMethod: {
        type: 'string',
        format: 'const',
        const: 'notifications/resources/list_changed',
      },
      ResourceUpdatedNotificationMethod: {
        type: 'string',
        format: 'const',
        const: 'notifications/resources/updated',
      },
      ResourceUpdatedNotificationParam: {
        type: 'object',
        required: [
          'uri',
        ],
        properties: {
          uri: {
            type: 'string',
          },
        },
      },
      ResourcesCapability: {
        type: 'object',
        properties: {
          listChanged: {
            type: [
              'boolean',
              'null',
            ],
          },
          subscribe: {
            type: [
              'boolean',
              'null',
            ],
          },
        },
      },
      Response: {
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
      Responses: {
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
      Role: {
        type: 'string',
        enum: [
          'user',
          'assistant',
        ],
      },
      Root: {
        type: 'object',
        required: [
          'uri',
        ],
        properties: {
          name: {
            type: [
              'string',
              'null',
            ],
          },
          uri: {
            type: 'string',
          },
        },
      },
      RootsCapabilities: {
        type: 'object',
        properties: {
          listChanged: {
            type: [
              'boolean',
              'null',
            ],
          },
        },
      },
      RootsListChangedNotificationMethod: {
        type: 'string',
        format: 'const',
        const: 'notifications/roots/list_changed',
      },
      SamplingMessage: {
        type: 'object',
        required: [
          'content',
          'role',
        ],
        properties: {
          content: {
            $ref: '#/components/schemas/Annotated_for_RawContent',
          },
          role: {
            $ref: '#/components/schemas/Role',
          },
        },
      },
      Schema: {
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
      SchemaObject: {
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
      SchemaObject2: {
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
      SecurityScheme: {
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
      Server: {
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
      ServerCapabilities: {
        title: 'Builder',
        description: '```rust # use rmcp::model::ServerCapabilities; let cap = ServerCapabilities::builder() .enable_logging() .enable_experimental() .enable_prompts() .enable_resources() .enable_tools() .enable_tool_list_changed() .build(); ```',
        type: 'object',
        properties: {
          completions: {
            type: [
              'object',
              'null',
            ],
            additionalProperties: true,
          },
          experimental: {
            type: [
              'object',
              'null',
            ],
            additionalProperties: {
              type: 'object',
              additionalProperties: true,
            },
          },
          logging: {
            type: [
              'object',
              'null',
            ],
            additionalProperties: true,
          },
          prompts: {
            anyOf: [
              {
                $ref: '#/components/schemas/PromptsCapability',
              },
              {
                type: 'null',
              },
            ],
          },
          resources: {
            anyOf: [
              {
                $ref: '#/components/schemas/ResourcesCapability',
              },
              {
                type: 'null',
              },
            ],
          },
          tools: {
            anyOf: [
              {
                $ref: '#/components/schemas/ToolsCapability',
              },
              {
                type: 'null',
              },
            ],
          },
        },
      },
      ServerResult: {
        anyOf: [
          {
            $ref: '#/components/schemas/InitializeResult',
          },
          {
            $ref: '#/components/schemas/CompleteResult',
          },
          {
            $ref: '#/components/schemas/GetPromptResult',
          },
          {
            $ref: '#/components/schemas/ListPromptsResult',
          },
          {
            $ref: '#/components/schemas/ListResourcesResult',
          },
          {
            $ref: '#/components/schemas/ListResourceTemplatesResult',
          },
          {
            $ref: '#/components/schemas/ReadResourceResult',
          },
          {
            $ref: '#/components/schemas/CallToolResult',
          },
          {
            $ref: '#/components/schemas/ListToolsResult',
          },
          {
            $ref: '#/components/schemas/EmptyObject',
          },
        ],
      },
      ServerVariable: {
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
      SetLevelRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'logging/setLevel',
      },
      SetLevelRequestParam: {
        type: 'object',
        required: [
          'level',
        ],
        properties: {
          level: {
            $ref: '#/components/schemas/LoggingLevel',
          },
        },
      },
      SingleOrVec_for_InstanceType: {
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
      SingleOrVec_for_Schema: {
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
      SseQuery: {
        type: 'object',
        properties: {
          timeout: {
            description: 'The maximum time to wait for the server to be ready before sending the message.',
            type: [
              'integer',
              'null',
            ],
            format: 'uint64',
            minimum: 0,
          },
        },
      },
      SubscribeRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'resources/subscribe',
      },
      SubscribeRequestParam: {
        type: 'object',
        required: [
          'uri',
        ],
        properties: {
          uri: {
            type: 'string',
          },
        },
      },
      SystemStatus: {
        type: 'object',
        required: [
          'arch',
          'availableParallelism',
          'cpuAverageLoad',
          'cpuAverageSpeed',
          'cpus',
          'family',
          'memoryAvailable',
          'memoryFree',
          'memoryTotal',
          'memoryUsed',
          'platform',
          'release',
          'uptime',
          'version',
        ],
        properties: {
          arch: {
            description: 'The architecture of the CPU (e.g., `x86_64`, `arm64`).',
            type: 'string',
          },
          availableParallelism: {
            description: 'The number of available parallelism threads.',
            type: 'integer',
            format: 'uint',
            minimum: 0,
          },
          cpuAverageLoad: {
            description: 'The load average over the last 1, 5, and 15 minutes.',
            type: 'array',
            items: {
              type: 'number',
              format: 'double',
            },
            maxItems: 3,
            minItems: 3,
          },
          cpuAverageSpeed: {
            description: 'The average CPU speed in MHz.',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          cpus: {
            description: 'A list of CPU information.',
            type: 'array',
            items: {
              $ref: '#/components/schemas/SystemStatusCpu',
            },
          },
          family: {
            description: 'The family of the CPU architecture (e.g., `x86`, `arm`).',
            type: 'string',
          },
          memoryAvailable: {
            description: 'The amount of available memory in bytes (total memory - free memory).',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          memoryFree: {
            description: 'The amount of free memory in bytes.',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          memoryTotal: {
            description: 'The total amount of memory in bytes.',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          memoryUsed: {
            description: 'The amount of used memory in bytes.',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          platform: {
            description: 'The platform the system is running on (e.g., `linux`, `windows`, `darwin`).',
            type: 'string',
          },
          release: {
            description: 'The release version of the operating system.',
            type: 'string',
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
      SystemStatusCpu: {
        type: 'object',
        required: [
          'model',
          'speed',
          'usage',
        ],
        properties: {
          model: {
            description: 'The model of the CPU (e.g., `Intel(R) Core(TM) i7-9700K CPU @ 3.60GHz`).',
            type: 'string',
          },
          speed: {
            description: 'The frequency of the CPU in MHz.',
            type: 'integer',
            format: 'uint64',
            minimum: 0,
          },
          usage: {
            description: 'The CPU usage percentage.',
            type: 'number',
            format: 'float',
          },
        },
      },
      Tag: {
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
      Tool: {
        description: 'A tool that can be used by a model.',
        type: 'object',
        required: [
          'inputSchema',
          'name',
        ],
        properties: {
          annotations: {
            description: 'Optional additional tool information.',
            anyOf: [
              {
                $ref: '#/components/schemas/ToolAnnotations',
              },
              {
                type: 'null',
              },
            ],
          },
          description: {
            description: 'A description of what the tool does',
            type: [
              'string',
              'null',
            ],
          },
          inputSchema: {
            description: 'A JSON Schema object defining the expected parameters for the tool',
            type: 'object',
            additionalProperties: true,
          },
          name: {
            description: 'The name of the tool',
            type: 'string',
          },
        },
      },
      ToolAnnotations: {
        description: 'Additional properties describing a Tool to clients.\n\nNOTE: all properties in ToolAnnotations are **hints**. They are not guaranteed to provide a faithful description of tool behavior (including descriptive properties like `title`).\n\nClients should never make tool use decisions based on ToolAnnotations received from untrusted servers.',
        type: 'object',
        properties: {
          destructiveHint: {
            description: 'If true, the tool may perform destructive updates to its environment. If false, the tool performs only additive updates.\n\n(This property is meaningful only when `readOnlyHint == false`)\n\nDefault: true A human-readable description of the tool\'s purpose.',
            type: [
              'boolean',
              'null',
            ],
          },
          idempotentHint: {
            description: 'If true, calling the tool repeatedly with the same arguments will have no additional effect on the its environment.\n\n(This property is meaningful only when `readOnlyHint == false`)\n\nDefault: false.',
            type: [
              'boolean',
              'null',
            ],
          },
          openWorldHint: {
            description: 'If true, this tool may interact with an "open world" of external entities. If false, the tool\'s domain of interaction is closed. For example, the world of a web search tool is open, whereas that of a memory tool is not.\n\nDefault: true',
            type: [
              'boolean',
              'null',
            ],
          },
          readOnlyHint: {
            description: 'If true, the tool does not modify its environment.\n\nDefault: false',
            type: [
              'boolean',
              'null',
            ],
          },
          title: {
            description: 'A human-readable title for the tool.',
            type: [
              'string',
              'null',
            ],
          },
        },
      },
      ToolListChangedNotificationMethod: {
        type: 'string',
        format: 'const',
        const: 'notifications/tools/list_changed',
      },
      ToolsCapability: {
        type: 'object',
        properties: {
          listChanged: {
            type: [
              'boolean',
              'null',
            ],
          },
        },
      },
      UnsubscribeRequestMethod: {
        type: 'string',
        format: 'const',
        const: 'resources/unsubscribe',
      },
      UnsubscribeRequestParam: {
        type: 'object',
        required: [
          'uri',
        ],
        properties: {
          uri: {
            type: 'string',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Server',
      description: 'Operations related to the `MCPServer` resources.',
    },
  ],
} as const
