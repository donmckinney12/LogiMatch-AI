# Frontend Deployment Instructions

## Deploying to Vercel

### Prerequisites
- Backend deployed to Render: ✅ https://logimatch-ai-1.onrender.com
- Clerk account with API keys
- Stripe account with API keys (if using payments)

### Step 1: Prepare Environment Variables

You'll need these environment variables for Vercel:

```
NEXT_PUBLIC_API_URL=https://logimatch-ai-1.onrender.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI** (Recommended)

```bash
cd frontend
vercel --prod
```

Follow the prompts and add environment variables when asked.

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository: `donmckinney12/LogiMatch-AI`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
5. Add environment variables (see Step 1)
6. Click "Deploy"

### Step 3: Update Clerk Settings

After deployment, update your Clerk dashboard:

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to "Domains" → Add your Vercel domain
4. Update redirect URLs to include your production domain

### Step 4: Test the Deployment

Once deployed, test:
- ✅ Authentication (Clerk login)
- ✅ API connectivity (upload a quote)
- ✅ Backend communication

## Troubleshooting

### CORS Errors
If you see CORS errors, update the backend's CORS configuration to allow your Vercel domain.

### API Not Found
Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel environment variables.

### Build Failures
Check the Vercel build logs for specific errors.
