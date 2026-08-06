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
      className="group bg-white rounded-2xl border border-ivory-dark overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-3/4 bg-ivory-dark/20 overflow-hidden">
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-espresso/75 backdrop-blur-xs z-10 flex items-center justify-center">
            <span className="bg-ivory text-espresso text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-widest border border-ivory-dark">
              {t('product.outOfStock')}
            </span>
          </div>
        )}

        {/* Promo Badge */}
        {discountPercent > 0 && !isOutOfStock && (
          <div className="absolute top-3 left-3 bg-terracotta text-ivory text-xs font-black px-2.5 py-1 rounded-md z-10 shadow-xs">
            -{discountPercent}%
          </div>
        )}

        {/* Low Stock Badge */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 right-3 bg-ochre text-espresso text-[10px] font-bold px-2 py-1 rounded-md z-10 flex items-center space-x-1 shadow-xs border border-ivory-dark">
            <AlertTriangle className="w-3 h-3 text-espresso" />
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
          <div className="absolute inset-0 bg-espresso/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2 z-10">
            <button
              onClick={() => onQuickView(product)}
              className="bg-ivory text-espresso p-3 rounded-full hover:bg-espresso hover:text-ivory transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer shadow-md"
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
              className="bg-ivory text-espresso p-3 rounded-full hover:bg-espresso hover:text-ivory transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer shadow-md delay-75"
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
            <span className="text-[10px] font-bold text-espresso-soft uppercase tracking-widest block">
              {product.brand}
            </span>
            <div className="flex items-center space-x-1 text-ochre">
              <Star className="w-3.5 h-3.5 fill-ochre text-ochre" />
              <span className="text-xs font-bold text-espresso">{product.rating}</span>
              <span className="text-[10px] text-espresso-soft">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-sans font-bold text-espresso group-hover:text-terracotta-dark transition-colors line-clamp-1 text-sm sm:text-base mt-1">
            {product.name}
          </h3>

          {/* Price Container */}
          <div className="flex items-baseline space-x-2 mt-1.5">
            <span className="text-base sm:text-lg font-mono font-black text-terracotta">
              {product.price.toLocaleString()} {t('product.price')}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm font-mono text-espresso-soft line-through">
                {product.originalPrice.toLocaleString()} {t('product.price')}
              </span>
            )}
          </div>

          {/* Sizes Inline Preview */}
          <div className="mt-2.5 flex items-center space-x-1 overflow-hidden">
            <span className="text-[10px] text-espresso-soft uppercase font-bold">{t('product.size')}:</span>
            <div className="flex space-x-1 overflow-x-auto scrollbar-none">
              {product.sizes.map(size => (
                <span 
                  key={size} 
                  className="text-[9px] font-bold border border-ivory-dark bg-ivory text-espresso px-1.5 py-0.5 rounded-sm shrink-0"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="pt-2 border-t border-ivory-dark/40 space-y-1.5 mt-auto">
          {/* Quick Telegram / WhatsApp checkout */}
          {!isOutOfStock ? (
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onInstantOrder(product, 'telegram')}
                className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium text-[11px] py-2 px-2 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-xs"
                id={`quick-telegram-${product.id}`}
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-[#0088cc]" />
                <span className="truncate">Telegram</span>
              </button>
              <button
                onClick={() => onInstantOrder(product, 'whatsapp')}
                className="bg-forest hover:bg-[#2e452d] text-white font-medium text-[11px] py-2 px-2 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-xs"
                id={`quick-whatsapp-${product.id}`}
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-forest" />
                <span className="truncate">WhatsApp</span>
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-ivory-dark/40 text-espresso-soft font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 cursor-not-allowed border border-ivory-dark"
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
