import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './QuanLyTaiKhoan.css';
import { FaSearch, FaEllipsisH, FaUserPlus, FaSortAlphaDown, FaSortAlphaUp, FaFilter, FaTimes, FaGraduationCap, FaUserCog } from 'react-icons/fa';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Sample data to match what's in the image
const initialAccounts = [
  { 
    id: 1, 
    name: 'Lê Hải Anh', 
    phone: '0384895040', 
    email: '0120068@st.huce.edu.vn', 
    code: '0120068', // Khóa 68
    role: 'Sinh viên',
    studentDetails: {
      dob: '20/10/2004',
      major: 'Khoa học máy tính',
      specialization: 'Khoa học máy tính',
      faculty: 'Công nghệ thông tin',
      trainingType: 'Chính quy - CĐIO',
      universitySystem: 'Đại học - B7',
      classGroup: '68',
      classSection: 'CS1'
    }
  },
  { 
    id: 2, 
    name: 'Lê Văn Anh', 
    phone: '0335244235', 
    email: '0126468@st.huce.edu.vn', 
    code: '0126467', // Khóa 67
    role: 'Sinh viên',
    studentDetails: {
      dob: '15/04/2003',
      major: 'Khoa học máy tính',
      specialization: 'Khoa học máy tính',
      faculty: 'Công nghệ thông tin',
      trainingType: 'Chính quy - CĐIO',
      universitySystem: 'Đại học - B7',
      classGroup: '67',
      classSection: 'CS2'
    }
  },
  { 
    id: 3, 
    name: 'Trần Hải Anh', 
    phone: '0944911333', 
    email: 'thanhnh@st.huce.edu.vn', 
    code: '2347249', 
    role: 'Admin',
    password: 'admin123'
  },
  { 
    id: 4, 
    name: 'Nguyễn Hoàng Mai Anh', 
    phone: '0336194290', 
    email: '0127068@st.huce.edu.vn', 
    code: '0127066', // Khóa 66
    role: 'Sinh viên',
    studentDetails: {
      dob: '05/06/2002',
      major: 'Khoa học máy tính',
      specialization: 'Khoa học máy tính',
      faculty: 'Công nghệ thông tin',
      trainingType: 'Chính quy - CĐIO',
      universitySystem: 'Đại học - B7',
      classGroup: '66',
      classSection: 'CS3'
    }
  },
  { 
    id: 5, 
    name: 'Nguyễn Việt Anh', 
    phone: '0913209689', 
    email: 'anhvn@huce.edu.vn', 
    code: '764332', 
    role: 'Admin',
    password: 'admin456'
  },
  { 
    id: 6, 
    name: 'Hàn Thanh Cương', 
    phone: '0918922564', 
    email: '0130068@st.huce.edu.vn', 
    code: '0130065', // Khóa 65
    role: 'Sinh viên',
    studentDetails: {
      dob: '12/09/2001',
      major: 'Kỹ thuật phần mềm',
      specialization: 'Kỹ thuật phần mềm',
      faculty: 'Công nghệ thông tin',
      trainingType: 'Chính quy - CĐIO',
      universitySystem: 'Đại học - B7',
      classGroup: '65',
      classSection: 'SE1'
    }
  },
  { 
    id: 7, 
    name: 'Nguyễn Hải Cường', 
    phone: '0977942963', 
    email: '0174067@st.huce.edu.vn', 
    code: '0174064', // Khóa 64
    role: 'Sinh viên',
    studentDetails: {
      dob: '28/03/2000',
      major: 'Hệ thống thông tin',
      specialization: 'Hệ thống thông tin',
      faculty: 'Công nghệ thông tin',
      trainingType: 'Chính quy - CĐIO',
      universitySystem: 'Đại học - B7',
      classGroup: '64',
      classSection: 'IS2'
    }
  },
];

// Define types
type SearchFilter = 'name' | 'code' | 'phone';
type RoleFilter = 'all' | 'student' | 'admin';
type AccountRole = 'Admin' | 'Sinh viên';
type SortDirection = 'asc' | 'desc' | 'none';

// Interface for student details
interface StudentDetails {
  dob: string;
  major: string;
  specialization: string;
  faculty: string;
  trainingType: string;
  universitySystem: string;
  classGroup: string;
  classSection: string;
}

// Interface for account
interface Account {
  id: number;
  name: string;
  phone: string;
  email: string;
  code: string;
  role: string;
  password?: string;
  studentDetails?: StudentDetails;
}

