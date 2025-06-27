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
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        message: "환경 변수가 설정되지 않았습니다.",
        env: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
          urlLength: supabaseUrl?.length || 0,
          keyLength: supabaseKey?.length || 0,
        },
      });
    }

    // 기본 연결 테스트
    const { data: testData, error: testError } = await supabase
      .from("dishes")
      .select("count")
      .limit(1);

    if (testError) {
      return res.status(500).json({
        success: false,
        message: "Supabase 기본 연결 실패",
        error: testError.message,
        env: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
        },
      });
    }

    // Storage 버킷 목록 조회
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    return res.status(200).json({
      success: true,
      message: "Supabase 연결 성공",
      env: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlLength: supabaseUrl.length,
        keyLength: supabaseKey.length,
      },
      database: {
        connected: true,
        testData: testData,
      },
      storage: {
        connected: !bucketsError,
        buckets: buckets || [],
        error: bucketsError?.message || null,
      },
    });
  } catch (error) {
    console.error("Supabase 디버깅 오류:", error);
    return res.status(500).json({
      success: false,
      message: "Supabase 디버깅 중 오류 발생",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
