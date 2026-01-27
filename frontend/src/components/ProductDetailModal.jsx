import React from 'react';
import { X, Star, Heart, ShoppingCart, Truck, Shield, RefreshCw } from 'lucide-react';

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, onAddToWishlist }) => {
  if (!isOpen || !product) return null;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-5 h-5 fill-yellow-200 text-yellow-400" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }
    
    return stars;
  };

  const formatPrice = () => {
    const price = Math.floor(Math.random() * 900) + 10;
    return `$${price}`;
  };

  const getRecommendationExplanation = (type) => {
    const explanations = {
      'collaborative': 'Users with similar preferences also liked this',
      'content based': 'Similar to items you\'ve previously viewed',
      'category based': 'From your favorite categories',
      'svd': 'Advanced AI pattern matching',
      'top rated': 'Highest rated by customers'
    };
    return explanations[type] || 'Personalized for you';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={product.image_url || 'https://via.placeholder.com/600x600?text=Product'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=Product';
                  }}
                />
              </div>
              
              {/* Thumbnail images */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/150x150?text=Product'}
                      alt={`${product.name} view ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Title and Brand */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600 capitalize">{product.brand}</p>
                <p className="text-sm text-gray-500 capitalize">{product.category}</p>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-lg font-medium text-gray-900">{product.rating}</span>
                <span className="text-gray-600">({product.review_count} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-primary-600">{formatPrice()}</span>
                <span className="text-lg text-gray-500 line-through">
                  ${Math.floor(Math.random() * 500) + 100}
                </span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                  {Math.floor(Math.random() * 30) + 10}% OFF
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'This is a high-quality product that offers excellent value and performance. Made with premium materials and designed to meet your needs perfectly.'}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-600">Premium quality materials</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-600">Satisfaction guaranteed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-600">Fast and reliable shipping</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-600">Excellent customer reviews</span>
                  </li>
                </ul>
              </div>

              {/* Recommendation Info */}
              {product.recommendation_type && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-primary-900 mb-1">Why we recommend this</h3>
                  <p className="text-sm text-primary-700">
                    {getRecommendationExplanation(product.recommendation_type)}
                  </p>
                  {product.confidence && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-primary-600">
                        <span>Match Score</span>
                        <span>{Math.round(product.confidence * 100)}%</span>
                      </div>
                      <div className="w-full bg-primary-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${product.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onAddToWishlist(product)}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Save for Later</span>
                  </button>
                  
                  <button className="btn-secondary flex items-center justify-center space-x-2">
                    <RefreshCw className="w-5 h-5" />
                    <span>Compare</span>
                  </button>
                </div>
              </div>

              {/* Shipping & Returns */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <Truck className="w-6 h-6 text-gray-600 mx-auto" />
                    <p className="text-xs text-gray-600">Free Shipping</p>
                    <p className="text-xs font-medium">On orders $50+</p>
                  </div>
                  <div className="space-y-2">
                    <Shield className="w-6 h-6 text-gray-600 mx-auto" />
                    <p className="text-xs text-gray-600">Secure Payment</p>
                    <p className="text-xs font-medium">100% Protected</p>
                  </div>
                  <div className="space-y-2">
                    <RefreshCw className="w-6 h-6 text-gray-600 mx-auto" />
                    <p className="text-xs text-gray-600">Easy Returns</p>
                    <p className="text-xs font-medium">30-Day Policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
