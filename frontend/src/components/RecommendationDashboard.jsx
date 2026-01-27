import React, { useState, useEffect } from 'react';
import { User, Search, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import { apiService } from '../api';

const RecommendationDashboard = ({ userId, onBack }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch user info and recommendations in parallel
      const [userRes, recRes, topRatedRes] = await Promise.all([
        apiService.getUserInfo(userId),
        apiService.getUserRecommendations(userId, 10),
        apiService.getTopRatedProducts(8)
      ]);

      setUserInfo(userRes.data);
      setRecommendations(recRes.data.products);
      setTopRated(topRatedRes.data.products);
      setLoading(false);
    } catch (err) {
      setError('Failed to load recommendations');
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await apiService.searchProducts(query, 8);
      setSearchResults(response.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    alert(`Added "${product.name}" to cart!`);
    // In a real app, this would update the cart state
  };

  const handleAddToWishlist = (product) => {
    alert(`Added "${product.name}" to wishlist!`);
    // In a real app, this would update the wishlist state
  };

  const getRecommendationExplanation = (type) => {
    const explanations = {
      'collaborative': 'Users with similar preferences also liked these',
      'content based': 'Similar to items you\'ve previously viewed',
      'category based': 'From your favorite categories',
      'svd': 'Advanced AI pattern matching',
      'top rated': 'Highest rated products'
    };
    return explanations[type] || 'Personalized for you';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-primary-600" />
                <h1 className="text-xl font-bold text-gray-900">
                  Your AI Recommendations
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>User {userId}</span>
              </div>
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title="Refresh recommendations"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Info Bar */}
      {userInfo && (
        <div className="bg-primary-50 border-b border-primary-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-sm text-primary-600 font-medium">
                    Shopping Profile
                  </p>
                  <p className="text-xs text-primary-500">
                    {userInfo.total_purchases} purchases • {userInfo.preferred_categories.length} favorite categories
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary-600 font-medium">
                    Average Rating Given
                  </p>
                  <p className="text-lg font-bold text-primary-700">
                    ⭐ {userInfo.avg_rating}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {userInfo.preferred_categories.slice(0, 3).map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-primary-700 text-xs font-medium rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search for products..."
              className="input-field pl-10 text-lg"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.map((product, index) => (
                <ProductCard
                  key={`search-${index}`}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          </section>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'recommendations'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Recommended for You</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'trending'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Top Rated</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recommended for You
              </h2>
              <p className="text-gray-600">
                Personalized recommendations based on your shopping history and preferences
              </p>
            </div>
            
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((product, index) => (
                  <ProductCard
                    key={`rec-${index}`}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recommendations available yet</p>
              </div>
            )}
          </section>
        )}

        {/* Top Rated Tab */}
        {activeTab === 'trending' && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Top Rated Products
              </h2>
              <p className="text-gray-600">
                Highest rated products across all categories
              </p>
            </div>
            
            {topRated.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topRated.map((product, index) => (
                  <ProductCard
                    key={`top-${index}`}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No top rated products available</p>
              </div>
            )}
          </section>
        )}
        
        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={showProductModal}
          onClose={handleCloseProductModal}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      </main>
    </div>
  );
};

export default RecommendationDashboard;
