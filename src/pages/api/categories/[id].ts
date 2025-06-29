import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { name, description, icon, display_order } = req.body;

      // ID를 숫자로 변환
      const numericId = parseInt(id as string, 10);

      if (isNaN(numericId)) {
        return res.status(400).json({
          error: "유효하지 않은 ID입니다.",
        });
      }

      console.log("Updating category with ID:", numericId);

      // 데이터 검증
      if (!name || name.trim() === "") {
        return res.status(400).json({
          error: "카테고리 이름은 필수입니다.",
        });
      }

      // 먼저 해당 ID의 카테고리가 존재하는지 확인
      const { data: existingCategory, error: checkError } = await supabase
        .from("sections")
        .select("id")
        .eq("id", numericId)
        .maybeSingle();

      if (checkError) {
        console.error("Check error:", checkError);
        return res.status(500).json({
          error: "카테고리 확인 중 오류가 발생했습니다.",
        });
      }

      if (!existingCategory) {
        console.log("Category not found with ID:", numericId);
        return res.status(404).json({
          error: "해당 카테고리를 찾을 수 없습니다.",
        });
      }

      // 중복 이름 체크 (자기 자신 제외)
      const { data: duplicateCategory, error: duplicateError } = await supabase
        .from("sections")
        .select("id")
        .eq("name", name.trim())
        .neq("id", numericId)
        .maybeSingle();

      if (duplicateError) {
        console.error("Duplicate check error:", duplicateError);
        return res.status(500).json({
          error: "카테고리 중복 확인 중 오류가 발생했습니다.",
        });
      }

      if (duplicateCategory) {
        return res.status(400).json({
          error: "이미 존재하는 카테고리 이름입니다.",
        });
      }

      // Supabase 업데이트
      const { data, error } = await supabase
        .from("sections")
        .update({
          name: name.trim(),
          description: description?.trim() || "",
          icon: icon || "AppstoreOutlined",
          display_order: display_order !== undefined ? display_order : 0,
        })
        .eq("id", numericId)
        .select();

      if (error) {
        console.error("Update error:", error);
        return res.status(500).json({
          error: "카테고리 수정에 실패했습니다.",
          details: error.message,
        });
      }

      // 업데이트된 데이터가 없으면 오류
      if (!data || data.length === 0) {
        console.log("No data returned after update for ID:", numericId);
        return res.status(404).json({
          error: "카테고리 수정 후 데이터를 찾을 수 없습니다.",
        });
      }

      res.status(200).json({
        message: "카테고리가 성공적으로 수정되었습니다.",
        data: data[0],
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

      // 카테고리에 연결된 메뉴 아이템이 있는지 확인
      const { data: relatedItems, error: relationError } = await supabase
        .from("section_items")
        .select("id")
        .eq("section_id", numericId);

      if (relationError) {
        console.error("Relation check error:", relationError);
        return res.status(500).json({
          error: "연관된 메뉴 확인 중 오류가 발생했습니다.",
        });
      }

      if (relatedItems && relatedItems.length > 0) {
        return res.status(400).json({
          error:
            "이 카테고리에 연결된 메뉴가 있어 삭제할 수 없습니다. 먼저 메뉴를 다른 카테고리로 이동하거나 삭제해주세요.",
        });
      }

      const { error } = await supabase
        .from("sections")
        .delete()
        .eq("id", numericId);

      if (error) {
        console.error("Delete error:", error);
        return res.status(500).json({
          error: "카테고리 삭제에 실패했습니다.",
          details: error.message,
        });
      }

      res.status(200).json({
        message: "카테고리가 성공적으로 삭제되었습니다.",
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
