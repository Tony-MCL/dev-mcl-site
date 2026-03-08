import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-copy">
          {t("footer.copyright")} © {year}
        </span>

        <nav className="footer-links">
          <Link to="/kjopsvilkar">
            {t("footer.links.termsPurchase")}
          </Link>
          <span>·</span>

          <Link to="/brukervilkar">
            {t("footer.links.termsUse")}
          </Link>
          <span>·</span>

          <Link to="/personvern">
            {t("footer.links.privacy")}
          </Link>
          <span>·</span>

          <Link to="/refusjon">
            {t("footer.links.refund")}
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
