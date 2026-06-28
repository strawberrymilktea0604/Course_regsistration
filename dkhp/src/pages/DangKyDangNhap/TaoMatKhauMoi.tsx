import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const TaoMatKhauMoi: React.FC = () => {
  const [matKhau, setMatKhau] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const isFormValid = 
    matKhau.trim() !== '' && 
    xacNhanMatKhau.trim() !== '' && 
    matKhau === xacNhanMatKhau;

  return (
    <div className="app">
      <div className="login-container">
        <Link to="/login" className="back-button" style={{ position: 'absolute', left: '20px', top: '20px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        
        <div className="logo">
          <img src="/huce-logo.png" alt="HUCE Logo" />
        </div>
        
        <h1 style={{ fontSize: '35px' }}>Đặt lại mật khẩu</h1>
        
        {error && <div style={{ color: '#FFD700', marginBottom: '20px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <div className="icon-wrapper">
              <img src="/lock-icon.svg" alt="Lock" className="field-icon" />
            </div>
            <input
              type="password"
              id="matKhau"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="matKhau">Mật khẩu</label>
          </div>
          
          <div className="input-field">
            <div className="icon-wrapper">
              <img src="/lock-icon.svg" alt="Lock" className="field-icon" />
            </div>
            <input
              type="password"
              id="xacNhanMatKhau"
              value={xacNhanMatKhau}
              onChange={(e) => setXacNhanMatKhau(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="xacNhanMatKhau">Xác nhận mật khẩu</label>
          </div>
          
          <button 
            type="submit" 
            className={isFormValid ? 'active' : 'inactive'}
            disabled={!isFormValid}
          >
            ĐỔI MẬT KHẨU
          </button>
        </form>
        
        {/* Removed "Quay lại đăng nhập" link */}
      </div>
    </div>
  );
};

export default TaoMatKhauMoi;