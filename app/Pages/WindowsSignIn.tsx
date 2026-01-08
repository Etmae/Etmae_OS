import React from 'react';
import { useNavigate } from 'react-router-dom';
import { enterFullScreen } from '../utils/fullscreen'; // Adjust path as needed

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

  const handleSignIn = async () => {
    // 1. Fire the fullscreen request (User-initiated gesture)
    await enterFullScreen();

    // 2. Handle the navigation/state logic
    if (onSuccess) {
      onSuccess();
    } else {
      try {
        await navigate('/desktop');
      } catch (error) {
        console.error('Navigation failed:', error);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-blue-600 overflow-hidden select-none">
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: 'blur(40px) brightness(0.7)',
        }}
      />

      {/* Sign-in Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* User Avatar */}
        <div className="mb-8">
          <div 
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-cover bg-center shadow-2xl border-2 border-white/10"
            style={{ backgroundImage: `url(${userAvatar})` }}
          />
        </div>

        {/* Username */}
        <h1 
          className="text-white text-3xl md:text-4xl mb-12 tracking-tight" 
          style={{ fontFamily: 'Segoe UI, system-ui, sans-serif', fontWeight: 400 }}
        >
          {userName}
        </h1>

        {/* Sign In Button */}
        <button
          type="button"
          onClick={handleSignIn}
          className="px-14 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white rounded transition-all shadow-lg active:scale-95"
          style={{ fontFamily: 'Segoe UI, sans-serif' }}
        >
          Sign in
        </button>

        {/* Bottom Right Icons - Visual Only for now */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4 text-white/80">
          <WifiIcon />
          <BatteryIcon />
        </div>
      </div>
    </div>
  );
};

// Simple Icon Components to keep JSX clean
const WifiIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const BatteryIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="7" width="16" height="10" rx="2" />
    <path d="M21 10v4" strokeLinecap="round" />
    <path d="M6 10h6v4H6z" fill="currentColor" />
  </svg>
);