# 🔗 Environment Variable URL Reference

## For Vercel Frontend Deployment

### Environment Variable Name:
```
VITE_API_URL
```

### URL Format (After Backend Deployment):

#### If deploying to **Render.com**:
```
https://your-app-name.onrender.com/api
```
**Example**: `https://easecart-server.onrender.com/api`

#### If deploying to **Railway.app**:
```
https://your-app-name.up.railway.app/api
```
**Example**: `https://easecart-production.up.railway.app/api`

#### If deploying to **Fly.io**:
```
https://your-app-name.fly.dev/api
```
**Example**: `https://easecart-api.fly.dev/api`

#### If deploying to **Heroku**:
```
https://your-app-name.herokuapp.com/api
```
**Example**: `https://easecart-api.herokuapp.com/api`

---

## 📝 Steps to Get Your Backend URL:

### Option 1: Render.com (Recommended)
1. Go to [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Set **Root Directory** to: `server`
5. After deployment, you'll see your URL in the format:
   ```
   https://easecart-server.onrender.com
   ```
6. Add `/api` at the end:
   ```
   https://easecart-server.onrender.com/api
   ```

### Option 2: Railway.app
1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Add service → Select `server` folder
4. After deployment, copy the generated URL
5. Add `/api` at the end

---

## ✅ What to Enter in Vercel:

**Variable Name**: `VITE_API_URL`

**Variable Value**: `https://your-backend-url.onrender.com/api`

**Important**: 
- ✅ Include `/api` at the end
- ✅ Use `https://` (not `http://`)
- ✅ No trailing slash after `/api`

---

## 🧪 Test Your Backend URL:

Before adding to Vercel, test your backend URL:
```
https://your-backend-url.onrender.com/api/health
```

You should see:
```json
{
  "status": "success",
  "message": "EaseCart API is running"
}
```

---

## 📋 Quick Copy Template:

Once you deploy your backend, replace `YOUR_BACKEND_URL` with your actual URL:

```
VITE_API_URL=https://YOUR_BACKEND_URL/api
```

**Example** (if your backend is at `easecart-server.onrender.com`):
```
VITE_API_URL=https://easecart-server.onrender.com/api
```


