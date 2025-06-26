import { useState } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallbackText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  width,
  height,
  fallbackText = "이미지 없음",
  className,
  style,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // 이미지 URL이 없거나 에러가 발생한 경우 placeholder 표시
  if (!src || imageError) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          ...style,
        }}
      >
        <span style={{ color: "#999", fontSize: "12px" }}>{fallbackText}</span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width, height }}>
      {imageLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            borderRadius: "4px",
          }}
        >
          <span style={{ color: "#999", fontSize: "10px" }}>로딩...</span>
        </div>
      )}
      <Image
        className={className}
        style={{
          objectFit: "cover",
          borderRadius: "4px",
          opacity: imageLoading ? 0 : 1,
          transition: "opacity 0.3s",
          ...style,
        }}
        src={src}
        width={width}
        height={height}
        alt={alt}
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized={true}
      />
    </div>
  );
};
