from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
import os

from models import load_and_process_data, HybridRecommender

app = FastAPI(
    title="AI Recommendation System API",
    description="AI Enabled Recommendation Engine for an E-commerce Platform",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
data = None
recommender = None

# Pydantic models
class Product(BaseModel):
    name: str
    brand: str
    category: str
    rating: float
    review_count: int
    image_url: str
    description: str
    recommendation_type: Optional[str] = None
    confidence: Optional[float] = None

class RecommendationResponse(BaseModel):
    products: List[Product]
    explanation: str
    total: int

class UserResponse(BaseModel):
    user_id: int
    total_purchases: int
    avg_rating: float
    preferred_categories: List[str]

# Load data on startup
@app.on_event("startup")
async def startup_event():
    global data, recommender
    try:
        # Load and process data
        data_path = os.path.join(os.path.dirname(__file__), "clean_data.csv")
        data = load_and_process_data(data_path)
        
        # Initialize recommender
        recommender = HybridRecommender(data)
        
        print(f"✅ Data loaded successfully: {len(data)} products")
        print(f"✅ Recommender system initialized")
        
    except Exception as e:
        print(f"❌ Error loading data: {str(e)}")
        raise e

@app.get("/")
async def root():
    return {"message": "AI Recommendation System API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "data_loaded": data is not None}

@app.get("/api/users", response_model=List[int])
async def get_users():
    """Get all user IDs"""
    if data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    users = sorted(data['ID'].unique().tolist())
    return users

@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user_info(user_id: int):
    """Get user information"""
    if data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    user_data = data[data['ID'] == user_id]
    if user_data.empty:
        raise HTTPException(status_code=404, detail="User not found")
    
    total_purchases = len(user_data)
    avg_rating = user_data['Rating'].mean()
    preferred_categories = user_data['Category'].value_counts().head(5).index.tolist()
    
    return UserResponse(
        user_id=user_id,
        total_purchases=total_purchases,
        avg_rating=round(avg_rating, 2),
        preferred_categories=preferred_categories
    )

@app.get("/api/products", response_model=List[Product])
async def get_products(
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    brand: Optional[str] = None
):
    """Get products with optional filtering"""
    if data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    filtered_data = data.copy()
    
    if category:
        filtered_data = filtered_data[
            filtered_data['Category'].str.contains(category, case=False, na=False)
        ]
    
    if brand:
        filtered_data = filtered_data[
            filtered_data['Brand'].str.contains(brand, case=False, na=False)
        ]
    
    # Sort by rating and review count
    filtered_data = filtered_data.sort_values(
        ['Rating', 'ReviewCount'], 
        ascending=[False, False]
    ).head(limit)
    
    products = []
    for _, row in filtered_data.iterrows():
        products.append(Product(
            name=row['Name'],
            brand=row['Brand'],
            category=row['Category'],
            rating=row['Rating'],
            review_count=row['ReviewCount'],
            image_url=row['ImageURL'],
            description=row['Description'][:200] + "..." if len(str(row['Description'])) > 200 else str(row['Description'])
        ))
    
    return products

@app.get("/api/products/search", response_model=List[Product])
async def search_products(
    query: str = Query(..., min_length=2),
    limit: int = Query(10, ge=1, le=50)
):
    """Search products by name"""
    if data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    search_results = data[
        data['Name'].str.contains(query, case=False, na=False)
    ].head(limit)
    
    products = []
    for _, row in search_results.iterrows():
        products.append(Product(
            name=row['Name'],
            brand=row['Brand'],
            category=row['Category'],
            rating=row['Rating'],
            review_count=row['ReviewCount'],
            image_url=row['ImageURL'],
            description=row['Description'][:200] + "..." if len(str(row['Description'])) > 200 else str(row['Description'])
        ))
    
    return products

@app.get("/api/recommendations/user/{user_id}", response_model=RecommendationResponse)
async def get_user_recommendations(
    user_id: int,
    limit: int = Query(10, ge=1, le=20)
):
    """Get personalized recommendations for a user"""
    if data is None or recommender is None:
        raise HTTPException(status_code=500, detail="System not ready")
    
    # Get hybrid recommendations
    recommendations = recommender.get_hybrid_recommendations(user_id, top_n=limit)
    
    if recommendations.empty:
        raise HTTPException(status_code=404, detail="No recommendations found")
    
    # Convert to response format
    products = []
    for _, row in recommendations.iterrows():
        products.append(Product(
            name=row['Name'],
            brand=row['Brand'],
            category=row['Category'],
            rating=row['Rating'],
            review_count=row['ReviewCount'],
            image_url=row['ImageURL'],
            description=row['Description'][:200] + "..." if len(str(row['Description'])) > 200 else str(row['Description']),
            recommendation_type=row.get('recommendation_type'),
            confidence=row.get('confidence')
        ))
    
    explanation = f"Personalized recommendations based on your shopping history and preferences"
    
    return RecommendationResponse(
        products=products,
        explanation=explanation,
        total=len(products)
    )

@app.get("/api/recommendations/hybrid/{user_id}", response_model=RecommendationResponse)
async def get_hybrid_recommendations(
    user_id: int,
    product_name: Optional[str] = None,
    limit: int = Query(10, ge=1, le=20)
):
    """Get hybrid recommendations combining multiple approaches"""
    if data is None or recommender is None:
        raise HTTPException(status_code=500, detail="System not ready")
    
    recommendations = recommender.get_hybrid_recommendations(
        user_id, 
        product_name, 
        top_n=limit
    )
    
    if recommendations.empty:
        raise HTTPException(status_code=404, detail="No recommendations found")
    
    products = []
    for _, row in recommendations.iterrows():
        products.append(Product(
            name=row['Name'],
            brand=row['Brand'],
            category=row['Category'],
            rating=row['Rating'],
            review_count=row['ReviewCount'],
            image_url=row['ImageURL'],
            description=row['Description'][:200] + "..." if len(str(row['Description'])) > 200 else str(row['Description']),
            recommendation_type=row.get('recommendation_type'),
            confidence=row.get('confidence')
        ))
    
    explanation = f"Hybrid recommendations using multiple AI algorithms for better accuracy"
    
    return RecommendationResponse(
        products=products,
        explanation=explanation,
        total=len(products)
    )

@app.get("/api/recommendations/content/{product_name}", response_model=RecommendationResponse)
async def get_content_based_recommendations(
    product_name: str,
    limit: int = Query(10, ge=1, le=20)
):
    """Get content-based recommendations for a product"""
    if data is None or recommender is None:
        raise HTTPException(status_code=500, detail="System not ready")
    
    recommendations = recommender.content_based.get_recommendations(product_name, top_n=limit)
    
    if recommendations.empty:
        raise HTTPException(status_code=404, detail="Product not found or no recommendations")
    
    products = []
    for _, row in recommendations.iterrows():
        products.append(Product(
            name=row['Name'],
            brand=row['Brand'],
            category=row['Category'],
            rating=row['Rating'],
            review_count=row['ReviewCount'],
            image_url=row['ImageURL'],
            description=row['Description'][:200] + "..." if len(str(row['Description'])) > 200 else str(row['Description']),
            recommendation_type='content_based',
            confidence=row.get('similarity_score', 0.8)
        ))
    
    explanation = f"Products similar to {product_name} based on features and characteristics"
    
    return RecommendationResponse(
        products=products,
        explanation=explanation,
        total=len(products)
    )

@app.get("/api/recommendations/similar/{product_name}", response_model=RecommendationResponse)
async def get_similar_products(
    product_name: str,
    limit: int = Query(5, ge=1, le=10)
):
    """Get similar products for a given product"""
    if data is None or recommender is None:
        raise HTTPException(status_code=500, detail="System not ready")
    
    similar_products = recommender.get_similar_products(product_name, top_n=limit)
    
    if similar_products.empty:
        raise HTTPException(status_code=404, detail="Product not found or no similar products")
    
    products = []
    for _, row in similar_products.iterrows():
        products.append(Product(
            name=row['Name'],
            brand=row['Brand'],
            category=row['Category'],
            rating=row['Rating'],
            review_count=row['ReviewCount'],
            image_url=row['ImageURL'],
            description=row['Description'][:200] + "..." if len(str(row['Description'])) > 200 else str(row['Description']),
            recommendation_type='similar_products',
            confidence=row.get('similarity_score', 0.8)
        ))
    
    explanation = f"Products similar to {product_name} that other customers also liked"
    
    return RecommendationResponse(
        products=products,
        explanation=explanation,
        total=len(products)
    )

@app.get("/api/products/top-rated", response_model=RecommendationResponse)
async def get_top_rated_products(limit: int = Query(10, ge=1, le=20)):
    """Get top-rated products across all categories"""
    if data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    top_products = data.sort_values(
        ['Rating', 'ReviewCount'], 
        ascending=[False, False]
    ).head(limit)
    
    products = []
    for _, row in top_products.iterrows():
        products.append(Product(
            name=row['Name'],
            brand=row['Brand'],
            category=row['Category'],
            rating=row['Rating'],
            review_count=row['ReviewCount'],
            image_url=row['ImageURL'],
            description=row['Description'][:200] + "..." if len(str(row['Description'])) > 200 else str(row['Description']),
            recommendation_type='top_rated',
            confidence=0.9
        ))
    
    explanation = "Highest rated products across all categories"
    
    return RecommendationResponse(
        products=products,
        explanation=explanation,
        total=len(products)
    )

@app.get("/api/categories", response_model=List[str])
async def get_categories():
    """Get all available categories"""
    if data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    categories = data['Category'].value_counts().head(20).index.tolist()
    return categories

@app.get("/api/brands", response_model=List[str])
async def get_brands():
    """Get all available brands"""
    if data is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    brands = data['Brand'].value_counts().head(50).index.tolist()
    return brands

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
