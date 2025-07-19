import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Heart } from 'lucide-react-native';

interface HeartIconProps {
  isInWishlist: boolean;
  onPress: () => void;
  size?: number;
  className?: string;
  style?: any;
}

export function HeartIcon({ 
  isInWishlist, 
  onPress, 
  size = 18, 
  className = "absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full items-center justify-center",
  style 
}: HeartIconProps) {
  return (
    <TouchableOpacity 
      className={className}
      style={style}
      onPress={onPress}
    >
      <Heart 
        size={size} 
        color={isInWishlist ? "#EF4444" : "#6B7280"} 
        fill={isInWishlist ? "#EF4444" : "none"}
      />
    </TouchableOpacity>
  );
}