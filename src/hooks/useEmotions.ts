import { useState, useEffect } from "react";
import { supabase, DatabaseEmotion } from "../lib/supabase";
import { Emotion, EmotionType } from "../types/emotion";

export const useEmotions = () => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const convertDatabaseEmotion = (dbEmotion: DatabaseEmotion): Emotion => ({
    id: dbEmotion.id,
    text: dbEmotion.text,
    emotion: dbEmotion.emotion as EmotionType,
    x: Number(dbEmotion.x),
    y: Number(dbEmotion.y),
    timestamp: new Date(dbEmotion.created_at).getTime(),
  });

  const fetchEmotions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("emotions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      const convertedEmotions = data?.map(convertDatabaseEmotion) || [];
      setEmotions(convertedEmotions);
      setError(null);
    } catch (err) {
      console.error("Error fetching emotions:", err);
      setError(
        err instanceof Error ? err.message : "Nie udało się załadować emocji"
      );
    } finally {
      setLoading(false);
    }
  };

  const addEmotion = async (
    text: string,
    emotionType: EmotionType
  ): Promise<boolean> => {
    try {
      setError(null);

      if (!text.trim()) {
        throw new Error("Tekst nie może być pusty");
      }

      if (text.trim().length > 100) {
        throw new Error("Tekst jest za długi (maksymalnie 100 znaków)");
      }

      const newEmotion = {
        text: text.trim(),
        emotion: emotionType,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
      };

      console.log("Adding emotion:", newEmotion);

      const { data, error } = await supabase
        .from("emotions")
        .insert([newEmotion])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(`Błąd dodawania emocji: ${error.message}`);
      }

      if (!data) {
        throw new Error("Nie otrzymano danych z bazy");
      }

      console.log("Emotion added successfully:", data);

      const convertedEmotion = convertDatabaseEmotion(data);
      setEmotions((prev) => [convertedEmotion, ...prev]);

      return true;
    } catch (err) {
      console.error("Error adding emotion:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Nie udało się dodać emocji";
      setError(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    fetchEmotions();

    const subscription = supabase
      .channel("emotions_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "emotions",
        },
        (payload) => {
          console.log("Real-time insert:", payload);
          try {
            const newEmotion = convertDatabaseEmotion(
              payload.new as DatabaseEmotion
            );
            setEmotions((prev) => {
              if (prev.some((e) => e.id === newEmotion.id)) {
                return prev;
              }
              return [newEmotion, ...prev];
            });
          } catch (err) {
            console.error("Error processing real-time update:", err);
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    emotions,
    loading,
    error,
    addEmotion,
    refetch: fetchEmotions,
  };
};
