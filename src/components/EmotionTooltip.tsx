import React from "react";
import { Emotion, EMOTION_COLORS } from "../types/emotion";

interface EmotionTooltipProps {
  emotion: Emotion;
  mousePosition: { x: number; y: number };
}

export const EmotionTooltip: React.FC<EmotionTooltipProps> = ({
  emotion,
  mousePosition,
}) => {
  const config = EMOTION_COLORS[emotion.emotion];

  // Zapewnij, że tooltip nie wyjdzie poza ekran
  const offsetX = 15;
  const offsetY = 10;
  const tooltipWidth = 280; // szacowana szerokość w px

  const left = Math.min(
    window.innerWidth - tooltipWidth - 16,
    mousePosition.x + offsetX
  );
  const top = Math.max(8, mousePosition.y - offsetY);

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-200"
      style={{
        left,
        top,
      }}
    >
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 max-w-[90vw] sm:max-w-xs shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span className="text-xs text-gray-400 font-medium">
            {config.label}
          </span>
        </div>
        <p className="text-sm text-gray-100 leading-relaxed break-words">
          {emotion.text}
        </p>
        <div className="text-xs text-gray-500 mt-2">
          {new Date(emotion.timestamp).toLocaleString("pl-PL")}
        </div>
      </div>
    </div>
  );
};
