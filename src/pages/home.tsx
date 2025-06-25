import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { animate } from "motion";
import { Button } from "antd";
import {
  AimOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  InstagramOutlined,
  ReadOutlined,
  UpOutlined,
} from "@ant-design/icons";

import { HomeLayout } from "../components/layouts/HomeLayout";
import { restaurantInfo } from "@/../database/restaurant"; // fallback용
import styles from "../styles/home.module.css";

const RESTAURANT_INFOS = [
  {
    icon: <InstagramOutlined />,
    label: "인스타",
    value: restaurantInfo.contact.instagram,
  },
  {
    icon: <ClockCircleOutlined />,
    label: "운영시간",
    value: restaurantInfo.mobileBusinessHours,
  },
];

const HomePage = () => {
  const router = useRouter();
  const animationRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // DOM이 렌더링된 후에 애니메이션 실행
    const timer = setTimeout(() => {
      if (animationRef.current) {
        animate(animationRef.current, { opacity: [0, 1] }, { duration: 0.9 });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <HomeLayout
      title={restaurantInfo.name}
      pageDescription={`${restaurantInfo.name} Menu`}
      imageUrl={restaurantInfo.images.ogImage}
    >
      <main className={styles.mainContainer}>
        <img
          className={styles.img}
          src={restaurantInfo.images.homeLayoutImage}
          alt="restaurant dish"
        />

        <div ref={animationRef} style={{ opacity: 0 }}>
          <section className={styles.restaurantInformation}>
            <div className={styles.infoMobile}>
              {RESTAURANT_INFOS.map((info) => (
                <div key={info.label} className={styles.infoMobileRow}>
                  {info.icon} {info.value}
                </div>
              ))}
            </div>
          </section>

          <section className={styles.titleContainer}>
            <div className={styles.introSections}>
              {restaurantInfo.intro.map((intro, index) => (
                <div key={intro.id} className={styles.introSection}>
                  <div
                    className={`${styles.introTitle} ${
                      index === 0 ? styles.mainTitle : styles.subTitle
                    }`}
                  >
                    {intro.title}
                  </div>
                  <div className={styles.introContent}>{intro.content}</div>
                </div>
              ))}
            </div>

            <Button
              type="primary"
              size="large"
              onClick={() => router.push("/dishes")}
              className={styles.menuButton}
            >
              <ReadOutlined />
              VIEW OUR MENU
            </Button>
          </section>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<UpOutlined />}
            onClick={scrollToTop}
            className={styles.scrollTopButton}
          />
        )}
      </main>
    </HomeLayout>
  );
};

export default HomePage;
