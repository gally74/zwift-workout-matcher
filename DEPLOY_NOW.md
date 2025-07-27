# 🚀 DEPLOY YOUR APP NOW - Step by Step

## 📋 **Prerequisites (5 minutes)**
1. **GitHub Account**: [github.com](https://github.com) - Sign up if you don't have one
2. **Node.js**: Download from [nodejs.org](https://nodejs.org) (LTS version)
3. **Git**: Download from [git-scm.com](https://git-scm.com)

## 🔧 **Step 1: Prepare Your Code (5 minutes)**

### **1.1 Install Node.js**
- Download and install Node.js from [nodejs.org](https://nodejs.org)
- Restart your computer after installation
- Open Command Prompt and type: `node --version` (should show version)

### **1.2 Build Your App**
```bash
# Open Command Prompt in your project folder
cd "C:\Users\Roy\Documents\Cursor Projects\Project Zwift Workout Routes"

# Install dependencies
npm install
cd client
npm install

# Build the React app
npm run build
```

### **1.3 Create GitHub Repository**
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `zwift-workout-matcher`
4. Make it **Public**
5. Click "Create repository"

### **1.4 Upload to GitHub**
```bash
# In your project folder, open Command Prompt
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zwift-workout-matcher.git
git push -u origin main
```
**Replace `YOUR_USERNAME` with your actual GitHub username**

## 🌐 **Step 2: Deploy Backend (Railway) - 5 minutes**

### **2.1 Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign up with GitHub
4. Authorize Railway to access your GitHub

### **2.2 Deploy Backend**
1. Click "Deploy from GitHub repo"
2. Select your `zwift-workout-matcher` repository
3. Railway will auto-detect it's a Node.js app
4. Wait for deployment (2-3 minutes)
5. **Copy the URL** (looks like: `https://your-app-name.railway.app`)

### **2.3 Test Backend**
- Open the URL in browser
- You should see: "Server running on port 3000" or similar

## 🎨 **Step 3: Deploy Frontend (Vercel) - 5 minutes**

### **3.1 Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub

### **3.2 Deploy Frontend**
1. Click "New Project"
2. Import your `zwift-workout-matcher` repository
3. Configure build settings:
   - **Framework Preset**: Other
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/build`
4. Click "Deploy"

### **3.3 Configure Environment**
1. In your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Add: `REACT_APP_API_URL` = `https://your-railway-url.railway.app`
4. Redeploy the project

## ✅ **Step 4: Test Your App (5 minutes)**

### **4.1 Test the App**
1. Open your Vercel URL (looks like: `https://your-app.vercel.app`)
2. Enter your FTP and Weight
3. Upload your ZWO file
4. Check if routes are recommended
5. Test the "Buy Me a Coffee" button

### **4.2 Share Your App**
- Your app is now live at: `https://your-app.vercel.app`
- Share with friends and cycling community!

## 🎯 **Your App URLs**
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **GitHub**: `https://github.com/YOUR_USERNAME/zwift-workout-matcher`

## 💰 **Cost**
- **Vercel**: FREE
- **Railway**: $5/month credit (usually covers small apps)
- **Total**: $0-5/month

## 🆘 **If Something Goes Wrong**

### **Common Issues:**
1. **"npm not recognized"**: Install Node.js and restart computer
2. **"Build failed"**: Check that all files are in the right folders
3. **"API not working"**: Make sure environment variable is set correctly

### **Need Help?**
- Check the error messages in Vercel/Railway logs
- Make sure your GitHub repository is public
- Verify all files are uploaded to GitHub

## 🚀 **You're Done!**

Your Zwift Workout Route Matcher is now live on the internet! 

**Next Steps:**
1. Test with your ZWO file
2. Share with the cycling community
3. Start collecting coffee donations! ☕

**Total Time**: ~20 minutes
**Cost**: $0-5/month

🎉 **Congratulations! Your app is now online!** 🎉 

npm --version

If that works, we're ready to deploy! 

## ✅ **Test npm (1 minute)**

In the same Command Prompt, type:
```
npm --version
```

If that works, we're ready to deploy! 

## 🚀 **Ready to Deploy Your App**

Since Node.js is working, let's proceed with the deployment:

### **Step 1: Build Your App**
1. **Navigate to your project folder**:
   ```
   cd "C:\Users\Roy\Documents\Cursor Projects\Project Zwift Workout Routes"
   ```

2. **Install dependencies and build**:
   ```
   npm install
   cd client
   npm install
   npm run build
   ```

### **Step 2: Create GitHub Repository**
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `zwift-workout-matcher`
4. Make it **Public**
5. Click "Create repository"

### **Step 3: Upload to GitHub**
In Command Prompt (in your project folder):
```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zwift-workout-matcher.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

## 🎯 **What's Your GitHub Username?**

I need to know your GitHub username so you can use the correct repository URL in the commands above.

Once you tell me your GitHub username, I'll give you the exact commands to run! 🚀

**Your app is ready to go live!** 🎉 