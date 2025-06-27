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
    // Storage 버킷 존재 확인
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      return res.status(500).json({
        success: false,
        message: "Storage 버킷 조회 실패",
        error: bucketsError.message,
      });
    }

    // menu-images 버킷 확인
    const menuImagesBucket = buckets.find(
      (bucket) => bucket.name === "menu-images"
    );

    if (!menuImagesBucket) {
      return res.status(404).json({
        success: false,
        message:
          "menu-images 버킷이 존재하지 않습니다. Supabase Dashboard에서 생성해주세요.",
        availableBuckets: buckets.map((b) => b.name),
      });
    }

    // 테스트 파일 업로드 (1KB 더미 파일)
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = "This is a test file for storage connection.";

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("menu-images")
      .upload(testFileName, testContent, {
        contentType: "text/plain",
      });

    if (uploadError) {
      return res.status(500).json({
        success: false,
        message: "Storage 업로드 테스트 실패",
        error: uploadError.message,
      });
    }

    // 테스트 파일 삭제
    const { error: deleteError } = await supabase.storage
      .from("menu-images")
      .remove([testFileName]);

    if (deleteError) {
      console.warn("테스트 파일 삭제 실패:", deleteError);
    }

    return res.status(200).json({
      success: true,
      message: "Supabase Storage 연결 성공!",
      bucket: {
        name: menuImagesBucket.name,
        id: menuImagesBucket.id,
        public: menuImagesBucket.public,
        fileSizeLimit: menuImagesBucket.file_size_limit,
        allowedMimeTypes: menuImagesBucket.allowed_mime_types,
      },
      test: {
        uploadSuccess: true,
        deleteSuccess: !deleteError,
      },
    });
  } catch (error) {
    console.error("Storage 테스트 오류:", error);
    return res.status(500).json({
      success: false,
      message: "Storage 테스트 중 오류 발생",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
