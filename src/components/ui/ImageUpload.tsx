import { useState, useEffect } from "react";
import {
  UploadOutlined,
  DeleteOutlined,
  PictureOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Spin, Space, Typography } from "antd";
import { supabase } from "../../lib/supabase";

const { Text } = Typography;

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
  const [isNewImage, setIsNewImage] = useState(false);

  // currentImageUrl이 변경될 때 previewUrl 업데이트
  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
      setIsNewImage(false);
    }
  }, [currentImageUrl]);

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
      setIsNewImage(true);
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
    setIsNewImage(false);
    onImageRemove();
  };

  const handleKeepOriginal = () => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
      setIsNewImage(false);
      onImageUpload(currentImageUrl);
    }
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

          {/* 이미지 상태 표시 */}
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: isNewImage
                ? "rgba(0, 128, 0, 0.8)"
                : "rgba(0, 0, 255, 0.8)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {isNewImage ? "새 이미지" : "기존 이미지"}
          </div>

          {/* 액션 버튼들 */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: "4px",
            }}
          >
            {/* 새 이미지가 있을 때만 원본 유지 버튼 표시 */}
            {isNewImage && currentImageUrl && (
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={handleKeepOriginal}
                disabled={disabled}
                style={{
                  background: "rgba(0, 0, 255, 0.8)",
                  color: "white",
                  border: "none",
                }}
                title="원본 이미지 유지"
              />
            )}

            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={handleRemoveImage}
              disabled={disabled}
              style={{
                background: "rgba(255, 0, 0, 0.8)",
                color: "white",
                border: "none",
              }}
              title="이미지 제거"
            />
          </div>
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

      {/* 기존 이미지가 있을 때 교체 버튼 */}
      {previewUrl && !isNewImage && (
        <div style={{ marginTop: 8 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={disabled || uploading}
            style={{ display: "none" }}
            id="image-replace"
          />
          <Button
            icon={<UploadOutlined />}
            disabled={disabled || uploading}
            loading={uploading}
            style={{ marginRight: 8 }}
            onClick={() => {
              const fileInput = document.getElementById(
                "image-replace"
              ) as HTMLInputElement;
              if (fileInput) {
                fileInput.click();
              }
            }}
          >
            이미지 교체
          </Button>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            기존 이미지를 다른 이미지로 교체할 수 있습니다.
          </Text>
        </div>
      )}
    </div>
  );
};
