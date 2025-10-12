# 🔧 EaseCart Troubleshooting Guide

## Current Status Check

### ✅ What's Working:
1. **Backend Server:** Running on port 5000
2. **Frontend Server:** Running on port 5173
3. **MongoDB:** Connected
4. **API Endpoints:** All 13 tests passed
5. **Network Ports:** Both 5173 and 5000 are accessible

---

## 🎯 Step-by-Step Verification

### Step 1: Open the Test Page
I've created a test page that automatically checks all components. 

**Action:** The file `test-frontend.html` should have opened in your browser.

**What to check:**
- ✅ Backend API Test - Should show green "✅ Backend is working!"
- ✅ Frontend React App Test - Should show green "✅ Frontend is loading!"
- ✅ Authentication Test - Should show green "✅ Login API working!"
- ✅ Products API Test - Should show green "✅ Products API working!"

**If you see red errors:** Take a screenshot and share the error messages.

---

### Step 2: Access the Frontend Directly

**Open your browser and go to:**
```
http://localhost:5173
```

**What you should see:**
- EaseCart navigation bar at the top
- "EaseCart" hero section with "Everything you need—beautifully priced"
- Product catalog with search and price filters
- Product cards displaying items

**If you see a blank page:**
1. Press F12 to open Developer Tools
2. Click on the "Console" tab
3. Look for any red error messages
4. Share those error messages with me

---

### Step 3: Check Browser Console

**How to open console:**
- **Chrome/Edge:** Press F12 or Ctrl+Shift+I
- **Firefox:** Press F12 or Ctrl+Shift+K

**What to look for:**
- ❌ Red error messages (these are problems)
- ⚠️ Yellow warnings (usually safe to ignore)
- 🔵 Blue info messages (informational only)

**Common errors and solutions:**

#### Error: "Failed to fetch"
**Cause:** Backend not responding
**Solution:** 
```bash
cd server
npm run dev
```

#### Error: "Cannot find module"
**Cause:** Missing dependencies
**Solution:**
```bash
cd client
npm install
```

#### Error: "CORS policy"
**Cause:** CORS not configured
**Solution:** Already configured in server/app.js, restart backend

---

### Step 4: Test Individual Pages

**Try accessing these URLs directly:**

1. **Home Page:**
   ```
   http://localhost:5173/
   ```
   Should show: Product catalog

2. **Login Page:**
   ```
   http://localhost:5173/login
   ```
   Should show: Login form

3. **Register Page:**
   ```
   http://localhost:5173/register
   ```
   Should show: Registration form

4. **Cart Page:**
   ```
   http://localhost:5173/cart
   ```
   Should show: Shopping cart (empty initially)

**If any page shows blank:**
- Check console for errors
- Verify the URL is correct
- Ensure frontend server is running

---

### Step 5: Test Backend APIs Directly

**Open these URLs in your browser:**

1. **Products API:**
   ```
   http://localhost:5000/api/products
   ```
   Should show: JSON with product list

2. **Test with curl:**
   ```bash
   curl http://localhost:5000/api/products
   ```
   Should return: JSON response

**If you see "Cannot GET /":**
- This is normal! Backend is API-only
- Use the /api/ endpoints instead

---

## 🐛 Common Issues and Solutions

### Issue 1: "Both servers not working"

**Diagnosis:**
```bash
# Check if Node processes are running
Get-Process | Where-Object {$_.ProcessName -like "*node*"}
```

**Solution A: Restart Servers**
```bash
# Stop all Node processes
taskkill /F /IM node.exe

# Start backend
cd server
npm run dev

# In new terminal, start frontend
cd client
npm run dev
```

