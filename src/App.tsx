import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import SEOContent from './components/SEOContent';
import LoginModal from './components/LoginModal';
import { 
  getStoredProducts, saveStoredProducts, 
  getStoredCategories, saveStoredCategories, 
  getStoredOrders, saveStoredOrders 
} from './services/db';
import { translations } from './services/localization';
import { Product, Category, Order, CartItem, Language, AdminUser } from './types';
import { ShoppingBag, ChevronRight, Sparkles, Filter, X } from 'lucide-react';

export default function App() {
  // 1. App Configuration & Lang State
  const [currentLanguage, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('ethioshein_lang_v1');
    return (stored === 'am' || stored === 'en') ? stored : 'en';
  });

  useEffect(() => {
    localStorage.setItem('ethioshein_lang_v1', currentLanguage);
  }, [currentLanguage]);

  const t = (key: string) => translations[currentLanguage][key] || key;

  // 2. Database/Local Persistence States
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());

  // 3. Navigation & Filtering States
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('ethioshein_admin_user_v1');
    return stored ? JSON.parse(stored) : null;
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('ethioshein_admin_user_v1', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('ethioshein_admin_user_v1');
      setIsAdminMode(false);
    }
  }, [adminUser]);

  // 4. Cart State (with persistent loading)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('ethioshein_cart_items_v1');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('ethioshein_cart_items_v1', JSON.stringify(cartItems));
  }, [cartItems]);

  // 5. Interactive UI drawers/modals state
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // --- CATALOG CRUD ACTIONS ---
  const handleAddProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    if (!adminUser || adminUser.email.toLowerCase() !== 'yared.abegaz@gmail.com') {
      alert("Unauthorized: Only yared.abegaz@gmail.com can make modifications.");
      return;
    }
    const productToAdd: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [productToAdd, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    if (!adminUser || adminUser.email.toLowerCase() !== 'yared.abegaz@gmail.com') {
      alert("Unauthorized: Only yared.abegaz@gmail.com can make modifications.");
      return;
    }
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    if (!adminUser || adminUser.email.toLowerCase() !== 'yared.abegaz@gmail.com') {
      alert("Unauthorized: Only yared.abegaz@gmail.com can make modifications.");
      return;
    }
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveStoredProducts(updated);
  };

  // --- CATEGORIES CRUD ACTIONS ---
  const handleAddCategory = (newCat: Omit<Category, 'id' | 'slug'>) => {
    if (!adminUser || adminUser.email.toLowerCase() !== 'yared.abegaz@gmail.com') {
      alert("Unauthorized: Only yared.abegaz@gmail.com can make modifications.");
      return;
    }
    const categoryToAdd: Category = {
      ...newCat,
      id: `cat-${Date.now()}`,
      slug: newCat.name.toLowerCase().replace(/\s+/g, '-')
    };
    const updated = [...categories, categoryToAdd];
    setCategories(updated);
    saveStoredCategories(updated);
  };

  const handleDeleteCategory = (id: string) => {
    if (!adminUser || adminUser.email.toLowerCase() !== 'yared.abegaz@gmail.com') {
      alert("Unauthorized: Only yared.abegaz@gmail.com can make modifications.");
      return;
    }
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    saveStoredCategories(updated);
  };

  // --- ORDERS / INQUIRIES ACTIONS ---
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    if (!adminUser || adminUser.email.toLowerCase() !== 'yared.abegaz@gmail.com') {
      alert("Unauthorized: Only yared.abegaz@gmail.com can make modifications.");
      return;
    }
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    saveStoredOrders(updated);
  };

  const handleDeleteOrder = (id: string) => {
    if (!adminUser || adminUser.email.toLowerCase() !== 'yared.abegaz@gmail.com') {
      alert("Unauthorized: Only yared.abegaz@gmail.com can make modifications.");
      return;
    }
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    saveStoredOrders(updated);
  };

  // --- SHOPPING CART TRANSITIONS ---
  const handleAddToCart = (product: Product, size: string, color: string, quantity: number = 1) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor === color
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, size, color);
      return;
    }
    setCartItems(prev => prev.map(
      item => (item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
        ? { ...item, quantity }
        : item
    ));
  };

  const handleRemoveCartItem = (productId: string, size: string, color: string) => {
    setCartItems(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  // --- LOCALIZED DISPATCH SUBMISSION & STOCK DEDUCTION ---
  const handleCheckoutSubmit = (
    customerName: string,
    customerPhone: string,
    customerCity: string,
    notes: string,
    channel: 'telegram' | 'whatsapp' | 'phone'
  ) => {
    const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    // 1. Build new order log
    const newOrder: Order = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      customerCity,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity
      })),
      totalAmount,
      date: new Date().toISOString(),
      status: 'pending',
      channel,
      notes: notes.trim() ? notes : undefined
    };

    // 2. Append order log
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);

    // 3. Deduct product inventory count automatically
    const updatedProducts = products.map(p => {
      // Accumulate all quantities purchased of this specific product across different sizes/colors
      const quantityPurchased = cartItems
        .filter(item => item.product.id === p.id)
        .reduce((sum, item) => sum + item.quantity, 0);

      if (quantityPurchased > 0) {
        return {
          ...p,
          inventory: Math.max(0, p.inventory - quantityPurchased)
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);

    // 4. Cart remains populated with items so the drawer can show redirection panel.
    // However, on reset or closing of the redirection panel (inside CartDrawer),
    // the cart gets officially cleared from both state and storage.
  };

  // Reset/Empty cart helper called when the user finishes viewing success redirection screen
  const handleClearCartAfterRedirection = (
    customerName: string,
    customerPhone: string,
    customerCity: string,
    notes: string,
    channel: 'telegram' | 'whatsapp' | 'phone'
  ) => {
    handleCheckoutSubmit(customerName, customerPhone, customerCity, notes, channel);
    setCartItems([]);
    localStorage.removeItem('ethioshein_cart_items_v1');
  };

  // --- INSTANT BUY ACTION FROM LIST OR DETAILS MODAL ---
  const handleInstantBuyOrder = (
    product: Product,
    channel: 'telegram' | 'whatsapp' | 'phone',
    selectedSize: string = 'M',
    selectedColor: string = 'Standard',
    quantity: number = 1
  ) => {
    // 1. Temporarily place item inside cart
    setCartItems([{ product, selectedSize, selectedColor, quantity }]);
    // 2. Open cart drawer so user can fill checkout form instantly
    setCartDrawerOpen(true);
    // 3. Close product detail modal for cleaner flow
    setActiveProduct(null);
  };

  // --- FILTERED CATALOG DATA ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory;
      
      // Search query filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900" id="ethioshein-root">
      
      {/* 1. Universal Responsive Header */}
      <Header
        currentLanguage={currentLanguage}
        setLanguage={setLanguage}
        cartCount={cartCount}
        onCartToggle={() => setCartDrawerOpen(!cartDrawerOpen)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        adminUser={adminUser}
        onLoginClick={() => setLoginModalOpen(true)}
        onLogout={() => setAdminUser(null)}
      />

      {/* 2. Main Workstage */}
      <main className="flex-1">
        {isAdminMode ? (
          /* --- BACK OFFICE ADMINISTRATIVE DASHBOARD VIEW --- */
          <div className="animate-fadeIn">
            <AdminDashboard
              products={products}
              categories={categories}
              orders={orders}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
            />
          </div>
        ) : (
          /* --- CONSUMER SHOPPING PORTAL VIEW --- */
          <div className="space-y-12">
            
            {/* Elegant Promo Banner Hero Slider (only visible on root state) */}
            {activeCategory === 'all' && !searchQuery && (
              <Hero
                currentLanguage={currentLanguage}
                onExploreClick={() => {
                  const el = document.getElementById('catalog-grid-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            )}

            {/* Catalog Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="catalog-grid-section">
              <div className="space-y-6">
                
                {/* Search result summary / headers */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-sans font-black text-black">
                      {activeCategory === 'all' 
                        ? (currentLanguage === 'en' ? 'Latest Collections' : 'አዳዲስ ስብስቦች')
                        : categories.find(c => c.id === activeCategory)?.name}
                    </h2>
                    {searchQuery && (
                      <p className="text-xs text-gray-500 mt-1">
                        Showing {filteredProducts.length} results for "<strong className="text-black">{searchQuery}</strong>"
                      </p>
                    )}
                  </div>

                  {/* Top categories select dropdown for quick filter on mobile */}
                  <div className="flex items-center space-x-2 md:hidden">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700"
                    >
                      <option value="all">{currentLanguage === 'en' ? 'All Fashion' : 'ሁሉንም ፋሽን'}</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Main Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl p-8 max-w-lg mx-auto" id="no-results-screen">
                    <p className="font-bold text-gray-900 text-sm mb-1">No items found matching your filters.</p>
                    <p className="text-xs text-gray-400 mb-4">Try searching different keywords or selecting other categories.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                      className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" id="products-catalog-grid">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        currentLanguage={currentLanguage}
                        onQuickView={(prod: Product) => setActiveProduct(prod)}
                        onAddToCart={(prod: Product, size: string, color: string) => handleAddToCart(prod, size, color, 1)}
                        onInstantOrder={(prod: Product, channel: 'telegram' | 'whatsapp') => {
                          const defSize = prod.sizes[0] || 'M';
                          const defColor = prod.colors[0] || 'Standard';
                          handleInstantBuyOrder(prod, channel, defSize, defColor, 1);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Crawlable, SEO Rich Localized Content with FAQs */}
            <SEOContent currentLanguage={currentLanguage} />

          </div>
        )}
      </main>

      {/* 3. Universal Footer */}
      <footer className="bg-black text-gray-400 py-12 border-t border-gray-850" id="universal-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="font-sans font-black text-xl text-white tracking-widest">
              ETHIO<span className="text-gray-400 font-normal">SHEIN</span>
            </span>
            <p className="text-xs leading-relaxed">
              Premium fashion marketplace inspired by global fast fashion, custom-tailored for the modern lifestyle of Ethiopia. Secure shopping with cash-on-delivery.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Regional Hubs</h4>
            <ul className="text-xs space-y-2">
              <li>Addis Ababa (Bole, Shiro Meda)</li>
              <li>Hawassa City Center</li>
              <li>Bahir Dar (Lake Tana)</li>
              <li>Adama & Dire Dawa</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Helpful Links</h4>
            <ul className="text-xs space-y-2">
              <li><button onClick={() => { if (adminUser && adminUser.email.toLowerCase() === 'yared.abegaz@gmail.com') { setIsAdminMode(true); } else { setLoginModalOpen(true); } }} className="hover:text-white cursor-pointer text-left">Admin Portal</button></li>
              <li><button onClick={() => { setActiveCategory('all'); setIsAdminMode(false); }} className="hover:text-white cursor-pointer text-left">Latest Catalog</button></li>
              <li><button onClick={() => setLanguage(currentLanguage === 'en' ? 'am' : 'en')} className="hover:text-white cursor-pointer text-left">አማርኛ / Switch Language</button></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Customer Care</h4>
            <p className="text-xs">Have questions or want to order directly? Chat with us now:</p>
            <div className="flex space-x-2">
              <a 
                href="https://t.me/EthioSheinSupport" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
              >
                <span>Telegram Chat</span>
              </a>
              <a 
                href="tel:+251911223344" 
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
              >
                <span>Call Us</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 mt-8 pt-6 text-center text-[10px] text-gray-500">
          <p>&copy; {new Date().getFullYear()} EthioShein Fashion Marketplace. All rights reserved. Locally crafted in Addis Ababa, Ethiopia.</p>
        </div>
      </footer>

      {/* 4. Quick View Product Detail Modal Overlay */}
      {activeProduct && (
        <ProductDetailModal
          product={activeProduct}
          currentLanguage={currentLanguage}
          onClose={() => setActiveProduct(null)}
          onAddToCart={(prod, size, color, qty) => handleAddToCart(prod, size, color, qty)}
          onInstantOrder={(prod, channel, size, color, qty) => handleInstantBuyOrder(prod, channel, size, color, qty)}
        />
      )}

      {/* 5. Cart Slideover Drawer with Localization */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        currentLanguage={currentLanguage}
        onCheckoutSubmit={handleClearCartAfterRedirection}
      />

      {/* 6. Admin Authentication Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setAdminUser(user);
          setIsAdminMode(true);
        }}
        currentLanguage={currentLanguage}
      />

    </div>
  );
}
