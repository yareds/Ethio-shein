import React from 'react';
import { Tag } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../services/localization';

interface HeroProps {
  currentLanguage: Language;
  onExploreClick: () => void;
}

export default function Hero({ currentLanguage, onExploreClick }: HeroProps) {
  const t = (key: string) => translations[currentLanguage][key] || key;

  return (
    <div className="relative bg-gray-50 overflow-hidden" id="hero-banner">
      {/* Visual background decorations */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center space-x-2 bg-black text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase" id="hero-badge">
              <Tag className="w-3.5 h-3.5 mr-1" />
              <span>{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-black leading-tight">
              {t('hero.title')}
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-medium px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                id="hero-cta-button"
              >
                {t('hero.cta')}
              </button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                <span>Active Support: 24/7 Delivery</span>
              </div>
            </div>

            {/* SHEIN-style Promos */}
            <div className="grid grid-cols-3 gap-3 pt-6 max-w-lg mx-auto lg:mx-0">
              <div className="bg-white border border-gray-100 p-3.5 rounded-xl text-center shadow-xs">
                <span className="block text-xl font-bold font-mono text-black">15% OFF</span>
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">CODE: SHEGER15</span>
              </div>
              <div className="bg-white border border-gray-100 p-3.5 rounded-xl text-center shadow-xs">
                <span className="block text-xl font-bold font-mono text-black">FREE DEL</span>
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">ON ORDERS &gt; 4k</span>
              </div>
              <div className="bg-white border border-gray-100 p-3.5 rounded-xl text-center shadow-xs">
                <span className="block text-xl font-bold font-mono text-black">PAYMENT</span>
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">AFTER DELIVERY</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visuals */}
          <div className="lg:col-span-5 relative" id="hero-image-grid">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image */}
              <div className="aspect-4/5 rounded-2xl overflow-hidden shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
                  alt="Ethiopian Modern Fashion"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
                
                {/* Floating Card inside Image */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-xl flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Trending Now</span>
                    <span className="text-sm font-bold text-black">Black Ripped Wide-Leg Jeans</span>
                  </div>
                  <span className="bg-black text-white text-xs font-bold px-2.5 py-1 rounded-md">2,600 ETB</span>
                </div>
              </div>

              {/* Smaller floating decoration image */}
              <div className="absolute -bottom-6 -left-6 w-36 h-48 hidden sm:block rounded-xl overflow-hidden shadow-xl border-4 border-white transform -rotate-6">
                <img
                  src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&auto=format&fit=crop&q=80"
                  alt="Traditional Netela weaving style"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Promo tag */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-black font-extrabold px-4 py-2.5 rounded-full text-xs uppercase tracking-widest shadow-md transform rotate-12 flex items-center space-x-1">
                <span className="animate-pulse">🔥 ENKUTATASH PRE-SALE!</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
