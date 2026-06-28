import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function XacNhanEmail() {
  const navigate = useNavigate();
  // State for the 6-digit verification code
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false); // Changed to false initially
  const [timerActive, setTimerActive] = useState(false); // New state to track if timer is running
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<number | null>(null);
  
  // Sample email - in a real app, this would come from props or context
  const maskedEmail = "lm****************@gmail.com";
  
  useEffect(() => {
    // Focus the first input on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Separate effect for managing the countdown
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            setIsResendDisabled(false);
            setTimerActive(false);
            clearInterval(timerRef.current as number);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive]);
  
  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleResend = () => {
    // Logic to resend verification code
    console.log('Resending verification code');
    setVerificationCode(['', '', '', '', '', '']);
    setCountdown(60);
    setIsResendDisabled(true);
    setTimerActive(true); // Start the timer when resend is clicked
    
    // Focus the first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    console.log('Verifying code:', code);
    
    // Remove navigation line - button no longer redirects anywhere
    // navigate('/tao-mat-khau-moi');
  };

  // Add this const to determine if all verification code fields are filled
  const isFormValid = verificationCode.every(digit => digit !== '');
  
  return (
    <div className="verification-page">
      <div className="verification-container">
        <div className="header">
          <Link to="/forgot-password" className="back-button" style={{ marginLeft: '500px', marginTop: '90px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className="logo">
            <img src="/huce-logo.png" alt="HUCE Logo" />
          </div>
        </div>

        <h1 className="title">Xác nhận email</h1>
        <p className="subtitle">
          Vui lòng nhập mã xác thực được gửi đến email<br />
          {maskedEmail}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="verification-inputs">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="verification-input"
              />
            ))}
          </div>

          <div className="resend-code">
            <span>Bạn chưa nhận được mã? </span>
            <span
              onClick={!isResendDisabled ? handleResend : undefined}
              style={{
                color: isResendDisabled ? '#aaa' : 'orange', // Changed from #007bff to orange
                textDecoration: 'none', // Removed underline for all states
                cursor: isResendDisabled ? 'default' : 'pointer',
                userSelect: 'none', // Prevents text selection when clicking
              }}
              role="button"
              tabIndex={isResendDisabled ? -1 : 0} // For accessibility
            >
              Gửi lại {isResendDisabled ? `(${countdown})` : ''}
            </span>
          </div>

          <button 
            type="submit" 
            className={isFormValid ? 'active' : 'inactive'}
            disabled={!isFormValid}
          >
            XÁC THỰC
          </button>
        </form>
      </div>
    </div>
  );
}

export default XacNhanEmail;