**Solution B: Check Ports**
```bash
# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

---

### Issue 2: "Functions not visible"

**Possible causes:**

#### A. React Components Not Rendering
**Check:** Browser console for errors
**Solution:** Fix import/export issues in components

#### B. API Not Returning Data
**Check:** 
```bash
curl http://localhost:5000/api/products
```
**Solution:** Verify MongoDB is running and seeded

#### C. CSS Not Loading
**Check:** Network tab in DevTools
**Solution:** Verify Tailwind CSS is configured

#### D. JavaScript Errors
**Check:** Console tab for red errors
**Solution:** Fix syntax errors in code

---

### Issue 3: "Blank Page"

**Diagnosis Steps:**

1. **Check if HTML loads:**
   - View page source (Ctrl+U)
   - Should see `<div id="root"></div>`

2. **Check if JavaScript loads:**
   - Open DevTools → Network tab
   - Refresh page
   - Look for main.jsx loading

3. **Check for React errors:**
   - Console tab
   - Look for "React" or "Uncaught" errors

**Common Solutions:**

```bash
# Clear cache and rebuild
cd client
rm -rf node_modules
npm install
npm run dev
```

---

### Issue 4: "MongoDB Connection Failed"

**Error Message:**
```
MongooseError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**Or use MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to localhost:27017
3. Verify connection

**Or check .env file:**
```
MONGO_URI=mongodb://localhost:27017/easecart
```

---

### Issue 5: "Port Already in Use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

**Find and kill process:**
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /F /PID <PID>

# Restart server
cd server
npm run dev
```

---

## 🧪 Automated Testing

### Run All Tests:
```bash
# API Tests
node test-api.js

# Expected output: All 13 tests pass ✅
```

### Manual API Testing:
```bash
# Test products endpoint
curl http://localhost:5000/api/products

# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"customer@test.com\",\"password\":\"Test123!\"}"
```

---

## 📊 Health Check Checklist

Run through this checklist:

- [ ] MongoDB is running (check MongoDB Compass or service)
- [ ] Backend server shows "Server running on port 5000"
- [ ] Backend server shows "MongoDB connected successfully"
- [ ] Frontend server shows "Local: http://localhost:5173/"
- [ ] Can access http://localhost:5173 in browser
- [ ] Can access http://localhost:5000/api/products in browser
- [ ] test-api.js shows all tests passing
- [ ] Browser console has no red errors
- [ ] Can see products on home page
- [ ] Can navigate to login page

**If all checked:** Application is working! ✅

**If any unchecked:** Follow the specific troubleshooting steps above.

---

## 🆘 Getting Help

### Information to Provide:

1. **Error Messages:**
   - Copy exact error from console
   - Include full stack trace

2. **Screenshots:**
   - Browser page showing the issue
   - Console tab with errors
   - Network tab if API issues

3. **Environment:**
   - Node version: `node --version`
   - npm version: `npm --version`
   - MongoDB status: Running/Not running

4. **What You've Tried:**
   - List troubleshooting steps already attempted
   - Any changes made to code

---

## 🎯 Quick Fixes

### Reset Everything:
```bash
# Stop all servers (Ctrl+C in terminals)

# Backend reset
cd server
rm -rf node_modules
npm install
npm run dev

# Frontend reset (in new terminal)
cd client
rm -rf node_modules
npm install
npm run dev

# Test
node test-api.js
```

### Clear Browser Cache:
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page (Ctrl+F5)

### Restart MongoDB:
```bash
# Windows
net stop MongoDB
net start MongoDB

# Or restart MongoDB service from Services app
```

---

## ✅ Verification Commands

Run these to verify everything:

```bash
# 1. Check Node processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"}

# 2. Check ports
Test-NetConnection -ComputerName localhost -Port 5000
Test-NetConnection -ComputerName localhost -Port 5173

# 3. Test backend
curl http://localhost:5000/api/products

# 4. Test frontend
curl http://localhost:5173

# 5. Run automated tests
node test-api.js
```

**All should return successful responses!**

---

## 📝 Next Steps

Once everything is working:

1. ✅ Test login functionality
2. ✅ Test product browsing
3. ✅ Test cart operations
4. ✅ Test checkout process
5. ✅ Test role-based dashboards
6. ✅ Test announcements
7. ✅ Test complaints system

---

## 🎉 Success Indicators

**You'll know it's working when:**

1. Home page loads with products
2. Can click "Login" and see login form
3. Can login with test accounts
4. Can add products to cart
5. Can view dashboard based on role
6. No red errors in console
7. All API tests pass

**If you're seeing all of these: Congratulations! Your application is fully functional! 🎉**
