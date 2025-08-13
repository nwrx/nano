# `ModuleObject`

The `ModuleObject` is a module that allows users to create and manage custom structured data objects within a workspace. Similar to Salesforce custom objects, it provides a flexible way to define data schemas, validate data, and manage relationships between different object types. This module enables users to build custom data models tailored to their specific business needs.

An object can be syncronized with external data sources using adapters. The module supports various adapters for different data sources, such as:
- **Salesforce**: Synchronize with Salesforce custom objects.
- **HubSpot**: Synchronize with HubSpot custom objects.
- **OpenAPI based APIs**: Synchronize with any OpenAPI-compliant service.
- **PostgresQL**: Synchronize with PostgreSQL databases.
- **MongoDB**: Synchronize with MongoDB collections.
- **Notion**: Synchronize with Notion databases.
- **Google Sheets**: Synchronize with Google Sheets as a data source.

## Entities

<!-- Object Schema -->

### `Object`: Represents a custom object type definition.
- Must have a `Workspace` association to indicate which workspace the object belongs to.
- Must have a unique name within the workspace to avoid conflicts.
- Has a name, label, description, and can be changed after creation.
- Contains field definitions with their types, constraints, and validation rules.
- Can define relationships with other object schemas (one-to-one, one-to-many, many-to-many).
- Can be enabled or disabled to control usability using `disabledAt` field.
- Has versioning support to track schema changes over time.
- Has an `icon` field to represent the field visually in the UI. Will be linked to a `Icon` entity.
- Can have a `color` field to represent the object visually in the UI.
- Can have a `isPublic` flag to indicate if the object and its records are accessible to all users in the workspace.
- Can have a `Model` association that will be used to generate the embedding of the records.
- Can be associated with an `ObjectConnection` to synchronize data with external sources.

## `ObjectConnection`: Represents an external data source connection for an object schema.
  - Has a `isSyncedFromConnection` flag to indicate if the object is synchronized from an external source.
  - Has a `isSyncedToConnection` flag to indicate if the object is synchronized to an external source.

### `ObjectField`: Represents a field definition within an object schema.
- Contains the field details such as name, type, label, and description.
- Must be associated with an `Object`.
- Has a `required` flag to indicate if the field is mandatory.
- Has an `index` flag to indicate if the field should be indexed for faster queries.
- Supports default values and auto-generation rules.
- Can be marked as `isUnique` to enforce uniqueness across records.
- Can be marked as `isReadOnly` to prevent modification after creation.
- Can be marked as `isHidden` to hide the field from the UI.
- Can be marked as `isEmbedded` to indicate that the field will be used in the embedding process.
- Has an `icon` field to represent the field visually in the UI.
- Has a `type` to indicate the data type that the field will hold.
- Has a `schema` to define validation rules and constraints for the field. Based on JSON Schema Draft 7.

### `ObjectFieldRole`: Assign one or more roles to an `ObjectField` to indicate its purpose or usage.
- Has a `role` field that can be 
  - `title`: Indicates that the field is used as the title of the object record.
  - `description`: Indicates that the field is used as the description of the object record.
  - `summary`: Indicates that the field is used as a summary of the object record.
  - `content`: Indicates that the field is used as a the main content of the object record.
  - `url`: Indicates that the field is used as a URL for the object record.
  - `email`: Indicates that the field is used as an email for the object record.
  - `phone`: Indicates that the field is used as a phone number for the object record.
  - `image`: Indicates that the field is used as an image for the object record.
  - `date`: Indicates that the field is used as a the main date for the object record.
  - `author`: Indicates that the field is used as the author of the object record.
  - `price`: Indicates that the field is used as a price for the object record.

- If the field type is `string`, it can have:
  - A `schema.required` flag to indicate if the field is mandatory.
  - A `schema.unique` flag to enforce uniqueness across records.
  - A `schema.maxLength` to limit the number of characters.
  - A `schema.minLength` to enforce a minimum character count.
  - A `schema.pattern` for regex validation.
  - A `schema.format` to specify the text format (e.g., `email`, `url`, `phone`).
  - A `schema.default` to set the initial state (true/false).
  - A `schema.enum` to define a set of predefined values (picklist).

