import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const { t } = useI18n();
  const location = useLocation();

  const isHusketRoute = location.pathname === "/husket" || location.pathname.startsWith("/husket/");
  const legalBase = isHusketRoute ? "/husket" : "";

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-copy">
          {t("footer.copyright")} © {year}
        </span>

        <nav className="footer-links">
          <Link to={`${legalBase}/kjopsvilkar`}>
            {isHusketRoute ? t("footer.husketLinks.termsPurchase") : t("footer.links.termsPurchase")}
          </Link>
          <span>·</span>

          <Link to={`${legalBase}/brukervilkar`}>
            {isHusketRoute ? t("footer.husketLinks.termsUse") : t("footer.links.termsUse")}
          </Link>
          <span>·</span>

          <Link to={`${legalBase}/personvern`}>
            {isHusketRoute ? t("footer.husketLinks.privacy") : t("footer.links.privacy")}
          </Link>
          <span>·</span>

          <Link to={`${legalBase}/refusjon`}>
            {isHusketRoute ? t("footer.husketLinks.refund") : t("footer.links.refund")}
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
