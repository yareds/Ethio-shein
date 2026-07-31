import React, { useState } from 'react';
import { Shield, X, AlertTriangle } from 'lucide-react';
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

  const t = (key: string) => translations[currentLanguage][key] || key;

  const handleGoogleLogin = () => {
    if (isConnecting) return;
    setError(null);
    setIsConnecting(true);

    try {
      const google = (window as any).google;
      if (!google || !google.accounts || !google.accounts.oauth2) {
        setError(
          currentLanguage === 'en'
            ? 'Google Sign-In is still loading. Please wait a moment and try again.'
            : 'የጉግል መግቢያ አገልግሎት በመጫን ላይ ነው። እባክዎ ጥቂት ሰከንዶች ጠብቀው እንደገና ይሞክሩ።'
        );
        setIsConnecting(false);
        return;
      }

      const client = google.accounts.oauth2.initTokenClient({
        client_id: '682048999019-f51079lq7qr692r8mb4e27avqqec3sro.apps.googleusercontent.com',
        scope: 'openid profile email',
        callback: async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`
                }
              });
              
              if (!res.ok) {
                throw new Error('Failed to fetch user profile');
              }

              const userInfo = await res.json();
              
              const user: AdminUser = {
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture
              };

              // Strict admin check
              if (user.email.toLowerCase() === 'yared.abegaz@gmail.com') {
                onLoginSuccess(user);
                setError(null);
                onClose();
              } else {
                setError(
                  currentLanguage === 'en'
                    ? `Access Denied: "${user.email}" is not authorized as an administrator. Only "yared.abegaz@gmail.com" has admin rights.`
                    : `መዳረሻ ተከልክሏል፡ "${user.email}" የአስተዳዳሪ ፈቃድ የለውም። "yared.abegaz@gmail.com" ብቻ ነው የአስተዳዳሪ መብት ያለው።`
                );
              }
            } catch (err) {
              console.error('Error fetching user info:', err);
              setError(
                currentLanguage === 'en'
                  ? 'Failed to retrieve Google user profile details.'
                  : 'የጉግል ፕሮፋይል መረጃን ማግኘት አልተቻለም።'
              );
            } finally {
              setIsConnecting(false);
            }
          } else {
            setIsConnecting(false);
          }
        },
        error_callback: (err: any) => {
          console.error('OAuth error callback:', err);
          setError(
            currentLanguage === 'en'
              ? 'Google authorization was canceled or failed.'
              : 'የጉግል ማረጋገጫ ተቋርጧል ወይም አልተሳካም።'
          );
          setIsConnecting(false);
        }
      });

      client.requestAccessToken();
    } catch (err) {
      console.error('OAuth execution error:', err);
      setError(
        currentLanguage === 'en'
          ? 'An unexpected error occurred during sign-in.'
          : 'በመግቢያው ሂደት ላይ ያልተጠበቀ ስህተት አጋጥሟል።'
      );
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" id="login-modal-overlay">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-50 transition-colors"
          id="close-login-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Shield Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-sans font-black text-xl text-black uppercase tracking-tight">
              {currentLanguage === 'en' ? 'Admin Portal Sign-In' : 'የአስተዳዳሪ ፖርታል መግቢያ'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {currentLanguage === 'en' 
                ? 'Authorized back-office credentials required.' 
                : 'የተፈቀደላቸው የአስተዳዳሪ ምስክር ወረቀቶች ያስፈልጋሉ።'}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed mb-6">
          {currentLanguage === 'en'
            ? 'Connect your Google Account to authorize back-office access. Only yared.abegaz@gmail.com is allowed to manage inventory, catalog categories, and customer orders.'
            : 'የአስተዳዳሪ ፖርታሉን ለመክፈት የጉግል አካውንትዎን ያገናኙ። "yared.abegaz@gmail.com" ብቻ ነው እቃዎችን፣ ካታሎጎችን እና የደንበኛ ትዕዛዞችን ማስተዳደር የሚችለው።'}
        </p>

        {/* Error Notification Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 text-red-700 animate-fadeIn" id="login-error-banner">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs">
                {currentLanguage === 'en' ? 'Authorization Failed' : 'ማረጋገጥ አልተቻለም'}
              </h4>
              <p className="text-[11px] leading-relaxed text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={isConnecting}
            className={`w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 rounded-2xl shadow-sm bg-white hover:bg-gray-50 text-sm font-bold text-gray-800 transition-all cursor-pointer ${
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
                ? (currentLanguage === 'en' ? 'Connecting...' : 'በመገናኘት ላይ...') 
                : (currentLanguage === 'en' ? 'Continue with Google' : 'በጉግል ቀጥል')}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-gray-500 hover:text-black transition-colors"
            id="cancel-login-action"
          >
            {currentLanguage === 'en' ? 'Back to Shopping' : 'ወደ ግብይት ተመለስ'}
          </button>
        </div>

      </div>
    </div>
  );
}
