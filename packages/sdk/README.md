# Nano - SDK

The Nano SDK is a collection of utilities and tools that helps developers integrate Nano workflows within their applications. It is designed to be a lightweight and easy-to-use and type-safe library that wraps API calls to a Nano instance with a simple interface.

## Installation

To install the Nano SDK, you can use the following command:

```bash
npm install @nwrx/sdk
```

## Usage

To use the Nano SDK, you can import the library and create a new instance of the SDK with the URL of the Nano instance you want to interact with:

```typescript
import NwrxSDK from '@nwrx/sdk';

// Instantiate the SDK with the URL of the Nano instance.
const nwrx = new NwrxSDK({
  apiKey: 'YOUR_API_KEY',
  instanceUrl: 'https://nwrx.io',
});

// List all workflows available on the Nano instance.
const flows = await nwrx.getFlows(); // Returns a list of flow objects.
const flow = await nwrx.getFlow('summarize-email'); // Returns a flow object.

// Call a chain with a specific input.
const thread = await flow.start('summarize-email', { body: '...' }); // Returns the result of the flow call.
```
