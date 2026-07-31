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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs" id="main-header">
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
              <div className="bg-black text-white p-2 rounded-md font-mono tracking-widest text-lg font-black group-hover:bg-gray-800 transition-colors">
                ES
              </div>
              <span className="font-sans font-bold tracking-tight text-xl sm:text-2xl text-black">
                ETHIO<span className="text-gray-500 font-normal">SHEIN</span>
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
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-hidden focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                id="search-input-desktop"
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Language Selector */}
            <button
              onClick={() => setLanguage(currentLanguage === 'en' ? 'am' : 'en')}
              className="flex items-center space-x-1 px-2 py-1.5 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors cursor-pointer"
              title="Switch Language / ቋንቋ ይቀይሩ"
              id="lang-toggle-button"
            >
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="hidden sm:inline">{currentLanguage === 'en' ? 'English' : 'አማርኛ'}</span>
              <span className="sm:hidden uppercase">{currentLanguage}</span>
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
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isAdminMode 
                  ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                  : adminUser
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              id="admin-toggle-button"
            >
              <Shield className={`w-4 h-4 ${isAdminMode ? 'text-red-600' : adminUser ? 'text-green-600' : 'text-gray-500'}`} />
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
              <div className="hidden sm:flex items-center space-x-2 border-l border-gray-150 pl-2 sm:pl-3" id="admin-profile-header">
                {adminUser.picture ? (
                  <img
                    src={adminUser.picture}
                    alt={adminUser.name}
                    className="w-8 h-8 rounded-full border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                    YA
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-extrabold text-black leading-none truncate max-w-[80px]">
                    {adminUser.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={onLogout}
                    className="text-[9px] text-red-600 hover:text-red-700 font-bold uppercase tracking-wider text-left hover:underline mt-0.5 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Shopping Cart Indicator */}
            <button
              onClick={onCartToggle}
              className="relative p-2.5 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              id="cart-indicator-button"
            >
              <ShoppingBag className="w-6 h-6 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white font-mono text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Desktop Sub-navigation (Category Filter Pills) */}
      {!isAdminMode && (
        <div className="bg-gray-50 border-t border-b border-gray-100 hidden md:block" id="desktop-sub-nav">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 py-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-600 hover:bg-white hover:text-black'
                }`}
                id="cat-pill-all"
              >
                {currentLanguage === 'en' ? 'All Fashion' : 'ሁሉንም ፋሽን'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-black text-white shadow-xs'
                      : 'text-gray-600 hover:bg-white hover:text-black'
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
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg animate-fadeIn" id="mobile-dropdown-menu">
          
          {/* Mobile Search */}
          <div className="relative mt-2">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-hidden focus:ring-1 focus:ring-black"
              id="search-input-mobile"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">
              <Search className="w-4 h-4" />
            </div>
          </div>

          {/* Categories Title */}
          {!isAdminMode && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
                {t('nav.categories')}
              </p>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    activeCategory === 'all' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
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
                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      activeCategory === cat.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
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
          <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
            <button
              onClick={() => {
                setLanguage(currentLanguage === 'en' ? 'am' : 'en');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
              id="lang-toggle-mobile"
            >
              <span className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span>Language / ቋንቋ</span>
              </span>
              <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-full font-bold">
                {currentLanguage === 'en' ? 'አማርኛ' : 'English'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
