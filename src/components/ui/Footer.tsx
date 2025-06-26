import Link from "next/link";

import { Layout, theme, Typography } from "antd";
const { Footer } = Layout;
import styles from "../../styles/footer.module.css";
const { Paragraph } = Typography;

import { useRestaurant } from "../../utils/useRestaurant";
import { restaurantInfo } from "@/../database/restaurant";

export const FooterComponent = () => {
  const { restaurant } = useRestaurant();

  // restaurant 정보가 없으면 fallback 데이터 사용
  const currentRestaurant = restaurant || restaurantInfo;

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Footer
      style={{ background: colorBgContainer }}
      className={styles.footerContainer}
    >
      <Link
        className={styles.footerLink}
        href="https://github.com/leoMirandaa"
        target="_blank"
      >
        <Paragraph>{currentRestaurant.name} ©2025</Paragraph>
      </Link>
    </Footer>
  );
};
