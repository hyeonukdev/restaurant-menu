import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // 환경 변수 확인
      console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log(
        "Supabase Key exists:",
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      // 간단한 쿼리로 연결 테스트
      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .limit(1);

      if (error) {
        console.error("Supabase connection error:", error);
        return res.status(500).json({
          error: "Supabase connection failed",
          details: error.message,
        });
      }

      res.status(200).json({
        message: "Supabase connection successful",
        data: data,
        env: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
        },
      });
    } catch (error) {
      console.error("Test API error:", error);
      res.status(500).json({
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
