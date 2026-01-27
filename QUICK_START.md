# 🚀 Quick Start Guide

## Get Your AI Recommendation System Running in 5 Minutes

### Prerequisites
- Python 3.8+ installed
- Node.js 14+ installed
- Your `clean_data.csv` file (already included)

### Step 1: Automatic Setup (Windows)
```bash
# Double-click this file or run in terminal
setup.bat
```

### Step 2: Manual Setup (If needed)

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend will start on: `http://localhost:8000`

#### Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm start
```
Frontend will start on: `http://localhost:3000`

### Step 3: Use the Application
1. Open your browser and go to `http://localhost:3000`
2. Select a user profile from the dropdown
3. Click "Get My Recommendations"
4. Explore your personalized AI recommendations!

## 🎯 What You'll See

### User Selection Page
- Clean, modern interface
- User profile dropdown
- Search functionality
- Professional design

### Recommendation Dashboard
- **Personalized Recommendations**: AI-powered product suggestions
- **Top Rated Products**: Highest rated items across categories
- **Search Functionality**: Find any product instantly
- **User Profile Info**: Your shopping statistics
- **Beautiful Product Cards**: Images, ratings, prices, and more

## 🤖 AI Features

### Multiple Recommendation Algorithms
1. **Collaborative Filtering**: "Users like you also liked..."
2. **Content-Based**: "Similar to items you've viewed..."
3. **Hybrid Approach**: Combines multiple methods
4. **SVD Matrix Factorization**: Advanced pattern matching

### Smart Explanations
- See WHY each product is recommended
- Confidence scores for recommendations
- Multiple recommendation types clearly labeled

## 📱 Features

### Frontend (React + TailwindCSS)
- ✅ Modern, responsive design
- ✅ Product cards with images
- ✅ Star ratings and reviews
- ✅ Search functionality
- ✅ User profiles
- ✅ Beautiful animations
- ✅ Mobile-friendly

### Backend (FastAPI + Python)
- ✅ RESTful API
- ✅ Multiple ML algorithms
- ✅ Real-time recommendations
- ✅ Error handling
- ✅ CORS enabled
- ✅ Auto-documentation

### Data Processing
- ✅ Clean dataset from your `clean_data.csv`
- ✅ 4000+ products
- ✅ User ratings and reviews
- ✅ Product images
- ✅ Categories and brands

## 🔧 API Endpoints

### Main Endpoints
- `GET /api/recommendations/user/{user_id}` - Personal recommendations
- `GET /api/recommendations/hybrid/{user_id}` - Hybrid recommendations
- `GET /api/products/top-rated` - Top rated products
- `GET /api/products/search` - Search products

### Documentation
Visit `http://localhost:8000/docs` for interactive API documentation

## 🎨 Customization

### Add Your Own Data
Replace `backend/clean_data.csv` with your dataset

### Modify Recommendations
Edit files in `backend/models/`:
- `content_based_filtering.py` - Content recommendations
- `collaborative_filtering.py` - User-based recommendations  
- `hybrid_recommender.py` - Combined approach

### Change UI Design
Modify React components in `frontend/src/components/`

## 🐛 Troubleshooting

### Backend Issues
```bash
# Check Python version
python --version

# Install dependencies manually
pip install fastapi uvicorn pandas numpy scikit-learn
```

### Frontend Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s node_modules
npm install
```

### Port Already in Use
```bash
# Kill processes on ports (Windows)
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID> /F
```

## 📞 Support

If you encounter any issues:
1. Check both backend and frontend are running
2. Verify the `clean_data.csv` file exists in `backend/`
3. Check console logs for error messages
4. Ensure all dependencies are installed

## 🎉 Success!

Once running, you'll have a fully functional AI recommendation system that:
- Learns from user behavior
- Provides personalized recommendations
- Shows beautiful product interfaces
- Explains why items are recommended
- Works like Amazon or Netflix recommendations

Enjoy your AI-powered e-commerce recommendation system! 🚀