- If the field type is `number` or `integer`, it can have:
  - A `schema.min` and `schema.max` to define the valid range.
  - A `schema.step` to indicate the increment/decrement value.
  - A `schema.default` to set the initial state (true/false).
  - A `schema.unit` to specify the unit of measurement (e.g., `mass`, `length`, `currency`, `dataVolume`, ...etc).
  - A `schema.currency` to specify the currency type (e.g., `USD`, `EUR`, `JPY`, only if the field type is `currency`).
  - A `schema.enum` to define a set of predefined values (picklist).

- If the field type is `boolean`, it can have:
  - A `defaultValue` to set the initial state (true/false).

  <!-- - Can be a file (e.g., `file:image/*`, `file:application/pdf`). -->
- If the field type is `date`, it can have:
  - A `schema.format` to specify the date format (e.g., `date`, `datetime`, `time`).

- If the field type is `reference`, it must have:
  - A `referenceTo` to indicate the `Object` it references.
  - A `referenceType` to indicate the relationship type (`OneToOne`, `OneToMany`, `ManyToMany`).
  - A `cascadeOnDelete` flag to indicate if related records should be deleted when the source record is deleted.

### `ObjectRecord`: Represents an actual data record based on an object schema.
- Contains the actual data values conforming to the object schema definition.
- Must be associated with an `Object`.
- Has a unique identifier within the schema type.
- Contains field values validated against the schema definition.
- Tracks creation and modification timestamps and users.
- Can be soft-deleted for data retention and auditing.

### `ObjectRecordValue`: Represents individual field values within an object instance.
- Contains the actual value for a specific field in an object instance.
- Must be associated with both an `ObjectRecord` and an `ObjectField`.
- Stores the value in a JSON format to support various data types.
- Maintains data type validation based on the field definition.
- If the field of type `reference`, it stores the `ObjectRecord` of the referenced instance.
- If the field type is `picklist` or `multiPicklist`, it stores the selected values as an array of strings.

! When a record field changes it's type, attempt to convert values to the new type. If conversion fails, we soft-delete every values.

<!-- Adapters -->

### `ObjectConnection`: Represents an external data source connection for an object schema.
- Contains the connection details such as type, configuration, and authentication.
- Can be used to synchronize data with external systems (e.g., Salesforce, HubSpot, Notion).
- Supports various connection types (e.g., `Salesforce`, `HubSpot`, `OpenAPI`, `PostgresQL`, `MongoDB`, `Notion`, `Google Sheets`).
- Can be used to fetch, update, and delete data from the external source.

### `ObjectConnectionParameter`: Represents a parameter for configuring an `ObjectConnection`.
- Contains the parameter details such as name, type, and value.
- Can be used to configure the connection behavior (e.g., authentication, query parameters).
- Can be a static value or a reference to a variable in the `Vault` module.

<!-- Permissions -->

### `ObjectUserAssignment`: Represents permissions for accessing object schemas.
- Is a many-to-many relationship with `User` and `Object`.
- Contains the `permission` type to indicate the level of access (e.g., `Read`, `Write`, `Owner`, `Create`, `Delete`).
- Can be assigned at the user or project level.

### `ObjectProjectAssignment`: Represents permissions for accessing object schemas within a project.
- Is a many-to-many relationship with `Project` and `Object`.
- Contains the `permission` type to indicate the level of access (e.g., `Read`, `Write`, `Owner`, `Create`, `Delete`).

<!-- Monitoring -->

### `ObjectChange`: Represents audit trail for object operations.
- Tracks all create, read, update, and delete operations on object schemas.
- Contains the operation details, user information, and timestamp.
- Must be associated with an `Object` to track schema changes.
- Stores before and after values for update operations.

### `ObjectRecordChange`: Represents audit trail for object operations.
- Tracks all create, read, update, and delete operations on object instances.
- Contains the operation details, user information, and timestamp.
- Must be associated with an `ObjectRecord` to track data changes.
- Stores before and after values for update operations.

