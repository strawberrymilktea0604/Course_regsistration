import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function QuenMatKhau() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  // Email validation function using regex
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Using our validation function
    if (!isValidEmail(email)) {
      alert('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    
    // Handle password recovery request
    console.log('Password recovery request for:', email);
    
    // Navigate to verification page
    navigate('/verify-email-1', { state: { email } });
  };

  // Check if email is valid for button state
  const isEmailValid = isValidEmail(email);

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="header">
          <Link to="/login" className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className="logo" style={{ width: '150px', height: '150px' }}>
            <img src="/huce-logo.png" alt="HUCE Logo" />
          </div>
        </div>

        <h1 className="title">Khôi phục tài khoản</h1>
        <p className="subtitle">Nhập email để gửi yêu cầu lấy lại mật khẩu</p>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
          {/* Updated input field to match Login style with extended width */}
          <div className="input-field" style={{ width: '100%' }}>
            <div className="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="field-icon">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
              style={{ width: '100%' }}
            />
            <label htmlFor="email">Email</label>
          </div>

          <button 
            type="submit" 
            className={isEmailValid ? 'active' : 'inactive'}
            disabled={!isEmailValid}
            style={{ width: '100%', padding: '12px 0' }}
          >
            GỬI YÊU CẦU
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuenMatKhau;