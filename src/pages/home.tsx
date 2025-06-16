import { useEffect } from "react";
import { useRouter } from "next/router";

import { animate } from "motion";
import { Button } from "antd";
import {
  AimOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  InstagramOutlined,
  ReadOutlined,
} from "@ant-design/icons";

import { HomeLayout } from "../components/layouts/HomeLayout";
import styles from "../styles/home.module.css";

const TITLE = "Aukra";
const PAGE_DESCRIPTION = "Aukra Menu";
const ADDRRESS = "서울특별시 서초구 양재천로 97";
const OPEN_TIME = "10:00 am";
const CLOSE_TIME = "10:00 pm";
const PHONE = "050-71378-8186";
const INSTA_ID = "@aukra.yangjae";

const OG_IMAGE = "/images/og-image.png";
const HOME_LAYOUT_IMAGE = "/images/home-layout.png";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    animate(".homeContentAnimation", { opacity: [0, 1] }, { duration: 0.9 });
  }, []);

  return (
    <HomeLayout
      title={TITLE}
      pageDescription={PAGE_DESCRIPTION}
      imageUrl={OG_IMAGE}
    >
      <main className={styles.mainContainer}>
        <img
          className={styles.img}
          src={HOME_LAYOUT_IMAGE}
          alt="restaurant dish"
        />

        <div className={"homeContentAnimation"}>
          <section className={styles.restaurantInformation}>
            <div className={styles.informationContainer}>
              <div>
                <AimOutlined /> {ADDRRESS}
              </div>
              <div>
                {/* TODO: OPEN_TIME, CLOSE_TIME */}
                <ClockCircleOutlined /> Daily: 8:00 am to 11:00 pm
              </div>
            </div>
            <div className={styles.informationContainer}>
              <div>
                <PhoneOutlined /> <span>{PHONE}</span>
              </div>
              <div>
                <InstagramOutlined />
                {INSTA_ID}
              </div>
            </div>
          </section>

          <section className={styles.titleContainer}>
            <h1 className={styles.title}>Where every flavor tells a story</h1>
            <Button
              type="primary"
              size="large"
              onClick={() => router.push("/dishes")}
            >
              <ReadOutlined />
              VIEW OUR MENU
            </Button>
          </section>
        </div>
      </main>
    </HomeLayout>
  );
};

export default HomePage;
