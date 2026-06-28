import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './QuanLyGiangVien.css';
import { FaSearch, FaEllipsisH, FaUserPlus, FaSortAlphaDown, FaSortAlphaUp, FaFilter, FaTimes } from 'react-icons/fa';
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
import Select from 'react-select';

// Sample data based on the images
const initialLecturers = [
  { 
    id: 1, 
    code: '00139', 
    name: 'Nguyễn Đình Anh', 
    department: 'Công nghệ thông tin',
    degree: 'Thạc sĩ',
    email: 'anhnd2@huce.edu.vn',
    phone: '0912345678',
    dob: '15/05/1980'
  },
  { 
    id: 2, 
    code: '00988', 
    name: 'Dương Văn Toàn', 
    department: 'Lý luận chính trị',
    degree: 'Tiến sĩ',
    email: 'toandv@huce.edu.vn',
    phone: '0923456789',
    dob: '22/11/1975'
  },
  { 
    id: 3, 
    code: '00121', 
    name: 'Mai Thị Huệ', 
    department: 'Cơ khí',
    degree: 'Thạc sĩ',
    email: 'huemt@huce.edu.vn',
    phone: '0934567890',
    dob: '08/03/1982'
  },
  { 
    id: 4, 
    code: '00154', 
    name: 'Lê Đức Quang', 
    department: 'Công nghệ thông tin',
    degree: 'Thạc sĩ',
    email: 'quangld@huce.edu.vn',
    phone: '0945678901',
    dob: '17/09/1981'
  },
  { 
    id: 5, 
    code: '00479', 
    name: 'Đặng Hoàng Mai', 
    department: 'Kinh tế & Quản lý Xây dựng',
    degree: 'Tiến sĩ',
    email: 'maidh@huce.edu.vn',
    phone: '0956789012',
    dob: '29/12/1973'
  },
  { 
    id: 6, 
    code: '01001', 
    name: 'Lê Văn Minh', 
    department: 'Công nghệ thông tin',
    degree: 'Kỹ sư',
    email: 'minhlv2@huce.edu.vn',
    phone: '0967890123',
    dob: '14/06/1985'
  },
  { 
    id: 7, 
    code: 'TG000113', 
    name: 'Trần Thị Hoàng Anh', 
    department: 'Bộ môn Ngoại ngữ',
    degree: 'Thạc sĩ',
    email: 'anhtth@huce.edu.vn',
    phone: '0978901234',
    dob: '03/04/1979'
  },
  { 
    id: 8, 
    code: '00195', 
    name: 'Nguyễn Đức Thịnh', 
    department: 'Công nghệ thông tin',
    degree: 'Thạc sĩ',
    email: 'thinhnd@huce.edu.vn',
    phone: '0989012345',
    dob: '21/07/1983'
  },
];

// Define types
type SearchFilter = 'name' | 'code' | 'phone';
type DegreeFilter = 'all' | 'bachelor' | 'master' | 'doctor';
type SortDirection = 'asc' | 'desc' | 'none';

// Interface for lecturer
interface Lecturer {
  id: number;
  code: string;
  name: string;
  department: string;
  degree: string;
  email: string;
  phone: string;
  dob: string;
}

// Interface for dropdown options
interface DropdownOption {
  value: string;
  label: string;
}

