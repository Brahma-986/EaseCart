# 🚀 Vercel Deployment Guide for EaseCart

This guide will help you deploy your EaseCart application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket Account**: Your code should be in a Git repository
3. **Backend Deployment**: Your backend should be deployed separately (see Backend Deployment section)

---

## 🎯 Deployment Options

### Option 1: Deploy Frontend Only (Recommended)

Since your backend uses Socket.io and requires persistent connections, deploy:
- **Frontend**: Vercel (this guide)
- **Backend**: Render, Railway, Fly.io, or similar platform

### Option 2: Full Stack on Vercel

Convert backend to Vercel Serverless Functions (more complex, requires refactoring)

---

## 📦 Step 1: Prepare Your Repository

1. **Ensure your code is committed and pushed to Git**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify your project structure**:
   ```
   FSD/
   ├── client/          # Frontend (React + Vite)
   │   ├── src/
   │   ├── package.json
   │   ├── vercel.json
   │   └── vite.config.js
   ├── server/          # Backend (Express)
   └── vercel.json      # Root config
   ```

---

## 🌐 Step 2: Deploy Backend First

**Important**: Deploy your backend before deploying the frontend so you have the API URL.

### Option A: Deploy to Render (Recommended)

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your repository
4. Configure:
   - **Name**: `easecart-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=production
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
6. Click **"Create Web Service"**
7. Copy your backend URL (e.g., `https://easecart-backend.onrender.com`)

### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add service → Select `server` directory
5. Add environment variables (same as Render)
6. Deploy and copy your backend URL

### Option C: Deploy to Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. In `server` directory: `fly launch`
3. Add environment variables
4. Deploy: `fly deploy`

---

## 🎨 Step 3: Deploy Frontend to Vercel

### Method 1: Using Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. Click **"Add New..."** → **"Project"**
3. **Import your Git repository**:
   - Connect GitHub/GitLab/Bitbucket if not already connected
   - Select your repository
   - Click **"Import"**

4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (IMPORTANT!)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

5. **Add Environment Variables**:
   Click **"Environment Variables"** and add:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   Replace `your-backend-url.onrender.com` with your actual backend URL.

6. **Deploy**:
   - Click **"Deploy"**
   - Wait for build to complete (2-5 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Method 2: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to client directory**:
   ```bash
   cd client
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No** (first time)
   - Project name? **easecart-frontend** (or your choice)
   - Directory? **./** (current directory)
   - Override settings? **No**

5. **Add Environment Variables**:
   ```bash
   vercel env add VITE_API_URL
   ```
   Enter: `https://your-backend-url.onrender.com/api`

6. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

---

## ⚙️ Step 4: Update Backend CORS Settings

After deploying frontend, update your backend's `CLIENT_URL` environment variable:

1. Go to your backend hosting platform (Render/Railway/etc.)
2. Update `CLIENT_URL` environment variable:
   ```
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
3. Restart your backend service

---

## 🔧 Step 5: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## 📝 Environment Variables Summary

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Backend (Render/Railway/etc.)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/easecart
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-vercel-app.vercel.app
```

---

## 🐛 Troubleshooting

### Build Fails

1. **Check build logs** in Vercel dashboard
2. **Verify Node version**: Add `.nvmrc` file in `client` directory:
   ```
   18.17.0
   ```
3. **Check for missing dependencies**: Ensure all packages are in `package.json`

### API Calls Fail (CORS Errors)

1. **Verify backend CORS settings** allow your Vercel domain
2. **Check `CLIENT_URL`** in backend environment variables
3. **Verify `VITE_API_URL`** in Vercel environment variables

### Environment Variables Not Working

1. **Redeploy after adding variables**: Environment variables require a new deployment
2. **Check variable names**: Must start with `VITE_` for Vite to expose them
3. **Verify in build logs**: Check if variables are being used

### 404 Errors on Routes

1. **Verify `vercel.json` rewrites**: Should redirect all routes to `index.html`
2. **Check React Router**: Ensure using `BrowserRouter` (not `HashRouter`)

---

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to your main branch:
- **Production**: Deploys from `main` branch
- **Preview**: Creates preview deployments for pull requests

---

## 📊 Monitoring

1. **Analytics**: Enable in Vercel dashboard → Settings → Analytics
2. **Logs**: View real-time logs in Vercel dashboard
3. **Performance**: Check Web Vitals in Analytics tab

---

## 🎉 Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Can access frontend URL
- [ ] Can login/register
- [ ] API calls working
- [ ] All routes accessible

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel build logs
2. Check backend logs
3. Verify environment variables
4. Test API endpoints directly
5. Check browser console for errors

---

**Your app should now be live on Vercel! 🚀**


