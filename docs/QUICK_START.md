# Quick Start Guide

Get your n8n clone frontend up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies (1 min)

```bash
cd n8njdfront
npm install
```

### 2. Configure Environment (30 sec)

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` if needed (default values work with local backend):

```env
NEXT_PUBLIC_API_URL=http://n8njd.test/api/v1
NEXT_PUBLIC_APP_NAME=Automation Inc.
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server (30 sec)

```bash
npm run dev
```

### 4. Open Browser (10 sec)

Visit: **http://localhost:3000**

## ✅ Verify Setup

1. **Homepage loads** - You should see the login page
2. **Backend connection** - Try logging in (requires backend running)
3. **No console errors** - Check browser console

## 🎯 First Steps

### Create an Account
1. Click "Sign up for free"
2. Fill in your details
3. Submit the form

### Create Your First Workflow
1. Login to dashboard
2. Click "New Workflow"
3. Drag nodes from left panel
4. Connect nodes
5. Save workflow

### Test Workflow
1. Go to "Workflows" tab
2. Click "Execute" on your workflow
3. Check "Executions" tab for results

## 🔧 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Backend Not Accessible
```bash
# Check backend is running
curl http://n8njd.test/api/v1/health

# Update .env.local with correct backend URL
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

## 📚 Learn More

- **Full Documentation**: See [README.md](./README.md)
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Production Checklist**: See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
- **All Improvements**: See [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md)

## 🎨 Key Features to Try

1. **Dashboard** - View workflow statistics
2. **Workflow Editor** - Visual workflow builder
3. **Credentials** - Manage API credentials
4. **Templates** - Use pre-built workflows
5. **Executions** - View execution history
6. **Settings** - Configure workspace

## 💡 Pro Tips

- **Toast Notifications**: Watch bottom-right for feedback
- **Keyboard Shortcuts**: Tab through forms
- **Mobile Friendly**: Try on your phone
- **Dark Theme**: Already enabled by default
- **Auto-save**: Workflows save automatically

## 🆘 Need Help?

1. Check browser console for errors
2. Check terminal for server errors
3. Review [README.md](./README.md)
4. Check backend logs
5. Verify environment variables

## 🎉 You're Ready!

Your frontend is now running with:
- ✅ Modern UI with glassmorphism design
- ✅ Toast notifications for feedback
- ✅ Error handling and boundaries
- ✅ Loading states
- ✅ Route protection
- ✅ Production-ready code

**Happy Automating! 🚀**
