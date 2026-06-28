import React, { useState } from 'react';
import { Menu, MenuItem, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Thêm dòng này

interface HeaderProps {
  title?: string; // Tham số tùy chọn cho tiêu đề 
}

const Header: React.FC<HeaderProps> = ({ title = "Welcome to HUCE for admin" }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate(); // Thêm dòng này

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThongTinCaNhan = () => {
    handleClose();
    navigate('/thong-tin-ca-nhan');
  };
  
  // Thêm hàm xử lý cho đổi mật khẩu
  const handleDoiMatKhau = () => {
    handleClose();
    navigate('/doi-mat-khau');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/huce-logo.png" alt="Logo" className="logo" />
      </div>
      <h1 className="welcome-text">{title}</h1>
      <div className="user-profile">
        <div className="user-avatar" onClick={handleClick}>
          <img src="/avatar.png" alt="User" />
        </div>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              elevation: 3,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                borderRadius: 2,
                width: 280,
                '& .MuiMenuItem-root': {
                  padding: 2,
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#0066cc',
                  justifyContent: 'center',
                  height: 50,
                  userSelect: 'none',
                  backgroundColor: '#fff !important', // Luôn nền trắng
                  '&.Mui-selected': {
                    backgroundColor: '#fff !important',
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: '#fff !important',
                  },
                  '&:hover': {
                    backgroundColor: '#f5f5f5 !important', // hoặc #fff nếu muốn không đổi màu khi hover
                  },
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleThongTinCaNhan} disableGutters>Thông tin cá nhân</MenuItem>
          <MenuItem onClick={handleDoiMatKhau} disableGutters>Đổi mật khẩu</MenuItem>
          <MenuItem onClick={handleClose} disableGutters>Đăng xuất</MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;