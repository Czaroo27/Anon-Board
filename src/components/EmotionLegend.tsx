import React from "react";
import { EMOTION_COLORS, EmotionType } from "../types/emotion";

interface EmotionLegendProps {
  emotionCounts: Record<EmotionType, number>;
  totalEmotions: number;
  onAddClick: () => void;
}

export const EmotionLegend: React.FC<EmotionLegendProps> = ({
  emotionCounts,
  totalEmotions,
}) => {
  return (
    <div className="fixed top-4 left-4 sm:top-4 sm:left-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-xl w-[calc(100vw-2rem)] max-w-xs sm:w-auto sm:max-w-xs z-40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          Emotion Map
        </h3>
      </div>

      <div className="space-y-2 mb-4">
        {Object.entries(EMOTION_COLORS).map(([key, config]) => {
          const count = emotionCounts[key as EmotionType] || 0;
          const percentage =
            totalEmotions > 0 ? (count / totalEmotions) * 100 : 0;

          return (
            <div key={key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-sm text-gray-300">{config.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{count}</span>
                <div className="w-10 sm:w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      backgroundColor: config.color,
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-gray-500 border-t border-gray-700 pt-3 text-right">
        Total: {totalEmotions} {totalEmotions === 1 ? "emotion" : "emotions"}
      </div>
    </div>
  );
};
