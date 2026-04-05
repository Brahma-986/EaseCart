# 🎨 Frontend-Only Vercel Deployment Guide

This guide shows you how to deploy **only the frontend** to Vercel.

---

## ✅ What's Already Configured

- ✅ `client/vercel.json` - Configured for React Router
- ✅ `client/package.json` - Build script ready
- ✅ `client/.nvmrc` - Node version specified
- ✅ Build tested and working

---

## 🚀 Quick Deployment Steps

### Step 1: Push to GitHub (if not already)

```bash
git add .
git commit -m "Configure frontend for Vercel"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. **Import your Git repository**
4. **Configure Project Settings**:
   - **Framework Preset**: `Vite` (auto-detected)
   - **Root Directory**: `client` ⚠️ **IMPORTANT!**
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. **Add Environment Variable**:
   - Click **"Environment Variables"**
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://your-backend-url.onrender.com/api
     ```
   - Replace `your-backend-url.onrender.com` with your actual backend URL
   - Select **Production**, **Preview**, and **Development** environments

6. Click **"Deploy"**

**Option B: Via Vercel CLI**

```bash
cd client
npm install -g vercel
vercel login
vercel
```

When prompted:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No** (first time)
- Project name? **easecart-frontend** (or your choice)
- Directory? **./** (current directory)
- Override settings? **No**

Add environment variable:
```bash
vercel env add VITE_API_URL
```
Enter your backend API URL: `https://your-backend-url.onrender.com/api`

Deploy to production:
```bash
vercel --prod
```

---

## 📝 Required Environment Variable

**Variable Name**: `VITE_API_URL`

**Variable Value**: Your backend API URL + `/api`

**Examples**:
- Render: `https://easecart-server.onrender.com/api`
- Railway: `https://easecart-production.up.railway.app/api`
- Custom: `https://api.yourdomain.com/api`

---

## ⚙️ Vercel Project Settings

After deployment, verify these settings in **Settings → General**:

- ✅ **Root Directory**: `client`
- ✅ **Framework Preset**: `Vite`
- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `dist`
- ✅ **Install Command**: `npm install`

---

## 🔍 Verify Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Check browser console (F12) for any errors
3. Test login/register functionality
4. Verify API calls are working

---

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify `Root Directory` is set to `client`
- Ensure all dependencies are in `package.json`

### API Calls Fail (CORS/404)
- Verify `VITE_API_URL` environment variable is set correctly
- Check backend CORS settings allow your Vercel domain
- Ensure backend is deployed and accessible

### 404 on Routes
- Verify `vercel.json` has the rewrites rule
- Check React Router is using `BrowserRouter`

---

## 📦 What Gets Deployed

Only the `client` folder contents:
- ✅ React frontend application
- ✅ Built static files (`dist` folder)
- ✅ Vite configuration
- ❌ Backend server (deploy separately)

---

## 🎉 Success!

Your frontend is now live on Vercel! 

**Next Steps**:
1. Deploy backend separately (Render/Railway/etc.)
2. Update `VITE_API_URL` if backend URL changes
3. Configure custom domain (optional)

---

## 📚 Related Files

- `VERCEL_DEPLOYMENT.md` - Full deployment guide (frontend + backend)
- `ENV_VAR_URL_REFERENCE.md` - Backend URL formats
- `client/vercel.json` - Vercel configuration


