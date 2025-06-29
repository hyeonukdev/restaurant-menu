import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("=== Restaurant API 디버깅 ===");

    // 1. restaurant_info 테이블 조회
    const { data: restaurantData, error: restaurantError } = await supabase
      .from("restaurant_info")
      .select("*")
      .single();

    console.log("Restaurant info query result:", {
      data: restaurantData,
      error: restaurantError,
      hasData: !!restaurantData,
    });

    if (restaurantError) {
      console.error("Restaurant info error:", restaurantError);
      return res.status(500).json({
        success: false,
        message: "레스토랑 정보 조회 실패",
        error: restaurantError.message,
      });
    }

    // 2. restaurant_intros 테이블 조회
    const { data: introsData, error: introsError } = await supabase
      .from("restaurant_intros")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    console.log("Intros query result:", {
      data: introsData,
      error: introsError,
      count: introsData?.length || 0,
    });

    if (introsError) {
      console.error("Intros error:", introsError);
      return res.status(500).json({
        success: false,
        message: "인트로 정보 조회 실패",
        error: introsError.message,
      });
    }

    // 3. 데이터 구조 변환 (원본 API와 동일)
    const transformedData = {
      name: restaurantData.name,
      description: restaurantData.description,
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
        content: intro.content,
      })),
      images: {
        ogImage: restaurantData.images_og_image,
        homeLayoutImage: restaurantData.images_home_layout_image,
      },
    };

    console.log("Transformed data:", {
      name: transformedData.name,
      introCount: transformedData.intro.length,
      introData: transformedData.intro,
    });

    return res.status(200).json({
      success: true,
      message: "Restaurant information retrieved successfully",
      data: transformedData,
      debug: {
        originalRestaurant: restaurantData,
        originalIntros: introsData,
        transformedData: transformedData,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
