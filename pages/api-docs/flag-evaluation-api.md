# Feature Flag Evaluation API

This API allows you to evaluate feature flag variations for a user against one or more feature flags in your environment.

## API Endpoint

```
POST {evaluation-server-url}/api/public/featureflag/evaluate
```

## Authentication

This API requires authentication using your **environment secret key**. Include the secret key in the `Authorization` header of your request.

> **Note:** To get the environment secret key, refer to [FAQ](../sdk/faq.mdx#how-to-get-the-environment-secret) documentation.

**Example:**
```
Authorization: your-environment-secret-key
```

## Request

The request body should be a JSON object with the following structure:

### Schema

**Request Body**

| Parameter | Type                | Required | Description                                              |
| --------- | ------------------- | -------- | -------------------------------------------------------- |
| `user`    | `EndUser`           | Yes      | The end user for whom to evaluate feature flags          |
| `filter`  | `FeatureFlagFilter` | No       | Optional filter to limit which feature flags to evaluate |

**EndUser**

| Property               | Type     | Required | Description                                        |
| ---------------------- | -------- | -------- | -------------------------------------------------- |
| `keyId`                | `string` | Yes      | Unique identifier for the user in your environment |
| `name`                 | `string` | No       | Display name for the user                          |
| `customizedProperties` | `array`  | No       | Array of custom properties for user targeting      |

**CustomizedProperty**

| Property | Type     | Description                  |
| -------- | -------- | ---------------------------- |
| `name`   | `string` | Name of the custom property  |
| `value`  | `string` | Value of the custom property |

**FeatureFlagFilter**

| Property        | Type       | Default | Description                                                 |
| --------------- | ---------- | ------- | ----------------------------------------------------------- |
| `tagFilterMode` | `string`   | `"and"` | How to combine tag filters. Valid values: `"and"` or `"or"` |
| `tags`          | `string[]` | `[]`    | Array of tags to filter feature flags                       |
| `keys`          | `string[]` | `[]`    | Array of specific feature flag keys to evaluate             |


### Example

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

### Schema

**Response Body**

| Property    | Type                  | Description                          |
| ----------- | --------------------- | ------------------------------------ |
| `key`       | `string`              | The feature flag key                 |
| `variation` | `EvalResultVariation` | The evaluated variation for the user |

**EvalResultVariation**

| Property | Type     | Description                                                      |
| -------- | -------- | ---------------------------------------------------------------- |
| `id`     | `string` | The variation ID                                                 |
| `type`   | `string` | The variation type (e.g., "string", "boolean", "number", "json") |
| `value`  | `string` | The variation value                                              |
| `matchReason` | `string` | Explanation of why this variation was selected. Possible values: <br/>• `"flag disabled"` - The flag is disabled<br/>• `"targeted"` - The user is targeted individually<br/>• `"{rule name}"` - The user matched a specific rule (returns the rule name)<br/>• `"default"` - The user matched the default rule |

### Example

```json
[
  {
    "key": "new-dashboard-design",
    "variation": {
      "id": "08aceef3-5513-4b38-80ad-4b27bebe8871",
      "type": "boolean",
      "value": "true",
      "matchReason": "premium user rule"
    }
  },
  {
    "key": "theme-color",
    "variation": {
      "id": "c5364cfd-292a-4e06-8e8e-b0ae7387f791",
      "type": "string",
      "value": "dark",
      "matchReason": "default"
    }
  },
  {
    "key": "max-file-upload-size",
    "variation": {
      "id": "34683e86-b436-4694-b335-29628c0896e3",
      "type": "number",
      "value": "104857600",
      "matchReason": "premium user rule"
    }
  }
]
```

## Error Responses

### 401 Unauthorized

Returned when the authentication secret key is invalid or missing.

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

### Request

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

### Response

> **Note:** When evaluating a single feature flag, the response will still be an array, but it will contain only one element.

```json
[
  {
    "key": "new-dashboard-design",
    "variation": {
      "id": "ac727073-8cc5-4ec5-9405-59737ea737bb",
      "type": "boolean",
      "value": "false",
      "matchReason": "flag disabled"
    }
  }
]
```

## Notes

- The `matchReason` field in the response provides transparency about why a particular variation was selected, which can be helpful for debugging targeting rules.
- If no filter is provided, **all feature flags** in the environment will be evaluated.
- If filter criteria result in no matching feature flags, the response will be an empty array `[]`.
