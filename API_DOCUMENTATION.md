# LogiMatch AI - API Documentation

## Overview

The LogiMatch AI API provides programmatic access to freight quote analysis, carrier scoring, invoice reconciliation, and risk monitoring capabilities. This RESTful API uses JSON for request/response payloads and supports OAuth 2.0 authentication.

**Base URL:** `https://api.logimatch.ai/v1`

**Authentication:** Bearer token (OAuth 2.0)

---

## Quick Start

### 1. Get API Credentials

Contact your account manager or visit the [Developer Portal](https://developers.logimatch.ai) to generate API keys.

### 2. Authenticate

```bash
curl -X POST https://api.logimatch.ai/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "grant_type": "client_credentials"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### 3. Make Your First Request

```bash
curl -X GET https://api.logimatch.ai/v1/quotes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Core Endpoints

### Quotes

#### Upload Quote for Analysis

```http
POST /v1/quotes
```

**Request Body:**
```json
{
  "quote_source": "pdf",
  "file_url": "https://yourstorage.com/quote.pdf",
  "metadata": {
    "carrier_name": "Global Shipping Co",
    "origin": "Shanghai, China",
    "destination": "Los Angeles, USA",
    "shipment_type": "FCL",
    "container_size": "40HC"
  }
}
```

**Response:**
```json
{
  "quote_id": "qt_1a2b3c4d5e6f",
  "status": "processing",
  "extracted_data": {
    "origin": "Shanghai, China",
    "destination": "Los Angeles, USA",
    "base_rate": 2450.00,
    "fuel_surcharge": 340.00,
    "security_fee": 75.00,
    "documentation_fee": 50.00,
    "total_cost": 2915.00,
    "transit_time_days": 18,
    "currency": "USD"
  },
  "ai_analysis": {
    "variance_from_baseline": -2.3,
    "variance_status": "normal",
    "carrier_reliability_score": 94.2,
    "recommendation": "approved",
    "flags": []
  },
  "created_at": "2026-02-14T07:23:45Z"
}
```

#### Get Quote Analysis

```http
GET /v1/quotes/{quote_id}
```

**Response:**
```json
{
  "quote_id": "qt_1a2b3c4d5e6f",
  "status": "analyzed",
  "extracted_data": { ... },
  "ai_analysis": {
    "variance_from_baseline": 15.7,
    "variance_status": "high",
    "carrier_reliability_score": 87.5,
    "recommendation": "review_required",
    "flags": [
      {
        "type": "abnormal_surcharge",
        "severity": "medium",
        "message": "Fuel surcharge 38% above 30-day average",
        "affected_line_item": "fuel_surcharge"
      }
    ]
  }
}
```

#### Compare Multiple Quotes

```http
POST /v1/quotes/compare
```

**Request Body:**
```json
{
  "quote_ids": ["qt_1a2b3c4d", "qt_2b3c4d5e", "qt_3c4d5e6f"],
  "comparison_criteria": ["total_cost", "reliability", "transit_time"]
}
```

**Response:**
```json
{
  "comparison_id": "cmp_9x8y7z6w",
  "quotes": [
    {
      "quote_id": "qt_1a2b3c4d",
      "rank": 1,
      "total_cost": 2915.00,
      "reliability_score": 94.2,
      "transit_time_days": 18,
      "recommendation_reason": "Best balance of cost and reliability"
    },
    { ... }
  ],
  "recommended_quote_id": "qt_1a2b3c4d"
}
```

---

### Carriers

#### Get Carrier Reliability Score

```http
GET /v1/carriers/{carrier_id}/reliability
```

**Response:**
```json
{
  "carrier_id": "car_abc123",
  "carrier_name": "Global Shipping Co",
  "reliability_score": 94.2,
  "metrics": {
    "on_time_delivery_pct": 96.3,
    "claims_rate_pct": 0.8,
    "avg_response_time_hours": 2.4,
    "cost_competitiveness_score": 8.7
  },
  "recent_performance": [
    {
      "month": "2026-01",
      "on_time_pct": 97.1,
      "shipments_count": 42
    },
    { ... }
  ],
  "compliance_status": {
    "insurance_valid": true,
    "certifications_current": true,
    "contract_active": true
  }
}
```

#### List All Carriers

```http
GET /v1/carriers?trade_lane=asia_to_na&min_reliability=90
```

---

### Invoices

#### Upload Invoice for Reconciliation

```http
POST /v1/invoices
```

**Request Body:**
```json
{
  "invoice_source": "pdf",
  "file_url": "https://yourstorage.com/invoice.pdf",
  "related_quote_id": "qt_1a2b3c4d5e6f",
  "metadata": {
    "invoice_number": "INV-2026-001234",
    "invoice_date": "2026-02-10"
  }
}
```

**Response:**
```json
{
  "invoice_id": "inv_7g8h9i0j",
  "status": "processed",
  "extracted_data": {
    "invoice_number": "INV-2026-001234",
    "total_amount": 3230.00,
    "line_items": [ ... ]
  },
  "reconciliation": {
    "quote_id": "qt_1a2b3c4d5e6f",
    "variance_amount": 315.00,
    "variance_pct": 10.8,
    "discrepancies": [
      {
        "type": "rate_increase",
        "line_item": "fuel_surcharge",
        "quoted_amount": 340.00,
        "invoiced_amount": 620.00,
        "variance": 280.00,
        "severity": "high"
      },
      {
        "type": "unauthorized_charge",
        "line_item": "handling_fee",
        "quoted_amount": 0.00,
        "invoiced_amount": 95.00,
        "variance": 95.00,
        "severity": "high"
      }
    ],
    "recommendation": "dispute_recommended"
  }
}
```

---

### Risk Monitoring

#### Get Global Disruptions

```http
GET /v1/risk/disruptions?severity=medium,high
```

**Response:**
```json
{
  "disruptions": [
    {
      "disruption_id": "dis_xyz789",
      "location": "Suez Canal",
      "type": "delay",
      "severity": "high",
      "impact": "47 shipments affected, avg delay 3-5 days",
      "affected_trade_lanes": ["asia_to_europe", "asia_to_east_coast_na"],
      "start_date": "2026-02-12",
      "estimated_resolution": "2026-02-18"
    },
    { ... }
  ]
}
```

#### Get Shipment Risk Assessment

```http
GET /v1/risk/shipments/{shipment_id}
```

**Response:**
```json
{
  "shipment_id": "shp_abc123",
  "risk_score": 6.8,
  "risk_level": "medium",
  "risk_factors": [
    {
      "factor": "port_congestion",
      "location": "LA/Long Beach",
      "impact": "2-4 day delay expected",
      "probability": 0.75
    },
    {
      "factor": "weather",
      "location": "Pacific Ocean",
      "impact": "minor routing adjustment",
      "probability": 0.30
    }
  ],
  "mitigation_suggestions": [
    "Consider alternative port (Oakland) for next shipment",
    "Alert customer of potential delay"
  ]
}
```

---

## Webhooks

Subscribe to real-time events for proactive monitoring.

### Available Events

- `quote.analyzed` - Quote analysis completed
- `invoice.discrepancy_detected` - Invoice variance found
- `carrier.reliability_changed` - Carrier score updated
- `risk.disruption_detected` - New disruption identified
- `shipment.delayed` - Shipment delay detected

### Setup Webhook

```http
POST /v1/webhooks
```

**Request Body:**
```json
{
  "url": "https://yourapp.com/webhooks/logimatch",
  "events": ["invoice.discrepancy_detected", "risk.disruption_detected"],
  "secret": "your_webhook_secret"
}
```

### Webhook Payload Example

```json
{
  "event": "invoice.discrepancy_detected",
  "timestamp": "2026-02-14T08:15:30Z",
  "data": {
    "invoice_id": "inv_7g8h9i0j",
    "variance_amount": 315.00,
    "severity": "high",
    "discrepancies_count": 2
  }
}
```

---

## Integration Examples

### Python

```python
import requests

API_BASE = "https://api.logimatch.ai/v1"
API_KEY = "your_access_token"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Upload quote for analysis
response = requests.post(
    f"{API_BASE}/quotes",
    headers=headers,
    json={
        "quote_source": "pdf",
        "file_url": "https://storage.example.com/quote.pdf",
        "metadata": {
            "carrier_name": "Global Shipping Co",
            "origin": "Shanghai, China",
            "destination": "Los Angeles, USA"
        }
    }
)

quote_data = response.json()
print(f"Quote ID: {quote_data['quote_id']}")
print(f"Recommendation: {quote_data['ai_analysis']['recommendation']}")
```

### Node.js

```javascript
const axios = require('axios');

const API_BASE = 'https://api.logimatch.ai/v1';
const API_KEY = 'your_access_token';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

// Get carrier reliability
async function getCarrierReliability(carrierId) {
  const response = await axios.get(
    `${API_BASE}/carriers/${carrierId}/reliability`,
    { headers }
  );
  
  return response.data;
}

getCarrierReliability('car_abc123').then(data => {
  console.log(`Reliability Score: ${data.reliability_score}`);
  console.log(`On-Time Delivery: ${data.metrics.on_time_delivery_pct}%`);
});
```

---

## Rate Limits

| Tier | Requests/Minute | Requests/Day |
|------|-----------------|--------------|
| Starter | 60 | 10,000 |
| Professional | 300 | 100,000 |
| Enterprise | Custom | Custom |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 287
X-RateLimit-Reset: 1644835200
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "invalid_quote_format",
    "message": "Unable to extract data from PDF. Please ensure file is a valid freight quote.",
    "details": {
      "file_url": "https://storage.example.com/quote.pdf",
      "reason": "No recognizable rate table found"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `unauthorized` | 401 | Invalid or expired API key |
| `rate_limit_exceeded` | 429 | Too many requests |
| `invalid_quote_format` | 400 | PDF extraction failed |
| `quote_not_found` | 404 | Quote ID doesn't exist |
| `carrier_not_found` | 404 | Carrier ID doesn't exist |
| `internal_error` | 500 | Server error, retry recommended |

---

## Support

- **API Status:** https://status.logimatch.ai
- **Developer Portal:** https://developers.logimatch.ai
- **Support Email:** api-support@logimatch.ai
- **Slack Community:** https://logimatch.slack.com

---

**© 2026 Antigravity AI Inc. All Rights Reserved.**
