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
      restaurant_info: {
        Row: {
          id: number;
          name: string;
          description: string;
          address_street: string;
          address_city: string;
          address_state: string;
          address_postal_code: string;
          address_country: string;
          contact_phone: string;
          contact_instagram: string;
          business_hours_weekday_open: string;
          business_hours_weekday_last_order: string;
          business_hours_weekday_close: string;
          business_hours_weekend_open: string;
          business_hours_weekend_last_order: string;
          business_hours_weekend_close: string;
          mobile_business_hours: string;
          images_og_image: string;
          images_home_layout_image: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description: string;
          address_street: string;
          address_city: string;
          address_state: string;
          address_postal_code: string;
          address_country: string;
          contact_phone: string;
          contact_instagram: string;
          business_hours_weekday_open: string;
          business_hours_weekday_last_order: string;
          business_hours_weekday_close: string;
          business_hours_weekend_open: string;
          business_hours_weekend_last_order: string;
          business_hours_weekend_close: string;
          mobile_business_hours: string;
          images_og_image: string;
          images_home_layout_image: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          address_street?: string;
          address_city?: string;
          address_state?: string;
          address_postal_code?: string;
          address_country?: string;
          contact_phone?: string;
          contact_instagram?: string;
          business_hours_weekday_open?: string;
          business_hours_weekday_last_order?: string;
          business_hours_weekday_close?: string;
          business_hours_weekend_open?: string;
          business_hours_weekend_last_order?: string;
          business_hours_weekend_close?: string;
          mobile_business_hours?: string;
          images_og_image?: string;
          images_home_layout_image?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurant_intros: {
        Row: {
          id: number;
          title: string;
          content: string;
          display_order: number;
          is_active: boolean;
          intro_type: string;
          title_align: string;
          content_align: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title?: string;
          content?: string;
          display_order?: number;
          is_active?: boolean;
          intro_type?: string;
          title_align?: string;
          content_align?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          display_order?: number;
          is_active?: boolean;
          intro_type?: string;
          title_align?: string;
          content_align?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
