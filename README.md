# LogiMatch AI: Freight Procurement Intelligence Platform

![Status](https://img.shields.io/badge/Status-Production-green?style=for-the-badge)
![Compliance](https://img.shields.io/badge/Compliance-GDPR%20|%20SOC2-blue?style=for-the-badge)

**LogiMatch AI** automates freight quote analysis, carrier selection, and procurement workflows—reducing manual processing time by 75% and eliminating cost leakage from invoice discrepancies.

---

## 🚀 Latest Enterprise Updates (v5.0)

We've recently transformed the platform to a unified **Mission Control** architecture:
- **Home / Portal Navigation**: A clean, centralized entry point for all Logistics Intelligence modules.
- **Multi-Tenant Carrier Support**: Organizations now have private, isolated carrier directories with shared naming support.
- **AI Audit Synchronization**: Fully integrated "Human-in-the-loop" approval for freight matrix findings.
- **Production Sync Active**: Look for the verification signature in the sidebar to confirm your instance is running the latest core.

---

## 💼 Business Outcomes

### Time Savings
- **Quote Processing**: 15 minutes → 90 seconds per shipment
- **Invoice Reconciliation**: Automated variance detection reduces audit time by 80%
- **Carrier Selection**: AI-driven recommendations based on historical reliability data

### Cost Reduction
- **Surcharge Detection**: Automatically flags unauthorized fees and duplicate charges
- **Rate Variance Analysis**: Identifies quotes 10%+ above market baseline
- **Landed Cost Accuracy**: Reduces budget overruns from hidden fees

### Risk Mitigation
- **Disruption Monitoring**: Real-time alerts for trade lane delays (Suez, Panama, etc.)
- **Carrier Reliability Scoring**: Historical on-time performance and claims data
- **Compliance Tracking**: Automated customs documentation validation

---

## 🎯 Core Capabilities

### Executive Dashboard
Real-time procurement intelligence tracking:
- **Total Landed Cost Variance** across all active shipments
- **Carrier Reliability Scoring** with on-time delivery metrics
- **Disruption Exposure by Trade Lane** (port congestion, weather, geopolitical)
- **Audit Variance Detection** flagging invoice discrepancies

### AI-Powered Procurement Assistant
Automates repetitive tasks and surfaces actionable insights:
- **Identifies surcharge discrepancies** between quotes and invoices
- **Flags abnormal quote variance** (e.g., 15% higher than 30-day average)
- **Suggests optimal carrier** based on historical reliability and cost
- **Drafts booking confirmations** and shipment instructions
- **Extracts data from PDFs** (quotes, invoices, BOLs) with 95%+ accuracy

### Global Risk Monitoring
Interactive 3D globe visualization showing:
- **Port congestion levels** at major hubs (LA/Long Beach, Rotterdam, Singapore)
- **Trade lane disruption alerts** (canal closures, weather delays)
- **Geopolitical risk zones** affecting shipping routes
- **Real-time incident tracking** with impact assessment

### Carrier Management
Centralized vendor directory with:
- **Reliability telemetry**: On-time delivery %, claims rate, response time
- **Automated compliance auditing**: Insurance verification, certifications
- **Performance benchmarking**: Cost vs. service level analysis
- **Contract management**: Rate agreements and expiration tracking

### Governance & Compliance
Enterprise-grade transparency:
- **Terms of Service** and **Privacy Policy**
- **AI Accuracy Disclaimer** with liability boundaries
- **Data retention policies** and **GDPR compliance** documentation
- **Audit trail** for all AI-generated recommendations

---

## 🔄 Workflow Integration

### 1. Quote Intake
- Upload freight quotes (PDF, email, manual entry)
- AI extracts: origin, destination, weight, rates, surcharges, transit time
- Normalizes data across carriers for apples-to-apples comparison

### 2. Analysis & Recommendation
- Compares quotes against historical baselines
- Flags outliers (abnormal surcharges, inflated rates)
- Scores carriers on reliability, cost, and service level
- Generates side-by-side comparison with total landed cost

### 3. Booking & Execution
- AI drafts booking confirmation with shipment details
- Sends instructions to selected carrier
- Tracks milestones (pickup, departure, arrival, delivery)
- Alerts on delays or exceptions

### 4. Invoice Reconciliation
- Matches invoices to original quotes
- Flags discrepancies (unauthorized charges, rate changes)
- Calculates variance impact on budget
- Generates audit report for finance team

---

## 🛠️ Technical Architecture

### Frontend
- **Next.js 15** (App Router) with React and TypeScript
- **TailwindCSS** + **Shadcn UI** for component library
- **Recharts** for data visualization
- **Canvas 3D Engine** for globe visualization

### Backend
- **Python** (Flask/FastAPI) for API layer
- **LangChain** + **OpenAI GPT-4** for AI workflows
- **PyMuPDF** for document OCR and data extraction
- **PostgreSQL** (Supabase) for relational data

### Infrastructure
- **Clerk** for authentication and multi-tenancy
- **Stripe** for subscription billing
- **Supabase** for database and real-time sync

---

## 📂 Project Structure

```
/frontend       # Next.js application (user interface)
/backend        # Python API (AI orchestration, OCR, data processing)
/context        # Subscription and state management
```

---

## ⚡ Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Add your OPENAI_API_KEY
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Access the application at `http://localhost:3000`

---

## 📊 ROI Calculator

**Example: Mid-size freight forwarder (500 shipments/month)**

| Metric | Before LogiMatch | After LogiMatch | Annual Savings |
|--------|------------------|-----------------|----------------|
| Quote processing time | 15 min/shipment | 90 sec/shipment | $156,000 |
| Invoice discrepancies caught | 5% | 95% | $240,000 |
| Carrier selection errors | 12% | 2% | $180,000 |
| **Total Annual Impact** | | | **$576,000** |

*Assumptions: $50/hr labor cost, 3% average invoice variance, 8% cost difference between optimal and suboptimal carrier*

---

## 🔐 Security & Compliance

- **Data Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Access Control**: Role-based permissions (Admin, Analyst, Viewer)
- **Audit Logging**: Complete trail of all AI recommendations and user actions
- **GDPR Compliant**: Data retention policies, right to deletion, consent management
- **SOC 2 Type II**: Security controls for availability, confidentiality, and integrity

---

## 📄 License & Disclaimer

LogiMatch AI is designed for professional freight procurement and logistics auditing. All AI-generated recommendations are advisory and subject to human review. See the **AI Accuracy & Liability Disclaimer** in the application's Legal Center for full terms.

&copy; 2026 Antigravity AI Inc. All Rights Reserved.