const QuanLyGiangVien: React.FC = () => {
  // State variables
  const [lecturers, setLecturers] = useState<Lecturer[]>(initialLecturers);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState<SearchFilter>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const [degreeFilter, setDegreeFilter] = useState<DegreeFilter>('all');
  const [degreeFilterOpen, setDegreeFilterOpen] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  
  // Selected items states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLecturerId, setSelectedLecturerId] = useState<number | null>(null);
  const [lecturerIdToDelete, setLecturerIdToDelete] = useState<number | null>(null);
  const [editingLecturerId, setEditingLecturerId] = useState<number | null>(null);
  
  // Form data states
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    degree: '',  // Changed from 'Thạc sĩ' to empty string
    email: '',
    phone: '',
    dob: ''
  });
  
  const [editFormData, setEditFormData] = useState({
    name: '',
    code: '',
    department: '',
    degree: '',
    email: '',
    phone: '',
    dob: ''
  });
  
  const [originalEditData, setOriginalEditData] = useState({
    name: '',
    code: '',
    department: '',
    degree: '',
    email: '',
    phone: '',
    dob: ''
  });
  
  const [viewLecturerData, setViewLecturerData] = useState({
    name: '',
    code: '',
    department: '',
    degree: '',
    email: '',
    phone: '',
    dob: ''
  });

  // Form validation
  const validateForm = (data: any) => {
    // Name validation - cannot be empty
    if (!data.name.trim()) return false;
    
    // Code validation - cannot be empty
    if (!data.code.trim()) return false;
    
    // Email validation - must be valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) return false;
    
    return true;
  };

  // Search and filter handlers
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
  
  // Add this function to extract unique degrees from lecturers
  const getUniqueDegrees = (lecturers: Lecturer[]): string[] => {
    const degrees = lecturers.map(lecturer => lecturer.degree);
    return Array.from(new Set(degrees)).filter(degree => degree); // Filter out empty strings
  };

  // Replace the fixed degreeOptions with a state that updates dynamically
  const [degreeOptions, setDegreeOptions] = useState<DropdownOption[]>(() => {
    // Initialize with "all" option and options from existing data
    const uniqueDegrees = getUniqueDegrees(initialLecturers);
    
    return [
      { value: 'all', label: 'Tất cả' },
      ...uniqueDegrees.map(degree => ({
        value: degree.toLowerCase().replace(/\s+/g, '-'), // Create a value key
        label: degree
      }))
    ];
  });

  const handleDegreeDropdownChange = (option: DropdownOption | null) => {
    setDegreeFilter(option?.value as DegreeFilter || 'all');
  };
  
  // Modal handlers
  const openCreateModal = () => {
    // Reset form data
    setFormData({
      name: '',
      code: '',
      department: '',
      degree: '',  // Changed from 'Thạc sĩ' to empty string
      email: '',
      phone: '',
      dob: ''
    });
    setShowCreateModal(true);
  };
  
  const handleCloseModal = () => {
    setShowCreateModal(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Update handleCreateLecturer to add new degree to options if it doesn't exist
  const handleCreateLecturer = () => {
    // Create new lecturer with full information
    const newLecturer: Lecturer = {
      id: lecturers.length + 1,
      name: formData.name,
      code: formData.code,
      department: formData.department,
      degree: formData.degree,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob
    };

    setLecturers([...lecturers, newLecturer]);
    
    // Add new degree to options if it doesn't exist
    if (formData.degree && !degreeOptions.some(option => option.label === formData.degree)) {
      const newOption = {
        value: formData.degree.toLowerCase().replace(/\s+/g, '-'),
        label: formData.degree
      };
      setDegreeOptions([...degreeOptions, newOption]);
    }
    
    setShowCreateModal(false);
    setShowCreateConfirm(false);
  };

  // Action menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, lecturerId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedLecturerId(lecturerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLecturerId(null);
  };

  const handleViewLecturer = () => {
    // Get lecturer to view
    const lecturerToView = lecturers.find(lecturer => lecturer.id === selectedLecturerId);
    if (lecturerToView) {
      // Set view data
      setViewLecturerData({
        name: lecturerToView.name,
        code: lecturerToView.code,
        department: lecturerToView.department,
        degree: lecturerToView.degree,
        email: lecturerToView.email,
        phone: lecturerToView.phone,
        dob: lecturerToView.dob
      });
      setShowViewModal(true);
    }
    handleMenuClose();
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  const handleEditLecturer = () => {
    const lecturerToEdit = lecturers.find(lecturer => lecturer.id === selectedLecturerId);
    if (lecturerToEdit) {
      setEditingLecturerId(selectedLecturerId);
      
      // Set edit form data
      const newEditFormData = {
        name: lecturerToEdit.name,
        code: lecturerToEdit.code,
        department: lecturerToEdit.department,
        degree: lecturerToEdit.degree,
        email: lecturerToEdit.email,
        phone: lecturerToEdit.phone,
        dob: lecturerToEdit.dob
      };
  
      setEditFormData(newEditFormData);
      // Store original data for comparison
      setOriginalEditData({...newEditFormData});
  
      setShowEditModal(true);
    }
    handleMenuClose();
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update handleSaveEdit to add new degree to options if it doesn't exist
  const handleSaveEdit = () => {
    setLecturers(lecturers.map(lecturer =>
      lecturer.id === editingLecturerId
        ? {
            ...lecturer,
            name: editFormData.name,
            code: editFormData.code,
            department: editFormData.department,
            degree: editFormData.degree,
            email: editFormData.email,
            phone: editFormData.phone,
            dob: editFormData.dob
          }
        : lecturer
    ));

    // Add new degree to options if it doesn't exist
    if (editFormData.degree && !degreeOptions.some(option => option.label === editFormData.degree)) {
      const newOption = {
        value: editFormData.degree.toLowerCase().replace(/\s+/g, '-'),
        label: editFormData.degree
      };
      setDegreeOptions([...degreeOptions, newOption]);
    }

    setShowEditModal(false);
    setShowEditConfirm(false);
    setEditingLecturerId(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleDeleteLecturer = () => {
    // Save lecturer ID before closing the menu
    setLecturerIdToDelete(selectedLecturerId);
    setShowDeleteConfirm(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (lecturerIdToDelete) {
      // Filter out the lecturer to delete
      const updatedLecturers = lecturers
        .filter(lecturer => lecturer.id !== lecturerIdToDelete)
        // Update IDs for remaining lecturers
        .map((lecturer, index) => ({
          ...lecturer,
          id: index + 1
        }));
      
      // Update state
      setLecturers(updatedLecturers);
    }
    
    setShowDeleteConfirm(false);
    setLecturerIdToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setLecturerIdToDelete(null);
  };

  // Filtering lecturers
  let displayedLecturers = lecturers.filter(lecturer => {
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      switch(searchFilter) {
        case 'name':
          if (!lecturer.name.toLowerCase().includes(term)) return false;
          break;
        case 'code':
          if (!lecturer.code.toLowerCase().includes(term)) return false;
          break;
        case 'phone':
          if (!lecturer.phone.toLowerCase().includes(term)) return false;
          break;
      }
    }
    
    // Apply degree filter
    if (degreeFilter !== 'all') {
      // Find the selected option to get its label
      const selectedOption = degreeOptions.find(option => option.value === degreeFilter);
      if (selectedOption && lecturer.degree !== selectedOption.label) {
        return false;
      }
    }
    
    return true;
  });
  
  // Apply sorting if needed
  if (sortDirection !== 'none') {
    displayedLecturers = [...displayedLecturers].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      if (sortDirection === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }
  
  return (
    <motion.div
      className="lecturer-management"
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
                searchFilter === 'code' ? 'mã giảng viên' : 'số điện thoại'
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
                  Mã giảng viên
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
                <div className="dropdown-container">
                  <Select
                    className="degree-dropdown"
                    options={degreeOptions}
                    placeholder="Học vấn"
                    value={degreeOptions.find(option => option.value === degreeFilter)}
                    onChange={handleDegreeDropdownChange}
                    isClearable={false}
                    isSearchable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button className="add-lecturer-btn" onClick={openCreateModal}>
          <span className="add-icon">+</span> Thêm thông tin giảng viên
        </button>
      </div>
      
      <h2 className="section-title">Danh sách giảng viên</h2>
      
      <div className="lecturers-table-container">
        <table className="lecturers-table">
          <thead>
            <tr>
              <th className="id-col">STT</th>
              <th className="code-col">Mã giảng viên</th>
              <th className="name-col">Họ và tên</th>
              <th className="department-col">Khoa</th>
              <th className="degree-col">Học vấn</th>
              <th className="email-col">Email</th>
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {displayedLecturers.map((lecturer) => (
              <tr key={lecturer.id}>
                <td>{lecturer.id}</td>
                <td>{lecturer.code}</td>
                <td>{lecturer.name}</td>
                <td>{lecturer.department}</td>
                <td>{lecturer.degree}</td>
                <td>{lecturer.email}</td>
                <td>
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleMenuOpen(e, lecturer.id)}
                    aria-label="actions"
                  >
                    <FaEllipsisH />
                  </IconButton>
                </td>
              </tr>
            ))}
            {lecturers.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-results">Không có dữ liệu</td>
              </tr>
            ) : displayedLecturers.length === 0 && (
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
        <MenuItem onClick={handleViewLecturer}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem thông tin</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditLecturer}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa thông tin</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteLecturer} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Xóa thông tin</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Create Lecturer Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="create-lecturer-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="modal-title">Tạo thông tin giảng viên</h2>
              
              <div className="lecturer-form">
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
                  <label htmlFor="department">Khoa</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
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
                  <label htmlFor="degree">Học vấn</label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="confirm-btn" 
                  onClick={() => setShowCreateConfirm(true)}
                  disabled={!validateForm(formData)}
                >
                  Xác nhận
                </button>
                <button className="cancel-btn" onClick={handleCloseModal}>
                  Hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Confirmation Modal */}
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
              <h2 className="confirm-title">Bạn có xác nhận muốn tạo thông tin giảng viên không?</h2>
              <div className="confirm-actions">
                <button
                  className="confirm-btn"
                  onClick={() => {
                    handleCreateLecturer();
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

      {/* View Lecturer Modal */}
      <AnimatePresence>
        {showViewModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="view-lecturer-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="modal-title">Thông tin giảng viên</h2>
              
              <div className="lecturer-details">
                <div className="detail-row">
                  <label>Họ và tên:</label>
                  <div className="detail-value">{viewLecturerData.name}</div>
                </div>
                <div className="detail-row">
                  <label>Mã giảng viên:</label>
                  <div className="detail-value">{viewLecturerData.code}</div>
                </div>
                <div className="detail-row">
                  <label>Khoa:</label>
                  <div className="detail-value">{viewLecturerData.department}</div>
                </div>
                <div className="detail-row">
                  <label>Ngày sinh:</label>
                  <div className="detail-value">{viewLecturerData.dob}</div>
                </div>
                <div className="detail-row">
                  <label>Điện thoại:</label>
                  <div className="detail-value">{viewLecturerData.phone}</div>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <div className="detail-value">{viewLecturerData.email}</div>
                </div>
                <div className="detail-row">
                  <label>Học vấn:</label>
                  <div className="detail-value">{viewLecturerData.degree}</div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button className="cancel-btn" onClick={handleCloseViewModal}>
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Lecturer Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="edit-lecturer-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="modal-title">Chỉnh sửa thông tin giảng viên</h2>
              
              <div className="lecturer-form">
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
                  <label htmlFor="edit-department">Khoa</label>
                  <input
                    type="text"
                    id="edit-department"
                    name="department"
                    value={editFormData.department}
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
                  <label htmlFor="edit-degree">Học vấn</label>
                  <input
                    type="text"
                    id="edit-degree"
                    name="degree"
                    value={editFormData.degree}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="confirm-btn" 
                  onClick={() => {
                    // Check if there are changes
                    const hasChanges = JSON.stringify(editFormData) !== JSON.stringify(originalEditData);
                    
                    if (hasChanges) {
                      // If there are changes, show confirmation modal
                      setShowEditConfirm(true);
                    } else {
                      // If no changes, just save
                      handleSaveEdit();
                    }
                  }}
                  disabled={!validateForm(editFormData)}
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

      {/* Edit Confirmation Modal */}
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
    </motion.div>
  );
};

export default QuanLyGiangVien;