import React, { useState } from "react";
import { Emotion, EMOTION_COLORS } from "../types/emotion";

interface EmotionDotProps {
  emotion: Emotion;
  scale: number;
  onHover: (emotion: Emotion | null) => void;
}

export const EmotionDot: React.FC<EmotionDotProps> = ({
  emotion,
  scale,
  onHover,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = EMOTION_COLORS[emotion.emotion];

  const handleEnter = () => {
    setIsHovered(true);
    onHover(emotion);
  };

  const handleLeave = () => {
    setIsHovered(false);
    onHover(null);
  };

  return (
    <div
      className="absolute transition-transform duration-300 cursor-pointer touch-none"
      style={{
        left: `${emotion.x}%`,
        top: `${emotion.y}%`,
        transform: `translate(-50%, -50%) scale(${
          scale * (isHovered ? 1.3 : 1)
        })`,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
    >
      <div
        className="w-3 h-3 rounded-full transition-all duration-300"
        style={{
          backgroundColor: config.color,
          boxShadow: isHovered
            ? `0 0 20px ${config.glow}, 0 0 40px ${config.glow}`
            : `0 0 8px ${config.glow}`,
        }}
      />
    </div>
  );
};
