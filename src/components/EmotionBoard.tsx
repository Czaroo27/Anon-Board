import React, { useState, useEffect, useCallback } from "react";
import { EmotionDot } from "./EmotionDot";
import { EmotionTooltip } from "./EmotionTooltip";
import { AddEmotionModal } from "./AddEmotionModal";
import { EmotionLegend } from "./EmotionLegend";
import { LoadingSpinner } from "./LoadingSpinner";
import { useEmotions } from "../hooks/useEmotions";
import { Emotion, EmotionType } from "../types/emotion";

export const EmotionBoard: React.FC = () => {
  const { emotions, loading, error, addEmotion } = useEmotions();
  const [hoveredEmotion, setHoveredEmotion] = useState<Emotion | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const handleAddEmotion = async (
    text: string,
    emotionType: EmotionType
  ): Promise<boolean> => {
    try {
      const success = await addEmotion(text, emotionType);
      if (success) {
        setIsModalOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add emotion:", error);
      return false;
    }
  };

  const emotionCounts = emotions.reduce((acc, emotion) => {
    acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1;
    return acc;
  }, {} as Record<EmotionType, number>);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(64,224,208,0.2),transparent_50%)]" />
      </div>

      <div className="relative z-10 text-center pt-6 pb-4 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Anon Board
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          You’re not alone — someone somewhere feels the same way
        </p>
        {error && (
          <div className="mt-4 bg-red-900/50 border border-red-700 rounded-lg p-3 max-w-md mx-auto text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">
        {emotions.map((emotion) => (
          <EmotionDot
            key={emotion.id}
            emotion={emotion}
            scale={scale}
            onHover={setHoveredEmotion}
          />
        ))}

        {emotions.length === 0 && !loading && (
          <div className="absolute inset-0 flex items-center justify-center text-center text-gray-500 px-4">
            <div>
              <p className="text-lg sm:text-xl mb-2">
                No emotions on the board
              </p>
              <p className="text-sm">Be the first to share your feeling</p>
            </div>
          </div>
        )}
      </div>

      {hoveredEmotion && (
        <EmotionTooltip
          emotion={hoveredEmotion}
          mousePosition={mousePosition}
        />
      )}

      <div className="px-4 sm:px-6">
        <EmotionLegend
          emotionCounts={emotionCounts}
          totalEmotions={emotions.length}
          onAddClick={() => setIsModalOpen(true)}
        />
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 left-4 sm:left-6 flex items-center gap-2 bg-[#1E1E2F] text-white px-4 py-2 rounded-full border border-white/10 hover:bg-[#2A2A3F] transition z-50 text-sm sm:text-base"
      >
        <span className="text-lg sm:text-xl">+</span>
        <span>Add Emotion</span>
      </button>

      <AddEmotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddEmotion}
      />

      <div className="fixed bottom-4 right-4 sm:right-6 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-sm text-gray-400 max-w-[90vw] sm:max-w-xs z-40">
        <p className="mb-1">
          💡 <strong>How it works:</strong>
        </p>
        <p>
          Hover over the colorful dots to see other people's emotions. Add yours
          anonymously.
        </p>
      </div>
    </div>
  );
};