### `ObjectRecordValueChange`: Represents audit trail for object field value changes.
- Tracks changes to individual field values within an object instance.
- Contains the operation details, user information, and timestamp.
- Must be associated with an `ObjectRecordValue` to track field value changes.
- Stores the previous and new values for field updates.

## Object Field Types

The module supports various field types for flexible data modeling:

- **Text**: Short and long text fields with length constraints
- **Number**: Integer and decimal numbers with range validation
- **Boolean**: True/false values
- **Date**: Date and datetime fields with format validation
- **Email**: Email addresses with format validation
- **URL**: Web URLs with format validation
- **Phone**: Phone numbers with format validation
- **Reference**: Links to other object instances (foreign keys)
- **Picklist**: Predefined list of values (enum)
- **Multi-Picklist**: Multiple selections from predefined values
- **File**: File attachments with type and size constraints
- **JSON**: Structured JSON data with schema validation
- **Formula**: Calculated fields based on other field values
- **Auto-Number**: Automatically generated sequential numbers

## Utilities

<!-- Schema Management -->

- `assertObject`: Parse and validate an `Object` from an object.
- `assertObjectField`: Parse and validate an `ObjectField` from an object.
- `assertObjectFieldType`: Parse and validate the field type enum.
- `assertObjectPermission`: Parse and validate the permission enum for object access.
- `assertObjectConnection`: Parse and validate an `ObjectConnection` from an object.
- `assertObjectAdapterParameter`: Parse and validate an `ObjectAdapterParameter` from an object.

- `getObject`: Fetches a specific `Object` by its ID within a workspace.
- `getObjectField`: Fetches a specific `ObjectField` by its ID within a schema.
- `getObjectRecord`: Fetches a specific `ObjectRecord` by its ID.
- `getObjectRecordValue`: Fetches a specific `ObjectRecordValue` by its ID.
- `getObjectConnection`: Fetches a specific `ObjectConnection` by its ID.
- `getObjectAdapterParameter`: Fetches a specific `ObjectAdapterParameter` by its ID.

- `searchObjects`: Searches for `Object`s based on query parameters and user permissions.
- `searchObjectFields`: Searches for `ObjectField`s within a specific object schema.
- `searchObjectRecords`: Searches for `ObjectRecord`s within a specific schema based on filters.
- `searchObjectConnections`: Searches for `ObjectConnection`s within a workspace.

- `createObject`: Creates a new `Object` within a workspace.
- `createObjectField`: Creates a new `ObjectField` within an object schema.
- `createObjectRecord`: Creates a new `ObjectRecord` based on a schema.
- `createObjectRecordValue`: Creates a new `ObjectRecordValue` for a specific field.
- `createObjectConnection`: Creates a new `ObjectConnection` for external data synchronization.
- `createObjectAdapterParameter`: Creates a new `ObjectAdapterParameter` for connection configuration.

- `updateObject`: Updates the details of an existing `Object`.
- `updateObjectField`: Updates the details of an existing `ObjectField`.
- `updateObjectRecord`: Updates field values of an existing `ObjectRecord`.
- `updateObjectRecordValue`: Updates a specific `ObjectRecordValue`.
- `updateObjectConnection`: Updates an existing `ObjectConnection`.
- `updateObjectAdapterParameter`: Updates an existing `ObjectAdapterParameter`.

- `deleteObject`: Soft deletes an `Object` and related data.
- `deleteObjectField`: Removes an `ObjectField` from a schema (with validation).
- `deleteObjectRecord`: Soft deletes an `ObjectRecord`.
- `deleteObjectRecordValue`: Removes an `ObjectRecordValue`.
- `deleteObjectConnection`: Removes an `ObjectConnection`.
- `deleteObjectAdapterParameter`: Removes an `ObjectAdapterParameter`.

<!-- Data Operations -->

