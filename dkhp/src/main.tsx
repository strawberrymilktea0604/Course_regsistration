import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Login from './pages/DangKyDangNhap/Login'
import Register from './pages/DangKyDangNhap/Register'
import QuenMatKhau from './pages/DangKyDangNhap/QuenMatKhau' // Add this import
import XacNhanEmailQuenPass from './pages/DangKyDangNhap/XacNhanEmailQuenPass' // Add this import
import XacNhanEmailDangKy from './pages/DangKyDangNhap/XacNhanEmailDangKy' // Add this import
import TaoMatKhau from './pages/DangKyDangNhap/TaoMatKhauMoi' // Add this import
import './index.css'

// Page transition wrapper component
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

// Animated Routes component
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><QuenMatKhau /></PageWrapper>} /> {/* Add this route */}
        <Route path="/verify-email-1" element={<PageWrapper><XacNhanEmailQuenPass /></PageWrapper>} /> {/* Add this route */}
        <Route path="/verify-email-2" element={<PageWrapper><XacNhanEmailDangKy /></PageWrapper>} />
        <Route path="/tao-mat-khau-moi" element={<PageWrapper><TaoMatKhau /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  </React.StrictMode>,
)
