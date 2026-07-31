import React from 'react';
import { Eye, ShoppingCart, MessageCircle, Star, AlertTriangle } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../services/localization';

interface ProductCardProps {
  key?: string;
  product: Product;
  currentLanguage: Language;
  onQuickView: (prod: Product) => void;
  onAddToCart: (prod: Product, size: string, color: string) => void;
  onInstantOrder: (prod: Product, channel: 'telegram' | 'whatsapp') => void;
}

export default function ProductCard({
  product,
  currentLanguage,
  onQuickView,
  onAddToCart,
  onInstantOrder
}: ProductCardProps) {
  const t = (key: string) => translations[currentLanguage][key] || key;

  // Calculate discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const isLowStock = product.inventory > 0 && product.inventory <= 4;
  const isOutOfStock = product.inventory === 0;

  return (
    <div 
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-3/4 bg-gray-50 overflow-hidden">
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-10 flex items-center justify-center">
            <span className="bg-white text-black text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-widest">
              {t('product.outOfStock')}
            </span>
          </div>
        )}

        {/* Promo Badge */}
        {discountPercent > 0 && !isOutOfStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-md z-10">
            -{discountPercent}%
          </div>
        )}

        {/* Low Stock Badge */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-md z-10 flex items-center space-x-1 shadow-xs">
            <AlertTriangle className="w-3 h-3 text-black" />
            <span>{t('product.lowStock')}</span>
          </div>
        )}

        {/* Image Component */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          id={`product-card-image-${product.id}`}
        />

        {/* Hover quick-actions overlay */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2 z-10">
            <button
              onClick={() => onQuickView(product)}
              className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer shadow-lg"
              title={t('product.quickView')}
              id={`quickview-btn-${product.id}`}
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const defaultSize = product.sizes[0] || 'One Size';
                const defaultColor = product.colors[0] || 'Standard';
                onAddToCart(product, defaultSize, defaultColor);
              }}
              className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer shadow-lg delay-75"
              title={t('product.addToCart')}
              id={`addtocart-btn-overlay-${product.id}`}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Stars */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              {product.brand}
            </span>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star className="w-3 h-3 fill-yellow-400" />
              <span className="text-xs font-bold text-gray-700">{product.rating}</span>
              <span className="text-[10px] text-gray-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-sans font-bold text-gray-900 group-hover:text-black line-clamp-1 text-sm sm:text-base mt-1">
            {product.name}
          </h3>

          {/* Price Container */}
          <div className="flex items-baseline space-x-2 mt-1.5">
            <span className="text-base sm:text-lg font-mono font-black text-black">
              {product.price.toLocaleString()} {t('product.price')}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm font-mono text-gray-400 line-through">
                {product.originalPrice.toLocaleString()} {t('product.price')}
              </span>
            )}
          </div>

          {/* Sizes Inline Preview */}
          <div className="mt-2.5 flex items-center space-x-1 overflow-hidden">
            <span className="text-[10px] text-gray-400 uppercase font-semibold">{t('product.size')}:</span>
            <div className="flex space-x-1 overflow-x-auto scrollbar-none">
              {product.sizes.map(size => (
                <span 
                  key={size} 
                  className="text-[9px] font-bold border border-gray-200 bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded-sm shrink-0"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="pt-2 border-t border-gray-50 space-y-1.5 mt-auto">
          {/* Quick Telegram checkout */}
          {!isOutOfStock ? (
            <button
              onClick={() => onInstantOrder(product, 'telegram')}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              id={`quick-telegram-${product.id}`}
            >
              <MessageCircle className="w-4 h-4 fill-white text-sky-500" />
              <span>{t('product.orderTelegram')}</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-100 text-gray-400 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 cursor-not-allowed"
              id={`out-of-stock-disabled-${product.id}`}
            >
              <span>{t('product.outOfStock')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
