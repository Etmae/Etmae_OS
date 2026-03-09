import React from 'react';

interface DesktopWallpaperProps {
  backgroundImage?: string;
}

export const DesktopWallpaper: React.FC<DesktopWallpaperProps> = ({
  backgroundImage = 'https://wallpapercave.com/wp/wp10363825.jpg'
}) => {
  return (
    <>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/5" />
    </>
  );
};
