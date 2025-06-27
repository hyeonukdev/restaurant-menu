import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      sections: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      dishes: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          ingredients: string | null;
          image_url: string | null;
          best_seller: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          ingredients?: string | null;
          image_url?: string | null;
          best_seller?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          ingredients?: string | null;
          image_url?: string | null;
          best_seller?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      prices: {
        Row: {
          id: number;
          dish_id: number;
          name: string;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          dish_id: number;
          name: string;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          dish_id?: number;
          name?: string;
          price?: number;
          created_at?: string;
        };
      };
      section_items: {
        Row: {
          id: number;
          section_id: number;
          dish_id: number;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          section_id: number;
          dish_id: number;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          section_id?: number;
          dish_id?: number;
          order_index?: number;
          created_at?: string;
        };
      };
    };
  };
}
