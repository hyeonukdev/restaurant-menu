import { useState } from "react";
import Image from "next/image";
import { PictureOutlined } from "@ant-design/icons";

// CSS 애니메이션을 전역으로 추가
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  if (!document.head.querySelector("style[data-safe-image-spin]")) {
    style.setAttribute("data-safe-image-spin", "true");
    document.head.appendChild(style);
  }
}

interface SafeImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallbackText?: string;
  className?: string;
  style?: React.CSSProperties;
  showIcon?: boolean;
  hideOnError?: boolean;
  backgroundImage?: string;
  priority?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  width,
  height,
  fallbackText,
  className,
  style,
  showIcon = true,
  hideOnError = false,
  backgroundImage,
  priority,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // src가 비어있거나 유효하지 않으면 바로 플레이스홀더 표시
  const isValidSrc =
    src &&
    src.trim() !== "" &&
    !src.includes("menu_") &&
    src !== "/images/menu/" &&
    !src.startsWith("/images/menu/menu_");

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // 이미지가 없거나 에러가 발생한 경우
  if (!isValidSrc || imageError) {
    // hideOnError가 true면 아무것도 표시하지 않음
    if (hideOnError) {
      return null;
    }

    // 배경 이미지가 있으면 배경 이미지 사용
    if (backgroundImage) {
      return (
        <div
          className={className}
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "8px",
            ...style,
          }}
        />
      );
    }

    // 기본 플레이스홀더 (아이콘 없이)
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#fafafa",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e8e8e8",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          ...style,
        }}
      >
        {showIcon && (
          <div
            style={{
              width: "24px",
              height: "24px",
              border: "2px solid #d9d9d9",
              borderTop: "2px solid #1890ff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {imageLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#fafafa",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            borderRadius: "8px",
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid #e8e8e8",
              borderTop: "2px solid #1890ff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}
      <Image
        className={className}
        style={{
          objectFit: "cover",
          borderRadius: "8px",
          opacity: imageLoading ? 0 : 1,
          transition: "opacity 0.3s ease",
          width: "100%",
          ...style,
        }}
        src={src}
        width={width}
        height={height}
        alt={alt}
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized={true}
        priority={priority}
      />
    </div>
  );
};
