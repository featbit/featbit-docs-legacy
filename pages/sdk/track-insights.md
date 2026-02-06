# Track API Documentation

## Overview

The Track API allows you to send user insights data including feature flag variation views and custom metrics to FeatBit for analytics and experimentation purposes.

## API Endpoint

```
POST /api/public/insight/track
```

## Authentication

This API requires authentication using your environment's secret key. Include the secret key in the `Authorization` header of your request.

### Header

```
Authorization: <your-environment-secret-key>
```

**Important:** Each environment in FeatBit has its own unique secret key. Make sure you use the correct secret key for the environment you want to track insights for.

## Request Parameters

The request body should be a JSON array of `Insight` objects. Each insight object contains user information, feature flag variations viewed by the user, and custom metrics.

### Insight Object Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user` | `EndUser` | Yes | The end user who triggered the insight |
| `variations` | `Array<VariationInsight>` | No | Array of feature flag variations viewed by the user |
| `metrics` | `Array<MetricInsight>` | No | Array of custom metrics tracked for the user |

### EndUser Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `keyId` | `string` | Yes | Unique identifier for the user |
| `name` | `string` | No | Display name of the user |
| `customizedProperties` | `Array<CustomProperty>` | No | Array of custom properties for the user |

### CustomProperty Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Property name |
| `value` | `string` | Yes | Property value |

### VariationInsight Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `featureFlagKey` | `string` | Yes | The key of the feature flag |
| `variation` | `Variation` | Yes | The variation that was served |
| `sendToExperiment` | `boolean` | Yes | Whether this variation should be included in experiment analysis |
| `timestamp` | `long` | Yes | Unix timestamp in milliseconds when this variation was served |

### Variation Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier of the variation |
| `value` | `string` | Yes | The value of the variation |

### MetricInsight Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `route` | `string` | Yes | The route or endpoint where the metric was tracked |
| `type` | `string` | Yes | The type of metric (e.g., "CustomEvent") |
| `eventName` | `string` | Yes | The name of the custom event |
| `numericValue` | `float` | Yes | Numeric value associated with the metric |
| `appType` | `string` | Yes | The type of application (e.g., "Web", "Mobile") |
| `timestamp` | `long` | Yes | Unix timestamp in milliseconds when this metric was tracked |

## Request Example

### Simple Example (Only Variations)

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
          "id": "variation-abc-123",
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

### Complete Example (Variations and Metrics)

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
          "id": "var-v2-789",
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

### Batch Example (Multiple Users)

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
          "id": "var-a",
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
          "id": "var-b",
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

### Success Response

**Status Code:** `200 OK`

**Response Body:** Empty

The API returns a `200 OK` status with no response body when insights are successfully received and queued for processing.

### Error Responses

#### Unauthorized

**Status Code:** `401 Unauthorized`

**Response Body:** Empty

This error occurs when:
- The `Authorization` header is missing
- The environment secret key is invalid
- The secret key doesn't match any existing environment

#### Bad Request

**Status Code:** `400 Bad Request`

This may occur when:
- The request body is not valid JSON
- Required fields are missing
- Data types don't match the expected schema

## Implementation Notes

1. **Validation**: The API validates each insight before processing. Invalid insights (e.g., missing user or invalid user.keyId) are silently ignored, and the API still returns `200 OK` for valid insights in the batch.

2. **Deduplication**: User data is deduplicated using a 3-minute cache. If the same user (identified by `envId:keyId`) is sent multiple times within 3 minutes, only the first occurrence will create an end user message.

3. **Asynchronous Processing**: Insights are published to message queues for asynchronous processing, so the API responds quickly even when sending large batches.

4. **Timestamp Format**: All timestamps must be in Unix milliseconds (not seconds). For example, January 1, 2024, 00:00:00 UTC = `1704067200000`.

5. **Batching**: You can send up to multiple insights in a single request. This is more efficient than making individual requests for each insight.

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
          "id": "var-new",
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

## Code Examples

### cURL

```bash
curl -X POST https://your-featbit-server.com/api/public/insight/track \
  -H "Content-Type: application/json" \
  -H "Authorization: your-environment-secret-key" \
  -d '[
    {
      "user": {
        "keyId": "user-123",
        "name": "John Doe"
      },
      "variations": [
        {
          "featureFlagKey": "new-feature",
          "variation": {
            "id": "var-123",
            "value": "true"
          },
          "sendToExperiment": true,
          "timestamp": 1704067200000
        }
      ],
      "metrics": []
    }
  ]'
```

