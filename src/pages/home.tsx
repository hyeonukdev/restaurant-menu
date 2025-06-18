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
const PHONE = "050-71378-8186";
const INSTA_ID = "@aukra.yangjae";

const BUSINESS_HOURS = {
  weekday: {
    open: "10:00 am",
    lastOrder: "6:00 pm",
    close: "7:00 pm",
  },
  weekend: {
    open: "10:00 am",
    lastOrder: "9:00 pm",
    close: "10:00 pm",
  },
};

const MOBILE_BUSINESS_HOURS = "운영시간: 10:00~19:00(평일), 10:00~22:00(주말)";

const INTRO =
  "양재천 최고의 뷰맛집!\n\n수제 오픈샌드위치와 커피, 그리고 와인의\n올데이 브런치 카페입니다.";
const OG_IMAGE = "/images/og-image.png";
const HOME_LAYOUT_IMAGE = "/images/home-layout.png";

const RESTAURANT_INFOS = [
  { icon: <AimOutlined />, label: "주소", value: ADDRRESS },
  { icon: <PhoneOutlined />, label: "전화", value: PHONE },
  { icon: <InstagramOutlined />, label: "인스타", value: INSTA_ID },
  {
    icon: <ClockCircleOutlined />,
    label: "운영시간",
    value: MOBILE_BUSINESS_HOURS,
  },
];

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
            {/* 모바일 */}
            <div className={styles.infoMobile}>
              {RESTAURANT_INFOS.map((info) => (
                <div key={info.label} className={styles.infoMobileRow}>
                  {info.icon} {info.value}
                </div>
              ))}
            </div>
            {/* 데스크탑 */}
            <div className={styles.infoDesktop}>
              {RESTAURANT_INFOS.map((info) =>
                info.label === "운영시간" ? (
                  <div key={info.label} className={styles.businessHours}>
                    <ClockCircleOutlined />
                    <div className={styles.hoursDesktop}>
                      <div className={styles.hoursContainer}>
                        <span className={styles.days}>평일</span>
                        <span>
                          {BUSINESS_HOURS.weekday.open} -{" "}
                          {BUSINESS_HOURS.weekday.close}
                        </span>
                        <span className={styles.days}>주말</span>
                        <span>
                          {BUSINESS_HOURS.weekend.open} -{" "}
                          {BUSINESS_HOURS.weekend.close}
                        </span>
                        <div className={styles.lastOrder}>
                          Last Order: 평일 {BUSINESS_HOURS.weekday.lastOrder} /
                          주말 {BUSINESS_HOURS.weekend.lastOrder}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={info.label} className={styles.informationRow}>
                    {info.icon} {info.value}
                  </div>
                )
              )}
            </div>
          </section>

          <section className={styles.titleContainer}>
            <h1 className={styles.title}>{INTRO}</h1>
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
