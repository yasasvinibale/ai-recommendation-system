import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD

class CollaborativeFilteringRecommender:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.user_item_matrix = None
        self.user_similarity = None
        self.item_similarity = None
        self.svd_model = None
        self._build_matrices()
    
    def _build_matrices(self):
        """Build user-item and similarity matrices"""
        # Create user-item matrix
        self.user_item_matrix = self.data.pivot_table(
            index='ID', 
            columns='ProdID', 
            values='Rating', 
            aggfunc='mean'
        ).fillna(0)
        
        # Calculate user similarity
        self.user_similarity = cosine_similarity(self.user_item_matrix)
        
        # Calculate item similarity
        self.item_similarity = cosine_similarity(self.user_item_matrix.T)
        
        # Build SVD model for matrix factorization
        self.svd_model = TruncatedSVD(n_components=50, random_state=42)
        self.svd_model.fit(self.user_item_matrix)
    
    def get_user_based_recommendations(self, user_id: int, top_n: int = 10):
        """
        Get recommendations based on similar users
        """
        if user_id not in self.user_item_matrix.index:
            return pd.DataFrame()
        
        # Get user index
        user_idx = self.user_item_matrix.index.get_loc(user_id)
        
        # Get similar users
        user_similarities = self.user_similarity[user_idx]
        similar_users_idx = user_similarities.argsort()[::-1][1:51]  # Top 50 similar users
        
        # Get items rated by similar users but not by target user
        user_ratings = self.user_item_matrix.iloc[user_idx]
        recommendations = {}
        
        for similar_user_idx in similar_users_idx:
            similar_user_ratings = self.user_item_matrix.iloc[similar_user_idx]
            similarity_score = user_similarities[similar_user_idx]
            
            # Find items rated by similar user but not by target user
            unrated_items = (similar_user_ratings > 0) & (user_ratings == 0)
            
            for item_idx in self.user_item_matrix.columns[unrated_items]:
                item_id = item_idx
                predicted_rating = similar_user_ratings[item_idx] * similarity_score
                
                if item_id not in recommendations:
                    recommendations[item_id] = []
                recommendations[item_id].append(predicted_rating)
        
        # Calculate average predicted ratings
        final_recommendations = []
        for item_id, ratings in recommendations.items():
            avg_rating = np.mean(ratings)
            final_recommendations.append((item_id, avg_rating))
        
        # Sort by predicted rating
        final_recommendations.sort(key=lambda x: x[1], reverse=True)
        
        # Get top N recommendations
        top_item_ids = [item_id for item_id, _ in final_recommendations[:top_n]]
        
        # Return product details
        recommended_products = self.data[self.data['ProdID'].isin(top_item_ids)][
            ['Name', 'Brand', 'Category', 'Rating', 'ReviewCount', 'ImageURL', 'Description']
        ].drop_duplicates().head(top_n)
        
        return recommended_products.reset_index(drop=True)
    
    def get_item_based_recommendations(self, user_id: int, top_n: int = 10):
        """
        Get recommendations based on item similarity
        """
        if user_id not in self.user_item_matrix.index:
            return pd.DataFrame()
        
        # Get user's rated items
        user_ratings = self.user_item_matrix.loc[user_id]
        rated_items = user_ratings[user_ratings > 0].index
        
        recommendations = {}
        
        for item_id in rated_items:
            item_idx = list(self.user_item_matrix.columns).index(item_id)
            item_similarities = self.item_similarity[item_idx]
            
            # Find similar items not rated by user
            for similar_item_idx, similarity_score in enumerate(item_similarities):
                similar_item_id = self.user_item_matrix.columns[similar_item_idx]
                
                if similar_item_id not in rated_items and similarity_score > 0.1:
                    predicted_rating = user_ratings[item_id] * similarity_score
                    
                    if similar_item_id not in recommendations:
                        recommendations[similar_item_id] = []
                    recommendations[similar_item_id].append(predicted_rating)
        
        # Calculate average predicted ratings
        final_recommendations = []
        for item_id, ratings in recommendations.items():
            avg_rating = np.mean(ratings)
            final_recommendations.append((item_id, avg_rating))
        
        # Sort by predicted rating
        final_recommendations.sort(key=lambda x: x[1], reverse=True)
        
        # Get top N recommendations
        top_item_ids = [item_id for item_id, _ in final_recommendations[:top_n]]
        
        # Return product details
        recommended_products = self.data[self.data['ProdID'].isin(top_item_ids)][
            ['Name', 'Brand', 'Category', 'Rating', 'ReviewCount', 'ImageURL', 'Description']
        ].drop_duplicates().head(top_n)
        
        return recommended_products.reset_index(drop=True)
    
    def get_svd_recommendations(self, user_id: int, top_n: int = 10):
        """
        Get recommendations using SVD matrix factorization
        """
        if user_id not in self.user_item_matrix.index:
            return pd.DataFrame()
        
        # Get user index
        user_idx = self.user_item_matrix.index.get_loc(user_id)
        
        # Predict ratings for all items
        user_factors = self.svd_model.transform(self.user_item_matrix.iloc[[user_idx]])
        item_factors = self.svd_model.components_
        
        predicted_ratings = np.dot(user_factors, item_factors)[0]
        
        # Get items not rated by user
        user_ratings = self.user_item_matrix.iloc[user_idx]
        unrated_items = user_ratings[user_ratings == 0].index
        
        # Create recommendations list
        recommendations = []
        for item_id in unrated_items:
            item_idx = list(self.user_item_matrix.columns).index(item_id)
            predicted_rating = predicted_ratings[item_idx]
            recommendations.append((item_id, predicted_rating))
        
        # Sort by predicted rating
        recommendations.sort(key=lambda x: x[1], reverse=True)
        
        # Get top N recommendations
        top_item_ids = [item_id for item_id, _ in recommendations[:top_n]]
        
        # Return product details
        recommended_products = self.data[self.data['ProdID'].isin(top_item_ids)][
            ['Name', 'Brand', 'Category', 'Rating', 'ReviewCount', 'ImageURL', 'Description']
        ].drop_duplicates().head(top_n)
        
        return recommended_products.reset_index(drop=True)
