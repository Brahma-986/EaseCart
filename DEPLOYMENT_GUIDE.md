# Deployment Guide for EaseCart

This guide provides detailed, step-by-step instructions to deploy the EaseCart application using GitHub Actions, Render, and Vercel.

## Prerequisites

1. **GitHub Repository**: A GitHub repository with your EaseCart code
2. **Render Account**: Free account at [render.com](https://render.com)
3. **Vercel Account**: Free account at [vercel.com](https://vercel.com)
4. **MongoDB Database**: MongoDB Atlas account (free tier available)
5. **Git**: Installed locally for pushing code

## Step 1: Prepare Your Codebase

### 1.1 Push Code to GitHub

1. **Create a new repository** on GitHub (or use existing one)
2. **Clone locally** (if not already):
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

3. **Copy your EaseCart project** into the repository folder

4. **Add deployment files** (already created):
   - `.github/workflows/deploy.yml`
   - `server/render.yaml`
   - `client/vercel.json`
   - `DEPLOYMENT_GUIDE.md`

5. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

### 1.2 Verify Project Structure

Ensure your repository has this structure:
```
your-repo/
├── .github/workflows/deploy.yml
├── server/
│   ├── render.yaml
│   ├── package.json
│   └── ... (other server files)
├── client/
│   ├── vercel.json
│   ├── package.json
│   └── ... (other client files)
└── DEPLOYMENT_GUIDE.md
```

## Step 2: Set Up MongoDB Atlas Database

### 2.1 Create MongoDB Atlas Account

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose the free tier (M0) cluster

### 2.2 Configure Database

1. **Create Cluster**:
   - Choose "AWS" as provider
   - Select a region close to your users
   - Click "Create Cluster" (takes 5-10 minutes)

2. **Set up Database User**:
   - Go to "Database Access" → "Add New Database User"
   - Authentication Method: Password
   - Username: `easecartuser`
   - Password: Choose a strong password
   - Built-in Role: `Read and write any database`
   - Click "Add User"

3. **Configure Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, restrict to specific IPs

4. **Get Connection String**:
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string, it looks like:
     ```
     mongodb+srv://easecartuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Replace `test` at the end with `easeCart` (database name)

## Step 3: Set Up Render (Backend Deployment)

### 3.1 Create Render Account and Connect GitHub

1. Go to [render.com](https://render.com) and sign up/login
2. Click your profile → "Account Settings" → "Connected Accounts"
3. Connect your GitHub account and authorize Render

### 3.2 Create Web Service

1. Click "New +" → "Web Service"
2. Choose "Connect GitHub" and select your repository
3. **Service Configuration**:
   - **Name**: `easecart-server` (or your preferred name)
   - **Environment**: `Node`
   - **Root Directory**: `server` (important!)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3.3 Configure Environment Variables

In your Render service dashboard, go to "Environment" and add:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Port for the app |
| `MONGO_URI` | `mongodb+srv://easecartuser:yourpassword@cluster0.xxxxx.mongodb.net/easeCart?retryWrites=true&w=majority` | Your MongoDB connection string |
| `JWT_SECRET` | Generate a secure random string (32+ characters) | Secret for JWT tokens |
| `JWT_EXPIRE` | `7d` | Token expiration time |
| `CLIENT_URL` | `https://your-vercel-app.vercel.app` | Your Vercel frontend URL (update after Vercel deployment) |

### 3.4 Deploy Backend

1. Click "Create Web Service"
2. Wait for initial deployment (5-10 minutes)
3. Once deployed, copy the service URL (e.g., `https://easecart-server.onrender.com`)

### 3.5 Get Deploy Hook URL

1. In your Render service, go to "Settings" tab
2. Scroll down to "Deploy Hook"
3. Copy the URL (starts with `https://api.render.com/deploy/srv-...`)

## Step 4: Set Up Vercel (Frontend Deployment)

### 4.1 Create Vercel Account and Connect GitHub

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel should auto-detect it's a Vite project

### 4.2 Configure Project Settings

1. **Project Name**: `easecart-client` (or your preferred name)
2. **Root Directory**: `client` (important!)
3. **Build Settings**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4.3 Set Environment Variables

In the Vercel project settings, go to "Environment Variables" and add:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://your-render-service.onrender.com/api` | Production |

### 4.4 Deploy Frontend

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Once deployed, copy the domain URL (e.g., `https://easecart-client.vercel.app`)

### 4.5 Get Vercel Token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name: `EaseCart Deployment`
4. Copy the token (keep it safe!)

## Step 5: Configure GitHub Actions Secrets

### 5.1 Add Repository Secrets

1. Go to your GitHub repository
2. Click "Settings" tab
3. Go to "Secrets and variables" → "Actions"
4. Click "New repository secret"

Add these secrets:

| Name | Value |
|------|-------|
| `RENDER_DEPLOY_HOOK_URL` | `https://api.render.com/deploy/srv-xxx...` (from Render) |
| `VERCEL_TOKEN` | `vercel_xxx...` (from Vercel tokens) |

## Step 6: Update Configuration Files

### 6.1 Update Vercel Configuration

Edit `client/vercel.json` and replace the placeholder URLs:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-render-service.onrender.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://your-render-service.onrender.com/api"
  }
}
```

### 6.2 Update Render Environment Variables

In Render dashboard, update the `CLIENT_URL` environment variable to your Vercel URL:
```
CLIENT_URL=https://your-vercel-app.vercel.app
```

## Step 7: Trigger Deployment

### 7.1 Push Configuration Changes

```bash
git add .
git commit -m "Update deployment URLs and configuration"
git push origin main
```

### 7.2 Monitor GitHub Actions

1. Go to your GitHub repository → "Actions" tab
2. You should see a workflow running
3. Wait for all jobs to complete:
   - **test**: Runs tests
   - **deploy-backend**: Deploys to Render
   - **deploy-frontend**: Deploys to Vercel

## Step 8: Test Your Deployment

### 8.1 Test Backend API

Visit: `https://your-render-service.onrender.com/api/health`

