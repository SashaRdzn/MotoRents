#!/bin/bash

# MotoRents Deployment Script
echo "🚀 Starting MotoRents deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/motorents.git"
    echo "   git push -u origin main"
    exit 1
fi

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Commit changes
echo "📝 Committing changes..."
git add .
git commit -m "Deploy to production"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://netlify.com and connect your GitHub repository"
echo "2. Set build settings:"
echo "   - Build command: npm run build"
echo "   - Publish directory: frontend/dist"
echo "   - Base directory: frontend"
echo "3. Add environment variable:"
echo "   - VITE_SERVER_URL=https://your-backend-url.railway.app"
echo "4. Deploy your backend to Railway or Render"
echo "5. Update CORS settings in backend for your Netlify domain"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
