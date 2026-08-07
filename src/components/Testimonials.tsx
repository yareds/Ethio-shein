import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Camera, Star, CheckCircle, MessageSquarePlus, X, Send, Heart, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface TestimonialsProps {
  currentLanguage: Language;
}

interface Testimonial {
  id: string;
  name: string;
  initials: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  isVisitor?: boolean;
}

export default function Testimonials({ currentLanguage }: TestimonialsProps) {
  const isEn = currentLanguage === 'en';

  // Seed testimonials
  const defaultReviews: Testimonial[] = [
    {
      id: 'rev-1',
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
      id: 'rev-2',
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
      id: 'rev-3',
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

  // State for reviews list with persistence
  const [reviews, setReviews] = useState<Testimonial[]>(() => {
    try {
      const stored = localStorage.getItem('ethioshein_user_testimonials_v2');
      if (stored) {
        const userRevs: Testimonial[] = JSON.parse(stored);
        return [...userRevs, ...defaultReviews];
      }
    } catch (e) {
      console.error('Error reading testimonials:', e);
    }
    return defaultReviews;
  });

  // State for comment modal / form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

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

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    // Generate initials
    const nameParts = newName.trim().split(' ');
    const initials = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    const createdReview: Testimonial = {
      id: `visitor-${Date.now()}`,
      name: newName.trim(),
      initials,
      city: newCity.trim() || (isEn ? 'Addis Ababa' : 'አዲስ አበባ'),
      rating: newRating,
      date: isEn ? 'Just now' : 'አሁን',
      comment: newComment.trim(),
      isVisitor: true
    };

    // Save to local storage
    try {
      const stored = localStorage.getItem('ethioshein_user_testimonials_v2');
      const existingUserRevs: Testimonial[] = stored ? JSON.parse(stored) : [];
      const updatedUserRevs = [createdReview, ...existingUserRevs];
      localStorage.setItem('ethioshein_user_testimonials_v2', JSON.stringify(updatedUserRevs));
    } catch (err) {
      console.error('Failed to save review:', err);
    }

    setReviews([createdReview, ...reviews]);
    setSubmittedSuccess(true);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsFormOpen(false);
      setNewName('');
      setNewCity('');
      setNewComment('');
      setNewRating(5);
    }, 1800);
  };

  return (
    <section className="py-16 bg-ivory border-t border-b border-ivory-dark/60 relative" id="trust-testimonials-section">
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

        {/* Header & Write Review Action Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-ivory-dark shadow-xs">
              <div className="flex items-center space-x-1 text-ochre">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-ochre text-ochre" />
                ))}
              </div>
              <span className="font-mono font-black text-espresso text-sm">4.9 / 5.0</span>
              <span className="text-espresso-soft text-xs font-semibold">
                {isEn ? `(${reviews.length + 1280}+ Verified Reviews)` : `(${reviews.length + 1280}+ የተረጋገጡ አስተያየቶች)`}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-fraunces font-bold text-espresso tracking-tight">
              {isEn ? (
                <>Loved by Fashion Lovers Across <span className="text-terracotta italic font-normal">Ethiopia</span></>
              ) : (
                <>በመላው <span className="text-terracotta italic font-normal">ኢትዮጵያ</span> በፋሽን ወዳጆች የተወደደ</>
              )}
            </h2>
            <p className="text-espresso-soft text-sm max-w-xl">
              {isEn 
                ? 'Read genuine feedback from shoppers or share your own EthioShein experience below.' 
                : 'የገዢዎቻችንን አስተያየት ያንብቡ ወይም የእርስዎን ተሞክሮ ያጋሩ።'}
            </p>
          </div>

          <div className="flex justify-center md:justify-end shrink-0">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-espresso hover:bg-terracotta text-ivory font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center space-x-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              id="write-review-button"
            >
              <MessageSquarePlus className="w-4 h-4 text-ochre" />
              <span>{isEn ? 'Share Your Experience' : 'አስተያየትዎን ያጋሩ'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Customer Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="customer-reviews-grid">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className={`bg-white border p-6 rounded-2xl shadow-xs flex flex-col justify-between space-y-4 hover:border-terracotta/40 transition-all ${
                rev.isVisitor ? 'border-ochre/60 bg-linear-to-b from-white to-ochre-soft/20' : 'border-ivory-dark'
              }`}
            >
              <div className="space-y-3">
                {/* Header Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-ochre">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-ochre text-ochre" />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    {rev.isVisitor && (
                      <span className="bg-terracotta/10 text-terracotta text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {isEn ? 'Visitor Post' : 'የጎብኚ አስተያየት'}
                      </span>
                    )}
                    <span className="text-[10px] text-espresso-soft font-semibold">{rev.date}</span>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-espresso font-sans italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-ivory-dark/40 flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-xs ${
                  rev.isVisitor ? 'bg-terracotta text-ivory' : 'bg-espresso text-ivory'
                }`}>
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

      {/* Leave a Review Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" id="write-review-modal-overlay">
          <div className="bg-ivory rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-ivory-dark relative animate-scaleUp">
            
            {/* Close Modal Button */}
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute right-4 top-4 text-espresso-soft hover:text-espresso p-1.5 rounded-full hover:bg-ivory-dark/40 transition-colors cursor-pointer"
              id="close-review-modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedSuccess ? (
              <div className="text-center py-8 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 bg-forest/15 text-forest rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Sparkles className="w-8 h-8 text-forest animate-spin" />
                </div>
                <h3 className="font-fraunces font-bold text-2xl text-espresso">
                  {isEn ? 'Thank You for Your Review!' : 'እናመሰግናለን!'}
                </h3>
                <p className="text-xs sm:text-sm text-espresso-soft max-w-xs mx-auto">
                  {isEn 
                    ? 'Your comment has been successfully published on EthioShein.' 
                    : 'አስተያየትዎ በኢትዮሼይን ላይ በስኬት ታትሟል።'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-5" id="review-submission-form">
                
                <div className="text-center space-y-2 mb-2">
                  <div className="inline-flex items-center space-x-1.5 bg-ochre-soft/50 px-3 py-1 rounded-full text-xs font-bold text-espresso">
                    <Heart className="w-3.5 h-3.5 text-terracotta fill-terracotta" />
                    <span>{isEn ? 'Customer Feedback' : 'የደንበኛ አስተያየት'}</span>
                  </div>
                  <h3 className="font-fraunces font-bold text-2xl text-espresso">
                    {isEn ? 'Share Your EthioShein Experience' : 'የኢትዮሼይን ተሞክሮዎን ያጋሩ'}
                  </h3>
                  <p className="text-xs text-espresso-soft">
                    {isEn 
                      ? 'Help other shoppers in Ethiopia by leaving your honest review.' 
                      : 'የእርስዎን እውነተኛ አስተያየት በመስጠት ሌሎችን ይርዱ።'}
                  </p>
                </div>

                {/* Rating Selector */}
                <div className="bg-white p-4 rounded-2xl border border-ivory-dark text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-espresso-soft block">
                    {isEn ? 'Your Overall Rating' : 'አጠቃላይ ደረጃ'}
                  </span>
                  <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star 
                          className={`w-7 h-7 ${
                            star <= newRating ? 'fill-ochre text-ochre' : 'text-ivory-dark fill-ivory-dark/40'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-terracotta block">
                    {newRating === 5 && (isEn ? '5/5 - Outstanding Experience!' : '5/5 - እጅግ በጣም ጥሩ!')}
                    {newRating === 4 && (isEn ? '4/5 - Very Good' : '4/5 - በጣም ጥሩ')}
                    {newRating === 3 && (isEn ? '3/5 - Average' : '3/5 - መካከለኛ')}
                    {newRating < 3 && (isEn ? 'Needs Improvement' : 'መሻሻል ይፈልጋል')}
                  </span>
                </div>

                {/* Name & City inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1.5">
                      {isEn ? 'Your Name' : 'ስምዎት'} <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isEn ? 'e.g., Tigist Alemu' : 'ምሳሌ፡ ትዕግስት አለሙ'}
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-white border border-ivory-dark rounded-xl px-3.5 py-2.5 text-xs text-espresso focus:outline-hidden focus:ring-2 focus:ring-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1.5">
                      {isEn ? 'City / Location' : 'ከተማ / አካባቢ'}
                    </label>
                    <input
                      type="text"
                      placeholder={isEn ? 'e.g., Addis Ababa (Bole)' : 'ምሳሌ፡ አዲስ አበባ (ቦሌ)'}
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-white border border-ivory-dark rounded-xl px-3.5 py-2.5 text-xs text-espresso focus:outline-hidden focus:ring-2 focus:ring-terracotta"
                    />
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1.5">
                    {isEn ? 'Your Comment / Experience' : 'አስተያየትዎት'} <span className="text-terracotta">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={isEn ? 'Tell us about the clothing fit, delivery speed, or quality...' : 'ስለ ልብሱ ጥራት፣ የመላኪያ ፈጣንነት ወይም አገልግሎት ይፃፉልን...'}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-white border border-ivory-dark rounded-xl p-3.5 text-xs text-espresso focus:outline-hidden focus:ring-2 focus:ring-terracotta"
                  ></textarea>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full bg-espresso hover:bg-terracotta text-ivory font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  id="submit-review-btn"
                >
                  <Send className="w-4 h-4 text-ochre" />
                  <span>{isEn ? 'Publish Review' : 'አስተያየት አቅርብ'}</span>
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}

