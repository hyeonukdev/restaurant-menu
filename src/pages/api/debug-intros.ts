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
    console.log("=== Supabase Intro 데이터 디버깅 ===");

    // 1. 모든 intro 데이터 조회
    const { data: allIntros, error: allError } = await supabase
      .from("restaurant_intros")
      .select("*")
      .order("display_order", { ascending: true });

    if (allError) {
      console.error("모든 intro 조회 오류:", allError);
      return res.status(500).json({
        success: false,
        message: "모든 intro 조회 실패",
        error: allError.message,
      });
    }

    // 2. 활성화된 intro 데이터만 조회
    const { data: activeIntros, error: activeError } = await supabase
      .from("restaurant_intros")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (activeError) {
      console.error("활성 intro 조회 오류:", activeError);
      return res.status(500).json({
        success: false,
        message: "활성 intro 조회 실패",
        error: activeError.message,
      });
    }

    console.log("=== 디버깅 결과 ===");
    console.log("전체 intro 개수:", allIntros?.length || 0);
    console.log("활성 intro 개수:", activeIntros?.length || 0);
    console.log("전체 intro 데이터:", allIntros);
    console.log("활성 intro 데이터:", activeIntros);

    return res.status(200).json({
      success: true,
      message: "Intro 데이터 디버깅 완료",
      data: {
        allIntros: allIntros || [],
        activeIntros: activeIntros || [],
        allCount: allIntros?.length || 0,
        activeCount: activeIntros?.length || 0,
      },
    });
  } catch (error) {
    console.error("Intro 디버깅 오류:", error);
    return res.status(500).json({
      success: false,
      message: "Intro 디버깅 중 오류 발생",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
