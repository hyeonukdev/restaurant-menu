import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해주세요."
  );
}

// 클라이언트 생성 (환경 변수가 없어도 빌드는 성공하도록)
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

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
          price: number;
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
          price: number;
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
          price?: number;
          best_seller?: boolean;
          created_at?: string;
          updated_at?: string;
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
