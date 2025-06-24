import React, { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { EmotionType, EMOTION_COLORS } from "../types/emotion";

interface AddEmotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (text: string, emotion: EmotionType) => Promise<boolean>;
}

export const AddEmotionModal: React.FC<AddEmotionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [text, setText] = useState("");
  const [selectedEmotion, setSelectedEmotion] =
    useState<EmotionType>("sadness");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const success = await onAdd(text.trim(), selectedEmotion);

      if (success) {
        setText("");
        setSelectedEmotion("sadness");
        onClose();
      } else {
        setSubmitError("Error");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setSubmitError("Wystąpił błąd podczas dodawania emocji");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setText("");
      setSelectedEmotion("sadness");
      setSubmitError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-gray-900 rounded-2xl p-5 sm:p-6 w-full max-w-md border border-gray-700 shadow-2xl z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Share your feeling
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition-colors p-1 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {submitError && (
          <div className="mb-4 bg-red-900/50 border border-red-700 rounded-lg p-3">
            <p className="text-red-300 text-sm">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What do you feel?
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write briefly about your feeling..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none disabled:opacity-50 text-sm"
              rows={3}
              maxLength={100}
              required
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {text.length}/100
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Choose an emotion
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(EMOTION_COLORS).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedEmotion(key as EmotionType)}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-all disabled:opacity-50 ${
                    selectedEmotion === key
                      ? "border-white bg-gray-800"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-sm text-gray-300">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={!text.trim() || isSubmitting}
              className="w-full sm:w-auto sm:flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
