import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; // Icon trang chủ
import { FaUserCog } from 'react-icons/fa'; // Icon quản lý tài khoản
import { FaBook } from 'react-icons/fa'; // Icon quản lý môn học
import { FaChalkboardTeacher } from 'react-icons/fa'; // Icon quản lý giảng viên
import { FaUsers } from 'react-icons/fa'; // Icon quản lý lớp học phần

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Kiểm tra xem có đang ở trang chủ không
  const isHomePage = location.pathname === '/trang-chu';
  
  // Các trang khác
  const isAccountPage = location.pathname === '/quan-ly-tai-khoan';
  const isCoursePage = location.pathname === '/quan-ly-mon-hoc';
  const isTeacherPage = location.pathname === '/quan-ly-giang-vien';
  const isClassPage = location.pathname === '/quan-ly-lop-hoc-phan';

  return (
    <div className="sidebar">
      <div 
        className={`menu-item ${isHomePage ? 'active' : ''}`} 
        onClick={() => navigate('/trang-chu')}
      >
        <div className="menu-icon">
          <FaHome />
        </div>
        Trang chủ
      </div>
      <div 
        className={`menu-item ${isAccountPage ? 'active' : ''}`} 
        onClick={() => navigate('/quan-ly-tai-khoan')}
      >
        <div className="menu-icon">
          <FaUserCog />
        </div>
        Quản lý tài khoản
      </div>
      <div 
        className={`menu-item ${isCoursePage ? 'active' : ''}`} 
        onClick={() => navigate('/quan-ly-mon-hoc')}
      >
        <div className="menu-icon">
          <FaBook />
        </div>
        Quản lý môn học
      </div>
      <div 
        className={`menu-item ${isTeacherPage ? 'active' : ''}`} 
        onClick={() => navigate('/quan-ly-giang-vien')}
      >
        <div className="menu-icon">
          <FaChalkboardTeacher />
        </div>
        Quản lý giảng viên
      </div>
      <div 
        className={`menu-item ${isClassPage ? 'active' : ''}`} 
        onClick={() => navigate('/quan-ly-lop-hoc-phan')}
      >
        <div className="menu-icon">
          <FaUsers />
        </div>
        Quản lý lớp học phần
      </div>
    </div>
  );
};

export default Sidebar;