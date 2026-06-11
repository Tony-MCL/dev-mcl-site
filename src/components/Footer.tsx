import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

type ProductLegal = "default" | "husket" | "kvittek";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const { t } = useI18n();
  const location = useLocation();

  const isHusketRoute =
    location.pathname === "/husket" || location.pathname.startsWith("/husket/");

  const isKvittekRoute =
    location.pathname === "/receipts" ||
    location.pathname.startsWith("/receipts/") ||
    location.pathname === "/kvittek";

  const productLegal: ProductLegal = isHusketRoute
    ? "husket"
    : isKvittekRoute
      ? "kvittek"
      : "default";

  const legalBase = productLegal === "husket" ? "/husket" : productLegal === "kvittek" ? "/receipts" : "";
  const labelBase = productLegal === "husket" ? "footer.husketLinks" : productLegal === "kvittek" ? "footer.kvittekLinks" : "footer.links";

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-copy">
          {t("footer.copyright")} © {year}
        </span>

        <nav className="footer-links">
          <Link to={`${legalBase}/kjopsvilkar`}>{t(`${labelBase}.termsPurchase`)}</Link>
          <span>·</span>

          <Link to={`${legalBase}/brukervilkar`}>{t(`${labelBase}.termsUse`)}</Link>
          <span>·</span>

          <Link to={`${legalBase}/personvern`}>{t(`${labelBase}.privacy`)}</Link>
          <span>·</span>

          <Link to={`${legalBase}/refusjon`}>{t(`${labelBase}.refund`)}</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
