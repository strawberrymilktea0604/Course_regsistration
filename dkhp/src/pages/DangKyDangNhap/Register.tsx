import { useState } from 'react'
import '../App.css'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate() // Add this line to use the navigation hook

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý đăng ký ở đây
    console.log('Register attempt:', { username, email, password, confirmPassword })
    
    // Navigate to XacNhanEmail page after registration submission
    navigate('/verify-email-2')
  }

  // Add email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Update the isFormValid check to include email validation and password matching
  const isFormValid = 
    username.trim() !== '' && 
    email.trim() !== '' && 
    isValidEmail(email) &&  // Check if email format is valid
    password.trim() !== '' && 
    confirmPassword.trim() !== '' &&
    password === confirmPassword; // Check if passwords match

  return (
    <div className="app">
      <div className="login-container">
        <div className="logo">
          <img src="/huce-logo.png" alt="HUCE Logo" />
        </div>
        <h1 style={{ fontSize: '35px' }}>Đăng ký tài khoản</h1>
        
        <form onSubmit={handleRegister}>
          <div className="input-field">
            <div className="icon-wrapper">
              <img src="/user-icon.svg" alt="User" className="field-icon" />
            </div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="username">Tên đăng nhập</label>
          </div>

          <div className="input-field">
            <div className="icon-wrapper">
              <img src="/email-icon.svg" alt="Email" className="field-icon" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-field">
            <div className="icon-wrapper">
              <img src="/lock-icon.svg" alt="Lock" className="field-icon" />
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="password">Mật khẩu</label>
          </div>

          <div className="input-field">
            <div className="icon-wrapper">
              <img src="/lock-icon.svg" alt="Lock" className="field-icon" />
            </div>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          </div>

          <button 
            type="submit" 
            className={isFormValid ? 'active' : 'inactive'}
            disabled={!isFormValid}
          >
            ĐĂNG KÝ
          </button>
        </form>

        <div className="register-link">
          <span>Đã có tài khoản? </span>
          <Link to="/">Đăng nhập</Link>
        </div>
      </div>
    </div>
  )
}

export default Register