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
    // 모든 Storage 버킷 조회
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      return res.status(500).json({
        success: false,
        message: "Storage 버킷 조회 실패",
        error: bucketsError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Storage 버킷 목록 조회 성공",
      totalBuckets: buckets.length,
      buckets: buckets.map((bucket) => ({
        name: bucket.name,
        id: bucket.id,
        public: bucket.public,
        fileSizeLimit: bucket.file_size_limit,
        allowedMimeTypes: bucket.allowed_mime_types,
        createdAt: bucket.created_at,
      })),
      note:
        buckets.length === 0
          ? "버킷이 없습니다. Supabase Dashboard에서 Storage 버킷을 생성해주세요."
          : "menu-images 버킷이 없다면 정확한 이름으로 생성해주세요.",
    });
  } catch (error) {
    console.error("버킷 목록 조회 오류:", error);
    return res.status(500).json({
      success: false,
      message: "버킷 목록 조회 중 오류 발생",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
