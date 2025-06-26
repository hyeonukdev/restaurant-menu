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
        <div style={{ position: "relative" }}>
          <SafeImage
            className={styles.image}
            alt="dish food"
            src={imageUrl || getMenuImageUrl(id)}
            width={300}
            height={200}
            fallbackText=""
            showIcon={false}
            hideOnError={true}
          />
          {bestSeller && (
            <Tag
              color={token.colorInfo}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                zIndex: 10,
                margin: 0,
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 8px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              Best seller
            </Tag>
          )}
        </div>
      }
    >
      <div className={styles.bodyCard}>
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
