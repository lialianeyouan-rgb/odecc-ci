import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PresidentPage from "./pages/PresidentPage";
import NewsPage from "./pages/NewsPage";
import ContactPage from "./pages/ContactPage";
import SupportPage from "./pages/SupportPage";
import GalleryPage from "./pages/GalleryPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/a-propos"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/le-president"
            element={
              <Layout>
                <PresidentPage />
              </Layout>
            }
          />
          <Route
            path="/actions-plaidoyer"
            element={
              <Navigate to="/a-propos" replace />
            }
          />
          <Route
            path="/actualites"
            element={
              <Layout>
                <NewsPage />
              </Layout>
            }
          />
          <Route
            path="/galerie"
            element={
              <Layout>
                <GalleryPage />
              </Layout>
            }
          />
          <Route
            path="/galerie/:id"
            element={
              <Layout>
                <GalleryPage />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <ContactPage />
              </Layout>
            }
          />
          <Route
            path="/soutenir"
            element={
              <Layout>
                <SupportPage />
              </Layout>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
