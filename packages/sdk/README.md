# Nano - SDK

The Nano SDK is a collection of utilities and tools that helps developers integrate Nano workflows within their applications. It is designed to be a lightweight and easy-to-use and type-safe library that wraps API calls to a Nano instance with a simple interface.

## Installation

To install the Nano SDK, you can use the following command:

```bash
npm install @nanoworks/sdk
```

## Usage

To use the Nano SDK, you can import the library and create a new instance of the SDK with the URL of the Nano instance you want to interact with:

```typescript
import { Nano } from '@nanoworks/sdk';

// Instantiate the SDK with the URL of the Nano instance.
const Nano = new Nano('https://app.nanoworks.io', {
  apiKey: 'YOUR_API_KEY',
});

// List all workflows available on the Nano instance.
const workflows = await Nano.getFlows(); // Returns a list of flow objects.

// Call a chain with a specific input.
const result = await Nano.callFlow('summarize-email', { data: 'value' }); // Returns the result of the flow call.
```
