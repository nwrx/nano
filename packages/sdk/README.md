# Maestrau - SDK

The Maestrau SDK is a collection of utilities and tools that helps developers integrate Maestrau workflows within their applications. It is designed to be a lightweight and easy-to-use and type-safe library that wraps API calls to a Maestrau instance with a simple interface.

## Installation

To install the Maestrau SDK, you can use the following command:

```bash
npm install @maestrau/sdk
```

## Usage

To use the Maestrau SDK, you can import the library and create a new instance of the SDK with the URL of the Maestrau instance you want to interact with:

```typescript
import { Maestrau } from '@maestrau/sdk';

// Instantiate the SDK with the URL of the Maestrau instance.
const maestrau = new Maestrau('https://app.maestrau.com', {
  apiKey: 'YOUR_API_KEY',
});

// List all workflows available on the Maestrau instance.
const workflows = await maestrau.getFlows(); // Returns a list of Chain objects.

// Call a chain with a specific input.
const result = await maestrau.callChain('summarize-email', { data: 'value' }); // Returns the result of the chain call.
```
