import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

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
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

import { DishLayout } from "../../../components/layouts";
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
  const { id } = router.query;
  const [imageError, setImageError] = useState(false);

  const { dish, loading, error, refetch } = useDish(id as string);

  const { useToken } = theme;
  const { token } = useToken();

  useEffect(() => {
    if (dish) {
      animate(
        ".cardDescriptionAnimation",
        { opacity: [0, 1] },
        { duration: 0.9 }
      );
    }
  }, [dish]);

  if (loading) {
    return (
      <DishLayout
        title="Loading..."
        pageDescription="Loading dish information"
        imageUrl="/images/og-image.png"
      >
        <Content>
          <main>
            <DishSkeleton />
          </main>
        </Content>
      </DishLayout>
    );
  }

  if (error || !dish) {
    return (
      <DishLayout
        title="Error"
        pageDescription="Failed to load dish information"
        imageUrl="/images/og-image.png"
      >
        <Content>
          <main>
            <Alert
              message="메뉴 정보 로딩 오류"
              description={error || "메뉴를 찾을 수 없습니다."}
              type="error"
              showIcon
              action={
                <Button size="small" onClick={refetch}>
                  다시 시도
                </Button>
              }
              style={{ marginBottom: 16 }}
            />
            <Button onClick={() => router.push("/dishes")}>
              메뉴 목록으로 돌아가기
            </Button>
          </main>
        </Content>
      </DishLayout>
    );
  }

  return (
    <DishLayout
      title={dish?.name}
      pageDescription={`Ingredients and description`}
      imageUrl={dish.imageUrl || `/images/menu/menu_${dish.id}.jpeg`}
    >
      <Content>
        <main>
          <Card
            className={`${styles.card} cardDescriptionAnimation`}
            cover={
              <>
                {imageError ? (
                  <Skeleton.Image active className={styles.image} />
                ) : (
                  <Image
                    className={styles.image}
                    style={{ borderRadius: "0px" }}
                    alt="dish food"
                    src={dish.imageUrl || `/images/menu/menu_${dish.id}.jpeg`}
                    width={400}
                    height={450}
                    onError={() => setImageError(true)}
                  />
                )}
              </>
            }
          >
            <div className={styles.bodyCard}>
              {dish?.bestSeller && (
                <Tag className={styles.bestSellerTag} color={token.colorInfo}>
                  Best seller
                </Tag>
              )}
              <Title className={styles.dishName} level={3}>
                {dish?.name}
              </Title>

              <Text className={styles.subtitle}>Ingredients</Text>
              <Paragraph type="secondary" className={styles.paragraph}>
                {dish?.ingredients}
              </Paragraph>

              <Text className={styles.subtitle}>Description</Text>
              <Paragraph type="secondary" className={styles.paragraph}>
                {dish?.description}
              </Paragraph>

              <Tooltip title="Back to Menu">
                <Button
                  onClick={() => router.push("/dishes")}
                  icon={<ArrowLeftOutlined style={{ fontSize: "13px" }} />}
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
