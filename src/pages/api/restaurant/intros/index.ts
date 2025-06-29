import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      console.log("=== 관리자 페이지 Intro API 호출 ===");

      const { data, error } = await supabase
        .from("restaurant_intros")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({
          error: "인트로 정보를 가져오는데 실패했습니다.",
        });
      }

      console.log("관리자 페이지 Intro 데이터:", {
        count: data?.length || 0,
        data: data,
      });

      res.status(200).json({
        message: "인트로 정보를 성공적으로 가져왔습니다.",
        data,
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        error: "서버 오류가 발생했습니다.",
      });
    }
  } else if (req.method === "POST") {
    try {
      const { title, content, display_order, intro_type, is_active } = req.body;

      // 데이터 검증
      if (!title && !content) {
        return res.status(400).json({
          error: "제목 또는 내용 중 하나는 필수입니다.",
        });
      }

      // Supabase 삽입
      const { data, error } = await supabase
        .from("restaurant_intros")
        .insert({
          title: title || "",
          content: content || "",
          display_order: display_order || 0,
          intro_type: intro_type || "text",
          is_active: is_active !== undefined ? is_active : true,
        })
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        return res.status(500).json({
          error: "인트로 추가에 실패했습니다.",
        });
      }

      res.status(201).json({
        message: "인트로가 성공적으로 추가되었습니다.",
        data,
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        error: "서버 오류가 발생했습니다.",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
