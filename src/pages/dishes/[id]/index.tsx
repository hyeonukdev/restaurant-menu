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
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

import { DishLayout } from "../../../components/layouts";
import { TMenuItem } from "@/types/dish";
import styles from "../../../styles/dishDetailsCard.module.css";
import {
  getAllDishes,
  getDishById,
  getMenuImageUrl,
} from "@/../database/dishes";

interface IDishes {
  dish: TMenuItem;
}

const Dish = (props: IDishes) => {
  const { dish } = props;
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const { useToken } = theme;
  const { token } = useToken();

  useEffect(() => {
    animate(
      ".cardDescriptionAnimation",
      { opacity: [0, 1] },
      { duration: 0.9 }
    );
  }, []);

  return (
    <DishLayout
      title={dish?.name}
      pageDescription={`Ingredients and description`}
      imageUrl={getMenuImageUrl(dish.id)}
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
                    src={getMenuImageUrl(dish.id)}
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

export async function getStaticPaths() {
  const allDishes = getAllDishes();

  const paths = allDishes.map((dish) => {
    return { params: { id: dish.id } };
  });

  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const { params } = context;
  const slug = params.id;
  const dish = getDishById(slug);

  if (!dish) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dish,
    },
    // Re-generate every 10 minutes(600sec)
    revalidate: 600,
  };
}