- `validateObjectRecord`: Validates object instance data against its schema definition.
- `validateObjectFieldValue`: Validates a single field value against its field definition.
- `transformObjectData`: Transforms raw data according to field type definitions.
- `convertFieldValue`: Converts field values when field types change.
- `calculateFormulaFields`: Computes values for formula fields based on other field values.
- `enforceRelationshipRules`: Validates and enforces relationship constraints.
- `generateAutoNumber`: Generates auto-incrementing numbers for auto-number fields.

<!-- Query and Filtering -->

- `buildObjectQuery`: Constructs database queries for object instance searches.
- `applyObjectFilters`: Applies filters and sorting to object instance queries.
- `exportObjectData`: Exports object instance data in various formats (JSON, CSV, Excel).
- `importObjectData`: Imports object instance data with validation and error reporting.
- `bulkCreateObjectRecords`: Creates multiple object records in a single operation.
- `bulkUpdateObjectRecords`: Updates multiple object records in a single operation.
- `bulkDeleteObjectRecords`: Soft deletes multiple object records in a single operation.

<!-- Permission Management -->

- `createObjectUserAssignment`: Assigns user permissions for accessing an object.
- `createObjectProjectAssignment`: Assigns project permissions for accessing an object.
- `updateObjectUserAssignment`: Updates user permissions for an object.
- `updateObjectProjectAssignment`: Updates project permissions for an object.
- `deleteObjectUserAssignment`: Removes user permissions for an object.
- `deleteObjectProjectAssignment`: Removes project permissions for an object.
- `checkObjectAccess`: Validates user permissions for object operations.
- `checkObjectRecordAccess`: Validates user permissions for specific object record operations.
- `getUserObjectPermissions`: Retrieves all object permissions for a specific user.
- `getProjectObjectPermissions`: Retrieves all object permissions for a specific project.

<!-- Synchronization and Adapters -->

- `syncObjectFromConnection`: Synchronizes object data from an external source.
- `syncObjectToConnection`: Synchronizes object data to an external source.
- `testObjectConnection`: Tests connectivity and authentication for an object connection.
- `getConnectionSchema`: Retrieves schema information from an external connection.
- `mapConnectionFields`: Maps external fields to object fields for synchronization.
- `scheduleSyncJob`: Schedules automatic synchronization for object connections.

<!-- Audit and Monitoring -->

- `logObjectChange`: Records audit trail entries for object schema changes.
- `logObjectRecordChange`: Records audit trail entries for object record changes.
- `logObjectRecordValueChange`: Records audit trail entries for field value changes.
- `getObjectAuditHistory`: Retrieves audit history for an object schema.
- `getObjectRecordAuditHistory`: Retrieves audit history for an object record.
- `getObjectRecordValueAuditHistory`: Retrieves audit history for field value changes.
- `generateObjectReport`: Creates reports on object usage and data statistics.
- `generateObjectUsageMetrics`: Generates usage metrics for objects and records.

<!-- Reference Resolution -->

- `resolveObjectReference`: Resolves a `#/Object/<Schema>/<Record>` reference to an object instance.
- `resolveFieldReference`: Resolves field references in formula and validation expressions.
- `resolveObjectRecordReferences`: Resolves all reference fields within an object record.
- `validateReferenceIntegrity`: Validates that all reference fields point to existing records.

<!-- Schema Versioning -->

- `createObjectVersion`: Creates a new version of an object schema.
- `getObjectVersionHistory`: Retrieves version history for an object schema.
- `rollbackObjectVersion`: Rolls back an object schema to a previous version.
- `compareObjectVersions`: Compares differences between object schema versions.

<!-- Field Type Utilities -->

- `validateTextField`: Validates text field values against schema constraints.
- `validateNumberField`: Validates number field values against schema constraints.
- `validateDateField`: Validates date field values against schema constraints.
- `validateBooleanField`: Validates boolean field values against schema constraints.
- `validateReferenceField`: Validates reference field values against target objects.
- `validatePicklistField`: Validates picklist field values against allowed options.
- `validateFileField`: Validates file field values against type and size constraints.
- `validateJSONField`: Validates JSON field values against schema definitions.

## API Routes

The module provides RESTful API endpoints for object management:

