import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 1. 기존 버킷 확인
    const { data: existingBuckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      return res.status(500).json({
        success: false,
        message: "기존 버킷 조회 실패",
        error: listError.message,
      });
    }

    // 2. menu-images 버킷이 이미 있는지 확인
    const existingBucket = existingBuckets?.find(
      (bucket) => bucket.name === "menu-images"
    );

    if (existingBucket) {
      return res.status(200).json({
        success: true,
        message: "menu-images 버킷이 이미 존재합니다.",
        bucket: {
          name: existingBucket.name,
          id: existingBucket.id,
          public: existingBucket.public,
          fileSizeLimit: existingBucket.file_size_limit,
        },
        existingBuckets: existingBuckets.map((b) => b.name),
      });
    }

    // 3. 새 버킷 생성
    console.log("menu-images 버킷 생성 시작...");
    const { data: newBucket, error: createError } =
      await supabase.storage.createBucket("menu-images", {
        public: true,
        allowedMimeTypes: ["image/*"],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });

    if (createError) {
      console.error("버킷 생성 오류:", createError);
      return res.status(500).json({
        success: false,
        message: "버킷 생성 실패",
        error: createError.message,
        existingBuckets: existingBuckets.map((b) => b.name),
      });
    }

    console.log("버킷 생성 성공:", newBucket);

    // 4. 생성된 버킷 확인
    const { data: updatedBuckets, error: verifyError } =
      await supabase.storage.listBuckets();

    if (verifyError) {
      return res.status(500).json({
        success: false,
        message: "생성된 버킷 확인 실패",
        error: verifyError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "menu-images 버킷이 성공적으로 생성되었습니다!",
      createdBucket: newBucket,
      allBuckets:
        updatedBuckets?.map((b) => ({
          name: b.name,
          id: b.id,
          public: b.public,
          fileSizeLimit: b.file_size_limit,
        })) || [],
      totalBuckets: updatedBuckets?.length || 0,
    });
  } catch (error) {
    console.error("버킷 생성 중 오류:", error);
    return res.status(500).json({
      success: false,
      message: "버킷 생성 중 오류 발생",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
