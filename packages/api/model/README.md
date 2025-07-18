# `ModuleModel`

The `ModuleModel` is a module that holds the registered LLM models within a `ModelProvider`. It is used to manage the models, autorize access, and handle requests to the models. Additionally, it provides monitoring and cost tracking for the models used within a workspace.

## Entities

<!-- Provider -->

### `ModelProvider`: Represents a provider of LLM models, such as OpenAI, Anthropic or VLLM.
- Must have a `Workspace` association to indicate which workspace the provider belongs to.
- Must have a unique name within the workspace to avoid conflicts.
- Can have multiple `Model`s registered under it.
- Has a name, title and description and can be changed after creation.
- Has a `extends` to indicate the type of provider (e.g., `openai`, `anthropic`, `vllm`) so that the system can handle different providers appropriately using the correct adapter.
- Can have multiple `ModelProviderParameter`s to configure the provider's behavior.
- Can be enabled or disabled to control access to the models it provides.

### `ModelProviderParameter`: Represents a parameter for a `ModelProvider`.
- Contains a value that can be a string, number, or boolean and can be used to configure the provider's behavior.
- Has a `location` to indicate where the parameter should be used (e.g., `header`, `query`, `body`).
- Has a `type` to indicate the data type of the parameter. Must be a JSONSchema7 object.
- Has a `value` or `variable` assigned to the parameter, which can be a static value or a reference to a variable in the `Vault` module.

### `ModelProviderAssignment`: Represents the permissions granted to a user or role for accessing a `ModelProvider`.
- Is a many-to-many relationship with `User` and `ModelProvider`.
- Contains the `permission` type to indicate the level of access (e.g., `Read`, `Write`, `Owner`, `Use`).

<!-- Model -->

### `Model`: Represents a specific LLM model registered under a `ModelProvider`.
- Has a name and a description and can't be changed after creation.
- Must have an associated `ModelProvider`.
- Must have a unique name within the `ModelProvider`.
- Describes the capabilities of the model, such as input/output formats, supported languages, and any specific parameters required for requests.
- Can have multiple `ModelRequest`s associated with it to track requests made to the model.
- May have a `status` to indicate whether the model is available for use (e.g., `Available`, `Unavailable`, `Deprecated`).
- Can have additionnal metadata in a `metadata` field, such as supported features, quantization, and other relevant information.
- Must have a `vendor` to indicate the vendor of the model (e.g., OpenAI, Anthropic, huggingface's user).

<!-- Vendor -->

### `ModelVendor`: Represents a vendor of LLM models, such as OpenAI, Anthropic, or VLLM.
- Contrary to `ModelProviderTemplate`, it represents the true authority behind the models, such as OpenAI, Anthropic. The one that actually trained the models.
- Contains the vendor details, such as name, title, description, and type.
- It has a reverse relationship with `Model` to indicate which models are provided by the vendor.

<!-- Monitoring -->

### `ModelRequest`: Represents a request made to a specific model.
- Contains the request details, such as the input text, parameters, and metadata.
- Has a reference to the `Model` being requested.
- Has a reference to a `Thread` to track the conversation context.
- Can have a status to indicate the state of the request (e.g., `Pending`, `Processing`, `Completed`, `Failed`).

### `ModelMessage`: Represents a message in a conversation with a model.
- Contains the message content, sender information, and timestamp.
- Must be associated with a `ModelRequest` to track the conversation history.
- Can have a type to indicate whether it's a user message or a model response.

### `ModelCost`: Represents the cost associated with using a specific model and within a timeframe.
- Can be used to generate reports and analytics on model usage and costs.
- Contains the cost details, such as the amount, currency, and timestamp.
- Must be associated with a `Model` to track the costs incurred for using that model.
- Has multiple `ModelCostEntry`s to track individual cost entries.

### `ModelCostEntry`: Represents an individual cost entry for a specific model usage.
- Contains the cost details, such as the amount, currency, and beginAt timestamp.
- Must be associated with a `ModelCost` to track the costs incurred for using that model.
- Has a `beginAt` to indicate when the cost was incurred. It means that the most recent cost entry is the one that is currently being tracked.
- Has a `type` to indicate the type of cost (e.g., `inputToken`, `outputToken`, `outputImage`, ...).

## Utilities

<!-- Provider -->

- `assertModel`: Parse and validate a `Model` from an or object.
- `assertModelVendor`: Parse and validate a `ModelVendor` from an or object.
- `assertModelProvider`: Parse and validate a `ModelProvider` from an or object.
- `assertModelProviderExtends`: Parse and validate the `extends` enum for `ModelProvider`.
- `assertModelProviderTemplate`: Parse and validate a `ModelProviderTemplate` from an or object.
- `assertModelProviderPermission`: Parse and validate the `permission` enum for `ModelProviderAssignment`.

- `getModel`: Fetches a specific `Model` by its name and `ModelProvider`.
- `getModelComponent`: Fetches a Nano component for a specific `Model` and `ModelProvider` using the model adapter.

- `getModelProvider`: Fetches a specific `ModelProvider` by its ID. (Based on `User`+`ModelProviderAssignment` or `Project`+`ModelProviderProjectAssignment`)
- `getModelProviderTemplate`: Fetches a specific `ModelProviderTemplate` by its name.

- `searchModelProviders`: Searches for `ModelProvider`s based on a query string. (Based on `User`+`ModelProviderAssignment` or `Project`+`ModelProviderProjectAssignment`)
- `searchModelProviderTemplates`: Searches for `ModelProviderTemplate`s based on a query string.

- `createModel`: Creates a new `Model` under a specific `ModelProvider`.
- `createModelVendor`: Creates a new `ModelVendor` to represent the authority behind the models.
- `createModelProvider`: Creates a new `ModelProvider` based on a `ModelProviderTemplate` within a `Workspace`.
- `createModelProviderTemplate`: Creates a new `ModelProviderTemplate` for use in creating new `ModelProvider`s. (Admin only)

- `updateModel`: Updates the details of an existing `Model`.
- `updateModelProvider`: Updates the details of an existing `ModelProvider`.
- `updateModelProviderUserPermissions`: Assigns a `ModelProvider` to a `User` with specific permissions.
- `updateModelProviderProjectPermissions`: Assigns a `ModelProvider` to a `Project` with specific permissions.

- `resolveModelReference`: Resolves a `#/Model/<Provider>/<Model>` reference to a `Model` object.
