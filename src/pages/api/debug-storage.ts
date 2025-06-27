import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

interface UploadTestResult {
  success: boolean;
  error: string | null;
  bucketName: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 1. 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 2. Supabase 클라이언트 정보
    const clientInfo = {
      url: supabaseUrl,
      keyLength: supabaseKey?.length || 0,
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
    };

    // 3. Storage 버킷 조회 시도
    console.log("Storage 버킷 조회 시작...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();
    console.log("Storage 버킷 조회 결과:", { buckets, error: bucketsError });

    // 4. 기본 데이터베이스 연결 테스트
    const { data: dbTest, error: dbError } = await supabase
      .from("dishes")
      .select("count")
      .limit(1);

    // 5. Storage 파일 업로드 테스트 (임시)
    let uploadTest: UploadTestResult | null = null;
    if (buckets && buckets.length > 0) {
      const testBucket = buckets[0];
      const testFileName = `debug-test-${Date.now()}.txt`;

      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(testBucket.name)
          .upload(testFileName, "Debug test file", {
            contentType: "text/plain",
          });

        uploadTest = {
          success: !uploadError,
          error: uploadError?.message || null,
          bucketName: testBucket.name,
        };

        // 테스트 파일 삭제
        if (!uploadError) {
          await supabase.storage.from(testBucket.name).remove([testFileName]);
        }
      } catch (uploadErr) {
        uploadTest = {
          success: false,
          error:
            uploadErr instanceof Error ? uploadErr.message : "Unknown error",
          bucketName: testBucket.name,
        };
      }
    }

    return res.status(200).json({
      success: true,
      message: "Storage 디버깅 완료",
      clientInfo,
      database: {
        connected: !dbError,
        error: dbError?.message || null,
        testData: dbTest,
      },
      storage: {
        connected: !bucketsError,
        error: bucketsError?.message || null,
        totalBuckets: buckets?.length || 0,
        buckets:
          buckets?.map((b) => ({
            name: b.name,
            id: b.id,
            public: b.public,
            fileSizeLimit: b.file_size_limit,
            createdAt: b.created_at,
          })) || [],
        uploadTest,
      },
      debug: {
        bucketsError: bucketsError?.message || null,
        bucketsData: buckets || null,
      },
    });
  } catch (error) {
    console.error("Storage 디버깅 오류:", error);
    return res.status(500).json({
      success: false,
      message: "Storage 디버깅 중 오류 발생",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
