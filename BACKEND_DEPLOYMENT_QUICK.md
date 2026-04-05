# ⚡ Quick Backend Deployment Checklist

## 🎯 Quick Steps

### 1. MongoDB Atlas Setup (5 minutes)
- [ ] Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create FREE cluster (M0 Sandbox)
- [ ] Create database user (save password!)
- [ ] Allow network access: `0.0.0.0/0`
- [ ] Get connection string, format:
  ```
  mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/easecart?retryWrites=true&w=majority
  ```

### 2. Render Deployment (10 minutes)
- [ ] Sign up at [render.com](https://render.com)
- [ ] New Web Service → Connect GitHub repo
- [ ] Settings:
  - Name: `easecart-backend`
  - Root Directory: `server` ⚠️
  - Build: `npm install`
  - Start: `npm start`
- [ ] Add Environment Variables:
  ```
  MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/easecart?retryWrites=true&w=majority
  JWT_SECRET=your_long_random_secret_key_here
  JWT_EXPIRE=7d
  NODE_ENV=production
  PORT=10000
  CLIENT_URL=http://localhost:5173
  ```
- [ ] Deploy → Wait 5-10 minutes
- [ ] Copy backend URL: `https://easecart-backend.onrender.com`

### 3. Test Backend
- [ ] Visit: `https://your-backend-url.onrender.com/api/health`
- [ ] Should see: `{"status":"success","message":"EaseCart API is running"}`

### 4. Get API URL for Vercel
- [ ] Backend URL: `https://easecart-backend.onrender.com`
- [ ] API URL: `https://easecart-backend.onrender.com/api` ✅
- [ ] Use this in Vercel `VITE_API_URL` environment variable

---

## 📋 Required Info

**MongoDB Connection String Format:**
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

**Render Environment Variables:**
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - Long random string (use https://randomkeygen.com/)
- `JWT_EXPIRE` - `7d`
- `NODE_ENV` - `production`
- `PORT` - `10000`
- `CLIENT_URL` - Update later with Vercel URL

---

## ✅ Success Indicators

- ✅ Render shows "Live" status
- ✅ `/api/health` endpoint returns success
- ✅ Backend URL accessible
- ✅ No errors in Render logs

---

**Full Guide**: See `BACKEND_DEPLOYMENT_GUIDE.md` for detailed instructions.


