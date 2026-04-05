# 🚀 Backend Deployment Guide - Render.com

This guide will help you deploy your EaseCart backend to Render.com step by step.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com) (free)
3. **MongoDB Atlas Account** - Free database at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Sign up with Google/GitHub or email

### 1.2 Create a Free Cluster

1. After login, click **"Build a Database"**
2. Choose **"FREE"** (M0 Sandbox) - Click **"Create"**
3. Select a **Cloud Provider** (AWS recommended)
4. Choose a **Region** closest to you
5. Click **"Create Cluster"** (takes 3-5 minutes)

### 1.3 Create Database User

1. While cluster is creating, set up database access:
2. Go to **"Database Access"** (left sidebar)
3. Click **"Add New Database User"**
4. Choose **"Password"** authentication
5. Username: `easecart-user` (or your choice)
6. Password: Click **"Autogenerate Secure Password"** (SAVE THIS!)
7. Database User Privileges: **"Atlas admin"**
8. Click **"Add User"**

### 1.4 Configure Network Access

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.5 Get Connection String

1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace** `<username>` and `<password>` with your database user credentials
7. **Add database name** at the end: `/easecart?retryWrites=true&w=majority`
8. **Final format**:
   ```
   mongodb+srv://easecart-user:your-password@cluster0.xxxxx.mongodb.net/easecart?retryWrites=true&w=majority
   ```
9. **SAVE THIS CONNECTION STRING** - You'll need it for Render!

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended) or email

### 2.2 Create New Web Service

1. In Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** next to GitHub (if not connected)
4. Authorize Render to access your repositories
5. Select your repository containing the EaseCart code
6. Click **"Connect"**

### 2.3 Configure Web Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `easecart-backend` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)
- **Root Directory**: `server` ⚠️ **IMPORTANT!**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**

Click **"Advanced"** → **"Add Environment Variable"** and add:

1. **MONGO_URI**
   ```
   mongodb+srv://easecart-user:your-password@cluster0.xxxxx.mongodb.net/easecart?retryWrites=true&w=majority
   ```
   (Use the connection string from Step 1.5)

2. **JWT_SECRET**
   ```
   your_super_secret_jwt_key_here_make_it_long_and_secure_change_this_in_production
   ```
   (Generate a long random string - you can use: https://randomkeygen.com/)

3. **JWT_EXPIRE**
   ```
   7d
   ```

4. **NODE_ENV**
   ```
   production
   ```

5. **PORT**
   ```
   10000
   ```
   (Render uses port 10000 by default)

6. **CLIENT_URL**
   ```
   http://localhost:5173
   ```
   (We'll update this later with your Vercel URL)

### 2.4 Deploy

1. Scroll down and click **"Create Web Service"**
2. Render will start building and deploying (takes 5-10 minutes)
3. Watch the build logs for any errors

### 2.5 Get Your Backend URL

1. Once deployment completes, you'll see:
   - **Status**: Live ✅
   - **URL**: `https://easecart-backend.onrender.com` (or similar)
2. **Copy this URL** - You'll need it for Vercel!
3. Test it: Visit `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"success","message":"EaseCart API is running"}`

---

## Step 3: Update Backend CORS (After Frontend Deployment)

After you deploy your frontend to Vercel:

1. Go back to Render dashboard → Your backend service
2. Go to **"Environment"** tab
3. Find **CLIENT_URL** variable
4. Click **"Edit"**
5. Update value to your Vercel URL:
   ```
   https://your-vercel-app.vercel.app
   ```
6. Click **"Save Changes"**
7. Render will automatically redeploy

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Render account created
- [ ] Web service created with correct settings
- [ ] Root Directory set to `server`
- [ ] All environment variables added
- [ ] Backend deployed successfully
- [ ] Health check endpoint works: `/api/health`
- [ ] Backend URL copied for Vercel

---

## 🐛 Troubleshooting

### Build Fails

**Error**: "Cannot find module"
- **Solution**: Ensure `Root Directory` is set to `server`
- Check `package.json` exists in `server` folder

**Error**: "Build timeout"
- **Solution**: Increase build timeout in Render settings
- Or optimize dependencies

### Database Connection Fails

**Error**: "MongoNetworkError"
- **Solution**: 
  - Verify MongoDB Atlas network access allows 0.0.0.0/0
  - Check connection string is correct
  - Ensure username/password are URL-encoded if they contain special characters

**Error**: "Authentication failed"
- **Solution**:
  - Verify database user credentials
  - Check connection string format
  - Ensure database name is correct (`easecart`)

### Backend Not Starting

**Error**: "Port already in use"
- **Solution**: Render uses port 10000, ensure your code uses `process.env.PORT`

**Error**: "Application error"
- **Solution**: Check Render logs for specific error
- Verify all environment variables are set
- Check `npm start` command works locally

---

## 📝 Environment Variables Summary

Here's what you need in Render:

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGO_URI` | `mongodb+srv://...` | From MongoDB Atlas |
| `JWT_SECRET` | Long random string | Generate securely |
| `JWT_EXPIRE` | `7d` | Token expiration |
| `NODE_ENV` | `production` | Environment |
| `PORT` | `10000` | Render default |
| `CLIENT_URL` | Vercel URL | Update after frontend deploy |

---

## 🎉 Success!

Once deployed, your backend URL will be:
```
https://easecart-backend.onrender.com
```

**API Base URL** (for Vercel):
```
https://easecart-backend.onrender.com/api
```

Use this URL in your Vercel `VITE_API_URL` environment variable!

---

## 📚 Next Steps

1. ✅ Backend deployed → Get backend URL
2. Deploy frontend to Vercel (see `FRONTEND_ONLY_VERCEL.md`)
3. Update `CLIENT_URL` in Render with Vercel URL
4. Test full application

---

## 🆘 Need Help?

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Check Render build logs for specific errors
- Test API endpoints with Postman or browser


