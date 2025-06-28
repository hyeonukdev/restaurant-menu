import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { animate } from "motion";
import { Button, Spin, Alert, Skeleton, Card } from "antd";
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
import { useRestaurant } from "../utils/useRestaurant";
import styles from "../styles/home.module.css";

// 스켈레톤 홈페이지 컴포넌트
const HomeSkeleton = () => (
  <main className={styles.mainContainer}>
    <Skeleton.Image
      active
      style={{ width: "100%", height: 400, marginBottom: 24 }}
    />

    <div style={{ opacity: 1 }}>
      <section className={styles.restaurantInformation}>
        <div className={styles.infoMobile}>
          {[1, 2].map((i) => (
            <div key={i} className={styles.infoMobileRow}>
              <Skeleton active paragraph={{ rows: 1 }} style={{ width: 200 }} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.titleContainer}>
        <div className={styles.introSections}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={styles.introSection}>
              <Skeleton.Input
                active
                size="small"
                style={{ width: 150, marginBottom: 8 }}
              />
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>

        <Skeleton.Button
          active
          size="large"
          style={{ width: 200, height: 40 }}
        />
      </section>
    </div>
  </main>
);

const HomePage = () => {
  const router = useRouter();
  const animationRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // API에서 restaurant 정보 가져오기 (initialData 없이 호출하여 API 요청 발생)
  const { restaurant, loading, error, refetch } = useRestaurant();

  // restaurant 정보가 로딩 중이거나 없으면 fallback 데이터 사용
  const currentRestaurant = restaurant || restaurantInfo;

  const RESTAURANT_INFOS = [
    {
      icon: <InstagramOutlined />,
      label: "인스타",
      value: currentRestaurant.contact.instagram,
    },
    {
      icon: <ClockCircleOutlined />,
      label: "운영시간",
      value: currentRestaurant.mobileBusinessHours,
    },
  ];

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

    // 스크롤 이벤트 최적화를 위한 throttle 적용
    let ticking = false;
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", optimizedScrollHandler, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", optimizedScrollHandler);
  }, []);

  const scrollToTop = () => {
    // 부드러운 스크롤 애니메이션
    const scrollStep = -window.scrollY / (500 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  };

  return (
    <HomeLayout
      title={currentRestaurant.name}
      pageDescription={`${currentRestaurant.name} Menu`}
      imageUrl={currentRestaurant.images.ogImage}
    >
      {loading ? (
        <HomeSkeleton />
      ) : (
        <main className={styles.mainContainer}>
          {error && (
            <Alert
              message="정보 로딩 오류"
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

          <Image
            className={styles.img}
            src={currentRestaurant.images.homeLayoutImage}
            alt="restaurant dish"
            width={1920}
            height={1080}
            priority
            sizes="100vw"
            style={{
              filter: "brightness(0.5)",
              height: "100vh",
              objectFit: "cover",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              maxWidth: "100vw",
              zIndex: 0,
            }}
          />

          <div
            ref={animationRef}
            style={{
              opacity: 0,
              position: "relative",
              zIndex: 10,
              minHeight: "100vh",
              paddingTop: "80px",
            }}
          >
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
                {currentRestaurant.intro.map((intro, index) => (
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
      )}
    </HomeLayout>
  );
};

export default HomePage;
