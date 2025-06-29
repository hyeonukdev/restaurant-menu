import React, { useEffect, useState } from "react";
import { useRestaurant } from "@/utils/useRestaurant";
import { Button, Spin, Alert, Typography, Layout, Card } from "antd";
import { useRouter } from "next/router";
import { HomeNavbar } from "@/components/ui/HomeNavbar";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

export default function Home() {
  const { restaurant, loading, error, refetch } = useRestaurant();
  const router = useRouter();

  // 로딩 중일 때
  if (loading) {
    return (
      <Layout
        style={{
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
          <Paragraph style={{ color: "#fff", marginTop: 16 }}>
            로딩 중...
          </Paragraph>
        </div>
      </Layout>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <Layout
        style={{
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Alert
            message="데이터를 불러오는데 실패했습니다."
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Button type="primary" onClick={() => refetch()}>
            다시 시도
          </Button>
        </div>
      </Layout>
    );
  }

  // 데이터가 없을 때
  if (!restaurant) {
    return (
      <Layout
        style={{
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Paragraph style={{ color: "#fff" }}>데이터가 없습니다.</Paragraph>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        position: "relative",
      }}
    >
      {/* 기존 HomeNavbar 사용 */}
      <HomeNavbar />

      {/* 배경 이미지 */}
      {restaurant.images.homeLayoutImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${restaurant.images.homeLayoutImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 1,
            opacity: 0.6,
          }}
        />
      )}

      {/* 메인 콘텐츠 */}
      <Content
        style={{
          position: "relative",
          zIndex: 10,
          padding: "16px 12px",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {/* 레스토랑 소개 헤더 */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
            paddingTop: "40px",
          }}
        >
          <Title
            level={1}
            style={{
              color: "#1a1a1a",
              fontSize: "clamp(2.5rem, 8vw, 4rem)",
              fontWeight: "bold",
              marginBottom: "16px",
              lineHeight: 1.2,
              textShadow:
                "3px 3px 6px rgba(255, 255, 255, 0.9), 1px 1px 2px rgba(0, 0, 0, 0.1)",
            }}
          >
            {restaurant.name}
          </Title>

          {restaurant.description && (
            <div
              style={{
                backgroundColor: "rgba(250, 248, 240, 0.85)",
                borderRadius: "12px",
                padding: "16px 20px",
                margin: "0 auto 32px",
                maxWidth: "600px",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(200, 180, 140, 0.2)",
              }}
            >
              <Paragraph
                style={{
                  color: "#2a2a2a",
                  fontSize: "clamp(1rem, 3vw, 1.2rem)",
                  lineHeight: 1.6,
                  marginBottom: "0",
                  whiteSpace: "pre-line",
                  fontWeight: "500",
                  margin: "0",
                  fontFamily: "'GowunDodum', sans-serif",
                  fontStyle: "italic",
                }}
              >
                {restaurant.description}
              </Paragraph>
            </div>
          )}
        </div>

        {/* 편지지 형태의 전체 콘텐츠 */}
        <Card
          style={{
            backgroundColor: "rgba(250, 248, 240, 0.88)",
            color: "#333",
            borderRadius: "8px",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(200, 180, 140, 0.3)",
            marginBottom: "24px",
            maxWidth: "480px",
            margin: "0 auto 24px",
            backgroundImage: `
              linear-gradient(90deg, rgba(200, 180, 140, 0.08) 1px, transparent 1px),
              linear-gradient(rgba(200, 180, 140, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "20px 24px",
            position: "relative",
          }}
          bodyStyle={{
            padding: "clamp(16px, 4vw, 28px)",
            position: "relative",
          }}
        >
          {/* 편지지 구멍 효과 */}
          <div
            style={{
              position: "absolute",
              left: "16px",
              top: "0",
              bottom: "0",
              width: "2px",
              background:
                "linear-gradient(to bottom, transparent 12px, rgba(200, 180, 140, 0.4) 12px, rgba(200, 180, 140, 0.4) 16px, transparent 16px)",
              backgroundSize: "2px 24px",
            }}
          />

          {/* 편지 헤더 */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Text
              style={{
                fontSize: "clamp(12px, 3vw, 16px)",
                color: "#666",
                fontStyle: "italic",
                display: "block",
                marginBottom: "12px",
                letterSpacing: "1px",
                fontFamily: "'GowunBatang', serif",
              }}
            >
              From {restaurant.name}
            </Text>
            <div
              style={{
                width: "80px",
                height: "1px",
                backgroundColor: "rgba(200, 180, 140, 0.6)",
                margin: "0 auto",
              }}
            />
          </div>

          {/* Intro 내용들을 순서대로 표시 */}
          {restaurant.intro &&
            restaurant.intro.map((intro, index) => (
              <div
                key={intro.id}
                style={{
                  marginBottom:
                    index < restaurant.intro.length - 1 ? "20px" : "0",
                }}
              >
                {/* 편지 제목 */}
                {intro.title && (
                  <Title
                    level={3}
                    style={{
                      color: "#333",
                      fontSize: "clamp(1.2rem, 4.5vw, 1.7rem)",
                      fontWeight: "600",
                      marginBottom: "16px",
                      lineHeight: 1.4,
                      fontFamily: "'GowunBatang', serif",
                      textAlign: (intro as any).titleAlign || "left",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      wordBreak: "keep-all",
                    }}
                  >
                    {intro.title}
                  </Title>
                )}

                {/* 편지 내용 */}
                {intro.content && (
                  <Paragraph
                    style={{
                      color: "#555",
                      fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
                      lineHeight: 1.8,
                      whiteSpace: "pre-line",
                      textAlign: (intro as any).contentAlign || "left",
                      fontFamily: "'GowunBatang', serif",
                      letterSpacing: "0.5px",
                      marginBottom:
                        index < restaurant.intro.length - 1 ? "16px" : "0",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      wordBreak: "keep-all",
                    }}
                  >
                    {intro.content}
                  </Paragraph>
                )}

                {/* 구분선 (마지막 항목 제외) */}
                {index < restaurant.intro.length - 1 && (
                  <div
                    style={{
                      width: "50px",
                      height: "1px",
                      backgroundColor: "rgba(200, 180, 140, 0.4)",
                      margin: "16px auto",
                    }}
                  />
                )}
              </div>
            ))}

          {/* 편지 서명 */}
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <Text
              style={{
                fontSize: "clamp(14px, 3vw, 18px)",
                color: "#666",
                fontStyle: "italic",
                fontFamily: "'GowunBatang', serif",
              }}
            >
              {/* - {restaurant.name} - */}- 양재천 옆, 오크라 드림 -
            </Text>
          </div>
        </Card>

        {/* 메뉴 보기 CTA */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Button
            type="primary"
            size="large"
            onClick={() => router.push("/dishes")}
            style={{
              backgroundColor: "#DC143C",
              borderColor: "#DC143C",
              color: "#fff",
              padding: "clamp(12px, 3vw, 16px) clamp(32px, 8vw, 48px)",
              height: "auto",
              fontSize: "clamp(16px, 4vw, 18px)",
              fontWeight: "600",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(220, 20, 60, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#B22222";
              e.target.style.borderColor = "#B22222";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#DC143C";
              e.target.style.borderColor = "#DC143C";
            }}
          >
            메뉴 보기
          </Button>
        </div>
      </Content>
    </Layout>
  );
}
