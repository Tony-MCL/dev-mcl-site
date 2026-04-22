import React from "react";
import ScrollToTop from "./ScrollToTop";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import WatermarkLayer from "./components/WatermarkLayer";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import IdeaBankPage from "./pages/IdeaBankPage";
import ProgressPage from "./pages/ProgressPage";
import ProductPage from "./pages/ProductPage";
import AdminPage from "./pages/AdminPage";

import KjopsvilkarPage from "./pages/KjopsvilkarPage";
import BrukervilkarPage from "./pages/BrukervilkarPage";
import PersonvernPage from "./pages/PersonvernPage";
import RefusjonPage from "./pages/RefusjonPage";

import HusketKjopsvilkarPage from "./pages/HusketKjopsvilkarPage";
import HusketBrukervilkarPage from "./pages/HusketBrukervilkarPage";
import HusketPersonvernPage from "./pages/HusketPersonvernPage";
import HusketRefusjonPage from "./pages/HusketRefusjonPage";

import { PRODUCTS } from "./config/products";
import { readCustomProducts } from "./config/customProducts";

const AppShell: React.FC = () => {
  const location = useLocation();
  const dynamicProducts = [...PRODUCTS, ...readCustomProducts()];

  const isCleanProductRoute = dynamicProducts.some(
    (product) => location.pathname === product.routePath || location.pathname.startsWith(`${product.routePath}/`)
  );

  return (
    <div className="app-shell">
      <ScrollToTop />

      {!isCleanProductRoute ? <WatermarkLayer /> : null}

      <Header />

      <div className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/om" element={<AboutPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/idebank" element={<IdeaBankPage />} />
          <Route path="/admin" element={<AdminPage />} />

          <Route path="/progress" element={<ProgressPage />} />
          {dynamicProducts.map((product) => (
            <Route key={product.slug} path={product.routePath} element={<ProductPage slug={product.slug} />} />
          ))}

          <Route path="/kjopsvilkar" element={<KjopsvilkarPage />} />
          <Route path="/brukervilkar" element={<BrukervilkarPage />} />
          <Route path="/personvern" element={<PersonvernPage />} />
          <Route path="/refusjon" element={<RefusjonPage />} />

          <Route path="/husket/kjopsvilkar" element={<HusketKjopsvilkarPage />} />
          <Route path="/husket/brukervilkar" element={<HusketBrukervilkarPage />} />
          <Route path="/husket/personvern" element={<HusketPersonvernPage />} />
          <Route path="/husket/refusjon" element={<HusketRefusjonPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return <AppShell />;
};

export default App;