### Schema Management
- `GET /workspaces/:workspace/objects` - List objects with filtering and pagination
- `POST /workspaces/:workspace/objects` - Create a new object schema
- `GET /workspaces/:workspace/objects/:name` - Get object schema details
- `PUT /workspaces/:workspace/objects/:name` - Update object schema
- `DELETE /workspaces/:workspace/objects/:name` - Soft delete object schema
- `POST /workspaces/:workspace/objects/:name/restore` - Restore soft-deleted object

### Field Management
- `GET /workspaces/:workspace/objects/:name/fields` - List object fields
- `POST /workspaces/:workspace/objects/:name/fields` - Create a new field
- `GET /workspaces/:workspace/objects/:name/fields/:fieldId` - Get field details
- `PUT /workspaces/:workspace/objects/:name/fields/:fieldId` - Update field definition
- `DELETE /workspaces/:workspace/objects/:name/fields/:fieldId` - Remove field
- `POST /workspaces/:workspace/objects/:name/fields/:fieldId/validate` - Validate field configuration

### Record Management
- `GET /workspaces/:workspace/objects/:name/records` - List object records with filtering, sorting, and pagination
- `POST /workspaces/:workspace/objects/:name/records` - Create a new object record
- `GET /workspaces/:workspace/objects/:name/records/:id` - Get object record details
- `PUT /workspaces/:workspace/objects/:name/records/:id` - Update object record
- `PATCH /workspaces/:workspace/objects/:name/records/:id` - Partially update object record
- `DELETE /workspaces/:workspace/objects/:name/records/:id` - Soft delete object record
- `POST /workspaces/:workspace/objects/:name/records/:id/restore` - Restore soft-deleted record

### Bulk Operations
- `POST /workspaces/:workspace/objects/:name/records/bulk` - Bulk create records
- `PUT /workspaces/:workspace/objects/:name/records/bulk` - Bulk update records
- `DELETE /workspaces/:workspace/objects/:name/records/bulk` - Bulk delete records
- `POST /workspaces/:workspace/objects/:name/records/bulk/restore` - Bulk restore records

### Data Operations
- `POST /workspaces/:workspace/objects/:name/validate` - Validate object data against schema
- `POST /workspaces/:workspace/objects/:name/records/:id/validate` - Validate specific record
- `POST /workspaces/:workspace/objects/:name/import` - Import data from file (CSV, JSON, Excel)
- `GET /workspaces/:workspace/objects/:name/export` - Export object data in various formats
- `POST /workspaces/:workspace/objects/:name/transform` - Transform data according to field definitions

### Connection Management
- `GET /workspaces/:workspace/objects/:name/connections` - List object connections
- `POST /workspaces/:workspace/objects/:name/connections` - Create external data connection
- `GET /workspaces/:workspace/objects/:name/connections/:connectionId` - Get connection details
- `PUT /workspaces/:workspace/objects/:name/connections/:connectionId` - Update connection
- `DELETE /workspaces/:workspace/objects/:name/connections/:connectionId` - Remove connection
- `POST /workspaces/:workspace/objects/:name/connections/:connectionId/test` - Test connection

### Connection Parameters
- `GET /workspaces/:workspace/objects/:name/connections/:connectionId/parameters` - List connection parameters
- `POST /workspaces/:workspace/objects/:name/connections/:connectionId/parameters` - Create connection parameter
- `PUT /workspaces/:workspace/objects/:name/connections/:connectionId/parameters/:parameterId` - Update parameter
- `DELETE /workspaces/:workspace/objects/:name/connections/:connectionId/parameters/:parameterId` - Remove parameter

### Synchronization
- `POST /workspaces/:workspace/objects/:name/sync/from` - Sync data from external source
- `POST /workspaces/:workspace/objects/:name/sync/to` - Sync data to external source
- `GET /workspaces/:workspace/objects/:name/sync/status` - Get synchronization status
- `POST /workspaces/:workspace/objects/:name/sync/schedule` - Schedule automatic sync
- `GET /workspaces/:workspace/objects/:name/sync/schema` - Get external source schema
- `POST /workspaces/:workspace/objects/:name/sync/map` - Map external fields to object fields

