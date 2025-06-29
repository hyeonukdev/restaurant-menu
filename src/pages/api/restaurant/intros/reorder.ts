import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { intros } = req.body;

      // 데이터 검증
      if (!Array.isArray(intros) || intros.length === 0) {
        return res.status(400).json({
          error: "유효하지 않은 데이터입니다.",
        });
      }

      // 트랜잭션으로 순서 업데이트
      const updates = intros.map((intro) => ({
        id: intro.id,
        display_order: intro.display_order,
      }));

      const { error } = await supabase
        .from("restaurant_intros")
        .upsert(updates, { onConflict: "id" });

      if (error) {
        console.error("Reorder error:", error);
        return res.status(500).json({
          error: "순서 변경에 실패했습니다.",
        });
      }

      res.status(200).json({
        message: "인트로 순서가 성공적으로 변경되었습니다.",
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
