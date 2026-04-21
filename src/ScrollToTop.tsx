import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Scroll vinduet
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Scroll intern scroll-container hvis appen bruker det
    const appContent = document.querySelector(".app-content");
    if (appContent instanceof HTMLElement) {
      appContent.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
