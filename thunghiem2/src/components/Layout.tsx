import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="trang-chu-container">
      <Header />
      
      <div className="main-content">
        <Sidebar />
        
        <div className="content-area">
          <Outlet /> {/* This is where the page content will be rendered */}
        </div>
      </div>
    </div>
  );
};

export default Layout;