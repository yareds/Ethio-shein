import React from 'react';
import { ShieldCheck, Truck, Camera, Star, CheckCircle } from 'lucide-react';
import { Language } from '../types';

interface TestimonialsProps {
  currentLanguage: Language;
}

export default function Testimonials({ currentLanguage }: TestimonialsProps) {
  const isEn = currentLanguage === 'en';

  const trustFeatures = [
    {
      icon: ShieldCheck,
      title: isEn ? 'Pay on Delivery' : 'ክፍያ በሚረከቡበት ጊዜ',
      desc: isEn 
        ? 'Inspect your items upon arrival in Addis Ababa or region centers before paying.' 
        : 'በአዲስ አበባ ወይም በክፍለ ሀገር ዕቃዎችዎ እንደደረሱ አይተው ከወደዱ በኋላ ይክፈሉ።'
    },
    {
      icon: Truck,
      title: isEn ? 'Nationwide Express Delivery' : 'መላው ኢትዮጵያ ፈጣን መላኪያ',
      desc: isEn 
        ? 'Same-day delivery in Addis Ababa, 24-48 hours via EMS/Post to all regions.' 
        : 'በአዲስ አበባ በዕለቱ፣ ወደ ሁሉም የኢትዮጵያ ክልሎች በ24-48 ሰዓት ውስጥ ይደርሳል።'
    },
    {
      icon: Camera,
      title: isEn ? 'Real Photos, Real Fit' : 'እውነተኛ ፎቶዎች፣ እውነተኛ ልክ',
      desc: isEn 
        ? '100% authentic unedited product photos taken locally in Ethiopia.' 
        : '100% እውነተኛና ያልተሰናዱ የአካባቢው ምርት ፎቶዎችና ልክ የተረጋገጠ።'
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Bethlehem Tassew',
      initials: 'BT',
      city: isEn ? 'Addis Ababa (Bole)' : 'አዲስ አበባ (ቦሌ)',
      rating: 5,
      date: isEn ? '2 days ago' : 'ከ2 ቀን በፊት',
      comment: isEn 
        ? 'The quality of the traditional dress was beyond my expectations! The golden embroidery is so rich and delivery took less than 3 hours in Bole.' 
        : 'የሃበሻ ቀሚሱ ጥራት ከጠበቅኩት በላይ ነው! የወርቅ ጥልፉ በጣም የሚያምር ሲሆን ቦሌ በ3 ሰዓት ውስጥ ደርሶልኛል።'
    },
    {
      id: 2,
      name: 'Yared Mamo',
      initials: 'YM',
      city: isEn ? 'Hawassa' : 'ሀዋሳ',
      rating: 5,
      date: isEn ? '1 week ago' : 'ከ1 ሳምንት በፊት',
      comment: isEn 
        ? 'Ordered 2 oversized t-shirts for Telegram order. Paying after inspecting at the post office gave me total peace of mind.' 
        : 'በቴሌግራም 2 ቲሸርቶች አዝዤ ነበር። ሀዋሳ ፖስታ ቤት አይቼ መክፈሌ ሙሉ በሙሉ እምነት አሳድሮብኛል።'
    },
    {
      id: 3,
      name: 'Saba Tesfaye',
      initials: 'ST',
      city: isEn ? 'Adama' : 'አዳማ',
      rating: 5,
      date: isEn ? '2 weeks ago' : 'ከ2 ሳምንት በፊት',
      comment: isEn 
        ? 'EthioShein is my go-to for trendy Habesha street style. Customer service on WhatsApp is super responsive!' 
        : 'ኢትዮሼይን ለዘመናዊ የሐበሻ ስታይል የመጀመሪያ ምርጫዬ ነው። በዋትስአፕ የደንበኞች አገልግሎታቸው ፈጣን ነው።'
    }
  ];

  return (
    <section className="py-16 bg-ivory border-t border-b border-ivory-dark/60" id="trust-testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row 1: 3 Trust-Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" id="trust-feature-cards">
          {trustFeatures.map((feature, idx) => {
            const IconComp = feature.icon;
            return (
              <div 
                key={idx}
                className="bg-white/90 border border-ivory-dark p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center space-y-3 group"
              >
                <div className="p-3.5 bg-ochre-soft/60 text-terracotta rounded-xl group-hover:bg-terracotta group-hover:text-ivory transition-colors">
                  <IconComp className="w-7 h-7" />
                </div>
                <h3 className="font-fraunces font-bold text-espresso text-lg">{feature.title}</h3>
                <p className="text-espresso-soft text-xs sm:text-sm font-sans leading-relaxed max-w-xs">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Aggregate Ratings Bar & Section Title */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-ivory-dark shadow-xs">
            <div className="flex items-center space-x-1 text-ochre">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-ochre text-ochre" />
              ))}
            </div>
            <span className="font-mono font-black text-espresso text-sm">4.9 / 5.0</span>
            <span className="text-espresso-soft text-xs font-semibold">
              {isEn ? '(1,280+ Verified Customers)' : '(1,280+ የተረጋገጡ ደንበኞች)'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-fraunces font-bold text-espresso tracking-tight">
            {isEn ? (
              <>Loved by Fashion Lovers Across <span className="text-terracotta italic font-normal">Ethiopia</span></>
            ) : (
              <>በመላው <span className="text-terracotta italic font-normal">ኢትዮጵያ</span> በፋሽን ወዳጆች የተወደደ</>
            )}
          </h2>
          <p className="text-espresso-soft text-sm max-w-xl mx-auto">
            {isEn 
              ? 'Read genuine feedback from verified buyers who enjoy our fast delivery and pay-on-delivery guarantee.' 
              : 'ከየቦታው ከታመኑ ገዢዎቻችን የተሰጡ እውነተኛ አስተያየቶችን ያንብቡ።'}
          </p>
        </div>

        {/* Row 2: Grid of 3 Customer Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="customer-reviews-grid">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white border border-ivory-dark p-6 rounded-2xl shadow-xs flex flex-col justify-between space-y-4 hover:border-terracotta/40 transition-all"
            >
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-ochre">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-ochre text-ochre" />
                    ))}
                  </div>
                  <span className="text-[10px] text-espresso-soft font-semibold">{rev.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-espresso font-sans italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-ivory-dark/40 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-espresso text-ivory flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-xs">
                  {rev.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-bold text-espresso text-xs truncate">{rev.name}</h4>
                    <CheckCircle className="w-3.5 h-3.5 text-forest shrink-0" title="Verified Buyer" />
                  </div>
                  <p className="text-[10px] text-espresso-soft">{rev.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
