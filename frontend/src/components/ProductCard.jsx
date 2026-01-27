import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onProductClick, showActions = true }) => {
  const handleCardClick = () => {
    onProductClick(product);
  };
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-200 text-yellow-400" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }
    
    return stars;
  };

  const formatPrice = () => {
    // Generate a random price for demonstration
    const price = Math.floor(Math.random() * 900) + 10;
    return `$${price}`;
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="relative">
        <img
          src={product.image_url || 'https://via.placeholder.com/300x300?text=Product'}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg mb-3"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Product';
          }}
        />
        {showActions && (
          <button
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Add to wishlist logic
            }}
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 capitalize">{product.category}</p>
        <p className="text-sm font-medium text-gray-800">{product.brand}</p>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.review_count})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice()}
          </span>
          {showActions && (
            <button
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart logic
              }}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {product.recommendation_type && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
              {product.recommendation_type.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
