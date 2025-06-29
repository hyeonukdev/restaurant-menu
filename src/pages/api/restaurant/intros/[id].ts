import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const {
        title,
        content,
        display_order,
        intro_type,
        title_align,
        content_align,
        is_active,
      } = req.body;

      // ID를 숫자로 변환
      const numericId = parseInt(id as string, 10);

      if (isNaN(numericId)) {
        return res.status(400).json({
          error: "유효하지 않은 ID입니다.",
        });
      }

      console.log("Updating intro with ID:", numericId);

      // 데이터 검증
      if (!title && !content) {
        return res.status(400).json({
          error: "제목 또는 내용 중 하나는 필수입니다.",
        });
      }

      // 먼저 해당 ID의 intro가 존재하는지 확인
      const { data: existingIntro, error: checkError } = await supabase
        .from("restaurant_intros")
        .select("id")
        .eq("id", numericId)
        .maybeSingle();

      if (checkError) {
        console.error("Check error:", checkError);
        return res.status(500).json({
          error: "인트로 확인 중 오류가 발생했습니다.",
        });
      }

      if (!existingIntro) {
        console.log("Intro not found with ID:", numericId);
        return res.status(404).json({
          error: "해당 인트로를 찾을 수 없습니다.",
        });
      }

      // Supabase 업데이트
      const { data, error } = await supabase
        .from("restaurant_intros")
        .update({
          title: title || "",
          content: content || "",
          display_order: display_order !== undefined ? display_order : 0,
          intro_type: intro_type || "text",
          title_align: title_align || "left",
          content_align: content_align || "left",
          is_active: is_active !== undefined ? is_active : true,
        })
        .eq("id", numericId)
        .select();

      if (error) {
        console.error("Update error:", error);
        return res.status(500).json({
          error: "인트로 수정에 실패했습니다.",
        });
      }

      // 업데이트된 데이터가 없으면 오류
      if (!data || data.length === 0) {
        console.log("No data returned after update for ID:", numericId);
        return res.status(404).json({
          error: "인트로 수정 후 데이터를 찾을 수 없습니다.",
        });
      }

      res.status(200).json({
        message: "인트로가 성공적으로 수정되었습니다.",
        data: data[0], // 첫 번째 결과 반환
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        error: "서버 오류가 발생했습니다.",
      });
    }
  } else if (req.method === "DELETE") {
    try {
      const numericId = parseInt(id as string, 10);

      if (isNaN(numericId)) {
        return res.status(400).json({
          error: "유효하지 않은 ID입니다.",
        });
      }

      const { error } = await supabase
        .from("restaurant_intros")
        .delete()
        .eq("id", numericId);

      if (error) {
        console.error("Delete error:", error);
        return res.status(500).json({
          error: "인트로 삭제에 실패했습니다.",
        });
      }

      res.status(200).json({
        message: "인트로가 성공적으로 삭제되었습니다.",
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        error: "서버 오류가 발생했습니다.",
      });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
