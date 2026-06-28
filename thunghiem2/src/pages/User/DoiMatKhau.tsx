import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Thêm AnimatePresence
import { FaLock } from 'react-icons/fa';
import './DoiMatKhau.css';

const DoiMatKhau: React.FC = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  
  useEffect(() => {
    const { oldPassword, newPassword, confirmPassword } = formData;
    const isValid = 
      oldPassword.length > 0 && 
      newPassword.length > 7 && 
      newPassword === confirmPassword;
      
    setIsFormValid(isValid);
  }, [formData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setShowConfirmPopup(true);
    }
  };
  
  const handleConfirm = () => {
    console.log('Form đã được gửi', formData);
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowConfirmPopup(false);
  };
  
  const handleCancel = () => {
    setShowConfirmPopup(false);
  };
  
  return (
    <>
      <div className="password-container">
        <h1 className="password-title">Đổi mật khẩu</h1>
        
        <form className="password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-with-icon">
              <div className="input-icon">
                <FaLock className="lock-icon" />
              </div>
              <input
                type="password"
                name="oldPassword"
                id="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder=" "
                className="password-input"
              />
              <label htmlFor="oldPassword" className="floating-label">
                Mật khẩu cũ
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-with-icon">
              <div className="input-icon">
                <FaLock className="lock-icon" />
              </div>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder=" "
                className="password-input"
              />
              <label htmlFor="newPassword" className="floating-label">
                Mật khẩu mới
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-with-icon">
              <div className="input-icon">
                <FaLock className="lock-icon" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                className="password-input"
              />
              <label htmlFor="confirmPassword" className="floating-label">
                Xác nhận mật khẩu
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`change-password-btn ${!isFormValid ? 'btn-disabled' : ''}`}
            disabled={!isFormValid}
          >
            ĐỔI MẬT KHẨU
          </button>
        </form>
      </div>
      
      <AnimatePresence>
        {showConfirmPopup && (
          <motion.div 
            className="confirm-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="confirm-popup"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="confirm-popup-content">
                <h2>Bạn có xác nhận muốn thay đổi mật khẩu không?</h2>
                <div className="confirm-buttons">
                  <button className="confirm-button" onClick={handleConfirm}>Có</button>
                  <button className="confirm-button" onClick={handleCancel}>Không</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DoiMatKhau;