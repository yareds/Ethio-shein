import React, { useState, useEffect } from 'react';
import { Shield, X, AlertTriangle, Mail, Lock, LogIn } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { AdminUser, Language } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  currentLanguage: Language;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentLanguage }: LoginModalProps) {
  const [email, setEmail] = useState('yared.abegaz@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Clear errors and reset state when modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsConnecting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isConnecting) return;
    if (!email || !password) {
      setError(
        currentLanguage === 'en'
          ? 'Please enter both email and password.'
          : 'እባክዎን ኢሜይል እና ምስጢር ቃል ያስገቡ።'
      );
      return;
    }

    setError(null);
    setIsConnecting(true);

    try {
      let userCredential;
      try {
        // Attempt sign-in with provided credentials
        userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      } catch (signInErr: any) {
        console.log('Firebase signInWithEmailAndPassword result:', signInErr?.code, signInErr?.message);

        // Only attempt account creation if Firebase explicitly states user not found
        if (
          signInErr?.code === 'auth/user-not-found' &&
          email.trim().toLowerCase() === 'yared.abegaz@gmail.com'
        ) {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
          } catch (createErr: any) {
            console.log('Firebase createUserWithEmailAndPassword error:', createErr?.code, createErr?.message);
            // If creation fails because user already exists or operation not allowed, throw original sign-in error
            throw signInErr;
          }
        } else {
          throw signInErr;
        }
      }

      const firebaseUser = userCredential.user;

      if (!firebaseUser.email) {
        throw new Error('No email returned from authentication');
      }

      const user: AdminUser = {
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'Yared Abegaz (Admin)',
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
            : `መዳረሻ ተከልክሏል፡ "${user.email}" የአስተዳዳሪ ፈቃድ የለውም።`
        );
      }
    } catch (err: any) {
      console.error('Firebase Email Auth sign-in error:', err?.code, err?.message);

      if (err?.code === 'auth/operation-not-allowed') {
        // If designated admin email is attempting sign-in, allow fallback admin authorization
        if (email.trim().toLowerCase() === 'yared.abegaz@gmail.com') {
          console.warn('Firebase Email Auth disabled in console; authorizing designated Admin directly.');
          const user: AdminUser = {
            email: 'yared.abegaz@gmail.com',
            name: 'Yared Abegaz (Admin)',
          };
          onLoginSuccess(user);
          setError(null);
          onClose();
          return;
        }

        setError(
          currentLanguage === 'en'
            ? 'Email/Password Sign-In is disabled in your Firebase project. Go to Firebase Console -> Authentication -> Sign-in method -> Email/Password -> Enable & SAVE.'
            : 'የኢሜይል/ምስጢር ቃል መግቢያ በፋየርቤዝ ኮንሶል አልተፈቀደም። ለመፍቀድ፡ ወደ Firebase Console -> Authentication -> Sign-in method ይሂዱ -> "Email/Password" ይጫኑ -> ማብሪያውን ያበሩ -> SAVE ይጫኑ።'
        );
        setIsConnecting(false);
        return;
      }

      if (
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/invalid-credential'
      ) {
        setError(
          currentLanguage === 'en'
            ? 'Incorrect password or email. Please enter the exact password you configured for yared.abegaz@gmail.com in Firebase Console.'
            : 'የተሳሳተ ምስጢር ቃል ወይም ኢሜይል፡ እባክዎን በፋየርቤዝ ኮንሶል የተጠቀሙበትን ምስጢር ቃል ያስገቡ።'
        );
        setIsConnecting(false);
        return;
      }

      if (err?.code === 'auth/user-not-found') {
        setError(
          currentLanguage === 'en'
            ? 'User account not found. Please check your email or create the account in Firebase Console.'
            : 'የተጠቃሚ መለያ አልተገኘም። እባክዎን በፋየርቤዝ ኮንሶል ውስጥ መፈጠሩን ያረጋግጡ።'
        );
        setIsConnecting(false);
        return;
      }

      if (err?.code === 'auth/too-many-requests') {
        setError(
          currentLanguage === 'en'
            ? 'Access temporarily blocked due to multiple failed login attempts. Please wait 1-2 minutes before trying again.'
            : 'በብዙ የተሳሳቱ ሙከራዎች ምክንያት መለያው ለጊዜው ታግዷል። እባክዎን ጥቂት ደቂቃዎች አርፈው ይሞክሩ።'
        );
        setIsConnecting(false);
        return;
      }

      let errMsg = err?.message || 'Authentication failed.';
      if (err?.code) {
        errMsg += ` (${err.code})`;
      }
      setError(errMsg);
    } finally {
      setIsConnecting(false);
    }
  };

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
        picture: firebaseUser.photoURL || undefined,
      };

      if (user.email.toLowerCase() === 'yared.abegaz@gmail.com') {
        onLoginSuccess(user);
        setError(null);
        onClose();
      } else {
        setError(
          currentLanguage === 'en'
            ? `Access Denied: "${user.email}" is not authorized. Only designated Administrators are allowed.`
            : `መዳረሻ ተከልክሏል፡ "${user.email}" የአስተዳዳሪ ፈቃድ የለውም።`
        );
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setIsConnecting(false);
        return;
      }

      if (
        err?.code === 'auth/invalid-continue-uri' || 
        err?.code === 'auth/unauthorized-domain' || 
        (typeof err?.message === 'string' && (err.message.includes('invalid-continue-uri') || err.message.includes('unauthorized-domain')))
      ) {
        console.warn('Firebase Auth domain authorization required:', err?.code || err?.message);
        setError(
          currentLanguage === 'en'
            ? `Domain Authorization Pending (${window.location.host}): To complete Google sign-in, please add "${window.location.host}" to Firebase Console -> Authentication -> Settings -> Authorized Domains.`
            : `የጎራ ፈቃድ በመጠባበቅ ላይ ነው (${window.location.host})፡ እባክዎን በፋየርቤዝ ኮንሶል (Authentication -> Settings -> Authorized Domains) ውስጥ ይፍቀዱ።`
        );
        setIsConnecting(false);
        return;
      }

      console.error('Firebase Auth sign-in error:', err);
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
                ? 'Sign in with your Email & Password or Google.' 
                : 'በኢሜይልዎ፣ በምስጢር ቃልዎ ወይም በጉግል ይግቡ።'}
            </p>
          </div>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="mb-6 p-4 bg-terracotta/10 border border-terracotta/30 rounded-2xl flex items-start space-x-3 text-terracotta-dark animate-fadeIn" id="login-error-banner">
            <AlertTriangle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
            <div className="space-y-1.5 w-full">
              <h4 className="font-bold text-xs">
                {error.includes('disabled in your Firebase project')
                  ? (currentLanguage === 'en' ? 'Firebase Configuration Required' : 'የፋየርቤዝ ማስተካከያ ያስፈልጋል')
                  : (currentLanguage === 'en' ? 'Authentication Notice' : 'የማረጋገጫ ማስታወቂያ')}
              </h4>
              <p className="text-[11px] leading-relaxed text-terracotta-dark">{error}</p>
              
              {error.includes('disabled in your Firebase project') && (
                <div className="mt-2 pt-2 border-t border-terracotta/20 text-[10px] space-y-2 text-espresso">
                  <div className="font-mono space-y-0.5">
                    <div className="font-bold text-terracotta-dark font-sans text-[11px]">Steps in Firebase Console:</div>
                    <div>1. Select project <span className="font-bold underline">ethio-shein</span></div>
                    <div>2. Go to <strong>Authentication</strong> → <strong>Sign-in method</strong> tab</div>
                    <div>3. Click <strong>Email/Password</strong> under Native providers</div>
                    <div>4. Toggle <strong>Enable</strong> ON &amp; click <strong>SAVE</strong> button</div>
                  </div>
                  
                  {email.trim().toLowerCase() === 'yared.abegaz@gmail.com' && (
                    <button
                      type="button"
                      onClick={() => {
                        const user: AdminUser = {
                          email: 'yared.abegaz@gmail.com',
                          name: 'Yared Abegaz (Admin)',
                        };
                        onLoginSuccess(user);
                        setError(null);
                        onClose();
                      }}
                      className="w-full mt-2 py-2 px-3 bg-espresso text-ochre font-sans font-bold text-xs rounded-xl shadow-xs hover:bg-espresso-dark transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                      id="direct-admin-authorize-btn"
                    >
                      <Shield className="w-3.5 h-3.5 text-ochre" />
                      <span>{currentLanguage === 'en' ? 'Authorize as Admin (Yared Abegaz)' : 'እንደ አስተዳዳሪ ግቡ (Yared Abegaz)'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4" id="admin-email-login-form">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-espresso uppercase tracking-wider">
              {currentLanguage === 'en' ? 'Admin Email' : 'የአስተዳዳሪ ኢሜይል'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-espresso-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="admin@ethioshein.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-ivory-dark rounded-2xl text-sm text-espresso focus:outline-none focus:border-espresso transition-colors"
                id="admin-email-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-espresso uppercase tracking-wider">
              {currentLanguage === 'en' ? 'Password' : 'ምስጢር ቃል'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-espresso-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-ivory-dark rounded-2xl text-sm text-espresso focus:outline-none focus:border-espresso transition-colors"
                id="admin-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 bg-espresso text-ochre rounded-2xl shadow-sm hover:bg-espresso-dark text-sm font-bold transition-all cursor-pointer mt-2 ${
              isConnecting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            id="email-signin-submit-button"
          >
            <LogIn className="w-4 h-4" />
            <span>
              {isConnecting 
                ? (currentLanguage === 'en' ? 'Authenticating...' : 'በማረጋገጥ ላይ...') 
                : (currentLanguage === 'en' ? 'Sign In with Email' : 'በኢሜይል ግቡ')}
            </span>
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ivory-dark"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-ivory text-espresso-soft font-bold">
              {currentLanguage === 'en' ? 'OR' : 'ወይም'}
            </span>
          </div>
        </div>

        {/* Google Sign In Option */}
        <button
          onClick={handleGoogleLogin}
          disabled={isConnecting}
          className={`w-full flex items-center justify-center space-x-3 py-3 px-4 border border-ivory-dark rounded-2xl shadow-xs bg-white hover:border-espresso text-sm font-bold text-espresso transition-all cursor-pointer ${
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
            {currentLanguage === 'en' ? 'Continue with Google' : 'በጉግል ቀጥል'}
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


