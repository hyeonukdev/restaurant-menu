import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";

import { Button, Card, theme, Typography, Tag, Tooltip, Skeleton } from "antd";
const { Title, Paragraph } = Typography;
import { ArrowRightOutlined } from "@ant-design/icons";

import { PriceNameType, TMenuItem, TPriceOption } from "@/types/dish";
import { getMenuImageUrl } from "@/../database/dishes";
import { SafeImage } from "@/components/ui";
import styles from "../../styles/dishCard.module.css";

export const PlateCard = ({
  id,
  name,
  description,
  prices,
  imageUrl,
  bestSeller,
}: TMenuItem) => {
  const router = useRouter();

  const { useToken } = theme;
  const { token } = useToken();

  const handleDetailsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/dishes/${id}`);
  };

  const handlePriceName = (name: string) => {
    switch (name) {
      case PriceNameType.STANDARD:
        return "";

      default:
        return `${name.charAt(0).toUpperCase() + name.slice(1)}: `;
    }
  };

  return (
    <Card
      className={styles.card}
      cover={
        <SafeImage
          className={styles.image}
          alt="dish food"
          src={imageUrl || getMenuImageUrl(id)}
          width={200}
          height={200}
          fallbackText="이미지 없음"
        />
      }
    >
      <div className={styles.bodyCard}>
        {bestSeller && (
          <Tag className={styles.bestSellerTag} color={token.colorInfo}>
            Best seller
          </Tag>
        )}

        <Title level={3}>{name}</Title>

        <div className={styles.pricesContainer}>
          {prices.map(({ name, price }: TPriceOption, idx) => (
            <Paragraph key={`${name}-${price}-${idx}`}>
              {handlePriceName(name)}
              <span style={{ color: token.colorTextSecondary }}>₩{price}</span>
            </Paragraph>
          ))}
        </div>
        <Paragraph className={styles.description} type="secondary">
          {description}
        </Paragraph>

        <Tooltip title="Details">
          <Button
            onClick={handleDetailsClick}
            icon={<ArrowRightOutlined style={{ fontSize: "13px" }} />}
            className={styles.detailsButton}
            style={{
              background: token.colorInfoBg,
              borderRadius: "50% 0px 0px 0px",
            }}
            type="text"
            size="large"
          />
        </Tooltip>
      </div>
    </Card>
  );
};
