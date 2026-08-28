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
        <div className="footer-brand" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL || "/"}mcl-logo.png`} alt="" />
        </div>
        <div className="footer-content">
          <div className="footer-nav-groups">
            <nav aria-label={t("footer.siteNavLabel")}>
              <strong>{t("footer.site")}</strong>
              <Link to="/">{t("header.nav.home")}</Link>
              <Link to="/om">{t("header.nav.about")}</Link>
              <Link to="/kontakt">{t("header.nav.contact")}</Link>
              <Link to="/idebank">{t("header.nav.workshop")}</Link>
            </nav>
            <nav aria-label={t("footer.legalNavLabel")}>
              <strong>{t("footer.legal")}</strong>
              <Link to={`${legalBase}/kjopsvilkar`}>{t(`${labelBase}.termsPurchase`)}</Link>
              <Link to={`${legalBase}/brukervilkar`}>{t(`${labelBase}.termsUse`)}</Link>
              <Link to={`${legalBase}/personvern`}>{t(`${labelBase}.privacy`)}</Link>
              <Link to={`${legalBase}/refusjon`}>{t(`${labelBase}.refund`)}</Link>
            </nav>
          </div>
          <span className="footer-copy">{t("footer.copyright")} © {year}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
