import { useState } from "react";
import {
  UploadOutlined,
  DeleteOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Button, Spin } from "antd";
import { supabase } from "../../lib/supabase";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (url: string) => void;
  onImageRemove: () => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageUpload,
  onImageRemove,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    try {
      setUploading(true);

      // 파일명 생성 (중복 방지)
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `menu-images/${fileName}`;

      // Supabase Storage에 업로드
      const { data, error } = await supabase.storage
        .from("menu-images")
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // 공개 URL 생성
      const {
        data: { publicUrl },
      } = supabase.storage.from("menu-images").getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onImageUpload(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageRemove();
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {/* 현재 이미지 또는 프리뷰 */}
      {previewUrl && (
        <div style={{ position: "relative", marginBottom: 16 }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #d9d9d9",
            }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={handleRemoveImage}
            disabled={disabled}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(255, 0, 0, 0.8)",
              color: "white",
              border: "none",
            }}
          />
        </div>
      )}

      {/* 업로드 영역 */}
      {!previewUrl && (
        <div
          style={{
            border: "2px dashed #d9d9d9",
            borderRadius: "8px",
            padding: "24px",
            textAlign: "center",
            background: "#fafafa",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={disabled || uploading}
            style={{ display: "none" }}
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            style={{
              cursor: disabled || uploading ? "not-allowed" : "pointer",
              opacity: disabled || uploading ? 0.5 : 1,
            }}
          >
            {uploading ? (
              <div style={{ marginBottom: 8 }}>
                <Spin size="large" />
              </div>
            ) : (
              <PictureOutlined
                style={{ fontSize: "32px", color: "#999", marginBottom: 8 }}
              />
            )}
            <div style={{ color: "#666", fontSize: "14px" }}>
              {uploading ? "업로드 중..." : "이미지를 클릭하여 업로드"}
            </div>
            <div style={{ color: "#999", fontSize: "12px", marginTop: 4 }}>
              PNG, JPG, GIF (최대 5MB)
            </div>
          </label>
        </div>
      )}
    </div>
  );
};
