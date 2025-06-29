import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const {
        name,
        description,
        address,
        contact,
        businessHours,
        mobileBusinessHours,
        images,
      } = req.body;

      // 데이터 검증
      if (!name || !description) {
        return res.status(400).json({
          error: "필수 필드가 누락되었습니다.",
        });
      }

      // Supabase 업데이트
      const { data, error } = await supabase
        .from("restaurant_info")
        .update({
          name,
          description,
          address_street: address.street,
          address_city: address.city,
          address_state: address.state,
          address_postal_code: address.postalCode,
          address_country: address.country,
          contact_phone: contact.phone,
          contact_instagram: contact.instagram,
          business_hours_weekday_open: businessHours.weekday.open,
          business_hours_weekday_last_order: businessHours.weekday.lastOrder,
          business_hours_weekday_close: businessHours.weekday.close,
          business_hours_weekend_open: businessHours.weekend.open,
          business_hours_weekend_last_order: businessHours.weekend.lastOrder,
          business_hours_weekend_close: businessHours.weekend.close,
          mobile_business_hours: mobileBusinessHours,
          images_og_image: images.ogImage,
          images_home_layout_image: images.homeLayoutImage,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        return res.status(500).json({
          error: "레스토랑 정보 업데이트에 실패했습니다.",
        });
      }

      res.status(200).json({
        message: "레스토랑 정보가 성공적으로 업데이트되었습니다.",
        data,
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        error: "서버 오류가 발생했습니다.",
      });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