### Permission Management
- `GET /workspaces/:workspace/objects/:name/permissions/users` - List user permissions
- `POST /workspaces/:workspace/objects/:name/permissions/users` - Assign user permissions
- `PUT /workspaces/:workspace/objects/:name/permissions/users/:userId` - Update user permissions
- `DELETE /workspaces/:workspace/objects/:name/permissions/users/:userId` - Remove user permissions
- `GET /workspaces/:workspace/objects/:name/permissions/projects` - List project permissions
- `POST /workspaces/:workspace/objects/:name/permissions/projects` - Assign project permissions
- `PUT /workspaces/:workspace/objects/:name/permissions/projects/:projectId` - Update project permissions
- `DELETE /workspaces/:workspace/objects/:name/permissions/projects/:projectId` - Remove project permissions

### Live Data Retrieval
- `GET /workspaces/:workspace/objects/sse` - Get live data for all objects using Server-Sent Events
- `GET /workspaces/:workspace/objects/:name/sse` - Get live data for specific object using SSE
- `GET /workspaces/:workspace/objects/:name/records/sse` - Get live data for object records using SSE
- `GET /workspaces/:workspace/objects/:name/records/:id/sse` - Get live data for specific record using SSE

### History and Audit
- `GET /workspaces/:workspace/objects/history` - Get history of all object changes
- `GET /workspaces/:workspace/objects/:name/history` - Get history of object schema changes
- `GET /workspaces/:workspace/objects/:name/records/history` - Get history of all record changes
- `GET /workspaces/:workspace/objects/:name/records/:id/history` - Get history of specific record changes
- `GET /workspaces/:workspace/objects/:name/records/:id/values/:fieldId/history` - Get field value change history

### Versioning
- `GET /workspaces/:workspace/objects/:name/versions` - Get object schema version history
- `POST /workspaces/:workspace/objects/:name/versions` - Create new schema version
- `GET /workspaces/:workspace/objects/:name/versions/:version` - Get specific schema version
- `POST /workspaces/:workspace/objects/:name/versions/:version/rollback` - Rollback to specific version
- `GET /workspaces/:workspace/objects/:name/versions/compare` - Compare schema versions

### Reference Resolution
- `GET /workspaces/:workspace/objects/:name/records/:id/references` - Get all reference fields
- `POST /workspaces/:workspace/objects/:name/records/:id/references/resolve` - Resolve reference fields
- `POST /workspaces/:workspace/objects/:name/references/validate` - Validate reference integrity

### Reports and Analytics
- `GET /workspaces/:workspace/objects/:name/reports` - Generate object usage reports
- `GET /workspaces/:workspace/objects/:name/metrics` - Get object usage metrics
- `GET /workspaces/:workspace/objects/:name/analytics` - Get object analytics data

### Search and Query
- `GET /workspaces/:workspace/objects/search` - Search across all objects
- `GET /workspaces/:workspace/objects/:name/search` - Search within specific object records

## Modules

This module will be split into multiple sub-modules for better organization and maintainability:
- `ModuleObject`: Manage `Object` and `ObjectChange`.
- `ModuleObjectField`: Manage `ObjectField` and `ObjectFieldChange`.
- `ModuleObjectRecord`: Manage `ObjectRecord` and `ObjectRecordValue` and their changes.
- `ModuleObjectConnection`: Manage `ObjectConnection` and `ObjectAdapterParameter`.
- `ModuleObjectAssignment`: Manage `ObjectUserAssignment` and `ObjectProjectAssignment`.

## Examples

### Creating a Custom Contact Object

```typescript
// Define a Contact object schema
const contactObject = await createObject({
  workspace,
  user,
  name: 'Contact',
  label: 'Contact',
  description: 'Customer contact information',
})

// Create a contact instance
const contact = await createObjectRecord({
  object: contactObject,
  user,
  data: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    company: getObjectRecord({
      object: companiesObject, 
      id: '000000-0000-0000000-00000'
    }),
  }
})
```
