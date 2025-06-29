import React, { useEffect, useState, useMemo } from "react";

import { Menu, theme } from "antd";

import { useDishes } from "@/utils/useDishes";
import { getIconForSection } from "@/utils/menuOptions";
import styles from "../../styles/sidebar.module.css";

export const MenuItems = ({ isDrawerOpen, setOpenDrawer }: any) => {
  const { dishes } = useDishes();

  // 동적으로 메뉴 옵션 생성
  const menuOptions = useMemo(() => {
    if (!dishes || dishes.length === 0) return [];

    return dishes.map((section) => ({
      key: section.name.toLowerCase(),
      icon: section.icon
        ? getIconForSection(section.icon)
        : getIconForSection(section.name),
      label: <a href={`#${section.name.toLowerCase()}`}>{section.name}</a>,
    }));
  }, [dishes]);

  const [currentSection, setCurrentSection] = useState<string | null>(null);

  // 메뉴 옵션이 로드되면 첫 번째 섹션을 기본값으로 설정
  useEffect(() => {
    if (menuOptions.length > 0 && !currentSection) {
      setCurrentSection(menuOptions[0].key);
    }
  }, [menuOptions, currentSection]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { useToken } = theme;
  const { token } = useToken();
  useEffect(() => {
    const handleScroll = () => {
      // Find all sections in the main layout
      const sections = document.querySelectorAll("section");

      // Determine the current section in view
      let newCurrentSection: string | null = null;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 300 && rect.bottom >= 10) {
          // Adjust threshold as needed
          newCurrentSection = section.id;
        }
      });

      // Update the current section in state
      setCurrentSection(newCurrentSection);
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Run only once on component mount

  const handleMenuClick = (e) => {
    isDrawerOpen && setOpenDrawer(false);
    setCurrentSection(e.key);
  };
  return (
    <>
      <Menu
        className={styles.menuContainer}
        mode="inline"
        selectedKeys={currentSection ? [currentSection] : []}
        onClick={handleMenuClick}
        items={menuOptions.map((option) => ({
          key: option.key,
          icon: option.icon,
          label: option.label,
        }))}
      />
    </>
  );
};
