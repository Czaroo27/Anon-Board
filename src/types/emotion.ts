export interface Emotion {
  id: string;
  text: string;
  emotion: EmotionType;
  x: number;
  y: number;
  timestamp: number;
}

export type EmotionType =
  | "sadness"
  | "anger"
  | "hope"
  | "joy"
  | "emptiness"
  | "anxiety";

export interface EmotionConfig {
  color: string;
  label: string;
  glow: string;
}

export const EMOTION_COLORS: Record<EmotionType, EmotionConfig> = {
  sadness: { color: "#3B82F6", label: "Sadness", glow: "#3B82F680" },
  anger: { color: "#EF4444", label: "Anger", glow: "#EF444480" },
  hope: { color: "#10B981", label: "Hope", glow: "#10B98180" },
  joy: { color: "#F59E0B", label: "Joy", glow: "#F59E0B80" },
  emptiness: { color: "#E5E7EB", label: "Emptiness", glow: "#E5E7EB80" },
  anxiety: { color: "#8B5CF6", label: "Anxiety", glow: "#8B5CF680" },
};
