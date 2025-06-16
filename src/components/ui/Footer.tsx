import Link from "next/link";

import { Layout, theme, Typography } from "antd";
const { Footer } = Layout;
import styles from "../../styles/footer.module.css";
const { Paragraph } = Typography;

const FOOTER = "Aukra";

export const FooterComponent = () => {
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
        <Paragraph>Aukra ©2025</Paragraph>
      </Link>
    </Footer>
  );
};
