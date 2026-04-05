# 🚀 Deploy Backend NOW - Step by Step

Follow these steps in order. Each step takes about 5-10 minutes.

---

## 📍 Step 1: MongoDB Atlas Setup

### A. Create Account & Cluster
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** → Sign up
3. Click **"Build a Database"**
4. Choose **FREE (M0)** → Click **"Create"**
5. Wait 3-5 minutes for cluster to create

### B. Create Database User
1. Click **"Database Access"** (left menu)
2. Click **"Add New Database User"**
3. Username: `easecart-user`
4. Password: Click **"Autogenerate Secure Password"** → **COPY & SAVE IT!**
5. Click **"Add User"**

### C. Allow Network Access
1. Click **"Network Access"** (left menu)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### D. Get Connection String
1. Go back to **"Database"** (left menu)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace** `<username>` with: `easecart-user`
6. **Replace** `<password>` with: your saved password
7. **Add database name**: Change `/?retryWrites` to `/easecart?retryWrites`
8. **Final format**:
   ```
   mongodb+srv://easecart-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/easecart?retryWrites=true&w=majority
   ```
9. ✅ **SAVE THIS** - You'll paste it in Render!

---

## 📍 Step 2: Render.com Setup

### A. Create Account
1. Go to: https://render.com
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended) or email

### B. Create Web Service
1. Click **"New +"** (top right)
2. Click **"Web Service"**
3. If GitHub not connected:
   - Click **"Connect account"** next to GitHub
   - Authorize Render
4. **Select your repository** → Click **"Connect"**

### C. Configure Settings

**Basic Settings:**
```
Name: easecart-backend
Region: (choose closest to you)
Branch: main
Root Directory: server  ⚠️ IMPORTANT!
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Environment Variables** (Click "Advanced" → "Add Environment Variable"):

1. **MONGO_URI**
   - Value: Paste your MongoDB connection string from Step 1D

2. **JWT_SECRET**
   - Value: Generate at https://randomkeygen.com/ (use CodeIgniter Encryption Keys)
   - Example: `aB3$kL9#mN2@pQ5&rS8!tU1*vW4%xY7^zA0`

3. **JWT_EXPIRE**
   - Value: `7d`

4. **NODE_ENV**
   - Value: `production`

5. **PORT**
   - Value: `10000`

6. **CLIENT_URL**
   - Value: `http://localhost:5173` (we'll update this later)

### D. Deploy
1. Scroll down → Click **"Create Web Service"**
2. Watch the build logs
3. Wait 5-10 minutes for deployment
4. ✅ When you see **"Live"** status, you're done!

---

## 📍 Step 3: Get Your Backend URL

1. In Render dashboard, find your service
2. Look for the URL (top of the page):
   ```
   https://easecart-backend.onrender.com
   ```
3. **Copy this URL**
4. Test it: Open in browser:
   ```
   https://easecart-backend.onrender.com/api/health
   ```
5. Should see: `{"status":"success","message":"EaseCart API is running"}`

---

## 📍 Step 4: Save for Vercel

Your **API URL** for Vercel environment variable:
```
https://easecart-backend.onrender.com/api
```

**Variable Name**: `VITE_API_URL`  
**Variable Value**: `https://easecart-backend.onrender.com/api`

---

## ✅ Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster created (M0)
- [ ] Database user created (username + password saved)
- [ ] Network access set to 0.0.0.0/0
- [ ] Connection string copied and formatted correctly
- [ ] Render account created
- [ ] Web service created
- [ ] Root Directory set to `server`
- [ ] All 6 environment variables added
- [ ] Deployment completed (status: Live)
- [ ] Health check works: `/api/health`
- [ ] Backend URL copied

---

## 🆘 Common Issues

**"Cannot find module" error:**
- ✅ Check Root Directory is `server` (not empty)

**"MongoNetworkError":**
- ✅ Check MongoDB network access allows 0.0.0.0/0
- ✅ Verify connection string format

**"Authentication failed":**
- ✅ Check username/password in connection string
- ✅ Ensure database name is `/easecart`

**Build timeout:**
- ✅ Wait a bit longer (first build takes time)
- ✅ Check Render logs for specific errors

---

## 🎉 You're Done!

Your backend is now live at:
```
https://easecart-backend.onrender.com
```

**Next**: Deploy frontend to Vercel using this API URL!


