import React, { useState, useEffect } from 'react';
import { Shield, X, AlertTriangle } from 'lucide-react';
import { signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { AdminUser, Language } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModal?: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  currentLanguage: Language;
}

export default function LoginModal({ isOpen, onClose, onOpenModal, onLoginSuccess, currentLanguage }: LoginModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Process redirect result when component mounts (on return from Google sign-in redirect)
  useEffect(() => {
    let isMounted = true;
    getRedirectResult(auth)
      .then(async (userCredential) => {
        if (!isMounted || !userCredential) return;
        const firebaseUser = userCredential.user;
        if (!firebaseUser.email) return;

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
          if (onOpenModal) onOpenModal();
        }
      })
      .catch((err: any) => {
        if (!isMounted) return;
        console.error('Firebase Auth redirect result error:', err);
        if (
          err?.code === 'auth/invalid-continue-uri' || 
          err?.code === 'auth/unauthorized-domain' || 
          (typeof err?.message === 'string' && (err.message.includes('invalid-continue-uri') || err.message.includes('unauthorized-domain')))
        ) {
          setError(
            currentLanguage === 'en'
              ? `Domain Authorization Pending (${window.location.host}): To complete Google sign-in, please add "${window.location.host}" to Firebase Console -> Authentication -> Settings -> Authorized Domains.`
              : `የጎራ ፈቃድ በመጠባበቅ ላይ ነው (${window.location.host})፡ እባክዎን በፋየርቤዝ ኮንሶል (Authentication -> Settings -> Authorized Domains) ውስጥ ይፍቀዱ።`
          );
        } else {
          setError(
            currentLanguage === 'en'
              ? (err.message || 'Google Sign-In failed via Firebase Authentication.')
              : 'በጉግል መግቢያ አልተሳካም። እባክዎን እንደገና ይሞክሩ።'
          );
        }
        if (onOpenModal) onOpenModal();
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Clear errors and reset state when modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsConnecting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    if (isConnecting) return;
    setError(null);
    setIsConnecting(true);

    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err: any) {
      console.error('Firebase Auth signInWithRedirect error:', err);
      if (
        err?.code === 'auth/invalid-continue-uri' || 
        err?.code === 'auth/unauthorized-domain' || 
        (typeof err?.message === 'string' && (err.message.includes('invalid-continue-uri') || err.message.includes('unauthorized-domain')))
      ) {
        setError(
          currentLanguage === 'en'
            ? `Domain Authorization Pending (${window.location.host}): To complete Google sign-in, please add "${window.location.host}" to Firebase Console -> Authentication -> Settings -> Authorized Domains.`
            : `የጎራ ፈቃድ በመጠባበቅ ላይ ነው (${window.location.host})፡ እባክዎን በፋየርቤዝ ኮንሶል (Authentication -> Settings -> Authorized Domains) ውስጥ ይፍቀዱ።`
        );
      } else {
        setError(
          currentLanguage === 'en'
            ? (err.message || 'Google Sign-In failed via Firebase Authentication.')
            : 'በጉግል መግቢያ አልተሳካም። እባክዎን እንደገና ይሞክሩ።'
        );
      }
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
                ? 'Sign in securely with your Google Account.' 
                : 'በጉግል መለያዎ ደህንነቱ በተጠበቀ ሁኔታ ይግቡ።'}
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

        {/* Google Sign In Option */}
        <button
          onClick={handleGoogleLogin}
          disabled={isConnecting}
          className={`w-full flex items-center justify-center space-x-3 py-3.5 px-4 bg-espresso text-ochre hover:bg-espresso-dark rounded-2xl shadow-sm text-sm font-bold transition-all cursor-pointer ${
            isConnecting ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          id="google-signin-action-button"
        >
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
              ? (currentLanguage === 'en' ? 'Connecting to Google...' : 'ከጉግል ጋር በመገናኘት ላይ...')
              : (currentLanguage === 'en' ? 'Continue with Google' : 'በጉግል ቀጥል')}
          </span>
        </button>

        <div className="mt-4 text-center">
          <button
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