const QuanLyTaiKhoan: React.FC = () => {
  // State variables
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState<SearchFilter>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Selected items states
  const [selectedRole, setSelectedRole] = useState<AccountRole>('Sinh viên');
  const [modalStep, setModalStep] = useState<'select-role' | 'enter-details'>('select-role');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [accountIdToDelete, setAccountIdToDelete] = useState<number | null>(null);
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState<AccountRole>('Sinh viên');
  
  // Form data states
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    phone: '',
    code: '',
    password: '',
    major: '',
    specialization: '',
    faculty: '',
    trainingType: '',
    universitySystem: '',
    classGroup: '',
    classSection: ''
  });
  const [viewRole, setViewRole] = useState<AccountRole>('Sinh viên');
  const [viewAccountData, setViewAccountData] = useState({
    name: '',
    dob: '',
    email: '',
    phone: '',
    code: '',
    password: '',
    major: '',
    specialization: '',
    faculty: '',
    trainingType: '',
    universitySystem: '',
    classGroup: '',
    classSection: ''
  });

  // Thêm vào phần trên của component
  const [selectedBatch, setSelectedBatch] = useState('67'); // Khóa mặc định là 67
  const [editSelectedBatch, setEditSelectedBatch] = useState('67');

  // Add this validation function after your state declarations
  const validateForm = (data: any, role: string) => {
    // Name validation - cannot be empty
    if (!data.name.trim()) return false;
    
    // Email validation - must be valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) return false;
    
    // Code validation - different rules based on role
    if (role === 'Sinh viên') {
      // For students: input portion (excluding batch) must be 2-5 digits
      const codeBase = data.code.replace(/\d{2}$/, '');
      if (!/^\d{2,5}$/.test(codeBase)) return false;
    } else {
      // For admins: code must be 5-6 digits
      if (!/^\d{5,7}$/.test(data.code)) return false;
    }
    
    // Password validation - must be at least 6 characters
    if (data.password.length < 6) return false;
    
    return true;
  };

  // Existing handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter: SearchFilter) => {
    setSearchFilter(filter);
  };
  
  const toggleSort = () => {
    if (sortDirection === 'none') setSortDirection('asc');
    else if (sortDirection === 'asc') setSortDirection('desc');
    else setSortDirection('none');
  };
  
  const handleRoleFilter = (role: RoleFilter) => {
    setRoleFilter(role);
  };
  
  // Modal handlers
  const openCreateModal = () => {
    setSelectedRole('Sinh viên'); // Default role
    setModalStep('select-role');
    // Reset form data
    setFormData({
      name: '',
      dob: '',
      email: '',
      phone: '',
      code: '',
      password: '',
      major: '',
      specialization: '',
      faculty: '',
      trainingType: '',
      universitySystem: '',
      classGroup: '',
      classSection: ''
    });
    setShowCreateModal(true);
  };
  
  const handleCloseModal = () => {
    setShowCreateModal(false);
  };
  
  const handleRoleSelect = (role: AccountRole) => {
    setSelectedRole(role);
    
    // Set example data based on role for demonstration
    if (role === 'Admin') {
      setFormData({
        name: 'Trần Việt Phương',
        dob: '15/06/1998',
        email: 'phuongtv@huce.edu.vn',
        phone: '0944 911 333',
        code: '325435',
        password: 'D@f+PY{3',
        major: '',
        specialization: '',
        faculty: '',
        trainingType: '',
        universitySystem: '',
        classGroup: '',
        classSection: ''
      });
    } else {
      // Example student data
      setFormData({
        name: 'Trần Phạm Nhật Quân',
        dob: '20/10/2004',
        email: '0305067@st.huce.edu.vn',
        phone: '0979836562',
        code: '03067',
        password: 'D@f+PY{3',
        major: 'Khoa học máy tính',
        specialization: 'Khoa học máy tính',
        faculty: 'Công nghệ thông tin',
        trainingType: 'Chính quy - CĐIO',
        universitySystem: 'Đại học - B7',
        classGroup: 'Khóa 67',
        classSection: 'CS2'
      });
    }
    
    setModalStep('enter-details');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateAccount = () => {

    // Tạo account mới với đầy đủ thông tin
    const newAccount: Account = {
      id: accounts.length + 1,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      code: formData.code,
      role: selectedRole,
      password: formData.password,
      studentDetails: selectedRole === 'Sinh viên' ? {
        dob: formData.dob,
        major: formData.major,
        specialization: formData.specialization,
        faculty: formData.faculty,
        trainingType: formData.trainingType,
        universitySystem: formData.universitySystem,
        classGroup: formData.classGroup,
        classSection: formData.classSection,
      } : undefined
    };
  
    setAccounts([...accounts, newAccount]);
    setShowCreateModal(false);
  };
  
  // Back to role selection
  const handleBackToRoleSelect = () => {
    setModalStep('select-role');
  };

  // Add these handlers for the dropdown menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, accountId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccountId(accountId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAccountId(null);
  };

  const handleViewAccount = () => {
    // Lấy thông tin tài khoản cần xem
    const accountToView = accounts.find(account => account.id === selectedAccountId);
    if (accountToView) {
      // Xác định role của tài khoản
      const role = accountToView.role as AccountRole;
      setViewRole(role);
      
      // Lấy thông tin chi tiết đã lưu (nếu có) hoặc dùng dữ liệu mẫu
      const studentDetails: StudentDetails = accountToView.studentDetails || {
        dob: '',
        major: '',
        specialization: '',
        faculty: '',
        trainingType: '',
        universitySystem: '',
        classGroup: '',
        classSection: ''
      };
      
      // Điền dữ liệu có sẵn vào form xem
      setViewAccountData({
        name: accountToView.name,
        dob: studentDetails.dob || (role === 'Admin' ? '15/06/1998' : '20/10/2004'),
        email: accountToView.email,
        phone: accountToView.phone,
        code: accountToView.code,
        password: '********',
        major: studentDetails.major || (role === 'Sinh viên' ? 'Khoa học máy tính' : ''),
        specialization: studentDetails.specialization || (role === 'Sinh viên' ? 'Khoa học máy tính' : ''),
        faculty: studentDetails.faculty || (role === 'Sinh viên' ? 'Công nghệ thông tin' : ''),
        trainingType: studentDetails.trainingType || (role === 'Sinh viên' ? 'Chính quy - CĐIO' : ''),
        universitySystem: studentDetails.universitySystem || (role === 'Sinh viên' ? 'Đại học - B7' : ''),
        classGroup: studentDetails.classGroup || (role === 'Sinh viên' ? '67' : ''),
        classSection: studentDetails.classSection || (role === 'Sinh viên' ? 'CS2' : '')
      });
      setShowViewModal(true);
    }
    handleMenuClose();
  };

  // Add this function to close view modal
  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  // Define editFormData state
  const [editFormData, setEditFormData] = useState({
    name: '',
    dob: '',
    email: '',
    phone: '',
    code: '',
    password: '',
    major: '',
    specialization: '',
    faculty: '',
    trainingType: '',
    universitySystem: '',
    classGroup: '',
    classSection: ''
  });

  // Thêm state để lưu trữ dữ liệu gốc khi mở form chỉnh sửa
  const [originalEditData, setOriginalEditData] = useState({
    name: '',
    dob: '',
    email: '',
    phone: '',
    code: '',
    password: '',
    major: '',
    specialization: '',
    faculty: '',
    trainingType: '',
    universitySystem: '',
    classGroup: '',
    classSection: ''
  });

  // Sửa lại hàm handleEditAccount để lưu dữ liệu gốc
  const handleEditAccount = () => {
    const accountToEdit = accounts.find(account => account.id === selectedAccountId);
    if (accountToEdit) {
      setEditingAccountId(selectedAccountId);
  
      const role = accountToEdit.role as AccountRole;
      setEditRole(role);
  
      // Define the empty fallback object with the correct type
      const studentDetails: StudentDetails = accountToEdit.studentDetails || {
        dob: '',
        major: '',
        specialization: '',
        faculty: '',
        trainingType: '',
        universitySystem: '',
        classGroup: '',
        classSection: ''
      };
      
      // Trích xuất khóa từ mã số hoặc lớp (nếu có)
      let batch = '67'; // Mặc định
      if (accountToEdit.code.match(/\d{2}$/)) {
        batch = accountToEdit.code.slice(-2);
      } else if (studentDetails.classGroup?.match(/\d{2}/)) {
        batch = studentDetails.classGroup.match(/\d{2}/)![0];
      }
      
      setEditSelectedBatch(batch);
  
      // Set edit form data
      const newEditFormData = {
        name: accountToEdit.name,
        dob: studentDetails.dob || (role === 'Admin' ? '15/06/1998' : '20/10/2004'),
        email: accountToEdit.email,
        phone: accountToEdit.phone,
        code: accountToEdit.code,
        password: accountToEdit.password || '', 
        major: studentDetails.major || (role === 'Sinh viên' ? 'Khoa học máy tính' : ''),
        specialization: studentDetails.specialization || (role === 'Sinh viên' ? 'Khoa học máy tính' : ''),
        faculty: studentDetails.faculty || (role === 'Sinh viên' ? 'Công nghệ thông tin' : ''),
        trainingType: studentDetails.trainingType || (role === 'Sinh viên' ? 'Chính quy - CĐIO' : ''),
        universitySystem: studentDetails.universitySystem || (role === 'Sinh viên' ? 'Đại học - B7' : ''),
        classGroup: studentDetails.classGroup || (role === 'Sinh viên' ? 'Khóa 67' : ''),
        classSection: studentDetails.classSection || (role === 'Sinh viên' ? 'CS2' : '')
      };
  
      setEditFormData(newEditFormData);
      // Lưu trữ dữ liệu gốc để so sánh sau này
      setOriginalEditData({...newEditFormData});
  
      setShowEditModal(true);
    }
    handleMenuClose();
  };

  // Sửa lại button xác nhận trong modal chỉnh sửa
  // Thay thế button xác nhận hiện tại bằng:
  <button 
    className="confirm-btn" 
    onClick={() => {
      // Kiểm tra xem có sự thay đổi không
      const hasChanges = JSON.stringify(editFormData) !== JSON.stringify(originalEditData);
      
      if (hasChanges) {
        // Nếu có thay đổi, hiện modal xác nhận
        setShowEditConfirm(true);
      } else {
        // Nếu không có thay đổi, xác nhận luôn
        handleSaveEdit();
      }
    }}
    disabled={!validateForm(editFormData, editRole)}
  >
    Xác nhận
  </button>

  // Sửa lại hàm handleDeleteAccount
  const handleDeleteAccount = () => {
    // Lưu ID tài khoản vào state riêng trước khi đóng menu
    setAccountIdToDelete(selectedAccountId);
    setShowDeleteConfirm(true);
    handleMenuClose();
  };

  // Thêm hàm xử lý khi xác nhận xóa
  const confirmDelete = () => {
    if (accountIdToDelete) {
      // Lọc ra tài khoản cần xóa
      const updatedAccounts = accounts
        .filter(account => account.id !== accountIdToDelete)
        // Cập nhật lại ID cho tất cả các tài khoản còn lại
        .map((account, index) => ({
          ...account,
          id: index + 1 // ID mới bắt đầu từ 1
        }));
      
      // Cập nhật state với mảng tài khoản đã xóa và đánh số lại
      setAccounts(updatedAccounts);
    }
    
    // Reset state và đóng modal
    setShowDeleteConfirm(false);
    setAccountIdToDelete(null);
  };

  // Sửa lại hàm cancelDelete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setAccountIdToDelete(null);
  };

  // Hàm xử lý khi thay đổi input trong form chỉnh sửa
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modify the handleSaveEdit function to use editingAccountId
  const handleSaveEdit = () => {

    setAccounts(accounts.map(account =>
      account.id === editingAccountId
        ? {
            ...account,
            name: editFormData.name,
            phone: editFormData.phone,
            email: editFormData.email,
            code: editFormData.code,
            password: editFormData.password || account.password || '', // Lưu mật khẩu mới (nếu có)
            studentDetails: {
              dob: editFormData.dob,
              major: editFormData.major,
              specialization: editFormData.specialization,
              faculty: editFormData.faculty,
              trainingType: editFormData.trainingType,
              universitySystem: editFormData.universitySystem,
              classGroup: editFormData.classGroup,
              classSection: editFormData.classSection,
            }
          }
        : account
    ));

    setShowEditModal(false);
    setEditingAccountId(null);
  };

  // Hàm đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Thêm hàm xử lý khi khóa thay đổi
  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const batchValue = e.target.value;
    setSelectedBatch(batchValue);
    
    // Cập nhật mã số: thêm 2 số cuối từ khóa
    const currentCode = formData.code.replace(/\d{2}$/, '');
    setFormData(prev => ({
      ...prev,
      code: currentCode + batchValue,
      classGroup: batchValue // Chỉ lưu số khóa, không lưu "Khóa XX"
    }));
  };

  // Hàm xử lý khi khóa thay đổi trong modal chỉnh sửa
  const handleEditBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const batchValue = e.target.value;
    setEditSelectedBatch(batchValue);
    
    // Cập nhật mã số: thêm 2 số cuối từ khóa
    const currentCode = editFormData.code.replace(/\d{2}$/, '');
    setEditFormData(prev => ({
      ...prev,
      code: currentCode + batchValue,
      classGroup: batchValue // Bỏ "Khóa " và chỉ lưu số khóa
    }));
  };

  // Thêm state để điều khiển modal xác nhận tạo tài khoản
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);

  // Thêm state để điều khiển modal xác nhận chỉnh sửa tài khoản
  const [showEditConfirm, setShowEditConfirm] = useState(false);

  // Filtering accounts
  let displayedAccounts = accounts.filter(account => {
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      switch(searchFilter) {
        case 'name':
          if (!account.name.toLowerCase().includes(term)) return false;
          break;
        case 'code':
          if (!account.code.toLowerCase().includes(term)) return false;
          break;
        case 'phone':
          if (!account.phone.toLowerCase().includes(term)) return false;
          break;
      }
    }
    
    // Apply role filter
    if (roleFilter === 'student' && account.role !== 'Sinh viên') return false;
    if (roleFilter === 'admin' && account.role !== 'Admin') return false;
    
    return true;
  });
  
  // Apply sorting if needed
  if (sortDirection !== 'none') {
    displayedAccounts = [...displayedAccounts].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      if (sortDirection === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }
  
  // Render different forms based on selected role
  const renderAccountForm = () => {
    if (selectedRole === 'Admin') {
      return (
        <div className="account-form">
          <div className="form-row">
            <label htmlFor="name">Họ và tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="dob">Ngày sinh</label>
            <input
              type="text"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              placeholder="DD/MM/YYYY"
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="phone">Điện thoại</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="code">Mã số</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
        </div>
      );
    } else {
      // Student form with balanced two-column layout
      return (
        <div className="account-form student-form two-columns">
          <div className="form-col">
            <div className="form-row">
              <label htmlFor="name">Họ và tên</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="dob">Ngày sinh</label>
              <input
                type="text"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div className="form-row">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row group-row">
              <label htmlFor="code">Mã số</label>
              <div className="input-with-dropdown">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code.replace(/\d{2}$/, '')}
                  onChange={(e) => {
                    const baseCode = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      code: baseCode + selectedBatch
                    }));
                  }}
                  placeholder="Nhập mã số"
                  className="code-input"
                />
                <select 
                  value={selectedBatch} 
                  onChange={handleBatchChange}
                  className="batch-dropdown"
                >
                  {[64, 65, 66, 67, 68, 69].map(batch => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-col">
            <div className="form-row">
              <label htmlFor="major">Ngành</label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="specialization">Chuyên ngành</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="faculty">Khoa</label>
              <input
                type="text"
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="trainingType">Loại hình đào tạo</label>
              <input
                type="text"
                id="trainingType"
                name="trainingType"
                value={formData.trainingType}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="universitySystem">Hệ đại học</label>
              <input
                type="text"
                id="universitySystem"
                name="universitySystem"
                value={formData.universitySystem}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="classSection">Lớp</label>
              <input
                type="text"
                id="classSection"
                name="classSection"
                value={formData.classSection}
                onChange={(e) => {
                  const classValue = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    classSection: classValue
                  }));
                }}
              />
            </div>
          </div>
        </div>
      );
    }
  };
  
  return (
    <motion.div
      className="account-management"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Search and filter section */}
      <div className="top-actions">
        <div className="search-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder={`Tìm kiếm theo ${
                searchFilter === 'name' ? 'họ tên' : 
                searchFilter === 'code' ? 'mã số' : 'số điện thoại'
              }`} 
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          
          <div className="filter-bar">
            <div className="search-filter">
              <span className="filter-label">Tìm theo:</span>
              <div className="filter-options">
                <button 
                  className={`filter-option ${searchFilter === 'name' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('name')}
                >
                  Họ tên
                </button>
                <button 
                  className={`filter-option ${searchFilter === 'code' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('code')}
                >
                  Mã số
                </button>
                <button 
                  className={`filter-option ${searchFilter === 'phone' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('phone')}
                >
                  Số điện thoại
                </button>
              </div>
            </div>
            
            <div className="advanced-filters">
              <div className="sort-filter">
                <button 
                  className={`sort-button ${sortDirection !== 'none' ? 'active' : ''}`}
                  onClick={toggleSort}
                  title="Sắp xếp theo tên"
                >
                  {sortDirection === 'asc' ? <FaSortAlphaDown /> : 
                   sortDirection === 'desc' ? <FaSortAlphaUp /> : 
                   <FaSortAlphaDown />} 
                  <span>A-Z</span>
                </button>
              </div>
              
              <div className="role-filter">
                <span className="filter-label">Vai trò:</span>
                <div className="filter-options">
                  <button 
                    className={`filter-option ${roleFilter === 'all' ? 'active' : ''}`}
                    onClick={() => handleRoleFilter('all')}
                  >
                    Tất cả
                  </button>
                  <button 
                    className={`filter-option ${roleFilter === 'student' ? 'active' : ''}`}
                    onClick={() => handleRoleFilter('student')}
                  >
                    Sinh viên
                  </button>
                  <button 
                    className={`filter-option ${roleFilter === 'admin' ? 'active' : ''}`}
                    onClick={() => handleRoleFilter('admin')}
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button className="add-account-btn" onClick={openCreateModal}>
          <span className="add-icon">+</span> Thêm tài khoản
        </button>
      </div>
      
      <h2 className="section-title">Danh sách tài khoản</h2>
      
      <div className="accounts-table-container">
        <table className="accounts-table">
          <thead>
            <tr>
              <th className="id-col">ID</th>
              <th className="name-col">Họ và tên</th>
              <th className="phone-col">Số điện thoại</th>
              <th className="email-col">Email</th>
              <th className="code-col">Mã số</th>
              <th className="role-col">Quyền</th>
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {displayedAccounts.map((account) => (
              <tr key={account.id}>
                <td>{account.id}</td>
                <td>{account.name}</td>
                <td>{account.phone}</td>
                <td>{account.email}</td>
                <td>{account.code}</td>
                <td className={account.role === 'Admin' ? 'admin-role' : 'student-role'}>
                  {account.role}
                </td>
                <td>
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleMenuOpen(e, account.id)}
                    aria-label="actions"
                  >
                    <FaEllipsisH />
                  </IconButton>
                </td>
              </tr>
            ))}
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-results">Không có dữ liệu</td>
              </tr>
            ) : displayedAccounts.length === 0 && (
              <tr>
                <td colSpan={7} className="no-results">Không tìm thấy kết quả phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleViewAccount}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem thông tin</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditAccount}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa thông tin</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteAccount} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Xóa thông tin</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Create Account Modal with steps */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="create-account-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <AnimatePresence mode="wait">
                {modalStep === 'select-role' && (
                  <motion.div
                    key="select-role"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="modal-title">Tạo thông tin tài khoản</h2>
                    <div className="account-type-selection">
                      <div 
                        className={`account-type-option ${selectedRole === 'Admin' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelect('Admin')}
                      >
                        <div className="account-type-icon admin-icon">
                          <FaUserCog />
                        </div>
                        <span className="account-type-label">Admin</span>
                      </div>
                      <div 
                        className={`account-type-option ${selectedRole === 'Sinh viên' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelect('Sinh viên')}
                      >
                        <div className="account-type-icon student-icon">
                          <FaGraduationCap />
                        </div>
                        <span className="account-type-label">Sinh viên</span>
                      </div>
                    </div>
                    <div className="modal-actions">
                      <button className="cancel-btn" onClick={handleCloseModal}>
                        Hủy
                      </button>
                    </div>
                  </motion.div>
                )}
                {modalStep === 'enter-details' && (
                  <motion.div
                    key="enter-details"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="modal-title">
                      {selectedRole === 'Admin' ? 'Tạo thông tin tài khoản' : 'Chỉnh sửa thông tin tài khoản'}
                    </h2>
                    {renderAccountForm()}
                    <div className="modal-actions">
                      <button 
                        className="confirm-btn" 
                        onClick={() => setShowCreateConfirm(true)}
                        disabled={!validateForm(formData, selectedRole)}
                      >
                        Xác nhận
                      </button>
                      <button className="cancel-btn" onClick={handleCloseModal}>
                        Hủy
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="confirmation-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="confirm-title">Bạn có xác nhận muốn xóa thông tin không?</h2>
              
              <div className="confirm-actions">
                <button className="confirm-btn" onClick={confirmDelete}>
                  Có
                </button>
                <button className="cancel-btn" onClick={cancelDelete}>
                  Không
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Account Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="create-account-modal"  // Có thể sử dụng lại style của create modal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="modal-title">Chỉnh sửa thông tin tài khoản</h2>
              
              {/* Render form tương tự như khi tạo tài khoản, nhưng với dữ liệu từ editFormData */}
              {editRole === 'Admin' ? (
                <div className="account-form">
                  <div className="form-row">
                    <label htmlFor="edit-name">Họ và tên</label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <label htmlFor="edit-dob">Ngày sinh</label>
                    <input
                      type="text"
                      id="edit-dob"
                      name="dob"
                      value={editFormData.dob}
                      onChange={handleEditInputChange}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  
                  <div className="form-row">
                    <label htmlFor="edit-email">Email</label>
                    <input
                      type="email"
                      id="edit-email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <label htmlFor="edit-phone">Điện thoại</label>
                    <input
                      type="text"
                      id="edit-phone"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <label htmlFor="edit-code">Mã số</label>
                    <input
                      type="text"
                      id="edit-code"
                      name="code"
                      value={editFormData.code}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <label htmlFor="edit-password">Mật khẩu</label>
                    <input
                      type="password"
                      id="edit-password"
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="account-form student-form two-columns">
                  <div className="form-col">
                    <div className="form-row">
                      <label htmlFor="edit-name">Họ và tên</label>
                      <input
                        type="text"
                        id="edit-name"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-row">
                      <label htmlFor="edit-dob">Ngày sinh</label>
                      <input
                        type="text"
                        id="edit-dob"
                        name="dob"
                        value={editFormData.dob}
                        onChange={handleEditInputChange}
                        placeholder="DD/MM/YYYY"
                      />
                    </div>
                    <div className="form-row">
                      <label htmlFor="edit-phone">Số điện thoại</label>
                      <input
                        type="text"
                        id="edit-phone"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-row">
                      <label htmlFor="edit-email">Email</label>
                      <input
                        type="email"
                        id="edit-email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-row group-row">
                      <label htmlFor="edit-code">Mã số</label>
                      <div className="input-with-dropdown">
                        <input
                          type="text"
                          id="edit-code"
                          name="code"
                          value={editFormData.code.replace(/\d{2}$/, '')}
                          onChange={(e) => {
                            const baseCode = e.target.value;
                            setEditFormData(prev => ({
                              ...prev,
                              code: baseCode + editSelectedBatch
                            }));
                          }}
                          className="code-input"
                        />
                        <select 
                          value={editSelectedBatch} 
                          onChange={handleEditBatchChange}
                          className="batch-dropdown"
                        >
                          {[64, 65, 66, 67, 68, 69].map(batch => (
                            <option key={batch} value={batch}>{batch}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <label htmlFor="edit-password">Mật khẩu</label>
                      <input
                        type="password"
                        id="edit-password"
                        name="password"
                        value={editFormData.password}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-col">
                    <div className="form-row">
                      <label htmlFor="edit-major">Ngành</label>
                      <input
                        type="text"
                        id="edit-major"
                        name="major"
                        value={editFormData.major}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-row">
                      <label htmlFor="edit-specialization">Chuyên ngành</label>
                      <input
                        type="text"
                        id="edit-specialization"
                        name="specialization"
                        value={editFormData.specialization}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-row">
                      <label htmlFor="edit-faculty">Khoa</label>
                      <input
                        type="text"
                        id="edit-faculty"
                        name="faculty"
                        value={editFormData.faculty}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-row">
                      <label htmlFor="edit-trainingType">Loại hình đào tạo</label>
                      <input
                        type="text"
                        id="edit-trainingType"
                        name="trainingType"
                        value={editFormData.trainingType}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-row">
                      <label htmlFor="edit-universitySystem">Hệ đại học</label>
                      <input
                        type="text"
                        id="edit-universitySystem"
                        name="universitySystem"
                        value={editFormData.universitySystem}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-row">
                      <label htmlFor="edit-classSection">Lớp</label>
                      <input
                        type="text"
                        id="edit-classSection"
                        name="classSection"
                        value={editFormData.classSection}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  className="confirm-btn" 
                  onClick={() => {
                    // Kiểm tra xem có sự thay đổi không
                    const hasChanges = JSON.stringify(editFormData) !== JSON.stringify(originalEditData);
                    
                    if (hasChanges) {
                      // Nếu có thay đổi, hiện modal xác nhận
                      setShowEditConfirm(true);
                    } else {
                      // Nếu không có thay đổi, xác nhận luôn
                      handleSaveEdit();
                    }
                  }}
                  disabled={!validateForm(editFormData, editRole)}
                >
                  Xác nhận
                </button>
                <button className="cancel-btn" onClick={handleCloseEditModal}>
                  Hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Account Modal */}
      <AnimatePresence>
        {showViewModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="create-account-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="modal-title">Thông tin tài khoản</h2>
              
              {/* Hiển thị thông tin dựa trên role */}
              {viewRole === 'Admin' ? (
                <div className="account-form view-form single-col">
                  <div className="form-row">
                    <label>Họ tên:</label>
                    <div className="view-value">{viewAccountData.name}</div>
                  </div>
                  
                  <div className="form-row">
                    <label>Ngày sinh:</label>
                    <div className="view-value">{viewAccountData.dob}</div>
                  </div>
                  
                  <div className="form-row">
                    <label>Email:</label>
                    <div className="view-value">{viewAccountData.email}</div>
                  </div>
                  
                  <div className="form-row">
                    <label>Điện thoại:</label>
                    <div className="view-value">{viewAccountData.phone}</div>
                  </div>
                  
                  <div className="form-row">
                    <label>Mã số:</label>
                    <div className="view-value">{viewAccountData.code}</div>
                  </div>
                </div>
              ) : (
                <div className="account-form view-form two-cols-centered">
                  <div className="view-cols">
                    <div className="view-col">
                      <div className="form-row">
                        <label>Họ tên:</label>
                        <div className="view-value">{viewAccountData.name}</div>
                      </div>
                      <div className="form-row">
                        <label>Ngày sinh:</label>
                        <div className="view-value">{viewAccountData.dob}</div>
                      </div>
                      <div className="form-row">
                        <label>Số điện thoại:</label>
                        <div className="view-value">{viewAccountData.phone}</div>
                      </div>
                      <div className="form-row">
                        <label>Email:</label>
                        <div className="view-value">{viewAccountData.email}</div>
                      </div>
                      <div className="form-row">
                        <label>Mã số:</label>
                        <div className="view-value">{viewAccountData.code}</div>
                      </div>
                    </div>
                    <div className="view-col">
                      <div className="form-row">
                        <label>Ngành:</label>
                        <div className="view-value">{viewAccountData.major}</div>
                      </div>
                      <div className="form-row">
                        <label>Chuyên ngành:</label>
                        <div className="view-value">{viewAccountData.specialization}</div>
                      </div>
                      <div className="form-row">
                        <label>Khoa:</label>
                        <div className="view-value">{viewAccountData.faculty}</div>
                      </div>
                      <div className="form-row">
                        <label>Loại hình đào tạo:</label>
                        <div className="view-value">{viewAccountData.trainingType}</div>
                      </div>
                      <div className="form-row">
                        <label>Hệ đại học:</label>
                        <div className="view-value">{viewAccountData.universitySystem}</div>
                      </div>
                      <div className="form-row">
                        <label>Lớp:</label>
                        <div className="view-value">{viewAccountData.classGroup}{viewAccountData.classSection}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="modal-actions">
                <button className="cancel-btn" onClick={handleCloseViewModal}>
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thêm modal xác nhận tạo tài khoản ngay dưới modal tạo tài khoản */}
      <AnimatePresence>
        {showCreateConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="confirmation-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="confirm-title">Bạn có xác nhận muốn tạo tài khoản không?</h2>
              <div className="confirm-actions">
                <button
                  className="confirm-btn"
                  onClick={() => {
                    handleCreateAccount();
                    setShowCreateConfirm(false);
                  }}
                >
                  Có
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowCreateConfirm(false)}
                >
                  Không
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thêm modal xác nhận chỉnh sửa tài khoản trước thẻ đóng của component */}
      <AnimatePresence>
        {showEditConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="confirmation-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="confirm-title">Bạn có xác nhận muốn thay đổi thông tin không?</h2>
              <div className="confirm-actions">
                <button
                  className="confirm-btn"
                  onClick={() => {
                    handleSaveEdit();
                    setShowEditConfirm(false);
                  }}
                >
                  Có
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowEditConfirm(false)}
                >
                  Không
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuanLyTaiKhoan;