import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CityOrStatePage from "./pages/CityOrStatePage";
import CityCategoryPage from "./pages/CityCategoryPage";
import ThirdSegmentResolver from "./pages/ThirdSegmentResolver";
import RegisterFreePage from "./pages/RegisterFreePage";
import ReviewTokenPage from "./pages/ReviewTokenPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register-free" element={<RegisterFreePage />} />
          <Route path="/:slug" element={<CityOrStatePage />} />
          <Route path="/:city/:category" element={<CityCategoryPage />} />
          <Route path="/:city/:category/:slug" element={<ThirdSegmentResolver />} />
          <Route path="/review/:token" element={<ReviewTokenPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}