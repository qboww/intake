# Iteration 10 - DevOps & Portfolio Readiness (Vercel Deployment)

## Objective
Deploy the application to Vercel for production use and portfolio showcase.

## Deployment Checklist

### Prerequisites
- [ ] GitHub repository created and code pushed
- [ ] Vercel account created (free tier available at https://vercel.com)
- [ ] MongoDB Atlas cluster configured
- [ ] Google OAuth credentials obtained
- [ ] All environment variables documented

### Step 1: Prepare for Deployment
- [ ] Verify build passes: `npm run build`
- [ ] Check `.env.local` has all required variables
- [ ] Review `vercel.json` configuration (already set up ✅)
- [ ] Ensure all commits are pushed to GitHub

### Step 2: Deploy to Vercel
- [ ] Connect GitHub repository to Vercel
- [ ] Configure environment variables in Vercel dashboard
- [ ] Trigger initial deployment
- [ ] Monitor build logs for errors

### Step 3: Configure Production Environment Variables
Required environment variables in Vercel dashboard:

```
MONGODB_URI=<your_mongodb_connection_string>
GOOGLE_ID=<your_google_oauth_client_id>
GOOGLE_SECRET=<your_google_oauth_client_secret>
NEXTAUTH_SECRET=<generated_random_secret>
NEXTAUTH_URL=https://your-deployment.vercel.app
NODE_ENV=production
```

**Important**: Generate a new `NEXTAUTH_SECRET` for production:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Test Production Deployment
- [ ] Access the deployed URL in browser
- [ ] Test authentication flow with Google OAuth
- [ ] Verify MongoDB connections work
- [ ] Test all CRUD operations (add entries, weight, etc.)
- [ ] Check dark mode works
- [ ] Verify responsive design on mobile

### Step 5: Custom Domain (Optional)
- [ ] Purchase domain (Namecheap, GoDaddy, etc.)
- [ ] Add domain in Vercel dashboard
- [ ] Configure DNS records
- [ ] Update `NEXTAUTH_URL` with custom domain

## Deployment Steps (Detailed)

### 1. Generate NEXTAUTH_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output - you'll need this for Vercel
```

### 2. Push Code to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment - Iteration 10"
git push origin main
```

### 3. Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 4. Set Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:
1. Add each variable from `.env.example`
2. Set scope to "Production"
3. Click "Save"

### 5. Deploy
1. Click "Deploy"
2. Monitor build progress in Logs tab
3. Wait for deployment to complete
4. Click "Visit" to access deployed app

## Environment Variables Reference

| Variable | Source | Notes |
|----------|--------|-------|
| `MONGODB_URI` | MongoDB Atlas | Connection string with credentials |
| `GOOGLE_ID` | Google Cloud Console | OAuth2 Client ID |
| `GOOGLE_SECRET` | Google Cloud Console | OAuth2 Client Secret |
| `NEXTAUTH_SECRET` | Generated | Use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXTAUTH_URL` | Vercel | Set to your Vercel deployment URL or custom domain |
| `NODE_ENV` | Manual | Set to `production` |

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Run `npm run build` locally to reproduce
- Verify all dependencies are in `package.json`

### "Unauthorized" Error
- Verify `NEXTAUTH_SECRET` is set in Vercel
- Check `NEXTAUTH_URL` matches deployment URL
- Clear browser cookies and try again

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas (add `0.0.0.0/0` for Vercel)
- Ensure cluster is active and credentials are valid

### Google OAuth Not Working
- Verify redirect URIs in Google Cloud Console
- Add your Vercel URL to authorized redirect URIs:
  - `https://your-deployment.vercel.app/api/auth/callback/google`
- Check `GOOGLE_ID` and `GOOGLE_SECRET` are correct

## Post-Deployment

### 1. Update Email Whitelist
Edit `lib/whitelist.ts` to include yourself:
```typescript
const ALLOWED_EMAILS = [
  'your-email@example.com',
  'friend-email@example.com',
];
```

### 2. Monitor Deployment
- Set up Vercel email alerts for deployment failures
- Monitor MongoDB Atlas connection stats
- Check application logs

### 3. Update Project Links
- Update GitHub README with deployment URL
- Add to portfolio website
- Share with team/stakeholders

## Portfolio Features

✅ Next.js 16 with TypeScript
✅ MongoDB with Mongoose schemas
✅ Google OAuth authentication
✅ Full CRUD API with route handlers
✅ Dark mode support
✅ Recharts data visualization
✅ Responsive mobile-first design
✅ Multi-user support
✅ Production-ready code
✅ Deployed on Vercel

## Deployment Commands Reference

```bash
# Local build test
npm run build

# Start production server locally
npm run start

# Generate auth secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check build size
du -sh .next/
```

## Success Criteria
- ✅ App deployed and accessible via HTTPS
- ✅ Authentication works with Google OAuth
- ✅ Can add/view/delete entries
- ✅ Weight tracking functional
- ✅ Charts display correctly
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Dark mode works

## Next Steps
After deployment:
1. Test all features in production
2. Gather feedback from users
3. Plan future iterations
4. Add monitoring/analytics if needed
