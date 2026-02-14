# LogiMatch AI - Integration Guide

## Overview

This guide covers integrating LogiMatch AI with common enterprise systems including ERP platforms, Transportation Management Systems (TMS), and email workflows.

---

## Table of Contents

1. [Email Integration (Auto Quote Intake)](#email-integration)
2. [TMS Integration](#tms-integration)
3. [ERP Integration (SAP, Oracle)](#erp-integration)
4. [Custom Webhooks](#custom-webhooks)
5. [Data Export & Reporting](#data-export)

---

## Email Integration

### Auto Quote Intake from Email

LogiMatch AI can automatically process freight quotes sent to a dedicated email address.

#### Setup

1. **Create Forwarding Address**
   - LogiMatch provides: `quotes-{your-company}@intake.logimatch.ai`
   - Forward carrier quote emails to this address

2. **Configure Email Rules** (Optional)
   - Set up filters to auto-forward emails from known carriers
   - Example Gmail filter:
     ```
     From: (*@maersk.com OR *@msc.com OR *@cma-cgm.com)
     Subject: (quote OR quotation OR rate)
     Forward to: quotes-yourcompany@intake.logimatch.ai
     ```

3. **AI Processing**
   - LogiMatch extracts PDF attachments
   - Parses quote data (origin, destination, rates, surcharges)
   - Creates quote record in dashboard
   - Sends notification when analysis complete

#### Email Template for Carriers

Send this to your carriers to standardize quote submissions:

```
Subject: Freight Quote Request - [Your PO Number]

Please send quotes to: quotes-yourcompany@intake.logimatch.ai

Required Information:
- Origin and destination
- Cargo details (weight, dimensions, commodity)
- Rate breakdown (base rate, fuel surcharge, fees)
- Transit time
- Validity period

Attach quote as PDF for fastest processing.
```

---

## TMS Integration

### Supported TMS Platforms

- Oracle Transportation Management (OTM)
- SAP Transportation Management (SAP TM)
- Blue Yonder (JDA)
- MercuryGate
- Descartes
- Custom TMS via API

### Integration Architecture

```
TMS → LogiMatch AI → TMS
  ↓         ↓           ↑
Quote    Analysis   Booking
Request            Confirmation
```

### Oracle TM Integration

#### 1. Configure API Connection

In Oracle TM, set up REST API endpoint:

```xml
<endpoint>
  <name>LogiMatch AI</name>
  <url>https://api.logimatch.ai/v1</url>
  <auth_type>OAuth2</auth_type>
  <client_id>your_client_id</client_id>
  <client_secret>your_client_secret</client_secret>
</endpoint>
```

#### 2. Create Quote Request Workflow

```sql
-- Oracle TM workflow to send quote to LogiMatch
CREATE OR REPLACE PROCEDURE send_quote_to_logimatch(
  p_shipment_id IN VARCHAR2
) AS
  l_quote_data CLOB;
  l_response CLOB;
BEGIN
  -- Extract shipment data
  SELECT JSON_OBJECT(
    'origin' VALUE origin_location,
    'destination' VALUE dest_location,
    'weight' VALUE total_weight,
    'commodity' VALUE commodity_code
  ) INTO l_quote_data
  FROM shipments
  WHERE shipment_id = p_shipment_id;
  
  -- Send to LogiMatch API
  l_response := apex_web_service.make_rest_request(
    p_url => 'https://api.logimatch.ai/v1/quotes',
    p_http_method => 'POST',
    p_body => l_quote_data
  );
  
  -- Store quote_id for later retrieval
  UPDATE shipments
  SET logimatch_quote_id = JSON_VALUE(l_response, '$.quote_id')
  WHERE shipment_id = p_shipment_id;
END;
```

#### 3. Retrieve Analysis Results

```sql
-- Retrieve LogiMatch analysis
CREATE OR REPLACE PROCEDURE get_quote_analysis(
  p_shipment_id IN VARCHAR2
) AS
  l_quote_id VARCHAR2(100);
  l_analysis CLOB;
BEGIN
  -- Get stored quote_id
  SELECT logimatch_quote_id INTO l_quote_id
  FROM shipments
  WHERE shipment_id = p_shipment_id;
  
  -- Fetch analysis from LogiMatch
  l_analysis := apex_web_service.make_rest_request(
    p_url => 'https://api.logimatch.ai/v1/quotes/' || l_quote_id,
    p_http_method => 'GET'
  );
  
  -- Update shipment with recommendation
  UPDATE shipments
  SET 
    ai_recommendation = JSON_VALUE(l_analysis, '$.ai_analysis.recommendation'),
    carrier_score = JSON_VALUE(l_analysis, '$.ai_analysis.carrier_reliability_score')
  WHERE shipment_id = p_shipment_id;
END;
```

### SAP TM Integration

#### 1. Create RFC Destination

Transaction: `SM59`

```
RFC Destination: ZLOGIMATCH_API
Connection Type: G (HTTP Connection to External Server)
Target Host: api.logimatch.ai
Path Prefix: /v1
```

#### 2. ABAP Code for Quote Submission

```abap
DATA: lv_quote_id TYPE string,
      lt_quote_data TYPE TABLE OF string,
      lv_response TYPE string.

" Build JSON payload
APPEND '{"origin": "Shanghai, China",' TO lt_quote_data.
APPEND '"destination": "Los Angeles, USA",' TO lt_quote_data.
APPEND '"weight": 15000}' TO lt_quote_data.

" Call LogiMatch API
CALL FUNCTION 'HTTP_POST'
  EXPORTING
    destination = 'ZLOGIMATCH_API'
    uri = '/quotes'
  TABLES
    request_body = lt_quote_data
  IMPORTING
    response = lv_response
  EXCEPTIONS
    OTHERS = 1.

" Parse response
DATA(lo_json) = /ui2/cl_json=>generate( json = lv_response ).
lv_quote_id = lo_json->get( 'quote_id' ).
```

---

## ERP Integration

### SAP ERP Integration

#### Invoice Reconciliation Workflow

```abap
" ABAP program to send invoices to LogiMatch for reconciliation
REPORT z_logimatch_invoice_recon.

DATA: lv_invoice_id TYPE string,
      lv_po_number TYPE ebeln,
      lt_invoice_data TYPE TABLE OF string.

" Get invoice from SAP
SELECT SINGLE * FROM rbkp
  INTO @DATA(ls_invoice)
  WHERE belnr = @p_invoice_no.

" Build JSON payload
APPEND |{ "invoice_number": "{ ls_invoice-belnr }",| TO lt_invoice_data.
APPEND |"po_number": "{ ls_invoice-ebeln }",| TO lt_invoice_data.
APPEND |"total_amount": { ls_invoice-rmwwr } }| TO lt_invoice_data.

" Send to LogiMatch
CALL FUNCTION 'HTTP_POST'
  EXPORTING
    destination = 'ZLOGIMATCH_API'
    uri = '/invoices'
  TABLES
    request_body = lt_invoice_data
  IMPORTING
    response = DATA(lv_response).

" Check for discrepancies
DATA(lv_variance) = /ui2/cl_json=>generate( json = lv_response )->get( 'reconciliation-variance_amount' ).

IF lv_variance > 100.
  " Flag for review
  PERFORM flag_invoice_for_review USING ls_invoice-belnr lv_variance.
ENDIF.
```

### Oracle ERP Cloud Integration

#### REST API Call from Oracle

```sql
-- PL/SQL procedure to send invoice to LogiMatch
CREATE OR REPLACE PROCEDURE reconcile_invoice(
  p_invoice_id IN NUMBER
) AS
  l_request CLOB;
  l_response CLOB;
  l_variance NUMBER;
BEGIN
  -- Build JSON request
  SELECT JSON_OBJECT(
    'invoice_number' VALUE invoice_num,
    'total_amount' VALUE invoice_amount,
    'related_quote_id' VALUE quote_reference
  ) INTO l_request
  FROM ap_invoices_all
  WHERE invoice_id = p_invoice_id;
  
  -- Call LogiMatch API
  l_response := apex_web_service.make_rest_request(
    p_url => 'https://api.logimatch.ai/v1/invoices',
    p_http_method => 'POST',
    p_body => l_request
  );
  
  -- Extract variance
  l_variance := JSON_VALUE(l_response, '$.reconciliation.variance_amount');
  
  -- Update invoice with variance flag
  IF l_variance > 100 THEN
    UPDATE ap_invoices_all
    SET attribute1 = 'VARIANCE_DETECTED',
        attribute2 = TO_CHAR(l_variance)
    WHERE invoice_id = p_invoice_id;
  END IF;
END;
```

---

## Custom Webhooks

### Real-Time Event Notifications

Configure webhooks to receive instant notifications when events occur.

#### Setup Webhook Endpoint

```javascript
// Node.js Express webhook receiver
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

app.post('/webhooks/logimatch', (req, res) => {
  // Verify webhook signature
  const signature = req.headers['x-logimatch-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.WEBHOOK_SECRET;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process event
  const { event, data } = req.body;
  
  switch(event) {
    case 'invoice.discrepancy_detected':
      handleInvoiceDiscrepancy(data);
      break;
    case 'risk.disruption_detected':
      handleDisruption(data);
      break;
  }
  
  res.status(200).send('OK');
});

function handleInvoiceDiscrepancy(data) {
  console.log(`Invoice ${data.invoice_id} has variance: $${data.variance_amount}`);
  // Send alert to finance team
  sendSlackAlert(`⚠️ Invoice discrepancy detected: $${data.variance_amount}`);
}

app.listen(3000);
```

---

## Data Export & Reporting

### Scheduled Data Export

Export LogiMatch data to your data warehouse for custom reporting.

#### Daily Export via API

```python
import requests
import pandas as pd
from datetime import datetime, timedelta

API_BASE = "https://api.logimatch.ai/v1"
API_KEY = "your_api_key"

headers = {"Authorization": f"Bearer {API_KEY}"}

# Get yesterday's quotes
yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
response = requests.get(
    f"{API_BASE}/quotes?created_after={yesterday}",
    headers=headers
)

quotes = response.json()['data']

# Convert to DataFrame
df = pd.DataFrame(quotes)

# Export to data warehouse
df.to_sql('logimatch_quotes', con=warehouse_connection, if_exists='append')
```

#### Power BI Integration

```powerquery
// Power BI M query to fetch LogiMatch data
let
    Source = Web.Contents(
        "https://api.logimatch.ai/v1/quotes",
        [
            Headers=[
                #"Authorization"="Bearer YOUR_API_KEY",
                #"Content-Type"="application/json"
            ]
        ]
    ),
    JsonData = Json.Document(Source),
    QuotesTable = Table.FromList(JsonData[data], Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    ExpandedColumns = Table.ExpandRecordColumn(QuotesTable, "Column1", 
        {"quote_id", "total_cost", "carrier_name", "reliability_score"})
in
    ExpandedColumns
```

---

## Support

For integration assistance:
- **Email:** integrations@logimatch.ai
- **Documentation:** https://docs.logimatch.ai
- **Slack:** #integrations channel

---

**© 2026 Antigravity AI Inc. All Rights Reserved.**
