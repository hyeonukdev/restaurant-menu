import { useRouter } from "next/router";

import { Layout, theme, Typography, Button } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { IconChefHat } from "@tabler/icons-react";
const { Header } = Layout;
const { Title } = Typography;

import { useRestaurant } from "../../utils/useRestaurant";
import { restaurantInfo } from "@/../database/restaurant";
import styles from "../../styles/navbar.module.css";

export const HomeNavbar = () => {
  const router = useRouter();
  const { restaurant } = useRestaurant();

  // restaurant 정보가 없으면 fallback 데이터 사용
  const currentRestaurant = restaurant || restaurantInfo;

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { useToken } = theme;
  const { token } = useToken();

  return (
    <Header
      className={styles.headerContainer}
      style={{ background: colorBgContainer, padding: "0px" }}
    >
      <nav className={`container ${styles.navContainer}`}>
        {/* mobile */}
        <div
          className={styles.navContainerOptions}
          onClick={() => router.push("/")}
        >
          <IconChefHat size={30} color={`${token.colorPrimary}`} />
          <Title level={1} style={{ fontSize: "24px" }}>
            {currentRestaurant.name}
          </Title>
        </div>

        <div className={styles.menuIcon}>
          <Button
            icon={<ReadOutlined />}
            onClick={() => router.push("/dishes")}
          />
        </div>

        {/* desktop */}
        <div className={styles.headerButtonsContainer}>
          <Button
            icon={<ReadOutlined />}
            onClick={() => router.push("/dishes")}
          >
            Menu
          </Button>
        </div>
      </nav>
    </Header>
  );
};
