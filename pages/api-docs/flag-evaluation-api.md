# Feature Flag Evaluation API

This API allows you to evaluate feature flag variations for a user against one or more feature flags in your environment.

## API Route

```
POST /api/public/FeatureFlag/evaluate
```

## Authentication

This API requires authentication using your **client-side environment secret key**. Include the secret key in the `Authorization` header of your request.

**Example:**
```
Authorization: your-client-side-env-secret-key
```

> **Note:** You can find your environment secret key in the FeatBit dashboard under your environment settings.

## Request Parameters

The request body should be a JSON object with the following structure:

### Request Body Schema

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user` | `EndUser` | Yes | The end user for whom to evaluate feature flags |
| `filter` | `FeatureFlagFilter` | No | Optional filter to limit which feature flags to evaluate |

### EndUser Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `keyId` | `string` | Yes | Unique identifier for the user in your environment |
| `name` | `string` | No | Display name for the user |
| `customizedProperties` | `array` | No | Array of custom properties for user targeting |

#### CustomizedProperty Object

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Name of the custom property |
| `value` | `string` | Value of the custom property |

### FeatureFlagFilter Object

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tagFilterMode` | `string` | `"and"` | How to combine tag filters. Valid values: `"and"` or `"or"` |
| `tags` | `string[]` | `[]` | Array of tags to filter feature flags |
| `keys` | `string[]` | `[]` | Array of specific feature flag keys to evaluate |

## Request Example

```json
{
  "user": {
    "keyId": "user-123",
    "name": "John Doe",
    "customizedProperties": [
      {
        "name": "country",
        "value": "US"
      },
      {
        "name": "plan",
        "value": "premium"
      }
    ]
  },
  "filter": {
    "tagFilterMode": "and",
    "tags": ["frontend", "mobile"],
    "keys": []
  }
}
```

## Response

The API returns an array of evaluation results, one for each matching feature flag.

### Response Schema

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | The feature flag key |
| `variation` | `EvalResultVariation` | The evaluated variation for the user |

#### EvalResultVariation Object

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The variation ID |
| `type` | `string` | The variation type (e.g., "string", "boolean", "number", "json") |
| `value` | `string` | The variation value |
| `matchReason` | `string` | Explanation of why this variation was selected |

### Response Example

```json
[
  {
    "key": "new-dashboard-design",
    "variation": {
      "id": "var-001",
      "type": "boolean",
      "value": "true",
      "matchReason": "Targeted by rule 'Premium users'"
    }
  },
  {
    "key": "theme-color",
    "variation": {
      "id": "var-002",
      "type": "string",
      "value": "dark",
      "matchReason": "Matched by default rule"
    }
  },
  {
    "key": "max-file-upload-size",
    "variation": {
      "id": "var-003",
      "type": "number",
      "value": "104857600",
      "matchReason": "Targeted by rule 'Premium users'"
    }
  }
]
```

## Error Responses

### 401 Unauthorized

Returned when the authentication secret key is invalid or missing.

```json
{
  "status": 401,
  "title": "Unauthorized"
}
```

### 400 Bad Request

Returned when the request validation fails.

**Missing or invalid user:**
```json
{
  "message": "A valid user is required."
}
```

**Invalid tag filter mode:**
```json
{
  "message": "Invalid tag filter mode: invalid. Valid values are 'and' or 'or'."
}
```

## Evaluating a Single Feature Flag

To evaluate against a single feature flag, use the `filter.keys` parameter with an array containing just one feature flag key.

### Single Flag Request Example

```json
{
  "user": {
    "keyId": "user-123",
    "name": "John Doe",
    "customizedProperties": [
      {
        "name": "country",
        "value": "US"
      }
    ]
  },
  "filter": {
    "keys": ["new-dashboard-design"]
  }
}
```

### Single Flag Response Example

```json
[
  {
    "key": "new-dashboard-design",
    "variation": {
      "id": "var-001",
      "type": "boolean",
      "value": "true",
      "matchReason": "Targeted by rule 'Premium users'"
    }
  }
]
```

> **Tip:** When evaluating a single feature flag, the response will still be an array, but it will contain only one element.

## Code Examples

### cURL

```bash
curl -X POST https://your-featbit-server.com/api/public/FeatureFlag/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: your-client-side-env-secret-key" \
  -d '{
    "user": {
      "keyId": "user-123",
      "name": "John Doe"
    },
    "filter": {
      "keys": ["new-dashboard-design"]
    }
  }'
```

### JavaScript (Fetch API)

```javascript
const response = await fetch('https://your-featbit-server.com/api/public/FeatureFlag/evaluate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'your-client-side-env-secret-key'
  },
  body: JSON.stringify({
    user: {
      keyId: 'user-123',
      name: 'John Doe',
      customizedProperties: [
        { name: 'country', value: 'US' },
        { name: 'plan', value: 'premium' }
      ]
    },
    filter: {
      keys: ['new-dashboard-design']
    }
  })
});

const results = await response.json();
console.log(results);
```

### Python

```python
import requests
import json

url = 'https://your-featbit-server.com/api/public/FeatureFlag/evaluate'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'your-client-side-env-secret-key'
}
data = {
    'user': {
        'keyId': 'user-123',
        'name': 'John Doe',
        'customizedProperties': [
            {'name': 'country', 'value': 'US'},
            {'name': 'plan', 'value': 'premium'}
        ]
    },
    'filter': {
        'keys': ['new-dashboard-design']
    }
}

response = requests.post(url, headers=headers, data=json.dumps(data))
results = response.json()
print(results)
```

### C#

```csharp
using System.Net.Http;
using System.Text;
using System.Text.Json;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "your-client-side-env-secret-key");

var request = new
{
    user = new
    {
        keyId = "user-123",
        name = "John Doe",
        customizedProperties = new[]
        {
            new { name = "country", value = "US" },
            new { name = "plan", value = "premium" }
        }
    },
    filter = new
    {
        keys = new[] { "new-dashboard-design" }
    }
};

var json = JsonSerializer.Serialize(request);
var content = new StringContent(json, Encoding.UTF8, "application/json");

var response = await client.PostAsync(
    "https://your-featbit-server.com/api/public/FeatureFlag/evaluate",
    content
);

var results = await response.Content.ReadAsStringAsync();
Console.WriteLine(results);
```

## Best Practices

1. **Always include user context**: Provide as much user information as possible (including customized properties) to ensure accurate targeting and evaluation.

2. **Use specific keys when possible**: If you only need to evaluate a few specific flags, use the `filter.keys` parameter to reduce response size and improve performance.

3. **Cache appropriately**: Feature flag evaluations can be cached on the client side, but be mindful of cache expiration to ensure users get up-to-date flag values.

4. **Handle errors gracefully**: Always implement proper error handling for network failures or invalid responses.

5. **Keep secret keys secure**: Never expose your environment secret key in client-side code or public repositories. Use environment variables or secure configuration management.

## Notes

- The `matchReason` field in the response provides transparency about why a particular variation was selected, which can be helpful for debugging targeting rules.
- If no filter is provided, all feature flags in the environment will be evaluated.
- The API respects all targeting rules, percentage rollouts, and user segments configured for each feature flag.
