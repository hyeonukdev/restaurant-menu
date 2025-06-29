import { useEffect } from "react";
import { useRouter } from "next/router";

import { animate } from "motion";
import {
  Button,
  Card,
  Layout,
  Skeleton,
  Typography,
  Tag,
  Tooltip,
  theme,
  Alert,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

import { DishLayout } from "../../../components/layouts";
import { SafeImage } from "@/components/ui";
import { TMenuItem } from "@/types/dish";
import styles from "../../../styles/dishDetailsCard.module.css";
import { useDish } from "../../../utils/useDish";

// 스켈레톤 카드 컴포넌트
const DishSkeleton = () => (
  <Card className={styles.card}>
    <Skeleton.Image active className={styles.image} />
    <div className={styles.bodyCard}>
      <Skeleton active paragraph={{ rows: 3 }} />
      <Skeleton active paragraph={{ rows: 2 }} />
    </div>
  </Card>
);

const Dish = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;
  const idForFetch = typeof id === "string" ? id : undefined;

  const { dish, loading, error, refetch } = useDish(idForFetch);

  const { useToken } = theme;
  const { token } = useToken();

  // 디버깅을 위한 로그
  console.log("Dish component state:", {
    id,
    dish: dish
      ? {
          id: dish.id,
          name: dish.name,
          ingredients: dish.ingredients?.substring(0, 20) + "...",
        }
      : null,
    loading,
    error,
    hasId: Boolean(id),
    hasDish: Boolean(dish),
  });

  // dish 변경 감지
  useEffect(() => {
    console.log("Dish useEffect triggered - dish changed:", dish);
    if (dish) {
      animate(
        ".cardDescriptionAnimation",
        { opacity: [0, 1] },
        { duration: 0.9 }
      );
    }
  }, [dish]);

  // id가 없으면 아무것도 렌더링하지 않음
  if (!idForFetch) return null;

  return (
    <DishLayout
      title={!dish ? "Loading..." : error ? "Error" : dish.name}
      pageDescription={
        !dish
          ? "Loading dish information"
          : error
          ? "Failed to load dish information"
          : "Ingredients and description"
      }
      imageUrl="/images/og-image.png"
    >
      <Content>
        <main>
          <Card
            className={`${styles.card} cardDescriptionAnimation`}
            cover={
              <SafeImage
                className={styles.image}
                style={{ borderRadius: "0px" }}
                alt="dish food"
                src={dish?.imageUrl || ""}
                width={400}
                height={300}
                fallbackText=""
                showIcon={false}
                backgroundImage="/images/placeholder.svg"
                priority={true}
              />
            }
          >
            <div className={styles.bodyCard}>
              {/* 베스트셀러 태그 */}
              {dish?.bestSeller && (
                <Tag className={styles.bestSellerTag} color={token.colorInfo}>
                  Best seller
                </Tag>
              )}

              {/* 메뉴명 */}
              <Title className={styles.dishName} level={3}>
                {!dish ? (
                  <Skeleton.Input
                    active
                    size="large"
                    style={{ width: "80%" }}
                  />
                ) : error ? (
                  <div
                    style={{
                      color: "#ff4d4f",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>⚠️</span>
                    메뉴를 불러올 수 없습니다
                  </div>
                ) : (
                  dish.name
                )}
              </Title>

              {/* 재료 */}
              <Text className={styles.subtitle}>Ingredients</Text>
              <Paragraph type="secondary" className={styles.paragraph}>
                {!dish ? (
                  <Skeleton active paragraph={{ rows: 1 }} />
                ) : error ? (
                  <span style={{ color: "#999" }}>
                    재료 정보를 불러올 수 없습니다
                  </span>
                ) : (
                  dish.ingredients
                )}
              </Paragraph>

              {/* 설명 */}
              <Text className={styles.subtitle}>Description</Text>
              <Paragraph type="secondary" className={styles.paragraph}>
                {!dish ? (
                  <Skeleton active paragraph={{ rows: 2 }} />
                ) : error ? (
                  <span style={{ color: "#999" }}>
                    설명을 불러올 수 없습니다
                  </span>
                ) : (
                  dish.description
                )}
              </Paragraph>

              {/* 에러 시 재시도 버튼 */}
              {error && (
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <Alert
                    message="메뉴 정보 로딩 오류"
                    description={error}
                    type="error"
                    showIcon
                    action={
                      <Button size="small" onClick={refetch}>
                        다시 시도
                      </Button>
                    }
                    style={{ marginBottom: 16 }}
                  />
                </div>
              )}

              {/* 뒤로가기 버튼 */}
              <Tooltip title="Back to Menu">
                <Button
                  onClick={() => router.push("/dishes")}
                  icon={
                    <ArrowLeftOutlined
                      style={{ fontSize: "13px" }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  }
                  className={styles.detailsButton}
                  style={{
                    background: token.colorInfoBg,
                    borderRadius: "0px 0px 50% 0px",
                  }}
                  type="text"
                  size="large"
                />
              </Tooltip>
            </div>
          </Card>
        </main>
      </Content>
    </DishLayout>
  );
};

export default Dish;
