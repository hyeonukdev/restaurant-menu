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

    if (buckets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "생성된 버킷이 없습니다.",
        note: "Supabase Dashboard에서 Storage 버킷을 생성해주세요.",
      });
    }

    // 첫 번째 버킷으로 테스트
    const testBucket = buckets[0];
    const bucketName = testBucket.name;

    // 테스트 파일 업로드
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = "This is a test file for storage connection.";

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testFileName, testContent, {
        contentType: "text/plain",
      });

    if (uploadError) {
      return res.status(500).json({
        success: false,
        message: `Storage 업로드 테스트 실패 (버킷: ${bucketName})`,
        error: uploadError.message,
        availableBuckets: buckets.map((b) => b.name),
      });
    }

    // 테스트 파일 삭제
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([testFileName]);

    if (deleteError) {
      console.warn("테스트 파일 삭제 실패:", deleteError);
    }

    return res.status(200).json({
      success: true,
      message: `Storage 연결 성공! (테스트 버킷: ${bucketName})`,
      testBucket: {
        name: testBucket.name,
        id: testBucket.id,
        public: testBucket.public,
        fileSizeLimit: testBucket.file_size_limit,
      },
      allBuckets: buckets.map((b) => b.name),
      test: {
        uploadSuccess: true,
        deleteSuccess: !deleteError,
      },
      note: `menu-images 버킷이 필요하다면 '${bucketName}'을 삭제하고 'menu-images'로 다시 생성하세요.`,
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
