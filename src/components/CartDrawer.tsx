import React from 'react';
import { X, Trash2, ShoppingBag, Send, Phone, MessageSquare, Clipboard, Check, ChevronRight, AlertTriangle } from 'lucide-react';
import { CartItem, Language, Order } from '../types';
import { translations, ETHIOPIAN_CITIES } from '../services/localization';
import { useToast } from './Toast';

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
  const { showToast } = useToast();

  // Checkout form fields state
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerCity, setCustomerCity] = React.useState('');
  const [orderNotes, setOrderNotes] = React.useState('');
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [submittedChannel, setSubmittedChannel] = React.useState<'telegram' | 'whatsapp' | 'phone' | null>(null);
  const [formattedMessage, setFormattedMessage] = React.useState('');
  const [isCopied, setIsCopied] = React.useState(false);
  const [redirectLink, setRedirectLink] = React.useState('');

  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Generate beautiful preformatted text for Telegram/WhatsApp
  const generateOrderMessageText = (name: string, phone: string, notes: string) => {
    let msg = `🌟 *NEW ORDER FROM ETHIOSHEIN* 🌟\n`;
    msg += `----------------------------------\n`;
    msg += `👤 *Customer:* ${name}\n`;
    msg += `📞 *Phone:* ${phone}\n\n`;
    msg += `🛍️ *Items Ordered:*\n`;
    
    cartItems.forEach((item, index) => {
      msg += `${index + 1}. *${item.product.name}* (Size: ${item.selectedSize}, Color: ${item.selectedColor}) x${item.quantity} — ${(item.product.price * item.quantity).toLocaleString()} ETB\n`;
    });

    msg += `----------------------------------\n`;
    msg += `💰 *Subtotal Price:* ${cartTotal.toLocaleString()} ETB\n`;
    if (notes.trim()) {
      msg += `📝 *Special Notes:* ${notes}\n`;
    }
    msg += `\nContact Info:\nTelegram: @yared_abegaz | WhatsApp: +15714749554 | Call: 0995967804\n`;
    msg += `Thank you for shopping with EthioShein!`;
    return msg;
  };

  const handleFormSubmit = (channel: 'telegram' | 'whatsapp' | 'phone') => {
    if (!customerName.trim() || !customerPhone.trim()) {
      const errorMsg = currentLanguage === 'en' 
        ? 'Please fill out all required fields.' 
        : 'እባክዎን ሁሉንም አስፈላጊ መረጃዎችን ያስገቡ።';
      setCheckoutError(errorMsg);
      showToast(errorMsg, 'error', currentLanguage === 'en' ? 'Missing Information' : 'ያልተሟላ መረጃ');
      return;
    }

    setCheckoutError(null);
    const message = generateOrderMessageText(customerName, customerPhone, orderNotes);
    setFormattedMessage(message);
    setSubmittedChannel(channel);

    // Prepare redirection URLs
    let link = '';
    const encodedText = encodeURIComponent(message);
    
    if (channel === 'telegram') {
      // Direct Telegram link to @yared_abegaz
      link = `https://t.me/yared_abegaz?text=${encodedText}`;
    } else if (channel === 'whatsapp') {
      // Direct WhatsApp link to +15714749554
      link = `https://wa.me/15714749554?text=${encodedText}`;
    } else {
      // Direct call protocol to 0995967804
      link = `tel:0995967804`;
    }

    setRedirectLink(link);
    setFormSubmitted(true);

    // Call checkout submission to parent context to save order log
    onCheckoutSubmit(customerName, customerPhone, customerCity || 'N/A', orderNotes, channel);
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
        <div className="pointer-events-auto w-screen max-w-md transform bg-ivory border-l border-ivory-dark shadow-2xl transition-all duration-300 flex flex-col h-full animate-slideLeft text-espresso">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-ivory-dark flex items-center justify-between bg-white/50">
            <h2 className="text-lg font-fraunces font-bold text-espresso flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-espresso" />
              <span>{t('nav.cart')}</span>
              <span className="font-mono text-xs bg-espresso text-ivory px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-espresso-soft hover:text-espresso hover:bg-ivory-dark/30 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Body Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {formSubmitted ? (
              /* ORDER REDIRECT CONFIRMATION MODAL STATE */
              <div className="space-y-6 text-center py-6 animate-scaleUp" id="order-success-screen">
                <div className="w-16 h-16 bg-forest/10 text-forest rounded-full flex items-center justify-center mx-auto shadow-xs border border-forest/20">
                  <Check className="w-8 h-8 text-forest" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-fraunces font-bold text-espresso">
                    {currentLanguage === 'en' ? 'Inquiry Processed!' : 'ትዕዛዝዎ ተመዝግቧል!'}
                  </h3>
                  <p className="text-xs text-espresso-soft px-4">
                    {t('cart.successMsg')}
                  </p>
                </div>

                {/* Text Message Preview */}
                <div className="bg-white border border-ivory-dark rounded-2xl p-4 text-left space-y-3 relative shadow-xs">
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold text-espresso-soft uppercase tracking-widest bg-ivory border border-ivory-dark px-2 py-0.5 rounded-md">
                    Order Text
                  </span>
                  <pre className="text-xs font-mono text-espresso whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto select-all">
                    {formattedMessage}
                  </pre>
                  
                  {/* Copy to Clipboard */}
                  <button
                    onClick={copyToClipboard}
                    className="w-full bg-ivory border border-ivory-dark hover:border-espresso text-espresso font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-forest" />
                        <span className="text-forest font-bold">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-4 h-4 text-espresso-soft" />
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
                      className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                      id="telegram-redirect-cta"
                    >
                      <Send className="w-4 h-4 text-white" />
                      <span>Open Telegram (@yared_abegaz)</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}

                  {submittedChannel === 'whatsapp' && (
                    <a
                      href={redirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-forest hover:bg-[#2e452d] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                      id="whatsapp-redirect-cta"
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                      <span>Open WhatsApp (+15714749554)</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}

                  {submittedChannel === 'phone' && (
                    <a
                      href={redirectLink}
                      className="w-full bg-espresso hover:bg-espresso-soft text-ivory font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                      id="phone-redirect-cta"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Dial 0995967804 Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={handleResetAndClose}
                    className="w-full bg-white hover:bg-ivory-dark/30 text-espresso border border-ivory-dark font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Close & Keep Shopping
                  </button>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              /* CART EMPTY STATE */
              <div className="text-center py-16 space-y-4" id="cart-empty-screen">
                <div className="w-16 h-16 bg-white border border-ivory-dark rounded-full flex items-center justify-center mx-auto shadow-xs text-espresso-soft">
                  <ShoppingBag className="w-8 h-8 text-espresso-soft" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-espresso text-sm">{t('cart.empty')}</p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-espresso hover:bg-terracotta-dark text-ivory font-bold text-xs px-5 py-2.5 rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              /* CART WITH ITEMS STATE */
              <div className="space-y-6" id="cart-items-screen">
                {/* List of Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div 
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="flex items-center space-x-4 border-b border-ivory-dark pb-4"
                      id={`cart-item-${item.product.id}`}
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-white border border-ivory-dark shrink-0">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>

                      {/* Info & Adjusters */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-bold text-espresso line-clamp-1">{item.product.name}</h4>
                        <p className="text-[10px] text-espresso-soft font-semibold uppercase tracking-wider">
                          {t('product.size')}: <span className="text-espresso">{item.selectedSize}</span> | {t('product.color')}: <span className="text-espresso">{item.selectedColor}</span>
                        </p>
                        
                        <div className="flex items-center justify-between pt-1">
                          {/* Quantity Incrementor */}
                          <div className="flex items-center border border-ivory-dark rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                              className="px-2 py-0.5 hover:bg-ivory text-espresso font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 font-mono text-xs font-bold text-espresso bg-ivory">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                              className="px-2 py-0.5 hover:bg-ivory text-espresso font-bold text-xs"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-sm font-mono font-bold text-terracotta">
                            {(item.product.price * item.quantity).toLocaleString()} {t('product.price')}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)}
                        className="p-1 text-espresso-soft hover:text-terracotta transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subtotal summary */}
                <div className="bg-white rounded-2xl p-4 border border-ivory-dark space-y-2 shadow-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-espresso-soft font-bold uppercase tracking-widest">{t('cart.total')}</span>
                    <span className="text-xl font-mono font-black text-terracotta">
                      {cartTotal.toLocaleString()} {t('product.price')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-forest font-semibold bg-forest/10 border border-forest/20 px-2.5 py-1 rounded-md">
                    <span>Payment Method:</span>
                    <span>Direct Call / Messaging Checkout</span>
                  </div>
                </div>

                {/* Localized Shopping Checkout Form */}
                <div className="border-t border-ivory-dark pt-6 space-y-4" id="checkout-form-container">
                  <div className="space-y-1">
                    <h3 className="text-sm font-fraunces font-bold text-espresso uppercase tracking-wider">{t('cart.checkoutHeader')}</h3>
                    <p className="text-[11px] text-espresso-soft leading-normal">
                      {t('cart.checkoutSub')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Customer Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-espresso flex items-center justify-between">
                        <span>{t('cart.customerName')} *</span>
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (checkoutError) setCheckoutError(null);
                        }}
                        placeholder="e.g. Yordanos Bekele"
                        className="w-full bg-white border border-ivory-dark rounded-xl px-3 py-2 text-sm text-espresso focus:outline-hidden focus:ring-1 focus:ring-terracotta focus:border-terracotta"
                        required
                        id="form-customer-name"
                      />
                    </div>

                    {/* Customer Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-espresso">
                        {t('cart.customerPhone')} *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (checkoutError) setCheckoutError(null);
                        }}
                        placeholder="e.g. 0911223344"
                        className="w-full bg-white border border-ivory-dark rounded-xl px-3 py-2 text-sm text-espresso focus:outline-hidden focus:ring-1 focus:ring-terracotta focus:border-terracotta"
                        required
                        id="form-customer-phone"
                      />
                    </div>

                    {/* Special Notes */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-espresso">
                        {t('cart.orderNotes')}
                      </label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        rows={2}
                        placeholder="Specify custom sizes, woven patterns, or delivery timelines..."
                        className="w-full bg-white border border-ivory-dark rounded-xl px-3 py-2 text-sm text-espresso focus:outline-hidden focus:ring-1 focus:ring-terracotta focus:border-terracotta"
                        id="form-customer-notes"
                      ></textarea>
                    </div>
                  </div>

                  {/* Inline Error Banner */}
                  {checkoutError && (
                    <div className="p-3 bg-terracotta/10 border border-terracotta/30 rounded-2xl flex items-center space-x-2 text-terracotta-dark animate-fadeIn" id="cart-checkout-error-banner">
                      <AlertTriangle className="w-4 h-4 text-terracotta shrink-0" />
                      <span className="text-xs font-bold leading-normal">{checkoutError}</span>
                    </div>
                  )}

                  {/* Submit dispatch triggers */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleFormSubmit('telegram')}
                      className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition-all"
                      id="checkout-telegram-button"
                    >
                      <Send className="w-4 h-4 fill-white text-[#0088cc]" />
                      <span>{t('cart.sendTelegram')}</span>
                    </button>

                    <button
                      onClick={() => handleFormSubmit('whatsapp')}
                      className="w-full bg-forest hover:bg-[#2e452d] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition-all"
                      id="checkout-whatsapp-button"
                    >
                      <MessageSquare className="w-4 h-4 fill-white text-forest" />
                      <span>{t('cart.sendWhatsApp')}</span>
                    </button>

                    <button
                      onClick={() => handleFormSubmit('phone')}
                      className="w-full bg-espresso hover:bg-espresso-soft text-ivory font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition-all"
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
