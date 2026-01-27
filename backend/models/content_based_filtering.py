import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class ContentBasedRecommender:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.tfidf_matrix = None
        self.cosine_sim = None
        self._build_model()
    
    def _build_model(self):
        """Build the TF-IDF and cosine similarity model"""
        # Combine relevant text features for better recommendations
        self.data['combined_features'] = (
            self.data['Category'] + ' ' + 
            self.data['Brand'] + ' ' + 
            self.data['Tags'] + ' ' + 
            self.data['Description'].fillna('')
        )
        
        # Create TF-IDF matrix
        tfidf_vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=5000,
            ngram_range=(1, 2)
        )
        self.tfidf_matrix = tfidf_vectorizer.fit_transform(self.data['combined_features'])
        
        # Calculate cosine similarity
        self.cosine_sim = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
    
    def get_recommendations(self, product_name: str, top_n: int = 10):
        """
        Get content-based recommendations for a product
        """
        if product_name not in self.data['Name'].values:
            return pd.DataFrame()
        
        # Get the index of the product
        product_indices = self.data[self.data['Name'] == product_name].index
        if len(product_indices) == 0:
            return pd.DataFrame()
        
        product_idx = product_indices[0]
        
        # Get similarity scores
        sim_scores = list(enumerate(self.cosine_sim[product_idx]))
        
        # Sort by similarity score
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Get top N similar products (excluding the product itself)
        top_indices = [i[0] for i in sim_scores[1:top_n+1]]
        
        # Return recommended products with relevant details
        recommendations = self.data.iloc[top_indices][
            ['Name', 'Brand', 'Category', 'Rating', 'ReviewCount', 'ImageURL', 'Description']
        ].copy()
        
        # Add similarity scores
        recommendations['similarity_score'] = [sim_scores[i][1] for i in range(1, len(top_indices)+1)]
        
        return recommendations.reset_index(drop=True)
    
    def get_recommendations_by_category(self, category: str, top_n: int = 10):
        """
        Get recommendations from a specific category
        """
        category_products = self.data[self.data['Category'].str.contains(category, case=False, na=False)]
        
        if len(category_products) == 0:
            return pd.DataFrame()
        
        # Sort by rating and review count
        recommendations = category_products.sort_values(
            ['Rating', 'ReviewCount'], 
            ascending=[False, False]
        ).head(top_n)
        
        return recommendations[
            ['Name', 'Brand', 'Category', 'Rating', 'ReviewCount', 'ImageURL', 'Description']
        ].reset_index(drop=True)