You should see a JSON response like:
```json
{
  "success": true,
  "message": "EaseCart API is running",
  "timestamp": "..."
}
```

### 8.2 Test Frontend

Visit your Vercel URL and try:
1. Registering a new user
2. Logging in
3. Browsing products
4. Adding items to cart

### 8.3 Test Full Integration

1. Register/login on frontend
2. Create an order
3. Check if data persists in MongoDB

## Step 9: Seed Database (Optional)

After deployment, seed with sample data:

1. **Locally** (with production DB):
   ```bash
   cd server
   npm install
   MONGO_URI="your_production_mongo_uri" node utils/seed.js
   ```

2. **Or via API** (if you have admin endpoints):
   - Use Postman to call seed endpoints

## Troubleshooting Guide

### Issue: GitHub Actions Build Fails

**Symptoms**: Red X on Actions tab

**Solutions**:
1. Check the build logs in Actions → Workflow → Build job
2. Common issues:
   - Missing dependencies in package.json
   - Node.js version mismatch (should be 18)
   - Environment variables not set correctly

### Issue: Render Deployment Fails

**Symptoms**: Service shows "Build Failed"

**Solutions**:
1. Check Render logs: Service → Logs tab
2. Common issues:
   - Wrong root directory (should be `server`)
   - Missing environment variables
   - Database connection issues

### Issue: Vercel Deployment Fails

**Symptoms**: Deployment shows error

**Solutions**:
1. Check Vercel deployment logs
2. Common issues:
   - Wrong root directory (should be `client`)
   - Missing environment variables
   - Build command issues

### Issue: CORS Errors

**Symptoms**: Frontend can't communicate with backend

**Solutions**:
1. Check `CLIENT_URL` in Render matches Vercel domain exactly
2. Ensure `VITE_API_URL` in Vercel matches Render domain
3. Check CORS headers in server code

### Issue: Database Connection Errors

**Symptoms**: App crashes or can't save data

**Solutions**:
1. Verify MongoDB connection string
2. Ensure IP whitelist allows Render (0.0.0.0/0)
3. Check database user credentials
4. Verify database name in connection string

### Issue: Authentication Not Working

**Symptoms**: Can't login/register

**Solutions**:
1. Check JWT_SECRET is set and matches between deployments
2. Verify CLIENT_URL for CORS
3. Check if database is accessible

## Security Checklist

- [ ] Never commit secrets to GitHub
- [ ] Use strong, unique passwords for database
- [ ] Enable 2FA on all accounts (GitHub, Render, Vercel, MongoDB)
- [ ] Restrict MongoDB IP access in production
- [ ] Use HTTPS (automatically enabled)
- [ ] Regularly rotate JWT secrets
- [ ] Monitor for security vulnerabilities

## Cost Optimization

- **Free Tiers**:
  - Render: 750 hours/month free
  - Vercel: 100GB bandwidth/month free
  - MongoDB Atlas: 512MB storage free
  - GitHub Actions: 2000 minutes/month free

- **Upgrade Considerations**:
  - Monitor usage in dashboards
  - Scale up only when needed
  - Use CDN for static assets

## Next Steps

1. **Custom Domain**: Add custom domains to Vercel and Render
2. **SSL Certificates**: Automatically handled by both services
3. **Monitoring**: Set up uptime monitoring (e.g., UptimeRobot)
4. **Backups**: Configure MongoDB Atlas backups
5. **Analytics**: Add Google Analytics to frontend

## Support Resources

- **Render Support**: [docs.render.com](https://docs.render.com/)
- **Vercel Support**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Actions**: [docs.github.com/actions](https://docs.github.com/actions)
- **MongoDB Atlas**: [docs.mongodb.com/atlas](https://docs.mongodb.com/atlas)

---

**Congratulations!** Your EaseCart application is now deployed and ready for users. 🎉
