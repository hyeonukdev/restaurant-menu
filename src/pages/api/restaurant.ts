import { supabase } from "@/lib/supabase";

// 개행 문자 변환 함수
function convertNewlines(text) {
  if (!text) return text;
  return text.replace(/\\n/g, "\n");
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      console.log("=== 홈페이지 API 호출 ===");

      // Supabase에서 restaurant 정보 가져오기
      const { data: restaurantData, error: restaurantError } = await supabase
        .from("restaurant_info")
        .select("*")
        .single();

      if (restaurantError) {
        console.error("Restaurant info error:", restaurantError);
        return res.status(500).json({
          error: "레스토랑 정보를 가져오는데 실패했습니다.",
          details: restaurantError.message,
        });
      }

      console.log("Restaurant data loaded successfully");

      // Supabase에서 intro 정보 가져오기
      const { data: introsData, error: introsError } = await supabase
        .from("restaurant_intros")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (introsError) {
        console.error("Intros error:", introsError);
        return res.status(500).json({
          error: "인트로 정보를 가져오는데 실패했습니다.",
          details: introsError.message,
        });
      }

      console.log("Intros data loaded:", {
        count: introsData?.length || 0,
        data: introsData,
      });

      // 데이터 구조 변환
      const transformedData = {
        name: restaurantData.name,
        description: convertNewlines(restaurantData.description),
        address: {
          street: restaurantData.address_street,
          city: restaurantData.address_city,
          state: restaurantData.address_state,
          postalCode: restaurantData.address_postal_code,
          country: restaurantData.address_country,
        },
        contact: {
          phone: restaurantData.contact_phone,
          instagram: restaurantData.contact_instagram,
        },
        businessHours: {
          weekday: {
            open: restaurantData.business_hours_weekday_open,
            lastOrder: restaurantData.business_hours_weekday_last_order,
            close: restaurantData.business_hours_weekday_close,
          },
          weekend: {
            open: restaurantData.business_hours_weekend_open,
            lastOrder: restaurantData.business_hours_weekend_last_order,
            close: restaurantData.business_hours_weekend_close,
          },
        },
        mobileBusinessHours: restaurantData.mobile_business_hours,
        intro: introsData.map((intro) => ({
          id: intro.id.toString(),
          title: intro.title,
          content: convertNewlines(intro.content),
        })),
        images: {
          ogImage: restaurantData.images_og_image,
          homeLayoutImage: restaurantData.images_home_layout_image,
        },
      };

      console.log(
        "Transformed data intro count:",
        transformedData.intro.length
      );

      // 캐싱 방지 헤더 설정
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      res.status(200).json({
        message: "Restaurant information retrieved successfully",
        data: transformedData,
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        error: "서버 오류가 발생했습니다.",
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
