import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";
import fs from "fs";
import path from "path";

interface MigrationResult {
  dishId: number;
  dishName: string;
  status: "success" | "error" | "skipped";
  reason?: string;
  imageUrl?: string;
  fileName?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 1. Storage 버킷 확인
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      return res.status(500).json({
        success: false,
        message: "Storage 버킷 조회 실패",
        error: bucketsError.message,
      });
    }

    const menuImagesBucket = buckets.find(
      (bucket) => bucket.name === "menu-images"
    );

    if (!menuImagesBucket) {
      return res.status(404).json({
        success: false,
        message:
          "menu-images 버킷이 존재하지 않습니다. 먼저 버킷을 생성해주세요.",
      });
    }

    // 2. 기존 메뉴 데이터 조회
    const { data: dishes, error: dishesError } = await supabase
      .from("dishes")
      .select("id, name, image_url")
      .order("id");

    if (dishesError) {
      return res.status(500).json({
        success: false,
        message: "메뉴 데이터 조회 실패",
        error: dishesError.message,
      });
    }

    const results: MigrationResult[] = [];
    const imageMapping: { [key: number]: string } = {
      1: "menu_1.jpeg",
      2: "menu_2.jpeg",
      3: "menu_3.jpeg",
      4: "menu_4.jpeg",
      5: "menu_5.jpeg",
    };

    // 3. 각 메뉴에 대해 이미지 업로드
    for (const dish of dishes) {
      const imageFileName = imageMapping[dish.id as keyof typeof imageMapping];

      if (!imageFileName) {
        results.push({
          dishId: dish.id,
          dishName: dish.name,
          status: "skipped",
          reason: "매핑된 이미지 없음",
        });
        continue;
      }

      const imagePath = path.join(
        process.cwd(),
        "public",
        "images",
        "menu",
        imageFileName
      );

      // 파일 존재 확인
      if (!fs.existsSync(imagePath)) {
        results.push({
          dishId: dish.id,
          dishName: dish.name,
          status: "error",
          reason: `파일 없음: ${imageFileName}`,
        });
        continue;
      }

      try {
        // 파일 읽기
        const fileBuffer = fs.readFileSync(imagePath);
        const fileExt = path.extname(imageFileName);
        const newFileName = `dish_${dish.id}_${Date.now()}${fileExt}`;
        const filePath = `menu-images/${newFileName}`;

        // Storage에 업로드
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("menu-images")
          .upload(filePath, fileBuffer, {
            contentType: `image/${fileExt.slice(1)}`,
            upsert: false,
          });

        if (uploadError) {
          results.push({
            dishId: dish.id,
            dishName: dish.name,
            status: "error",
            reason: `업로드 실패: ${uploadError.message}`,
          });
          continue;
        }

        // 공개 URL 생성
        const {
          data: { publicUrl },
        } = supabase.storage.from("menu-images").getPublicUrl(filePath);

        // 데이터베이스 업데이트
        const { error: updateError } = await supabase
          .from("dishes")
          .update({ image_url: publicUrl })
          .eq("id", dish.id);

        if (updateError) {
          results.push({
            dishId: dish.id,
            dishName: dish.name,
            status: "error",
            reason: `DB 업데이트 실패: ${updateError.message}`,
          });
          continue;
        }

        results.push({
          dishId: dish.id,
          dishName: dish.name,
          status: "success",
          imageUrl: publicUrl,
          fileName: newFileName,
        });
      } catch (error) {
        results.push({
          dishId: dish.id,
          dishName: dish.name,
          status: "error",
          reason: `처리 오류: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }

    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;
    const skippedCount = results.filter((r) => r.status === "skipped").length;

    return res.status(200).json({
      success: true,
      message: `이미지 마이그레이션 완료: 성공 ${successCount}개, 실패 ${errorCount}개, 건너뜀 ${skippedCount}개`,
      results,
      summary: {
        total: results.length,
        success: successCount,
        error: errorCount,
        skipped: skippedCount,
      },
    });
  } catch (error) {
    console.error("이미지 마이그레이션 오류:", error);
    return res.status(500).json({
      success: false,
      message: "이미지 마이그레이션 중 오류 발생",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
