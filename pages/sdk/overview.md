# SDK

> The main differences between Server Side SDK and Client Side SDK
>
> - Server side SDK is designed to be used in a multi user environment but client side SDK is designed to be used in a single user environment.
> - Server side SDK do the evaluation locally but Client Side SDK rely on the server to evaluate flags 

The use of SDK is an essential skill for understanding how to deliver, control, and experiment with the software through feature flags.

Our official offered SDK is the best choice for you to get started with Feature Flags. It is also the best choice for you to implement the best practices of Feature Flags. All SDKs are considering the following best practices:

1. **Local cache**, if the network is not available, the SDK will use the local cache to get the feature flag evaluation result.
2. **Local cache update**, if the network is available, the SDK will update the local cache with the latest feature flag evaluation result.
3. **Real time update**, the SDK will receive the latest feature flag evaluation result from the server in real time.
4. **High Performance**, the SDK will not affect the performance of your application.
5. **Compatible**, the SDK will be compatible with the old version of the SDK. You can upgrade the SDK without any impact on your application.
6. **Server Side Evaluation**, the server-side SDK evaluates the feature flag locally. So you don't need to worry about the network latency and security of your feature flags.
7. **Client side Evaluation**, the client-side SDK retrieves the evaluation result from server at the init stage, so you don't worry about the performance impact of the feature flag.
8. **Custom Event & Feature Flags Insights**, the SDK will send the custom event and feature flags insights to the server. So you can get the insights of your feature flags and custom events.
9. **Custom Event for feature experiments**, the SDK will send the custom event to the server. So you can use the custom event to do the feature experiments.
10. **Retry mechansim**, the SDK will retry to connect to the server automatically if the network is not available.
11. **Feature Flag & evluation update listener**, the SDK will notify you when the feature flag or evaluation result is updated.

To getting started with our SDKs, we offer two ways:

- Follow the guide in the portal to quickly implement SDK in your project. You can read quick start guide [here](../getting-started/connect-an-sdk).
- Read the README file of the SDK on GitHub to manually implement SDK in your project.

## Supported SDKs

We provide a variety of client-side, server-side, and mobile SDKs to choose from. You can select the language you're good at to accelerate completing your quick start.

### JavaScript

We provide a client-side [Javascript/Typescript SDK](https://github.com/featbit/featbit-js-client-sdk). We also provide a "Dino Game" sample for [Vue](https://github.com/featbit/featbit-samples/tree/main/samples/dino-game/interactive-demo-vue). This SDK works perfectly with Typescript, React, Vue, Angular, etc.

The SDK's GitHub repository contains full tutorials for React and NextJs APPs on how to use it. It also provides a sample project for you to try out.

### ReactJS

We provide a client-side [React SDK](https://github.com/featbit/featbit-react-client-sdk).

The SDK's GitHub repository contains full tutorials for React and NextJs APPs on how to use it. It also provides three sample projects for you to try out.

### React Native

We provide a client-side [React Native SDK](https://github.com/featbit/featbit-react-native-sdk).

The SDK's GitHub repository contains full tutorials for React Native APPs on how to use it. It also provides two sample projects for you to try out.


### Node.js

We provide a [server-side Node.js SDK](https://github.com/featbit/featbit-node-server-sdk) for you to use. This SDK can be used in your console APP or Express.js and other web application framework APP.

The SDK's GitHub repository contains a full tutorial on how to use it. It also provides a sample project for you to try out.

### .NET

We provide .NET SDKs for both client-side and server-side applications.
- The [Server-Side .NET SDK](https://github.com/featbit/featbit-dotnet-sdk)  is designed primarily for use in multi-user systems such as ASP.NET Core.
- The [Client-Side .NET SDK](https://github.com/featbit/featbit-dotnet-client-sdk) is intended for use in a single-user context, which can be mobile, desktop or embedded applications.

The SDK's GitHub repository contains a full tutorial on how to use it. It also provides some examples project for you to try out.

### Java

We provide a [Java SDK](https://github.com/featbit/featbit-java-sdk) for you to use. This SDK can be used in your console APP or Spring Boot APP. 

The SDK's GitHub repository contains a full tutorial on how to use it. It also provides a sample project for you to try out.

### Python

We provide a [Python SDK](https://github.com/featbit/featbit-python-sdk). The SDK's GitHub repository contains a full tutorial on how to use it. It also provides a sample project for you to try out.

### Go

We provide a [Go SDK](https://github.com/featbit/featbit-go-sdk). The SDK's GitHub repository contains a full tutorial on how to use it. It also provides a sample project for you to try out.

### OpenFeature Providers

#### JavaScript

We provide a [OpenFeature provider for Javascript SDK](https://github.com/featbit/featbit-js-client-openfeature-provider) for you to use. Be aware, this is a client side SDK, it is intended for use in a single-user context, which can be mobile, desktop or embedded applications. This SDK can only be ran in a browser environment, it is not suitable for NodeJs applications.

The SDK's GitHub repository contains a full tutorial on how to use it. It also provides a sample project for you to try out.

#### Node.js

We provide a [OpenFeature provider for Node.js SDK](https://github.com/featbit/openfeature-provider-node-server) for you to use. This SDK can be used in your console APP or Express.js and other web application framework APP.

The SDK's GitHub repository contains a full tutorial on how to use it. It also provides a sample project for you to try out.

#### .NET

We provide a [OpenFeature Provider for .NET Server-Side SDK](https://github.com/featbit/openfeature-provider-dotnet-server) for you to use. This SDK can be used in your .NET web or desktop application.

The SDK's GitHub repository contains a full tutorial on how to use it. It also provides a sample project for you to try out.

#### Java

We provide a [OpenFeature provider for Java Server SDK](https://github.com/featbit/featbit-openfeature-provider-java-server) for you to use. This SDK can be used in your console APP or Spring Boot APP. 

The SDK's GitHub repository contains a full tutorial on how to use it. It also provides a sample project for you to try out.

## REST APIs & WebSocket

We are continuously dedicated to expanding our platform support. However, it is possible that the specific platform you are targeting may not currently have an available SDK. In such instances, we offer two alternatives:

- Use our REST APIs to get feature flags and evaluation result. See the documentation [Evaluation with REST APIs](/api-docs/flag-evaluation-api).
- Use our WebSocket interface to get real-time feature flags update and evaluation result of a feature flag. Please join our [Slack channel](https://join.slack.com/t/featbit/shared_invite/zt-1ew5e2vbb-x6Apan1xZOaYMnFzqZkGNQ) to get more information about this feature.

## Contribution

We actively encourage and welcome contributions from developers who can help us bridge the gap by creating missing SDKs. If you successfully develop an SDK that aligns with our standards and are interested in collaborating, we would be thrilled to include your work as one of our community SDKs.
