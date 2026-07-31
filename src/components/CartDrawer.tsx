import React from 'react';
import { X, Trash2, ShoppingBag, Send, Phone, MessageSquare, Clipboard, Check, ChevronRight } from 'lucide-react';
import { CartItem, Language, Order } from '../types';
import { translations, ETHIOPIAN_CITIES } from '../services/localization';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string, color: string) => void;
  currentLanguage: Language;
  onCheckoutSubmit: (
    customerName: string,
    customerPhone: string,
    customerCity: string,
    notes: string,
    channel: 'telegram' | 'whatsapp' | 'phone'
  ) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  currentLanguage,
  onCheckoutSubmit
}: CartDrawerProps) {
  const t = (key: string) => translations[currentLanguage][key] || key;

  // Checkout form fields state
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerCity, setCustomerCity] = React.useState('');
  const [orderNotes, setOrderNotes] = React.useState('');
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [submittedChannel, setSubmittedChannel] = React.useState<'telegram' | 'whatsapp' | 'phone' | null>(null);
  const [formattedMessage, setFormattedMessage] = React.useState('');
  const [isCopied, setIsCopied] = React.useState(false);
  const [redirectLink, setRedirectLink] = React.useState('');

  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Generate beautiful preformatted text for Telegram/WhatsApp
  const generateOrderMessageText = (name: string, phone: string, city: string, notes: string) => {
    let msg = `🌟 *NEW ORDER FROM ETHIOSHEIN* 🌟\n`;
    msg += `----------------------------------\n`;
    msg += `👤 *Customer:* ${name}\n`;
    msg += `📞 *Phone:* ${phone}\n`;
    msg += `📍 *Delivery City:* ${city}\n\n`;
    msg += `🛍️ *Items Ordered:*\n`;
    
    cartItems.forEach((item, index) => {
      msg += `${index + 1}. *${item.product.name}* (Size: ${item.selectedSize}, Color: ${item.selectedColor}) x${item.quantity} — ${(item.product.price * item.quantity).toLocaleString()} ETB\n`;
    });

    msg += `----------------------------------\n`;
    msg += `💰 *Subtotal Price:* ${cartTotal.toLocaleString()} ETB\n`;
    if (notes.trim()) {
      msg += `📝 *Special Notes:* ${notes}\n`;
    }
    msg += `\nThank you for shopping with EthioShein! Please send this message to finalize your delivery scheduling.`;
    return msg;
  };

  const handleFormSubmit = (channel: 'telegram' | 'whatsapp' | 'phone') => {
    if (!customerName.trim() || !customerPhone.trim() || !customerCity) {
      alert(currentLanguage === 'en' ? 'Please fill out all required fields.' : 'እባክዎን ሁሉንም አስፈላጊ መረጃዎችን ያስገቡ።');
      return;
    }

    const message = generateOrderMessageText(customerName, customerPhone, customerCity, orderNotes);
    setFormattedMessage(message);
    setSubmittedChannel(channel);

    // Prepare redirection URLs
    let link = '';
    const encodedText = encodeURIComponent(message);
    
    if (channel === 'telegram') {
      // Direct Telegram link
      // Use standard share URL which is extremely stable across mobile & desktop devices
      link = `https://t.me/share/url?url=${encodeURIComponent('https://ethioshein.com')}&text=${encodedText}`;
    } else if (channel === 'whatsapp') {
      // Direct WhatsApp link - using a placeholder Ethiopian customer care phone line
      // or standard wa.me API
      link = `https://wa.me/251911223344?text=${encodedText}`;
    } else {
      // Direct call protocol
      link = `tel:+251911223344`;
    }

    setRedirectLink(link);
    setFormSubmitted(true);

    // Call checkout submission to parent context to save order log
    onCheckoutSubmit(customerName, customerPhone, customerCity, orderNotes, channel);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setFormSubmitted(false);
    setSubmittedChannel(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerCity('');
    setOrderNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-container">
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 flex flex-col h-full animate-slideLeft">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-sans font-black text-black flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <span>{t('nav.cart')}</span>
              <span className="font-mono text-xs bg-black text-white px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Body Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {formSubmitted ? (
              /* ORDER REDIRECT CONFIRMATION MODAL STATE */
              <div className="space-y-6 text-center py-6 animate-scaleUp" id="order-success-screen">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-black">
                    {currentLanguage === 'en' ? 'Inquiry Processed!' : 'ትዕዛዝዎ ተመዝግቧል!'}
                  </h3>
                  <p className="text-xs text-gray-500 px-4">
                    {t('cart.successMsg')}
                  </p>
                </div>

                {/* Text Message Preview */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left space-y-3 relative">
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-100 px-2 py-0.5 rounded-md">
                    Order Text
                  </span>
                  <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto select-all">
                    {formattedMessage}
                  </pre>
                  
                  {/* Copy to Clipboard */}
                  <button
                    onClick={copyToClipboard}
                    className="w-full bg-white border border-gray-200 hover:border-black text-black font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-4 h-4" />
                        <span>Copy Order Text</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Call-to-Action dispatch buttons */}
                <div className="space-y-2.5 pt-4">
                  {submittedChannel === 'telegram' && (
                    <a
                      href={redirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                      id="telegram-redirect-cta"
                    >
                      <Send className="w-4 h-4 text-white" />
                      <span>Open Telegram & Paste</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}

                  {submittedChannel === 'whatsapp' && (
                    <a
                      href={redirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                      id="whatsapp-redirect-cta"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Open WhatsApp & Send</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}

                  {submittedChannel === 'phone' && (
                    <a
                      href={redirectLink}
                      className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                      id="phone-redirect-cta"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Dial Representative Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={handleResetAndClose}
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Close & Keep Shopping
                  </button>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              /* CART EMPTY STATE */
              <div className="text-center py-16 space-y-4" id="cart-empty-screen">
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto shadow-xs text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 text-sm">{t('cart.empty')}</p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              /* CART WITH ITEMS STATE */
              <div className="space-y-6" id="cart-items-screen">
                {/* List of Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div 
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="flex items-center space-x-4 border-b border-gray-100 pb-4"
                      id={`cart-item-${item.product.id}`}
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-150 shrink-0">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>

                      {/* Info & Adjusters */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.name}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          {t('product.size')}: <span className="text-gray-700">{item.selectedSize}</span> | {t('product.color')}: <span className="text-gray-700">{item.selectedColor}</span>
                        </p>
                        
                        <div className="flex items-center justify-between pt-1">
                          {/* Quantity Incrementor */}
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                              className="px-2 py-0.5 hover:bg-gray-50 text-gray-600 font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 font-mono text-xs font-bold text-black bg-gray-50">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                              className="px-2 py-0.5 hover:bg-gray-50 text-gray-600 font-bold text-xs"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-sm font-mono font-bold text-black">
                            {(item.product.price * item.quantity).toLocaleString()} {t('product.price')}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subtotal summary */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t('cart.total')}</span>
                    <span className="text-xl font-mono font-black text-black">
                      {cartTotal.toLocaleString()} {t('product.price')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md">
                    <span>Payment Method:</span>
                    <span>Direct Call / Messaging Checkout</span>
                  </div>
                </div>

                {/* Localized Shopping Checkout Form */}
                <div className="border-t border-gray-100 pt-6 space-y-4" id="checkout-form-container">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-black uppercase tracking-wider">{t('cart.checkoutHeader')}</h3>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      {t('cart.checkoutSub')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Customer Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                        <span>{t('cart.customerName')} *</span>
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Yordanos Bekele"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black focus:border-black"
                        required
                        id="form-customer-name"
                      />
                    </div>

                    {/* Customer Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">
                        {t('cart.customerPhone')} *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 0911223344"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black focus:border-black"
                        required
                        id="form-customer-phone"
                      />
                    </div>

                    {/* Customer Location City */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">
                        {t('cart.customerCity')} *
                      </label>
                      <select
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black focus:border-black"
                        required
                        id="form-customer-city"
                      >
                        <option value="">-- {t('cart.customerCityPlaceholder')} --</option>
                        {ETHIOPIAN_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Special Notes */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">
                        {t('cart.orderNotes')}
                      </label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        rows={2}
                        placeholder="Specify custom sizes, woven patterns, or delivery timelines..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-black focus:border-black"
                        id="form-customer-notes"
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit dispatch triggers */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleFormSubmit('telegram')}
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition-all"
                      id="checkout-telegram-button"
                    >
                      <Send className="w-4 h-4 fill-white text-sky-500" />
                      <span>{t('cart.sendTelegram')}</span>
                    </button>

                    <button
                      onClick={() => handleFormSubmit('whatsapp')}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition-all"
                      id="checkout-whatsapp-button"
                    >
                      <MessageSquare className="w-4 h-4 fill-white text-green-500" />
                      <span>{t('cart.sendWhatsApp')}</span>
                    </button>

                    <button
                      onClick={() => handleFormSubmit('phone')}
                      className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition-all"
                      id="checkout-phone-button"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{t('cart.sendCall')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
