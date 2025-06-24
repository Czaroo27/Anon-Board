import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables:", {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
  });
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

console.log("Initializing Supabase client with URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export interface DatabaseEmotion {
  id: string;
  text: string;
  emotion: string;
  x: number;
  y: number;
  created_at: string;
}

supabase
  .from("emotions")
  .select("count", { count: "exact", head: true })
  .then(({ error, count }) => {
    if (error) {
      console.error("Supabase connection test failed:", error);
    } else {
      console.log("Supabase connected successfully. Emotions count:", count);
    }
  });
