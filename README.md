# AI Enabled Recommendation Engine for an E-commerce Platform

A modern recommendation system that suggests products to users based on what they liked and what similar users liked — just like Amazon or Netflix recommendations.

## 🎯 Project Overview

This system uses multiple ML approaches to provide personalized product recommendations:
- **Content-Based Filtering**: Recommends items similar to what the user has liked before
- **Collaborative Filtering**: Recommends items based on similar users' behavior  
- **Hybrid Approach**: Combines both methods for better recommendations
- **Rating-Based**: Top-rated products across the platform

## 🏗️ Project Structure

```
├── backend/                 # Python FastAPI backend
│   ├── app.py              # Main FastAPI application
│   ├── models/             # ML recommendation models
│   ├── requirements.txt    # Python dependencies
│   └── clean_data.csv     # Dataset
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main App component
│   └── package.json      # Frontend dependencies
└── README.md              # This file
```

## 🚀 Technologies Used

### Backend
- **Python** - Core programming language
- **FastAPI** - Modern web framework for APIs
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Scikit-learn** - Machine learning algorithms
- **LangChain** - AI/ML utilities

### Frontend
- **React** - Modern UI framework
- **TailwindCSS** - Utility-first CSS framework
- **Lucide** - Beautiful icons
- **Axios** - HTTP client for API calls

## 📊 Dataset

The system uses `clean_data.csv` containing:
- User information and ratings
- Product details (name, category, brand, description)
- Product images
- Reviews and ratings

## 🤖 Recommendation Algorithms

### 1. Content-Based Filtering
- Uses item features (category, brand, description)
- TF-IDF vectorization for text similarity
- Cosine similarity for recommendations

### 2. Collaborative Filtering  
- User-user similarity analysis
- Item-item collaborative filtering
- Matrix factorization techniques

### 3. Hybrid Approach
- Combines content-based and collaborative filtering
- Removes duplicates and ranks by relevance
- Provides more diverse recommendations

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd AI-Recommendation-System
```

2. **Install dependencies**
```bash
npm run install-deps
```

3. **Start the development servers**
```bash
npm run dev
```

This will start:
- Backend API server at `http://localhost:8000`
- Frontend React app at `http://localhost:3000`

## 📱 Features

- **User Selection**: Login or select user profile
- **Personalized Recommendations**: AI-powered product suggestions
- **Product Details**: View product information, images, ratings
- **Explanation System**: Understand why products are recommended
- **Similar Products**: "People also liked" section
- **Modern UI**: Clean, responsive design like Amazon/Flipkart

## 🔗 API Endpoints

### Recommendation Endpoints
- `GET /api/recommendations/user/{user_id}` - Get user recommendations
- `GET /api/recommendations/content/{product_name}` - Content-based recommendations
- `GET /api/recommendations/collaborative/{user_id}` - Collaborative filtering
- `GET /api/recommendations/hybrid/{user_id}/{product_name}` - Hybrid recommendations
- `GET /api/products/top-rated` - Get top-rated products

### User & Product Endpoints
- `GET /api/users` - Get all users
- `GET /api/products` - Get all products
- `GET /api/products/{product_id}` - Get product details

## 🎨 Frontend Components

### Key Screens
1. **User Selection/Login Page**
   - Enter User ID or choose profile
   - "Get My Recommendations" button

2. **Recommendation Dashboard**
   - "Recommended for You" section
   - Product cards with images, names, prices, ratings
   - AI explanations for recommendations

3. **Product Details**
   - Full product information
   - Similar products suggestions
   - "People also liked" section

## 🤝 How It Works

1. **User selects profile** or enters User ID
2. **Frontend sends request** to backend API
3. **Backend processes** data through ML models
4. **Recommendations generated** using multiple algorithms
5. **Results displayed** in beautiful, user-friendly interface

## 📈 Performance

- **Fast response times** with optimized algorithms
- **Scalable architecture** for large datasets
- **Real-time recommendations** with caching
- **Responsive design** for all devices

## 🔮 Future Enhancements

- Deep learning models (Neural Collaborative Filtering)
- Real-time user behavior tracking
- A/B testing framework
- Advanced analytics dashboard
- Mobile app development

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Dataset from e-commerce platform
- ML algorithms from Scikit-learn
- UI inspiration from modern e-commerce platforms
