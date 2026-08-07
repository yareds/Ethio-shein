import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export default function ContactModal({ isOpen, onClose, currentLanguage }: ContactModalProps) {
  const isEn = currentLanguage === 'en';
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactInfo.trim() || !message.trim()) return;

    // Log contact submission locally
    try {
      const stored = localStorage.getItem('ethioshein_contact_messages');
      const existing = stored ? JSON.parse(stored) : [];
      const newMessage = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        contactInfo: contactInfo.trim(),
        subject,
        message: message.trim(),
        date: new Date().toISOString()
      };
      localStorage.setItem('ethioshein_contact_messages', JSON.stringify([newMessage, ...existing]));
    } catch (err) {
      console.error('Failed to store contact message:', err);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setContactInfo('');
      setSubject('general');
      setMessage('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" id="contact-modal-overlay">
      <div className="bg-ivory rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-ivory-dark relative animate-scaleUp max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-espresso-soft hover:text-espresso p-2 rounded-full hover:bg-ivory-dark/40 transition-colors cursor-pointer"
          id="close-contact-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-forest/15 text-forest rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-forest" />
            </div>
            <h3 className="font-fraunces font-bold text-2xl text-espresso">
              {isEn ? 'Message Sent Successfully!' : 'መልእክትዎ በተሳካ ሁኔታ ተልኳል!'}
            </h3>
            <p className="text-xs sm:text-sm text-espresso-soft max-w-xs mx-auto">
              {isEn 
                ? 'Thank you for reaching out to EthioShein. Our representative will contact you shortly.' 
                : 'ስለተገናኙን እናመሰግናለን። ወኪላችን በቅርቡ ያነጋግርዎታል።'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-1.5 bg-ochre-soft/50 px-3 py-1 rounded-full text-xs font-bold text-espresso">
                <Mail className="w-3.5 h-3.5 text-terracotta" />
                <span>{isEn ? 'Get in Touch' : 'እኛን ለማግኘት'}</span>
              </div>
              <h3 className="font-fraunces font-bold text-2xl text-espresso">
                {isEn ? 'Contact EthioShein Customer Care' : 'የኢትዮሼይን ደንበኞች አገልግሎት'}
              </h3>
              <p className="text-xs text-espresso-soft">
                {isEn 
                  ? 'Have a question about sizing, custom Habesha Kemis, or orders? Send us a direct message below.' 
                  : 'ስለ ልብስ መጠን፣ የሐበሻ ቀሚስ ትዕዛዝ ወይም ጥያቄ ካለዎት ይጻፉልን።'}
              </p>
            </div>

            {/* Direct Contact Bar Pills */}
            <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-2xl border border-ivory-dark text-center text-xs">
              <a 
                href="tel:0995967804" 
                className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-forest/10 transition-colors group"
              >
                <Phone className="w-4 h-4 text-forest group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-espresso text-[11px]">0995967804</span>
                <span className="text-[9px] text-espresso-soft">{isEn ? 'Call Now' : 'ይደውሉ'}</span>
              </a>

              <a 
                href="https://t.me/yared_abegaz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-terracotta/10 transition-colors group"
              >
                <Send className="w-4 h-4 text-terracotta group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-espresso text-[11px]">@yared_abegaz</span>
                <span className="text-[9px] text-espresso-soft">Telegram</span>
              </a>

              <a 
                href="https://wa.me/15714749554" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-forest/10 transition-colors group"
              >
                <MessageSquare className="w-4 h-4 text-forest group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-espresso text-[11px]">WhatsApp</span>
                <span className="text-[9px] text-espresso-soft">+15714749554</span>
              </a>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4" id="contact-form-modal">
              <div>
                <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1">
                  {isEn ? 'Your Full Name' : 'ሙሉ ስም'} <span className="text-terracotta">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? 'e.g. Yared Abegaz' : 'ምሳሌ፡ ያሬድ አበጋዝ'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-ivory-dark rounded-xl px-3.5 py-2 text-xs text-espresso focus:outline-hidden focus:ring-2 focus:ring-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1">
                  {isEn ? 'Phone Number / Email' : 'ስልክ ቁጥር ወይም ኢሜይል'} <span className="text-terracotta">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? '0911... or user@example.com' : '0911... ወይም ኢሜይል'}
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full bg-white border border-ivory-dark rounded-xl px-3.5 py-2 text-xs text-espresso focus:outline-hidden focus:ring-2 focus:ring-terracotta"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1">
                  {isEn ? 'Subject' : 'ርዕስ'}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-ivory-dark rounded-xl px-3.5 py-2 text-xs text-espresso focus:outline-hidden focus:ring-2 focus:ring-terracotta"
                >
                  <option value="general">{isEn ? 'General Inquiry' : 'አጠቃላይ ጥያቄ'}</option>
                  <option value="custom_order">{isEn ? 'Custom Tailoring (Habesha Kemis)' : 'ልዩ የሐበሻ ቀሚስ ስፌት'}</option>
                  <option value="delivery">{isEn ? 'Delivery & Shipping Questions' : 'የመላኪያ ጥያቄዎች'}</option>
                  <option value="wholesale">{isEn ? 'Wholesale & Partnership' : 'የጅምላ ትዕዛዝ'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1">
                  {isEn ? 'Your Message' : 'መልእክትዎ'} <span className="text-terracotta">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={isEn ? 'How can we help you today?' : 'እንዴት ልንረዳዎ እንችላለን?'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-ivory-dark rounded-xl p-3.5 text-xs text-espresso focus:outline-hidden focus:ring-2 focus:ring-terracotta"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-espresso hover:bg-terracotta text-ivory font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                id="submit-contact-form-btn"
              >
                <Send className="w-4 h-4 text-ochre" />
                <span>{isEn ? 'Send Message' : 'መልእክት ላክ'}</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
