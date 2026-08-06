import React from 'react';
import { X, Star, ShoppingCart, MessageCircle, Phone, Check, AlertCircle } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../services/localization';

interface ProductDetailModalProps {
  product: Product | null;
  currentLanguage: Language;
  onClose: () => void;
  onAddToCart: (prod: Product, size: string, color: string, quantity: number) => void;
  onInstantOrder: (prod: Product, channel: 'telegram' | 'whatsapp' | 'phone', selectedSize: string, selectedColor: string, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  currentLanguage,
  onClose,
  onAddToCart,
  onInstantOrder
}: ProductDetailModalProps) {
  const t = (key: string) => translations[currentLanguage][key] || key;

  const [activeImageIdx, setActiveImageIdx] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [addedFeedback, setAddedFeedback] = React.useState(false);

  // Pre-select first size and color
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'One Size');
      setSelectedColor(product.colors[0] || 'Standard');
      setQuantity(1);
      setActiveImageIdx(0);
      setAddedFeedback(false);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  };

  const isOutOfStock = product.inventory === 0;
  const isLowStock = product.inventory > 0 && product.inventory <= 4;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="product-detail-modal" role="dialog" aria-modal="true">
      {/* Dark overlay backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      {/* Modal Stage Container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-ivory text-left shadow-2xl transition-all my-8 w-full max-w-4xl flex flex-col md:flex-row border border-ivory-dark animate-scaleUp">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-ivory/80 hover:bg-ivory-dark text-espresso p-2 rounded-full border border-ivory-dark transition-all shadow-md cursor-pointer"
            id="close-modal-button"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Block: Image Gallery */}
          <div className="w-full md:w-1/2 p-6 bg-ivory-dark/20 flex flex-col justify-center border-r border-ivory-dark/50">
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-white border border-ivory-dark shadow-xs flex items-center justify-center">
              <img
                src={product.images[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                id="modal-main-image"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-espresso/70 flex items-center justify-center">
                  <span className="bg-ivory text-espresso text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest border border-ivory-dark">
                    {t('product.outOfStock')}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 mt-3 overflow-x-auto py-1 justify-center" id="thumbnail-strip">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIdx === idx ? 'border-terracotta scale-102 shadow-xs' : 'border-ivory-dark opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Block: Configuration Details */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between" id="modal-details-container">
            <div className="space-y-4">
              
              {/* Brand & Badge Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-espresso-soft uppercase tracking-widest">
                  {product.brand}
                </span>
                
                {/* Stars and Ratings */}
                <div className="flex items-center space-x-1 text-ochre">
                  <Star className="w-4 h-4 fill-ochre text-ochre" />
                  <span className="text-sm font-extrabold text-espresso">{product.rating}</span>
                  <span className="text-xs text-espresso-soft font-medium">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-fraunces font-extrabold text-espresso leading-tight">
                {product.name}
              </h2>

              {/* Pricing Display */}
              <div className="flex items-baseline space-x-3 bg-white/80 p-3.5 rounded-xl border border-ivory-dark">
                <span className="text-2xl font-mono font-black text-terracotta">
                  {product.price.toLocaleString()} {t('product.price')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm sm:text-base font-mono text-espresso-soft line-through">
                    {product.originalPrice.toLocaleString()} {t('product.price')}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-md ml-auto border border-terracotta/20">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Product Detailed Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-espresso-soft uppercase tracking-widest">{t('product.description')}</h4>
                <p className="text-xs sm:text-sm text-espresso-soft leading-relaxed max-h-32 overflow-y-auto pr-1">
                  {product.description}
                </p>
              </div>

              {/* Dynamic Inventory Status Indicator */}
              {isLowStock && (
                <div className="bg-ochre-soft/50 text-espresso border border-ochre p-2.5 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-terracotta shrink-0" />
                  <span>
                    <strong>{product.inventory} items remaining in stock!</strong> Order soon before it sells out.
                  </span>
                </div>
              )}

              {/* Selection Interactive Forms */}
              {!isOutOfStock && (
                <div className="space-y-3 pt-2">
                  
                  {/* Size Selector */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-espresso-soft uppercase tracking-widest">{t('product.size')}</span>
                      <span className="text-espresso font-bold">{selectedSize}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-10 h-10 px-3 rounded-lg text-xs font-bold border flex items-center justify-center transition-all cursor-pointer ${
                            selectedSize === size
                              ? 'bg-espresso text-ivory border-espresso scale-102 font-black shadow-xs'
                              : 'bg-white text-espresso border-ivory-dark hover:border-espresso'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-espresso-soft uppercase tracking-widest">{t('product.color')}</span>
                      <span className="text-espresso font-bold">{selectedColor}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`h-9 px-3.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            selectedColor === color
                              ? 'bg-espresso text-ivory border-espresso scale-102 font-black shadow-xs'
                              : 'bg-white text-espresso border-ivory-dark hover:border-espresso'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4 pt-1">
                    <span className="text-xs font-bold text-espresso-soft uppercase tracking-widest">Qty</span>
                    <div className="flex items-center border border-ivory-dark rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-3 py-1.5 hover:bg-ivory-dark/30 text-espresso font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 font-mono text-sm font-bold text-espresso bg-ivory">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(q => Math.min(product.inventory, q + 1))}
                        className="px-3 py-1.5 hover:bg-ivory-dark/30 text-espresso font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-espresso-soft">({product.inventory} available)</span>
                  </div>

                </div>
              )}

            </div>

            {/* Core checkout / order button trigger panel */}
            <div className="pt-6 border-t border-ivory-dark space-y-2 mt-6">
              {!isOutOfStock ? (
                <>
                  {/* Master Add to Cart */}
                  <button
                    onClick={handleAddToCartClick}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      addedFeedback 
                        ? 'bg-forest text-ivory shadow-md' 
                        : 'bg-espresso text-ivory hover:bg-terracotta-dark shadow-md transform hover:-translate-y-0.5'
                    }`}
                    id="add-to-cart-modal-action"
                  >
                    {addedFeedback ? (
                      <>
                        <Check className="w-4 h-4 text-ivory" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>{t('product.addToCart')}</span>
                      </>
                    )}
                  </button>

                  {/* Social checkouts */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onInstantOrder(product, 'telegram', selectedSize, selectedColor, quantity)}
                      className="bg-[#0088cc] hover:bg-[#0077b5] text-white py-2 px-1 rounded-xl text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer shadow-xs"
                      id="modal-order-telegram"
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-[#0088cc]" />
                      <span className="text-[10px] font-bold">Telegram</span>
                    </button>
                    
                    <button
                      onClick={() => onInstantOrder(product, 'whatsapp', selectedSize, selectedColor, quantity)}
                      className="bg-forest hover:bg-[#2e452d] text-white py-2 px-1 rounded-xl text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer shadow-xs"
                      id="modal-order-whatsapp"
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-forest" />
                      <span className="text-[10px] font-bold">WhatsApp</span>
                    </button>

                    <button
                      onClick={() => onInstantOrder(product, 'phone', selectedSize, selectedColor, quantity)}
                      className="bg-espresso hover:bg-espresso-soft text-ivory py-2 px-1 rounded-xl text-xs font-medium flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer shadow-xs"
                      id="modal-order-phone"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-[10px] font-bold">{t('product.callToOrder')}</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  disabled
                  className="w-full bg-ivory-dark/50 text-espresso-soft py-3 rounded-xl font-bold text-sm cursor-not-allowed border border-ivory-dark"
                >
                  {t('product.outOfStock')}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
