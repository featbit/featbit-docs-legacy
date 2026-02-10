# Track Insights API

## Overview

The Track API allows you to send user insights data including feature flag variation results and custom metrics to FeatBit for analytics and experimentation purposes.

## API Endpoint

```
POST {evaluation-server-url}/api/public/insight/track
```

## Authentication

This API requires authentication using your **environment secret key**. Include the secret key in the `Authorization` header of your request.

> **Note:** To get the environment secret key, refer to [FAQ](../sdk/faq.mdx#how-to-get-the-environment-secret) documentation.

**Example:**
```
Authorization: your-environment-secret-key
```

## Request

### Schema

The request body should be a JSON array of `Insight` objects. Each insight object contains user information, feature flag variations user received, and custom metrics.

**Insight**

| Field        | Type                      | Required | Description                                    |
| ------------ | ------------------------- | -------- | ---------------------------------------------- |
| `user`       | `EndUser`                 | Yes      | The end user who triggered the insight         |
| `variations` | `Array<VariationInsight>` | No       | Array of feature flag variations user received |
| `metrics`    | `Array<MetricInsight>`    | No       | Array of custom metrics tracked for the user   |

**EndUser**

| Field                  | Type                    | Required | Description                             |
| ---------------------- | ----------------------- | -------- | --------------------------------------- |
| `keyId`                | `string`                | Yes      | Unique identifier for the user          |
| `name`                 | `string`                | No       | Display name of the user                |
| `customizedProperties` | `Array<CustomProperty>` | No       | Array of custom properties for the user |

**CustomProperty**

| Field   | Type     | Required | Description    |
| ------- | -------- | -------- | -------------- |
| `name`  | `string` | Yes      | Property name  |
| `value` | `string` | Yes      | Property value |

**VariationInsight**

| Field              | Type        | Required | Description                                                       |
| ------------------ | ----------- | -------- | ----------------------------------------------------------------- |
| `featureFlagKey`   | `string`    | Yes      | The key of the feature flag                                       |
| `variation`        | `Variation` | Yes      | The variation that was served                                     |
| `sendToExperiment` | `boolean`   | Yes      | Whether this variation should be included in experiment analysis  |
| `timestamp`        | `long`      | Yes      | Unix timestamp in **milliseconds** when this variation was served |

**Variation**

| Field   | Type     | Required | Description                        |
| ------- | -------- | -------- | ---------------------------------- |
| `id`    | `string` | Yes      | Unique identifier of the variation |
| `value` | `string` | Yes      | The value of the variation         |

**MetricInsight**

| Field          | Type     | Required | Description                                                     |
| -------------- | -------- | -------- | --------------------------------------------------------------- |
| `route`        | `string` | Yes      | The route or endpoint where the metric was tracked              |
| `type`         | `string` | Yes      | The type of metric (e.g., "CustomEvent")                        |
| `eventName`    | `string` | Yes      | The name of the custom event                                    |
| `numericValue` | `float`  | Yes      | Numeric value associated with the metric                        |
| `appType`      | `string` | Yes      | The type of application (e.g., "Web", "Mobile")                 |
| `timestamp`    | `long`   | Yes      | Unix timestamp in **milliseconds** when this metric was tracked |

### Examples

#### Simple Example (Only Variations)

```json
[
  {
    "user": {
      "keyId": "user-123",
      "name": "John Doe",
      "customizedProperties": [
        {
          "name": "email",
          "value": "john.doe@example.com"
        },
        {
          "name": "role",
          "value": "premium"
        }
      ]
    },
    "variations": [
      {
        "featureFlagKey": "new-checkout-flow",
        "variation": {
          "id": "3c9f8e2a-5b1d-4f7c-a3e6-8d4b2c1a9f5e",
          "value": "true"
        },
        "sendToExperiment": true,
        "timestamp": 1704067200000
      }
    ],
    "metrics": []
  }
]
```

#### Complete Example (Variations and Metrics)

```json
[
  {
    "user": {
      "keyId": "user-456",
      "name": "Jane Smith",
      "customizedProperties": [
        {
          "name": "country",
          "value": "USA"
        },
        {
          "name": "plan",
          "value": "enterprise"
        }
      ]
    },
    "variations": [
      {
        "featureFlagKey": "recommendation-algorithm",
        "variation": {
          "id": "7d2e4f3b-8c6a-4d9e-b2f7-1a5c3e8b6d4f",
          "value": "algorithm-v2"
        },
        "sendToExperiment": true,
        "timestamp": 1704067300000
      }
    ],
    "metrics": [
      {
        "route": "/api/checkout/complete",
        "type": "CustomEvent",
        "eventName": "purchase-completed",
        "numericValue": 299.99,
        "appType": "Web",
        "timestamp": 1704067350000
      },
      {
        "route": "/api/items/add-to-cart",
        "type": "CustomEvent",
        "eventName": "item-added",
        "numericValue": 1.0,
        "appType": "Web",
        "timestamp": 1704067250000
      }
    ]
  }
]
```

#### Batch Example (Multiple Users)

```json
[
  {
    "user": {
      "keyId": "user-001",
      "name": "Alice"
    },
    "variations": [
      {
        "featureFlagKey": "feature-x",
        "variation": {
          "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
          "value": "control"
        },
        "sendToExperiment": true,
        "timestamp": 1704067200000
      }
    ],
    "metrics": []
  },
  {
    "user": {
      "keyId": "user-002",
      "name": "Bob"
    },
    "variations": [
      {
        "featureFlagKey": "feature-x",
        "variation": {
          "id": "f9e8d7c6-b5a4-4938-8271-6a5b4c3d2e1f",
          "value": "treatment"
        },
        "sendToExperiment": true,
        "timestamp": 1704067300000
      }
    ],
    "metrics": []
  }
]
```

## Response

### 200 OK

The API returns a `200 OK` status with no response body when insights are successfully received and queued for processing.

### 401 Unauthorized

This error occurs when:

- The `Authorization` header is missing
- The environment secret key is invalid

### 400 Bad Request

This may occur when:
- The request body is not valid JSON
- Required fields are missing
- Data types don't match the expected schema

## Common Use Cases

### 1. Track Feature Flag Evaluation

When your application evaluates a feature flag and serves a variation to a user, send the variation insight:

```json
[
  {
    "user": {
      "keyId": "user-123",
      "name": "User Name"
    },
    "variations": [
      {
        "featureFlagKey": "your-flag-key",
        "variation": {
          "id": "variation-id",
          "value": "variation-value"
        },
        "sendToExperiment": true,
        "timestamp": 1704067200000
      }
    ],
    "metrics": []
  }
]
```

### 2. Track Custom Events with Metrics

When a user completes an important action (conversion, purchase, etc.), send metric insights:

```json
[
  {
    "user": {
      "keyId": "user-123",
      "name": "User Name"
    },
    "variations": [],
    "metrics": [
      {
        "route": "/api/your-route",
        "type": "CustomEvent",
        "eventName": "conversion",
        "numericValue": 149.99,
        "appType": "Web",
        "timestamp": 1704067200000
      }
    ]
  }
]
```

### 3. Combined Tracking

Track both variation views and metrics in the same request:

```json
[
  {
    "user": {
      "keyId": "user-123",
      "name": "User Name"
    },
    "variations": [
      {
        "featureFlagKey": "checkout-flow",
        "variation": {
          "id": "b8c7d6e5-f4a3-4b92-8c1d-7e6f5a4b3c2d",
          "value": "new-flow"
        },
        "sendToExperiment": true,
        "timestamp": 1704067100000
      }
    ],
    "metrics": [
      {
        "route": "/checkout/complete",
        "type": "CustomEvent",
        "eventName": "purchase",
        "numericValue": 99.99,
        "appType": "Web",
        "timestamp": 1704067200000
      }
    ]
  }
]
```

## Best Practices

1. **Use Batching**: Send multiple insights in a single request when possible to reduce network overhead
2. **Handle Errors Gracefully**: Don't fail application operations if insight tracking fails
3. **Async Tracking**: Track insights asynchronously to avoid blocking your main application flow
4. **Accurate Timestamps**: Always use the actual time when the event occurred, not when you send the request
5. **Secure Your Secret Key**: Never expose your environment secret key in client-side code
6. **Consistent User Identification**: Use consistent keyId values for the same user across sessions
7. **Rich User Properties**: Include relevant custom properties to enable better segmentation and analysis
