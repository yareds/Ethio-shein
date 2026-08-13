import React, { useState, useEffect } from 'react';
import { Shield, X, AlertTriangle, Lock, Mail } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { AdminUser, Language } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModal?: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  currentLanguage: Language;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentLanguage }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Clear errors and reset state when modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError(null);
      setIsConnecting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError(
        currentLanguage === 'en'
          ? 'Please fill out both email and password fields.'
          : 'እባክዎን ኢሜይል እና የይለፍ ቃል ያስገቡ።'
      );
      return;
    }

    setError(null);
    setIsConnecting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser.email) {
        throw new Error('No email returned from authentication');
      }

      const user: AdminUser = {
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'Admin User',
        picture: firebaseUser.photoURL || undefined,
      };

      // Strict admin email check
      if (user.email.toLowerCase() === 'yared.abegaz@gmail.com') {
        onLoginSuccess(user);
        setError(null);
        onClose();
      } else {
        await signOut(auth);
        setError(
          currentLanguage === 'en'
            ? `Access Denied: "${user.email}" is not authorized. Only designated Administrators are allowed.`
            : `መዳረሻ ተከልክሏል፡ "${user.email}" የአስተዳዳሪ ፈቃድ የለውም።`
        );
      }
    } catch (err: any) {
      console.error('Firebase Email Auth sign-in error:', err);
      setError(
        err?.message || (currentLanguage === 'en' ? 'Sign-in failed. Please check your credentials.' : 'መግባት አልተሳካም። እባክዎን መረጃዎን ያረጋግጡ።')
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
        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto w-12 h-12 bg-espresso text-ochre rounded-2xl flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 text-ochre" />
          </div>
          <div>
            <h3 className="font-fraunces font-bold text-xl text-espresso uppercase tracking-tight">
              {currentLanguage === 'en' ? 'Admin Portal Sign-In' : 'የአስተዳዳሪ ፖርታል መግቢያ'}
            </h3>
            <p className="text-xs text-espresso-soft mt-1">
              {currentLanguage === 'en' 
                ? 'Sign in securely with your Email and Password.' 
                : 'በኢሜይል እና በይለፍ ቃልዎ ደህንነቱ በተጠበቀ ሁኔታ ይግቡ።'}
            </p>
          </div>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="mb-6 p-4 bg-terracotta/10 border border-terracotta/30 rounded-2xl flex items-start space-x-3 text-terracotta-dark animate-fadeIn" id="login-error-banner">
            <AlertTriangle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
            <div className="space-y-1.5 w-full">
              <h4 className="font-bold text-xs">
                {currentLanguage === 'en' ? 'Authentication Notice' : 'የማረጋገጫ ማስታወቂያ'}
              </h4>
              <p className="text-[11px] leading-relaxed text-terracotta-dark">{error}</p>
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1.5">
              {currentLanguage === 'en' ? 'Email Address' : 'ኢሜይል አድራሻ'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-espresso-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-white border border-ivory-dark rounded-xl pl-10 pr-4 py-3 text-sm text-espresso focus:outline-hidden focus:ring-2 focus:ring-espresso focus:border-transparent"
                required
                id="email-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1.5">
              {currentLanguage === 'en' ? 'Password' : 'የይለፍ ቃል'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-espresso-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-ivory-dark rounded-xl pl-10 pr-4 py-3 text-sm text-espresso focus:outline-hidden focus:ring-2 focus:ring-espresso focus:border-transparent"
                required
                id="password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            className={`w-full py-3.5 px-4 bg-espresso text-ochre hover:bg-espresso-dark rounded-2xl shadow-sm text-sm font-bold transition-all cursor-pointer ${
              isConnecting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            id="email-signin-action-button"
          >
            {isConnecting
              ? (currentLanguage === 'en' ? 'Signing In...' : 'በመግባት ላይ...')
              : (currentLanguage === 'en' ? 'Sign In' : 'ይግቡ')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="py-2 text-xs font-bold text-espresso-soft hover:text-espresso transition-colors cursor-pointer"
            id="cancel-login-action"
          >
            {currentLanguage === 'en' ? 'Back to Shopping' : 'ወደ ግብይት ተመለስ'}
          </button>
        </div>

      </div>
    </div>
  );
}