### JavaScript (Fetch API)

```javascript
const insights = [
  {
    user: {
      keyId: "user-123",
      name: "John Doe",
      customizedProperties: [
        { name: "email", value: "john@example.com" }
      ]
    },
    variations: [
      {
        featureFlagKey: "new-feature",
        variation: {
          id: "var-123",
          value: "true"
        },
        sendToExperiment: true,
        timestamp: Date.now()
      }
    ],
    metrics: []
  }
];

fetch('https://your-featbit-server.com/api/public/insight/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'your-environment-secret-key'
  },
  body: JSON.stringify(insights)
})
  .then(response => {
    if (response.ok) {
      console.log('Insights tracked successfully');
    } else if (response.status === 401) {
      console.error('Unauthorized: Check your environment secret key');
    }
  })
  .catch(error => console.error('Error:', error));
```

### Python

```python
import requests
import time

url = "https://your-featbit-server.com/api/public/insight/track"
headers = {
    "Content-Type": "application/json",
    "Authorization": "your-environment-secret-key"
}

insights = [
    {
        "user": {
            "keyId": "user-123",
            "name": "John Doe",
            "customizedProperties": [
                {"name": "email", "value": "john@example.com"}
            ]
        },
        "variations": [
            {
                "featureFlagKey": "new-feature",
                "variation": {
                    "id": "var-123",
                    "value": "true"
                },
                "sendToExperiment": True,
                "timestamp": int(time.time() * 1000)
            }
        ],
        "metrics": []
    }
]

response = requests.post(url, json=insights, headers=headers)

if response.status_code == 200:
    print("Insights tracked successfully")
elif response.status_code == 401:
    print("Unauthorized: Check your environment secret key")
else:
    print(f"Error: {response.status_code}")
```

### C# (.NET)

```csharp
using System.Net.Http;
using System.Text;
using System.Text.Json;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "your-environment-secret-key");

var insights = new[]
{
    new
    {
        user = new
        {
            keyId = "user-123",
            name = "John Doe",
            customizedProperties = new[]
            {
                new { name = "email", value = "john@example.com" }
            }
        },
        variations = new[]
        {
            new
            {
                featureFlagKey = "new-feature",
                variation = new
                {
                    id = "var-123",
                    value = "true"
                },
                sendToExperiment = true,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            }
        },
        metrics = Array.Empty<object>()
    }
};

var json = JsonSerializer.Serialize(insights);
var content = new StringContent(json, Encoding.UTF8, "application/json");

var response = await client.PostAsync(
    "https://your-featbit-server.com/api/public/insight/track",
    content
);

if (response.IsSuccessStatusCode)
{
    Console.WriteLine("Insights tracked successfully");
}
else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
{
    Console.WriteLine("Unauthorized: Check your environment secret key");
}
```

## Troubleshooting

### 401 Unauthorized Error

- Verify that you're using the correct environment secret key
- Check that the secret key is included in the `Authorization` header
- Ensure the environment exists and is active

### No Data Appearing in Analytics

- Verify that timestamps are in milliseconds (not seconds)
- Check that user.keyId is not empty
- Ensure insights are valid (use the validation logic: user must exist and user.keyId must not be empty)
- Check the feature flag key matches exactly with your configured flags

### Performance Issues

- Consider batching multiple insights into a single request
- Avoid sending duplicate insights within the 3-minute deduplication window
- Send insights asynchronously from your main application flow

## Best Practices

1. **Use Batching**: Send multiple insights in a single request when possible to reduce network overhead
2. **Handle Errors Gracefully**: Don't fail application operations if insight tracking fails
3. **Async Tracking**: Track insights asynchronously to avoid blocking your main application flow
4. **Accurate Timestamps**: Always use the actual time when the event occurred, not when you send the request
5. **Secure Your Secret Key**: Never expose your environment secret key in client-side code
6. **Consistent User Identification**: Use consistent keyId values for the same user across sessions
7. **Rich User Properties**: Include relevant custom properties to enable better segmentation and analysis
