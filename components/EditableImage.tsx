
import React, { useRef, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface EditableImageProps {
  src?: string;
  alt: string;
  className?: string;
  onImageChange: (newSrc: string) => void;
  placeholderIcon?: React.ReactNode;
}

const EditableImage: React.FC<EditableImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  onImageChange,
  placeholderIcon 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  const handleStart = () => {
    setIsPressing(true);
    pressTimer.current = setTimeout(() => {
      fileInputRef.current?.click();
      setIsPressing(false);
      // Optional: Vibrate to indicate long press action
      if (navigator.vibrate) navigator.vibrate(50);
    }, 800);
  };

  const handleEnd = () => {
    setIsPressing(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      <div 
        className={`relative overflow-hidden cursor-pointer select-none ${className}`}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onContextMenu={(e) => e.preventDefault()}
      >
         {/* Visual feedback overlay */}
         <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isPressing ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30">
               更換圖片
            </div>
         </div>

        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover pointer-events-none" 
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
             {placeholderIcon || <ImageIcon size={24} />}
          </div>
        )}
      </div>
    </>
  );
};

export default EditableImage;
