import React from 'react';
import { ShoppingBag, Search, Globe, User, Shield, Menu, X } from 'lucide-react';
import { Language, AdminUser } from '../types';
import { translations } from '../services/localization';

interface HeaderProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  cartCount: number;
  onCartToggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  categories: { id: string; name: string }[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  adminUser: AdminUser | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({
  currentLanguage,
  setLanguage,
  cartCount,
  onCartToggle,
  searchQuery,
  setSearchQuery,
  isAdminMode,
  setIsAdminMode,
  categories,
  activeCategory,
  setActiveCategory,
  adminUser,
  onLoginClick,
  onLogout
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = (key: string) => translations[currentLanguage][key] || key;

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-md border-b border-ivory-dark shadow-xs" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => {
                setActiveCategory('all');
                setIsAdminMode(false);
              }}
              className="flex items-center space-x-2 group cursor-pointer"
              id="logo-button"
            >
              <div className="bg-espresso text-ivory p-2 rounded-md font-mono tracking-widest text-lg font-black group-hover:bg-terracotta transition-colors shadow-xs">
                ES
              </div>
              <span className="font-sans font-bold tracking-tight text-xl sm:text-2xl text-espresso">
                ETHIO<span className="text-terracotta font-medium">SHEIN</span>
              </span>
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/80 border border-ivory-dark rounded-full py-2 pl-4 pr-10 text-sm text-espresso placeholder-espresso-soft/60 focus:outline-hidden focus:ring-2 focus:ring-terracotta focus:border-terracotta focus:bg-white transition-all shadow-xs"
                id="search-input-desktop"
              />
              <div className="absolute right-3 top-2.5 text-espresso-soft">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Language Selector */}
            <button
              onClick={() => setLanguage(currentLanguage === 'en' ? 'am' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg hover:bg-ivory-dark/40 text-sm font-medium text-espresso transition-colors cursor-pointer"
              title="Switch Language / ቋንቋ ይቀይሩ"
              id="lang-toggle-button"
            >
              <Globe className="w-4 h-4 text-terracotta" />
              <span className="hidden sm:inline font-semibold">{currentLanguage === 'en' ? 'English' : 'አማርኛ'}</span>
              <span className="sm:hidden uppercase font-semibold">{currentLanguage}</span>
            </button>

            {/* Admin Portal Toggle */}
            <button
              onClick={() => {
                if (adminUser && adminUser.email.toLowerCase() === 'yared.abegaz@gmail.com') {
                  setIsAdminMode(!isAdminMode);
                } else {
                  onLoginClick();
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                isAdminMode 
                  ? 'bg-terracotta/15 text-terracotta-dark hover:bg-terracotta/25' 
                  : adminUser
                    ? 'bg-forest/15 text-forest hover:bg-forest/25'
                    : 'bg-ivory-dark/30 text-espresso hover:bg-ivory-dark/50'
              }`}
              id="admin-toggle-button"
            >
              <Shield className={`w-4 h-4 ${isAdminMode ? 'text-terracotta' : adminUser ? 'text-forest' : 'text-espresso-soft'}`} />
              <span className="hidden lg:inline">
                {isAdminMode 
                  ? t('admin.viewStore') 
                  : adminUser 
                    ? (currentLanguage === 'en' ? 'Admin Portal' : 'የአስተዳዳሪ ፖርታል') 
                    : t('nav.admin')}
              </span>
              <span className="lg:hidden">{isAdminMode ? 'Store' : 'Admin'}</span>
            </button>

            {/* Admin Profile Details */}
            {adminUser && adminUser.email.toLowerCase() === 'yared.abegaz@gmail.com' && (
              <div className="hidden sm:flex items-center space-x-2 border-l border-ivory-dark pl-2 sm:pl-3" id="admin-profile-header">
                {adminUser.picture ? (
                  <img
                    src={adminUser.picture}
                    alt={adminUser.name}
                    className="w-8 h-8 rounded-full border border-ivory-dark"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-espresso text-ivory flex items-center justify-center font-bold text-xs">
                    YA
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-extrabold text-espresso leading-none truncate max-w-[80px]">
                    {adminUser.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={onLogout}
                    className="text-[9px] text-terracotta hover:text-terracotta-dark font-bold uppercase tracking-wider text-left hover:underline mt-0.5 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Shopping Cart Indicator */}
            <button
              onClick={onCartToggle}
              className="relative p-2.5 hover:bg-ivory-dark/40 rounded-full transition-colors cursor-pointer"
              id="cart-indicator-button"
            >
              <ShoppingBag className="w-6 h-6 text-espresso" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-terracotta text-ivory font-mono text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-espresso hover:bg-ivory-dark/40 rounded-lg transition-all"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Desktop Sub-navigation (Category Filter Pills) */}
      {!isAdminMode && (
        <div className="bg-ivory-dark/25 border-t border-b border-ivory-dark hidden md:block" id="desktop-sub-nav">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-2 py-2.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-espresso text-ivory shadow-xs'
                    : 'bg-white/60 text-espresso-soft hover:bg-white hover:text-espresso border border-ivory-dark/50'
                }`}
                id="cat-pill-all"
              >
                {currentLanguage === 'en' ? 'All Fashion' : 'ሁሉንም ፋሽን'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-espresso text-ivory shadow-xs'
                      : 'bg-white/60 text-espresso-soft hover:bg-white hover:text-espresso border border-ivory-dark/50'
                  }`}
                  id={`cat-pill-${cat.id}`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory border-t border-ivory-dark px-4 pt-2 pb-6 space-y-4 shadow-lg animate-fadeIn" id="mobile-dropdown-menu">
          
          {/* Mobile Search */}
          <div className="relative mt-2">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-ivory-dark rounded-full py-2 pl-4 pr-10 text-sm text-espresso placeholder-espresso-soft/60 focus:outline-hidden focus:ring-1 focus:ring-terracotta"
              id="search-input-mobile"
            />
            <div className="absolute right-3 top-2.5 text-espresso-soft">
              <Search className="w-4 h-4" />
            </div>
          </div>

          {/* Categories Title */}
          {!isAdminMode && (
            <div>
              <p className="text-xs font-bold text-espresso-soft uppercase tracking-widest mb-2 pl-1">
                {t('nav.categories')}
              </p>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeCategory === 'all' ? 'bg-espresso text-ivory' : 'text-espresso-soft hover:bg-ivory-dark/30'
                  }`}
                  id="cat-mobile-all"
                >
                  {currentLanguage === 'en' ? 'All Fashion' : 'ሁሉንም ፋሽን'}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeCategory === cat.id ? 'bg-espresso text-ivory' : 'text-espresso-soft hover:bg-ivory-dark/30'
                    }`}
                    id={`cat-mobile-${cat.id}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Language and Admin Actions */}
          <div className="pt-2 border-t border-ivory-dark flex flex-col space-y-2">
            <button
              onClick={() => {
                setLanguage(currentLanguage === 'en' ? 'am' : 'en');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-ivory-dark/30 text-xs font-bold text-espresso"
              id="lang-toggle-mobile"
            >
              <span className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-terracotta" />
                <span>Language / ቋንቋ</span>
              </span>
              <span className="text-[10px] bg-ivory-dark px-2.5 py-1 rounded-full font-bold text-espresso">
                {currentLanguage === 'en' ? 'አማርኛ' : 'English'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
