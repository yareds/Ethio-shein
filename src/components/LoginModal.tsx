import React, { useState } from 'react';
import { Shield, X, AlertTriangle } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { AdminUser, Language } from '../types';
import { translations } from '../services/localization';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  currentLanguage: Language;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentLanguage }: LoginModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    if (isConnecting) return;
    setError(null);
    setIsConnecting(true);

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user;

      if (!firebaseUser.email) {
        throw new Error('No email returned from Google authentication');
      }

      const user: AdminUser = {
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'Admin User',
        picture: firebaseUser.photoURL || undefined
      };

      // Strict admin check
      if (user.email.toLowerCase() === 'yared.abegaz@gmail.com') {
        onLoginSuccess(user);
        setError(null);
        onClose();
      } else {
        setError(
          currentLanguage === 'en'
            ? `Access Denied: "${user.email}" is not authorized. Only designated Administrators are allowed.`
            : `መዳረሻ ተከልክሏል፡ "${user.email}" የአስተዳዳሪ ፈቃድ የለውም። የተፈቀደላቸው አስተዳዳሪዎች ብቻ ናቸው የሚፈቀድላቸው።`
        );
      }
    } catch (err: any) {
      console.error('Firebase Auth sign-in error:', err);
      // Don't show scary error if user closed the popup window
      if (err?.code === 'auth/popup-closed-by-user') {
        setIsConnecting(false);
        return;
      }

      setError(
        currentLanguage === 'en'
          ? (err.message || 'Google Sign-In failed via Firebase Authentication.')
          : 'በጉግል መግቢያ አልተሳካም። እባክዎን እንደገና ይሞክሩ።'
      );
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" id="login-modal-overlay">
      <div className="bg-ivory rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-ivory-dark relative animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-espresso-soft hover:text-espresso p-1.5 rounded-full hover:bg-ivory-dark/40 transition-colors cursor-pointer"
          id="close-login-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Shield Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto w-12 h-12 bg-espresso text-ochre rounded-2xl flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 text-ochre" />
          </div>
          <div>
            <h3 className="font-fraunces font-bold text-xl text-espresso uppercase tracking-tight">
              {currentLanguage === 'en' ? 'Admin Portal Sign-In' : 'የአስተዳዳሪ ፖርታል መግቢያ'}
            </h3>
            <p className="text-xs text-espresso-soft mt-1">
              {currentLanguage === 'en' 
                ? 'Authorized back-office credentials required.' 
                : 'የተፈቀደላቸው የአስተዳዳሪ ምስክር ወረቀቶች ያስፈልጋሉ።'}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-espresso-soft text-center leading-relaxed mb-6">
          {currentLanguage === 'en'
            ? 'Connect your Google Account to authorize back-office access. Only Admin is allowed to manage inventory, catalog categories, and customer orders.'
            : 'የአስተዳዳሪ ፖርታሉን ለመክፈት የጉግል አካውንትዎን ያገናኙ። የተፈቀደላቸው አስተዳዳሪዎች ብቻ ናቸው እቃዎችን፣ ካታሎጎችን እና የደንበኛ ትዕዛዞችን ማስተዳደር የሚችሉት።'}
        </p>

        {/* Error Notification Banner */}
        {error && (
          <div className="mb-6 p-4 bg-terracotta/10 border border-terracotta/30 rounded-2xl flex items-start space-x-3 text-terracotta-dark animate-fadeIn" id="login-error-banner">
            <AlertTriangle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs">
                {currentLanguage === 'en' ? 'Authorization Failed' : 'ማረጋገጥ አልተቻለም'}
              </h4>
              <p className="text-[11px] leading-relaxed text-terracotta-dark">{error}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={isConnecting}
            className={`w-full flex items-center justify-center space-x-3 py-3 px-4 border border-ivory-dark rounded-2xl shadow-xs bg-white hover:border-espresso text-sm font-bold text-espresso transition-all cursor-pointer ${
              isConnecting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            id="google-signin-action-button"
          >
            {/* Minimalist Google Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.68 1.4 7.6l3.86 3C6.18 7.6 8.84 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.46-1.1 2.7-2.34 3.54l3.64 2.82c2.13-1.97 3.75-4.86 3.75-8.46z"
              />
              <path
                fill="#FBBC05"
                d="M5.26 14.4c-.24-.72-.38-1.5-.38-2.4s.14-1.68.38-2.4L1.4 6.6C.5 8.22 0 10.05 0 12s.5 3.78 1.4 5.4l3.86-3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.64-2.82c-1.11.75-2.53 1.19-4.32 1.19-3.16 0-5.82-2.56-6.77-5.56L1.37 15.9C3.33 19.82 7.33 23 12 23z"
              />
            </svg>
            <span>
              {isConnecting 
                ? (currentLanguage === 'en' ? 'Connecting to Firebase...' : 'በመገናኘት ላይ...') 
                : (currentLanguage === 'en' ? 'Continue with Google' : 'በጉግል ቀጥል')}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-espresso-soft hover:text-espresso transition-colors cursor-pointer"
            id="cancel-login-action"
          >
            {currentLanguage === 'en' ? 'Back to Shopping' : 'ወደ ግብይት ተመለስ'}
          </button>
        </div>

      </div>
    </div>
  );
}
