import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ThongTinCaNhan.css';

const ThongTinCaNhan: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [verificationCode, setVerificationCode] = useState(['','','','','','']);
  const [originalEmail, setOriginalEmail] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [userData, setUserData] = useState({
    name: 'Trần Việt Phương',
    dob: '15/06/1998',
    email: 'phuongtv@huce.edu.vn',
    phone: '0944 911 333',
    code: '325435'
  });
  
  const [formData, setFormData] = useState({...userData});
  
  // Thêm useEffect để reset countdown mỗi khi showEmailVerification thay đổi thành true
  useEffect(() => {
    if (showEmailVerification) {
      // Reset countdown về 60 khi hiển thị màn hình xác nhận email
      setCountdown(60);
      // Reset mã xác nhận
      setVerificationCode(['','','','','','']);
    }
  }, [showEmailVerification]);

  // Đếm ngược khi hiển thị xác nhận email
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showEmailVerification && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showEmailVerification, countdown]);
  
  // Kiểm tra xem form có hợp lệ không
  useEffect(() => {
    // Check các điều kiện
    const isNameValid = formData.name.trim() !== '';
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const isCodeValid = /^\d{5,7}$/.test(formData.code);
    
    // Form hợp lệ khi tất cả điều kiện đều đúng
    setIsFormValid(isNameValid && isEmailValid && isCodeValid);
  }, [formData]);
  
  const handleEditClick = () => {
    setFormData({...userData});
    setOriginalEmail(userData.email);
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setShowConfirm(false);
    setShowEmailVerification(false);
  };
  
  // Kiểm tra xem có thông tin nào thay đổi không
  const hasChanges = () => {
    return (
      formData.name !== userData.name ||
      formData.dob !== userData.dob ||
      formData.email !== userData.email ||
      formData.phone !== userData.phone ||
      formData.code !== userData.code
    );
  };
  
  // Kiểm tra xem email có thay đổi không
  const isEmailChanged = () => {
    return formData.email !== originalEmail;
  };
  
  const handleSubmitClick = () => {
    if (isFormValid && hasChanges()) {
      // Luôn hiển thị dialog xác nhận chung trước
      setShowConfirm(true);
    } else if (isFormValid) {
      // Không có thay đổi, đóng form
      setIsEditing(false);
    }
  };
  
  const handleConfirmYes = () => {
    // Đóng dialog xác nhận chung
    setShowConfirm(false);
    
    // Kiểm tra xem email có thay đổi không
    if (isEmailChanged()) {
      // Nếu có thay đổi email, hiển thị màn hình xác nhận email
      setShowEmailVerification(true);
    } else {
      // Nếu không thay đổi email, đóng form
      setUserData({...formData});
      setIsEditing(false);
    }
  };
  
  const handleConfirmNo = () => {
    // Đóng dialog xác nhận khi người dùng chọn Không
    setShowConfirm(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Xử lý khi người dùng nhập mã xác nhận
  const handleVerificationCodeChange = (index: number, value: string) => {
    const newCode = [...verificationCode];
    // Chỉ cho phép nhập 1 ký tự cho mỗi ô
    newCode[index] = value.slice(0, 1);
    setVerificationCode(newCode);
    
    // Tự động focus vào ô tiếp theo nếu có nhập giá trị
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  // Xử lý xác nhận email
  const handleVerifyEmail = () => {
    // Giả lập xác nhận email thành công
    setUserData({...formData});
    setShowEmailVerification(false);
    setIsEditing(false);
  };
  
  // Xử lý gửi lại mã xác nhận
  const handleResendCode = () => {
    // Reset đếm ngược
    setCountdown(60);
    // Giả lập gửi lại mã
    setVerificationCode(['','','','','','']);
  };

  // Thêm function để kiểm tra mã xác nhận đã đủ chưa
  const isVerificationCodeComplete = () => {
    return verificationCode.every(digit => digit.trim() !== '');
  };

  return (
    <>
      <div className="page-actions">
        <button className="edit-button" onClick={handleEditClick}>Chỉnh sửa thông tin</button>
      </div>
      
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-avatar">
            <img src="/avatar.png" alt="User" className="avatar-image" />
          </div>
          
          <div className="profile-info">
            <div className="info-row">
              <div className="info-label">Họ tên:</div>
              <div className="info-value">{userData.name}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Ngày sinh:</div>
              <div className="info-value">{userData.dob}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Email:</div>
              <div className="info-value">{userData.email}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Điện thoại:</div>
              <div className="info-value">{userData.phone}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Mã số:</div>
              <div className="info-value">{userData.code}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal chỉnh sửa thông tin */}
      <AnimatePresence>
        {isEditing && !showEmailVerification && (
          <motion.div 
            className="edit-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="edit-modal"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h2 className="edit-modal-title">Chỉnh sửa thông tin tài khoản</h2>
              
              <div className="edit-form">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Mã số</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    className={`btn-confirm ${!isFormValid ? 'btn-disabled' : ''}`} 
                    onClick={handleSubmitClick}
                    disabled={!isFormValid}
                  >
                    Xác nhận
                  </button>
                  <button className="btn-cancel" onClick={handleCancel}>Hủy</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dialog xác nhận thay đổi thông tin */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            className="confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="confirm-dialog"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <div className="confirm-content">
                <h3 className="confirm-title">Bạn có xác nhận muốn thay đổi thông tin không?</h3>
                <div className="confirm-actions">
                  <button className="confirm-button confirm-yes" onClick={handleConfirmYes}>Có</button>
                  <button className="confirm-button confirm-no" onClick={handleConfirmNo}>Không</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Xác nhận email */}
      <AnimatePresence>
        {showEmailVerification && (
          <motion.div 
            className="confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="confirm-dialog email-confirm-dialog"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <div className="confirm-content">
                <h3 className="confirm-title">Xác nhận email</h3>
                
                <p className="verify-text">
                  Vui lòng nhập mã xác thực được gửi đến email<br />
                  {formData.email.substring(0, 2)}
                  {'*'.repeat(formData.email.indexOf('@') - 2)}
                  {formData.email.substring(formData.email.indexOf('@'))}
                </p>
                
                <div className="verification-code-container">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      className="verification-input"
                      value={verificationCode[index]}
                      onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                      maxLength={1}
                    />
                  ))}
                </div>
                
                <div className="resend-code">
                  <span>Bạn chưa nhận được mã? </span>
                  <button 
                    className="resend-button" 
                    onClick={handleResendCode}
                    disabled={countdown > 0}
                  >
                    Gửi lại {countdown > 0 ? `(${countdown})` : ''}
                  </button>
                </div>
                
                <div className="confirm-actions">
                  <button 
                    className={`confirm-button confirm-yes ${!isVerificationCodeComplete() ? 'btn-disabled' : ''}`} 
                    onClick={handleVerifyEmail}
                    disabled={!isVerificationCodeComplete()}
                  >
                    Xác nhận
                  </button>
                  <button className="confirm-button confirm-no" onClick={handleCancel}>Hủy</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThongTinCaNhan;