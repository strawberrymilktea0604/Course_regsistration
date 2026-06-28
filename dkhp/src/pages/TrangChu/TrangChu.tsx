import React from 'react';
import { motion } from 'framer-motion';
import './TrangChu.css';

const TrangChu: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="background-image"></div>
      <h2 className="greeting">Chào mừng bạn đã đến với giao diện trang chủ quản trị viên!</h2>
    </motion.div>
  );
};

export default TrangChu;