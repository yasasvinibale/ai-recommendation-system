import pandas as pd
import numpy as np
from .content_based_filtering import ContentBasedRecommender
from .collaborative_filtering import CollaborativeFilteringRecommender

class HybridRecommender:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.content_based = ContentBasedRecommender(data)
        self.collaborative = CollaborativeFilteringRecommender(data)
    
    def get_hybrid_recommendations(self, user_id: int, product_name: str = None, top_n: int = 10):
        """
        Get hybrid recommendations combining multiple approaches
        """
        recommendations = []
        
        # 1. Get collaborative filtering recommendations
        collab_recs = self.collaborative.get_user_based_recommendations(user_id, top_n)
        if not collab_recs.empty:
            collab_recs['recommendation_type'] = 'collaborative'
            collab_recs['confidence'] = 0.8
            recommendations.append(collab_recs)
        
        # 2. Get content-based recommendations if product is provided
        if product_name:
            content_recs = self.content_based.get_recommendations(product_name, top_n)
            if not content_recs.empty:
                content_recs['recommendation_type'] = 'content_based'
                content_recs['confidence'] = 0.7
                recommendations.append(content_recs)
        else:
            # Get recommendations based on user's preferred categories
            user_data = self.data[self.data['ID'] == user_id]
            if not user_data.empty:
                preferred_categories = user_data['Category'].value_counts().head(3).index.tolist()
                for category in preferred_categories:
                    category_recs = self.content_based.get_recommendations_by_category(category, top_n//2)
                    if not category_recs.empty:
                        category_recs['recommendation_type'] = 'category_based'
                        category_recs['confidence'] = 0.6
                        recommendations.append(category_recs)
        
        # 3. Get SVD recommendations
        svd_recs = self.collaborative.get_svd_recommendations(user_id, top_n)
        if not svd_recs.empty:
            svd_recs['recommendation_type'] = 'svd'
            svd_recs['confidence'] = 0.75
            recommendations.append(svd_recs)
        
        # Combine all recommendations
        if not recommendations:
            return self._get_fallback_recommendations(top_n)
        
        combined_recs = pd.concat(recommendations, ignore_index=True)
        
        # Remove duplicates and sort by confidence and rating
        combined_recs = combined_recs.drop_duplicates(subset=['Name'], keep='first')
        combined_recs = combined_recs.sort_values(
            ['confidence', 'Rating'], 
            ascending=[False, False]
        )
        
        return combined_recs.head(top_n).reset_index(drop=True)
    
    def _get_fallback_recommendations(self, top_n: int):
        """
        Get fallback recommendations when user-specific recommendations fail
        """
        # Return top-rated products
        top_rated = self.data.sort_values(
            ['Rating', 'ReviewCount'], 
            ascending=[False, False]
        ).head(top_n)
        
        result = top_rated[
            ['Name', 'Brand', 'Category', 'Rating', 'ReviewCount', 'ImageURL', 'Description']
        ].copy()
        result['recommendation_type'] = 'top_rated'
        result['confidence'] = 0.5
        
        return result.reset_index(drop=True)
    
    def get_explanation(self, product_name: str, user_id: int, recommendation_type: str):
        """
        Generate explanation for why a product is recommended
        """
        explanations = {
            'collaborative': f"Users with similar preferences to you also liked {product_name}",
            'content_based': f"{product_name} is similar to items you've previously viewed or purchased",
            'category_based': f"{product_name} is from a category you frequently shop from",
            'svd': f"Based on advanced pattern analysis, {product_name} matches your preferences",
            'top_rated': f"{product_name} is highly rated by other customers"
        }
        
        return explanations.get(recommendation_type, f"{product_name} is recommended for you")
    
    def get_similar_products(self, product_name: str, top_n: int = 5):
        """
        Get similar products for a given product
        """
        return self.content_based.get_recommendations(product_name, top_n)
