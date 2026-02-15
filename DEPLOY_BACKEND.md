# Backend Deployment Instructions

## Deploying to Render

1. **Sign up for Render** (if you haven't already):
   - Go to https://render.com
   - Sign up with your GitHub account

2. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `donmckinney12/LogiMatch-AI`
   - Render will automatically detect the `render.yaml` configuration

3. **Set Environment Variables**:
   In the Render dashboard, add these environment variables:
   
   ```
   OPENAI_API_KEY=<your-openai-api-key>
   CLERK_SECRET_KEY=<your-clerk-secret-key>
   DATABASE_URL=sqlite:///logimatch_v4.db
   FLASK_ENV=production
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend
   - You'll get a URL like: `https://logimatch-api.onrender.com`

5. **Test the API**:
   ```
   curl https://logimatch-api.onrender.com/health
   ```

## Important Notes

- **Free Tier**: The free tier spins down after 15 minutes of inactivity
- **First request**: May take 30-60 seconds to wake up
- **Database**: Currently using SQLite (file-based). For production, consider PostgreSQL
- **Uploads folder**: Will be ephemeral on free tier. Consider using cloud storage (S3, Cloudinary)

## Next Steps

After backend is deployed:
1. Copy the production API URL
2. Update frontend environment variables with this URL
3. Deploy frontend to Vercel
