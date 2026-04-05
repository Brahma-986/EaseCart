# ⚡ Quick Start: Deploy to Vercel

## 🚀 Fast Deployment Steps

### 1. Deploy Backend First (Choose One)

**Render.com** (Recommended):
- Go to [render.com](https://render.com)
- New Web Service → Connect repo
- Root Directory: `server`
- Add env vars (see below)
- Copy backend URL

**Railway.app**:
- Go to [railway.app](https://railway.app)
- New Project → Deploy from GitHub
- Add service → Select `server` folder
- Add env vars → Deploy

### 2. Deploy Frontend to Vercel

**Via Dashboard**:
1. Go to [vercel.com](https://vercel.com)
2. Add New Project → Import Git repo
3. **Root Directory**: `client` ⚠️ IMPORTANT!
4. **Framework**: Vite (auto-detected)
5. **Environment Variable**: 
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
6. Deploy!

**Via CLI**:
```bash
cd client
npm install -g vercel
vercel login
vercel
vercel env add VITE_API_URL  # Enter your backend API URL
vercel --prod
```

### 3. Update Backend CORS

In your backend hosting platform, update:
```
CLIENT_URL=https://your-vercel-app.vercel.app
```

---

## 📝 Required Environment Variables

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend (Render/Railway)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLIENT_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

---

## ✅ Verify Deployment

1. Visit your Vercel URL
2. Try logging in
3. Check browser console for errors
4. Test API calls

---

## 📚 Full Guide

See `VERCEL_DEPLOYMENT.md` for detailed instructions.


