import React from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../services/localization';
import ShatterText from './ShatterText';

interface HeroProps {
  currentLanguage: Language;
  onExploreClick: () => void;
}

export default function Hero({ currentLanguage, onExploreClick }: HeroProps) {
  const t = (key: string) => translations[currentLanguage][key] || key;

  return (
    <div className="relative bg-ivory overflow-hidden border-b border-ivory-dark" id="hero-banner">
      {/* Decorative Tibeb Strip Accent Bar at Top */}
      <div className="tibeb-strip" />

      {/* Visual background decorations */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-ochre-soft/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center space-x-2 bg-espresso text-ivory px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-xs" id="hero-badge">
              <Tag className="w-3.5 h-3.5 mr-1 text-ochre" />
              <span>{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-fraunces font-bold tracking-tight text-espresso leading-tight pb-2">
              {currentLanguage === 'en' ? (
                <ShatterText
                  segments={[
                    { text: 'Fast Fashion, ' },
                    { text: 'Habesha', className: 'text-terracotta', isItalic: true },
                    { text: ' Style' },
                  ]}
                />
              ) : (
                <ShatterText
                  segments={[
                    { text: 'ዘመናዊ ፋሽን፣ በ' },
                    { text: 'ሐበሻ', className: 'text-terracotta', isItalic: true },
                    { text: ' ስታይል' },
                  ]}
                />
              )}
            </h1>
            
            <p className="text-base sm:text-lg text-espresso-soft max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto bg-espresso hover:bg-terracotta-dark text-ivory font-semibold px-8 py-4 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center space-x-2"
                id="hero-cta-button"
              >
                <span>{t('hero.cta')}</span>
                <Sparkles className="w-4 h-4 text-ochre" />
              </button>
              
              <div className="flex items-center space-x-2 text-xs text-espresso-soft font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-forest animate-ping"></span>
                <span>Active Support: 24/7 Delivery</span>
              </div>
            </div>

            {/* EthioShein Warm Promo Tiles */}
            <div className="grid grid-cols-3 gap-3 pt-6 max-w-lg mx-auto lg:mx-0">
              <div className="bg-white/80 border border-ivory-dark p-3.5 rounded-xl text-center shadow-xs">
                <span className="block text-lg font-bold font-fraunces text-terracotta">15% OFF</span>
                <span className="text-[10px] sm:text-xs text-espresso-soft font-semibold uppercase tracking-wider">CODE: SHEGER15</span>
              </div>
              <div className="bg-white/80 border border-ivory-dark p-3.5 rounded-xl text-center shadow-xs">
                <span className="block text-lg font-bold font-fraunces text-terracotta">FREE DEL</span>
                <span className="text-[10px] sm:text-xs text-espresso-soft font-semibold uppercase tracking-wider">ON ORDERS &gt; 4k</span>
              </div>
              <div className="bg-white/80 border border-ivory-dark p-3.5 rounded-xl text-center shadow-xs">
                <span className="block text-lg font-bold font-fraunces text-terracotta">PAYMENT</span>
                <span className="text-[10px] sm:text-xs text-espresso-soft font-semibold uppercase tracking-wider">AFTER DELIVERY</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visuals - High Quality Cinematic Video Stage */}
          <div className="lg:col-span-5 relative" id="hero-video-stage">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer 3D Perspective Container with smooth orbit tilt */}
              <div className="relative rounded-3xl p-2 bg-linear-to-b from-ochre/20 via-ivory-dark/40 to-espresso/20 shadow-2xl border border-ivory-dark/80 backdrop-blur-xs">
                
                {/* Main Video Frame */}
                <div className="aspect-4/5 rounded-2xl overflow-hidden shadow-xl border border-ivory-dark relative bg-espresso group">
                  
                  {/* Video Element with CSS Camera Movement (Smooth Zoom-Ins, Zoom-Outs & 360 Orbit Movement) */}
                  <div className="w-full h-full overflow-hidden relative animate-cinematic-camera">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80"
                      className="w-full h-full object-cover transition-all duration-700 pointer-events-none"
                    >
                      <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-wearing-a-stylish-black-dress-41551-large.mp4" type="video/mp4" />
                      <source src="https://assets.mixkit.co/videos/preview/mixkit-model-wearing-a-yellow-dress-40019-large.mp4" type="video/mp4" />
                      <source src="https://assets.mixkit.co/videos/preview/mixkit-stylish-model-posing-in-a-golden-dress-41315-large.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Gradient Overlay for visual warmth and contrast */}
                  <div className="absolute inset-0 bg-linear-to-t from-espresso/80 via-transparent to-espresso/20 pointer-events-none"></div>

                  {/* Top Header Badge inside Video Frame */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                    <div className="bg-espresso/80 backdrop-blur-md border border-ivory/20 px-3 py-1.5 rounded-full flex items-center space-x-2 text-ivory text-xs font-bold shadow-md">
                      <span className="w-2 h-2 rounded-full bg-terracotta animate-ping shrink-0"></span>
                      <span className="text-[11px] font-mono tracking-wider">CINEMATIC 4K SHOWCASE</span>
                    </div>
                  </div>

                  {/* Floating Product Card inside Video Stage */}
                  <div className="absolute bottom-4 left-4 right-4 bg-ivory/95 backdrop-blur-md p-3.5 rounded-xl flex items-center justify-between shadow-xl border border-ivory-dark z-10 pointer-events-auto">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] text-terracotta font-extrabold uppercase tracking-widest block">Luxurious Elegance</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-ochre"></span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-espresso block truncate max-w-[200px]">Gold Threaded Evening Dress</span>
                    </div>
                    <button
                      onClick={onExploreClick}
                      className="bg-espresso hover:bg-terracotta text-ivory text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer shrink-0"
                    >
                      3,800 ETB
                    </button>
                  </div>

                </div>

              </div>

              {/* Promo badge tag floating on top right */}
              <div className="absolute -top-4 -right-4 bg-ochre text-espresso font-extrabold px-4 py-2.5 rounded-full text-xs uppercase tracking-widest shadow-lg transform rotate-12 flex items-center space-x-1 border border-ivory-dark z-20 pointer-events-none">
                <span className="animate-pulse">🔥 ENKUTATASH LUXE COLLECTION</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
