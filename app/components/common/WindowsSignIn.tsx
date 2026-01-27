import React from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// SIGN-IN COMPONENT
// ============================================================================
interface SignInProps {
  backgroundImage?: string;
  userName?: string;
  userAvatar?: string;
  onSuccess?: () => void;
}

export const WindowsSignIn: React.FC<SignInProps> = ({
  backgroundImage = 'https://wallpapercave.com/wp/wp10363825.jpg',
  userName = 'Etmae',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  onSuccess,
}) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (onSuccess) {
      // Use callback if provided (workflow mode)
      onSuccess();
    } else {
      // Fallback to navigation (standalone mode)
      navigate('/desktop');
    }
    console.log('User signed in!');
  };

  return (
    <div className="relative min-h-screen bg-blue-600 overflow-hidden">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: 'blur(40px) brightness(0.7)',
          transform: 'scale(1.0)',
        }}
      />

      {/* Sign-in Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* User Avatar */}
        <div className="mb-8">
          <div
            className="w-32 h-32 sm:w-36 sm:h-36 md:w-50 md:h-50 rounded-full bg-cover bg-center shadow-2xl  border-opacity-20"
            style={{
              backgroundImage: `url(${userAvatar})`,
            }}
          />
        </div>

        {/* Username */}
        <div
          className="text-white text-2xl sm:text-3xl md:text-4xl mb-12"
          style={{
            fontFamily: 'Segoe UI, sans-serif',
            fontWeight: 450,
          }}
        >
          {userName}
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          className="px-12 py-3 bg-blue-600 bg-opacity-90 hover:bg-opacity-100 text-white rounded text-base sm:text-lg transition-all shadow-lg"
          style={{
            fontFamily: 'Segoe UI, sans-serif',
            fontWeight: 400,
          }}
        >
          Sign in
        </button>

        {/* Bottom Right Icons */}
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 flex gap-1">
          {/* WiFi Icon */}
          <button className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-white opacity-80 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </button>

          {/* Battery Icon */}
          <button className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-white opacity-80 hover:opacity-100 transition-opacity">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="7" width="18" height="10" rx="2" ry="2" />
              <line x1="22" y1="11" x2="22" y2="13" strokeLinecap="round" />
              <rect x="5" y="9.5" width="10" height="5" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};















