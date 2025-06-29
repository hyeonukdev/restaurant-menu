import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("=== Supabase 초기화 시작 ===");

    // 1. restaurant_info 테이블 확인
    const { data: existingRestaurant, error: restaurantCheckError } =
      await supabase.from("restaurant_info").select("id").limit(1);

    if (restaurantCheckError) {
      console.error("Restaurant info check error:", restaurantCheckError);
      return res.status(500).json({
        success: false,
        message: "레스토랑 정보 확인 중 오류 발생",
        error: restaurantCheckError.message,
      });
    }

    // 2. restaurant_intros 테이블 확인
    const { data: existingIntros, error: introsCheckError } = await supabase
      .from("restaurant_intros")
      .select("id")
      .limit(1);

    if (introsCheckError) {
      console.error("Intros check error:", introsCheckError);
      return res.status(500).json({
        success: false,
        message: "인트로 정보 확인 중 오류 발생",
        error: introsCheckError.message,
      });
    }

    const results = {
      restaurant_info: {
        exists: existingRestaurant && existingRestaurant.length > 0,
        inserted: false,
      },
      restaurant_intros: {
        exists: existingIntros && existingIntros.length > 0,
        inserted: false,
      },
    };

    // 3. restaurant_info가 없으면 삽입
    if (!results.restaurant_info.exists) {
      console.log("Restaurant info 삽입 중...");
      const { data: insertedRestaurant, error: restaurantInsertError } =
        await supabase
          .from("restaurant_info")
          .insert({
            name: "Aukra",
            description:
              "양재천 최고의 뷰맛집! 수제 오픈샌드위치와 커피, 그리고 와인의 올데이 브런치 카페입니다.",
            address_street: "서울 서초구 양재천로 97",
            address_city: "서울",
            address_state: "서울특별시",
            address_postal_code: "12345",
            address_country: "대한민국",
            contact_phone: "050-71378-8186",
            contact_instagram: "@aukra.yangjae",
            business_hours_weekday_open: "10:00 am",
            business_hours_weekday_last_order: "6:00 pm",
            business_hours_weekday_close: "7:00 pm",
            business_hours_weekend_open: "10:00 am",
            business_hours_weekend_last_order: "9:00 pm",
            business_hours_weekend_close: "10:00 pm",
            mobile_business_hours:
              "운영시간: 10:00~19:00(평일), 10:00~22:00(주말)",
            images_og_image: "/images/og-image.png",
            images_home_layout_image: "/images/home-layout.png",
          })
          .select()
          .single();

      if (restaurantInsertError) {
        console.error("Restaurant info insert error:", restaurantInsertError);
        return res.status(500).json({
          success: false,
          message: "레스토랑 정보 삽입 실패",
          error: restaurantInsertError.message,
        });
      }

      results.restaurant_info.inserted = true;
      console.log("Restaurant info 삽입 완료");
    }

    // 4. restaurant_intros가 없으면 삽입
    if (!results.restaurant_intros.exists) {
      console.log("Restaurant intros 삽입 중...");
      const { data: insertedIntros, error: introsInsertError } = await supabase
        .from("restaurant_intros")
        .insert([
          {
            title: "양재천 최고의 뷰맛집!",
            content: "",
            display_order: 1,
            intro_type: "highlight",
          },
          {
            title: "",
            content: "낮에는 커피, 저녁에는 한 잔의 여유",
            display_order: 2,
            intro_type: "text",
          },
          {
            title: "",
            content:
              "오크라는 브런치와 커피를 사랑하는 분들을 위한 공간이자,\n북유럽의 여유로운 하루처럼 낮에도 맥주와 와인을 즐길 수 있는\n 복합문화공간으로 확장하고 있습니다.",
            display_order: 3,
            intro_type: "text",
          },
          {
            title: "인기 브런치 메뉴는 그대로!",
            content: "<트러플 머쉬룸 샌드위치> \n <선드라이드 바질 샌드위치>",
            display_order: 4,
            intro_type: "menu",
          },
          {
            title: "이젠 한 낮에도 맥주와 와인을 자유롭게",
            content:
              "<산책 후, 시원한 맥주 한 잔> \n <여유로운 오후, 와인 한 모금>",
            display_order: 5,
            intro_type: "menu",
          },
          {
            title: "",
            content:
              "당신의 하루가 머무는 곳, \n 언제 찾아도 편안한 오크라에서\n 커피도 좋고, 술도 좋은 시간을 즐겨보세요.",
            display_order: 6,
            intro_type: "text",
          },
          {
            title: "",
            content: "낮술? 아니죠,\n 낮의 여유입니다.",
            display_order: 7,
            intro_type: "slogan",
          },
          {
            title: "",
            content: "양재천 옆, 오크라 드림",
            display_order: 8,
            intro_type: "slogan",
          },
        ])
        .select();

      if (introsInsertError) {
        console.error("Intros insert error:", introsInsertError);
        return res.status(500).json({
          success: false,
          message: "인트로 정보 삽입 실패",
          error: introsInsertError.message,
        });
      }

      results.restaurant_intros.inserted = true;
      console.log("Restaurant intros 삽입 완료:", insertedIntros?.length, "개");
    }

    console.log("=== Supabase 초기화 완료 ===");
    console.log("결과:", results);

    return res.status(200).json({
      success: true,
      message: "Supabase 초기화 완료",
      results,
    });
  } catch (error) {
    console.error("Supabase 초기화 오류:", error);
    return res.status(500).json({
      success: false,
      message: "Supabase 초기화 중 오류 발생",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
