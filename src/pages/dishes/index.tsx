import { useEffect } from "react";

import {
  Layout,
  theme,
  Typography,
  Spin,
  Alert,
  Button,
  Skeleton,
  Card,
} from "antd";
const { Content } = Layout;
const { Title, Paragraph } = Typography;

import { PlateCard } from "../../components/products/Card";
import { ScrollToTop } from "../../components/products/ScrollToTop";
import { inView, animate } from "motion";

import { TMenuSection } from "@/types/dish";
import { DishesLayout } from "../../components/layouts";
import styles from "../../styles/dishes.module.css";
import cardStyles from "../../styles/dishCard.module.css";

import { useDishes } from "../../utils/useDishes";

// 스켈레톤 카드 컴포넌트
const SkeletonCard = () => (
  <Card
    className={cardStyles.card}
    cover={<Skeleton.Image active style={{ width: "100%", height: 200 }} />}
  >
    <div className={cardStyles.bodyCard}>
      <Skeleton.Input
        active
        size="large"
        style={{ width: "80%", marginBottom: 8 }}
      />
      <div className={cardStyles.pricesContainer}>
        <Skeleton active paragraph={{ rows: 1 }} style={{ marginBottom: 8 }} />
      </div>
      <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 16 }} />
    </div>
  </Card>
);

// 스켈레톤 섹션 컴포넌트
const SkeletonSection = () => (
  <section className={styles.sectionContainer}>
    <Skeleton.Input
      active
      size="large"
      style={{ width: 200, marginBottom: 16 }}
    />
    <Skeleton active paragraph={{ rows: 1 }} style={{ marginBottom: 24 }} />
    <span className={styles.cardsContainer}>
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </span>
  </section>
);

const Dishes = () => {
  const { dishes, loading, error, refetch } = useDishes();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { useToken } = theme;
  const { token } = useToken();

  useEffect(() => {
    // 애니메이션 로직 수정
    if (dishes && dishes.length > 0) {
      inView("section", ({ target }) => {
        const cardsContainer = target.querySelector("span");
        if (cardsContainer) {
          animate(
            cardsContainer,
            { opacity: 1, transform: "none" },
            { delay: 0.2, duration: 0.9, easing: [0.17, 0.55, 0.55, 1] }
          );
        }
      });
    }
  }, [dishes]);

  return (
    <DishesLayout
      title="Today's Menu"
      pageDescription="List of delicious dishes"
      imageUrl={process.env.NEXT_PUBLIC_OG_IMAGE_URL || "/images/og-image.png"}
    >
      <Content
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {error && (
          <Alert
            message="데이터 로딩 오류"
            description={error}
            type="warning"
            showIcon
            action={
              <Button size="small" onClick={refetch}>
                다시 시도
              </Button>
            }
            style={{ marginBottom: 16 }}
          />
        )}

        <main>
          {loading ? (
            // 로딩 중일 때 스켈레톤 표시
            <>
              {[1, 2, 3, 4].map((i) => (
                <SkeletonSection key={i} />
              ))}
            </>
          ) : dishes && dishes.length > 0 ? (
            // 데이터가 있을 때 실제 메뉴 표시
            dishes.map((section: TMenuSection) => (
              <section
                key={section.name}
                id={section.name.toLowerCase()}
                className={styles.sectionContainer}
              >
                <Title
                  level={2}
                  style={{
                    color: token.colorPrimary,
                    margin: "0px",
                  }}
                >
                  {section?.name}
                </Title>

                <Paragraph className="section" style={{ fontSize: "16px" }}>
                  {section.description}
                </Paragraph>

                <span className={styles.cardsContainer}>
                  {section?.items && section.items.length > 0 ? (
                    section.items.map((item) => (
                      <PlateCard key={item.id} {...item} />
                    ))
                  ) : (
                    <div className={styles.preparingMessage}>준비중...</div>
                  )}
                </span>
              </section>
            ))
          ) : (
            // 데이터가 없을 때 메시지 표시
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                color: "#666",
              }}
            >
              <h2>메뉴를 불러올 수 없습니다</h2>
              <p>잠시 후 다시 시도해주세요.</p>
              <Button onClick={refetch} type="primary">
                다시 시도
              </Button>
            </div>
          )}
        </main>
      </Content>

      <ScrollToTop />
    </DishesLayout>
  );
};

export default Dishes;
