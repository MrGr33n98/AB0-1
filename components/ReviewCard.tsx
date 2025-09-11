'use client';

import { motion } from 'framer-motion';
import { Star, ThumbsUp, User } from 'lucide-react';
import { Review } from '@/lib/api';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export default function ReviewCard({ review, className = "" }: ReviewCardProps) {
  // Mock data for demo
  const mockData = {
    userName: 'João Silva',
    userAvatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face`,
    date: '15 de Janeiro, 2025',
    productName: 'Painel Solar Pro 500W',
    helpful: Math.floor(Math.random() * 20) + 5,
    verified: true,
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={mockData.userAvatar}
            alt={mockData.userName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info & Rating */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">{mockData.userName}</h4>
              {mockData.verified && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 ml-1">Verificado</span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500">{mockData.date}</span>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {review.rating}/5
            </span>
          </div>

          {/* Product Name */}
          <p className="text-sm text-gray-600">
            Para: <span className="font-medium text-gray-900">{mockData.productName}</span>
          </p>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {review.comment}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm">Útil ({mockData.helpful})</span>
        </button>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <button className="hover:text-gray-700 transition-colors">
            Responder
          </button>
          <button className="hover:text-gray-700 transition-colors">
            Compartilhar
          </button>
        </div>
      </div>
    </motion.div>
  );
}