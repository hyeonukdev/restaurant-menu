import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      console.log("=== 카테고리 목록 API 호출 ===");

      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Categories fetch error:", error);
        return res.status(500).json({
          error: "카테고리 정보를 가져오는데 실패했습니다.",
          details: error.message,
        });
      }

      console.log("카테고리 데이터:", {
        count: data?.length || 0,
        data: data,
      });

      res.status(200).json({
        message: "카테고리 정보를 성공적으로 가져왔습니다.",
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
      const { name, description, icon, display_order } = req.body;

      // 데이터 검증
      if (!name || name.trim() === "") {
        return res.status(400).json({
          error: "카테고리 이름은 필수입니다.",
        });
      }

      // 중복 이름 체크
      const { data: existingCategory, error: checkError } = await supabase
        .from("sections")
        .select("id")
        .eq("name", name.trim())
        .maybeSingle();

      if (checkError) {
        console.error("Duplicate check error:", checkError);
        return res.status(500).json({
          error: "카테고리 중복 확인 중 오류가 발생했습니다.",
        });
      }

      if (existingCategory) {
        return res.status(400).json({
          error: "이미 존재하는 카테고리 이름입니다.",
        });
      }

      // Supabase 삽입
      const { data, error } = await supabase
        .from("sections")
        .insert({
          name: name.trim(),
          description: description?.trim() || "",
          icon: icon || "IconBread",
          display_order: display_order || 0,
        })
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        return res.status(500).json({
          error: "카테고리 추가에 실패했습니다.",
          details: error.message,
        });
      }

      res.status(201).json({
        message: "카테고리가 성공적으로 추가되었습니다.",
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
