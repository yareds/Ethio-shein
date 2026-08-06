import React from 'react';
import { HelpCircle, Shield, Truck, Sparkles, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../services/localization';

interface SEOContentProps {
  currentLanguage: Language;
}

export default function SEOContent({ currentLanguage }: SEOContentProps) {
  const t = (key: string) => translations[currentLanguage][key] || key;

  return (
    <section className="bg-ivory border-t border-ivory-dark/60 py-16" id="seo-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Row 1: SEO Rich Keywords Content Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-fraunces font-bold text-espresso leading-tight">
              {currentLanguage === 'en' 
                ? 'Ethiopia’s Premier Fashion Marketplace — Inspired by SHEIN, Crafted for You'
                : 'የኢትዮጵያ ቀዳሚ የፋሽን የገበያ ቦታ — በዓለም አቀፍ ደረጃ የተነሳሳ፣ ለእርስዎ የተሰራ'}
            </h2>
            <p className="text-sm sm:text-base text-espresso-soft leading-relaxed">
              {currentLanguage === 'en'
                ? 'Welcome to EthioShein, the largest digital fashion platform in Ethiopia. We bring you thousands of trendy dresses, oversized hoodies, casual street apparel, outerwear, and accessories. Experience the best fast-fashion curation, adapted perfectly for shoppers in Addis Ababa, Hawassa, Bahir Dar, Adama, and all regional cities.'
                : 'ወደ ኢትዮሼን በደህና መጡ፣ በኢትዮጵያ ትልቁ የዲጂታል ፋሽን መድረክ። በሺዎች የሚቆጠሩ ወቅታዊ ቀሚሶችን፣ ሁዲዎችን፣ ተራ የመንገድ ላይ አልባሳትን፣ ጃኬቶችን እና መለዋወጫዎችን እናቀርብልዎታለን። በአዲስ አበባ፣ በሀዋሳ፣ በባህር ዳር፣ በአዳማ እና በሁሉም የሀገሪቱ ከተሞች ለሚገኙ ሸማቾች በሚገባ የተዘጋጀውን ምርጥ ፋሽን ይለማመዱ።'}
            </p>
            <p className="text-sm sm:text-base text-espresso-soft leading-relaxed">
              {currentLanguage === 'en'
                ? 'We bridge traditional Ethiopian craftsmanship and global aesthetic trends. Browse authentic hand-woven Habesha Kemis, light Netela shawls, and handcrafted Axumite jewelry woven by traditional weavers in Shiro Meda, Addis Ababa. Our local supply chains guarantee affordable prices in Ethiopian Birr (ETB), making high fashion accessible to everyone.'
                : 'ባህላዊ የኢትዮጵያን ጥበብ ከዓለም አቀፍ ውበት ጋር እናገናኛለን። በአዲስ አበባ ሽሮ ሜዳ በባህላዊ ባለሙያዎች የተሸመኑ እውነተኛ የሐበሻ ቀሚሶችን፣ ቀጫጭን ነጠላዎችን እና በእጅ የተሰሩ የአክሱም መለዋወጫዎችን እዚህ ያገኛሉ። የሀገር ውስጥ አቅርቦታችን በተመጣጣኝ የኢትዮጵያ ብር (ETB) ዋጋዎችን ያረጋግጣል፣ ይህም ለሁሉም ተደራሽ ያደርገዋል።'}
            </p>
          </div>

          <div className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-ivory-dark shadow-xs">
            <div className="flex items-center space-x-2 text-espresso">
              <Sparkles className="w-5 h-5 text-ochre fill-ochre" />
              <h3 className="font-fraunces font-bold text-sm sm:text-base uppercase tracking-wider">{t('seo.localShippingTitle')}</h3>
            </div>
            <p className="text-xs sm:text-sm text-espresso-soft leading-relaxed">
              {t('seo.localShippingDesc')}
            </p>
            <div className="pt-2 border-t border-ivory-dark">
              <table className="w-full text-[11px] text-espresso-soft font-medium">
                <thead>
                  <tr className="text-espresso text-left font-bold border-b border-ivory-dark">
                    <th className="pb-1.5 font-fraunces">Destination Zone</th>
                    <th className="pb-1.5 font-fraunces">Delivery Time</th>
                    <th className="pb-1.5 font-fraunces">Carrier Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-dark/40 font-mono text-[10px] sm:text-[11px]">
                  <tr>
                    <td className="py-2 font-sans font-medium text-espresso">Addis Ababa (Bole, Piassa, Sarbet)</td>
                    <td className="py-2 text-forest font-bold">Under 24 Hours</td>
                    <td className="py-2">Local Moto Rider</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-espresso">Major Regional Cities (Hawassa, Bahir Dar)</td>
                    <td className="py-2 text-terracotta font-bold">24 - 48 Hours</td>
                    <td className="py-2">EMS / Bus Transport</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-espresso">Secondary Regional Towns (Jimma, Sodo)</td>
                    <td className="py-2 text-espresso font-bold">48 - 72 Hours</td>
                    <td className="py-2">EMS Parcel / Air Cargo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Row 2: Locally tailored FAQ */}
        <div className="space-y-8 pt-8 border-t border-ivory-dark/60">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-fraunces font-bold text-espresso">
              {currentLanguage === 'en' ? 'Frequently Asked Questions (FAQ)' : 'ተደጋግመው የሚጠየቁ ጥያቄዎች'}
            </h2>
            <p className="text-xs sm:text-sm text-espresso-soft">
              Everything you need to know about purchasing, shipping, and sizes in EthioShein.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* FAQ 1 */}
            <div className="bg-white/80 border border-ivory-dark p-5 rounded-2xl flex items-start space-x-3 shadow-xs">
              <HelpCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-espresso">
                  {currentLanguage === 'en' ? 'How do I place an order?' : 'እንዴት ማዘዝ እችላለሁ?'}
                </h4>
                <p className="text-xs text-espresso-soft leading-relaxed">
                  {currentLanguage === 'en'
                    ? 'Simply browse our catalog and add items to your cart. Fill out your name, phone, and city in the checkout form, and click "Submit". The system automatically compiles your items into a neat text message and redirects you to our official Telegram or WhatsApp representative to finalize delivery details.'
                    : 'በቀላሉ እቃዎቹን መርጠው ወደ ጋሪዎ ያስገቡ። በፎርሙ ላይ ስምዎ፣ ስልክ ቁጥርዎ እና የሚኖሩበትን ከተማ ከሞሉ በኋላ "አጠናቅቅ" የሚለውን ይጫኑ። ሲስተሙ እቃዎቹን በጽሑፍ አዘጋጅቶ ወደ ቴሌግራም ወይም ዋትስአፕ ወኪላችን ይልካል።'}
                </p>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="bg-white/80 border border-ivory-dark p-5 rounded-2xl flex items-start space-x-3 shadow-xs">
              <Shield className="w-5 h-5 text-forest shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-espresso">
                  {currentLanguage === 'en' ? 'Is online payment required?' : 'ቅድመ ክፍያ ወይም ኦንላይን መክፈል ግዴታ ነው?'}
                </h4>
                <p className="text-xs text-espresso-soft leading-relaxed">
                  {currentLanguage === 'en'
                    ? 'No! We believe in zero-risk e-commerce. You pay only after you receive and inspect your items. Payment can be made in Cash or local Mobile Banking transfers (CBE Birr, Telebirr, or Bank Transfers) directly to our courier during delivery.'
                    : 'አይደለም! ምንም አይነት ስጋት የሌለበት ግብይት እናምናለን። ክፍያ የሚፈጽሙት እቃው ደርሶዎት አይተው ሲረከቡ ብቻ ነው። ክፍያውን በጥሬ ገንዘብ ወይም በቴሌብር፣ በሲቢኢ ብር ወይም በባንክ ማስተላለፍ በቀጥታ መክፈል ይችላሉ።'}
                </p>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="bg-white/80 border border-ivory-dark p-5 rounded-2xl flex items-start space-x-3 shadow-xs">
              <Truck className="w-5 h-5 text-ochre shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-espresso">
                  {currentLanguage === 'en' ? 'Can I request custom sizes for traditional items?' : 'ለባህላዊ ቀሚሶች የራሴን ልክ ማዘዝ እችላለሁ?'}
                </h4>
                <p className="text-xs text-espresso-soft leading-relaxed">
                  {currentLanguage === 'en'
                    ? 'Yes! In the checkout form, there is a "Special Notes" field. You can specify exact chest/height measurements for hand-woven Habesha Kemis, and our master weavers in Shiro Meda will tailor it specifically to fit your measurements.'
                    : 'አዎ! በሚያዝዙበት ወቅት "ልዩ ትዕዛዝ" በሚለው ሳጥን ውስጥ ትክክለኛ የቁመት እና ደረት ልኮችን መጻፍ ይችላሉ። በሽሮ ሜዳ የሚገኙ ባለሙያዎቻችን በልኩ ሰፍተው ያዘጋጁልዎታል።'}
                </p>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="bg-white/80 border border-ivory-dark p-5 rounded-2xl flex items-start space-x-3 shadow-xs">
              <MessageCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-espresso">
                  {currentLanguage === 'en' ? 'How fast is regional delivery?' : 'ክፍለ ሀገር መላኪያ ምን ያህል ጊዜ ይወስዳል?'}
                </h4>
                <p className="text-xs text-espresso-soft leading-relaxed">
                  {currentLanguage === 'en'
                    ? 'For major regional hub cities (Hawassa, Bahir Dar, Adama, Dire Dawa), delivery takes between 24 and 48 hours. Items are packed securely and dispatched via daily fast bus networks or EMS courier services.'
                    : 'ለዋና ዋና የክልል ከተሞች (ሀዋሳ፣ ባህር ዳር፣ አዳማ፣ ድሬዳዋ) መላኪያ ከ24 እስከ 48 ሰዓታት ይወስዳል። እቃዎቹ በአስተማማኝ ሁኔታ ተጭነው በየቀኑ በፈጣን አውቶቡሶች ወይም በኢኤምኤስ (EMS) ይላካሉ።'}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
