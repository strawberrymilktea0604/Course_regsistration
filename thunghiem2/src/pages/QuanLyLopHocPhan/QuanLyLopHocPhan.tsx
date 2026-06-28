import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { motion, AnimatePresence } from 'framer-motion';
// Import FaEllipsisH
import { FaSearch, FaSort, FaEdit, FaTrash, FaEye, FaPlus, FaExclamationTriangle, FaEllipsisH, FaQuestionCircle, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa'; // Added FaExclamationTriangle, FaEllipsisH, FaQuestionCircle
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import Select from 'react-select';
import './QuanLyLopHocPhan.css';
// Xóa dòng import này nếu ViewMajorModal không được dùng cho mục đích xem lớp học phần
// import ViewMajorModal from '../../components/ViewMajorModal';

// Types and interfaces
type SearchFilter = 'name' | 'courseCode' | 'sectionIdentifier' | 'sectionCode' | 'lecturer'; // Added options
type SortDirection = 'asc' | 'desc' | 'none';
type DepartmentFilter = 'all' | string;
type Day = 'Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6' | 'Thứ 7' | 'Chủ nhật';
type TimeSlot = 'T1 -> T3' | 'T4 -> T6' | 'T7 -> T9' | 'T10 -> T12' | 'T13 -> T15';

// Schedule interface
interface Schedule {
  id: number;
  day: Day;
  timeSlot: TimeSlot;
  room: string;
  building: string;
  campus: string;
  startDate: string;
  endDate: string;
}

// Course section interface
interface CourseSection {
  id: number;
  sectionIdentifier: string; // New: Represents "Mã lớp học phần" from image (e.g., 772911701)
  courseCode: string; // Represents "Mã môn học" (e.g., 7729117) - Links to Course
  courseName: string;
  sectionCode: string; // Represents "Lớp học phần" (e.g., 66CS1)
  department: string;
  lecturer: {
    id: number;
    code: string;
    name: string;
  };
  capacity: number;
  enrolled: number;
  schedules: Schedule[];
  notes?: string;
  semester: string;
  academicYear: string;
}

// Course interface
interface Course {
  id: number;
  code: string; // Represents "Mã môn học" (e.g., 7729117)
  name: string;
  department: string;
  credits: number;
}

// Lecturer interface
interface Lecturer {
  id: number;
  code: string;
  name: string;
  department: string;
  degree: string;
  email: string;
}

// Semester interface
interface Semester {
  id: number;
  code: string;        // e.g., HK1, HK2, HK3
  name: string;        // e.g., "Học kỳ 1"
  academicYear: string; // e.g., "2024-2025"
  startDate: string;   // e.g., "01/09/2024"
  endDate: string;     // e.g., "31/12/2024"
  registrationStartDate: string; // e.g., "15/08/2024"
  registrationEndDate: string;   // e.g., "25/08/2024"
  status: "upcoming" | "active" | "completed"; // Status of the semester
}

// Sample data for courses (Adjust codes to be "Mã môn học")
const coursesData: Course[] = [
  {
    id: 1,
    code: '7729117', // Adjusted code
    name: 'Đồ án phát triển hệ thống phía server nâng cao',
    department: 'Công nghệ thông tin',
    credits: 3
  },
  {
    id: 2,
    code: '608800', // Adjusted code
    name: 'Giới thiệu ngành Khoa học máy tính',
    department: 'Công nghệ thông tin',
    credits: 1
  },
  {
    id: 3,
    code: '7728112', // Adjusted code
    name: 'Học máy',
    department: 'Công nghệ thông tin',
    credits: 3
  },
  {
    id: 4,
    code: '608803', // Adjusted code
    name: 'Lập trình đánh cho kỹ thuật', // Assuming this is the name for 608803
    department: 'Công nghệ thông tin',
    credits: 3
  },
  {
    id: 5,
    code: '531815', // Adjusted code
    name: 'Lập trình hệ thống',
    department: 'Công nghệ thông tin',
    credits: 2
  },
  {
    id: 6,
    code: '608813', // Adjusted code
    name: 'Nhập môn dữ liệu lớn',
    department: 'Công nghệ thông tin',
    credits: 3
  },
  {
    id: 7,
    code: '538801', // Adjusted code
    name: 'Nhập môn lập trình',
    department: 'Công nghệ thông tin',
    credits: 3
  }
];

// Sample data for lecturers (Keep as is)
const lecturersData: Lecturer[] = [
  {
    id: 1,
    code: '00139',
    name: 'Nguyễn Đình Anh',
    department: 'Công nghệ thông tin',
    degree: 'Thạc sĩ',
    email: 'anhnd2@huce.edu.vn'
  },
  {
    id: 2,
    code: '00988',
    name: 'Dương Văn Toàn',
    department: 'Lý luận chính trị',
    degree: 'Tiến sĩ',
    email: 'toandv@huce.edu.vn'
  },
  {
    id: 3,
    code: '00121',
    name: 'Mai Thị Huệ',
    department: 'Cơ khí',
    degree: 'Thạc sĩ',
    email: 'huemt@huce.edu.vn'
  },
  {
    id: 4,
    code: '00154',
    name: 'Lê Đức Quang',
    department: 'Công nghệ thông tin',
    degree: 'Thạc sĩ',
    email: 'quangld@huce.edu.vn'
  },
  {
    id: 5,
    code: '00479',
    name: 'Đặng Hoàng Mai',
    department: 'Kinh tế & Quản lý Xây dựng',
    degree: 'Tiến sĩ',
    email: 'maidh@huce.edu.vn'
  },
  {
    id: 6,
    code: '01001',
    name: 'Lê Văn Minh',
    department: 'Công nghệ thông tin',
    degree: 'Kỹ sư',
    email: 'minhlv2@huce.edu.vn'
  }
];

// Sample data for course sections (Adjusted structure)
const initialSections: CourseSection[] = [
  {
    id: 1,
    sectionIdentifier: '772911701', // Mã lớp học phần
    courseCode: '7729117',         // Mã môn học (links to Course)
    courseName: 'Đồ án phát triển hệ thống phía server nâng cao',
    sectionCode: '66CS1',           // Lớp học phần
    department: 'Công nghệ thông tin',
    lecturer: { id: 6, code: '01001', name: 'Lê Văn Minh' },
    capacity: 40,
    enrolled: 35,
    schedules: [
      {
        id: 1,
        day: 'Thứ 2',
        timeSlot: 'T7 -> T9',
        room: '107',
        building: 'H1',
        campus: 'Cơ sở chính',
        startDate: '18/11/2024',
        endDate: '18/11/2024'
      },
      {
        id: 2,
        day: 'Thứ 2',
        timeSlot: 'T7 -> T9',
        room: '109',
        building: 'H1',
        campus: 'Cơ sở chính',
        startDate: '28/10/2024',
        endDate: '28/10/2024'
      },
      {
        id: 3,
        day: 'Thứ 2',
        timeSlot: 'T7 -> T9',
        room: '110',
        building: 'H1',
        campus: 'Cơ sở chính',
        startDate: '04/11/2024',
        endDate: '11/11/2024'
      }
    ],
    semester: 'HK1',
    academicYear: '2024-2025'
  },
  {
    id: 2,
    sectionIdentifier: '6088001', // Mã lớp học phần
    courseCode: '608800',       // Mã môn học
    courseName: 'Giới thiệu ngành Khoa học máy tính',
    sectionCode: '69CS1',         // Lớp học phần
    department: 'Công nghệ thông tin',
    lecturer: { id: 4, code: '00154', name: 'Lê Đức Quang' },
    capacity: 120,
    enrolled: 118,
    schedules: [
      {
        id: 1,
        day: 'Thứ 5',
        timeSlot: 'T1 -> T3',
        room: 'H1',
        building: 'H1',
        campus: 'Cơ sở chính',
        startDate: '24/10/2024',
        endDate: '21/11/2024'
      }
    ],
    semester: 'HK1',
    academicYear: '2024-2025'
  },
  {
    id: 3,
    sectionIdentifier: '772811203', // Mã lớp học phần
    courseCode: '7728112',         // Mã môn học
    courseName: 'Học máy',
    sectionCode: '66PM3',           // Lớp học phần
    department: 'Công nghệ thông tin',
    lecturer: { id: 1, code: '00139', name: 'Nguyễn Đình Anh' },
    capacity: 60,
    enrolled: 58,
    schedules: [
      {
        id: 1,
        day: 'Thứ 6',
        timeSlot: 'T4 -> T6',
        room: '107',
        building: 'H1',
        campus: 'Cơ sở chính',
        startDate: '29/11/2024',
        endDate: '29/11/2024'
      },
      {
        id: 2,
        day: 'Thứ 6',
        timeSlot: 'T7 -> T9',
        room: 'MSTeams 02',
        building: 'A1',
        campus: 'Cơ sở chính',
        startDate: '29/11/2024',
        endDate: '29/11/2024'
      }
    ],
    semester: 'HK1',
    academicYear: '2024-2025'
  },
  // Add more sections based on the image if needed
  {
    id: 4, // Example for the 4th row in the image
    sectionIdentifier: '772811205', // Mã lớp học phần
    courseCode: '7728112',         // Mã môn học
    courseName: 'Học máy',
    sectionCode: '66PM5',           // Lớp học phần
    department: 'Công nghệ thông tin',
    lecturer: { id: 1, code: '00139', name: 'Nguyễn Đình Anh' }, // Assuming same lecturer
    capacity: 60,
    enrolled: 55, // Example enrollment
    schedules: [ /* ... add schedules if known ... */ ],
    semester: 'HK1',
    academicYear: '2024-2025'
  }
];

// Sample data for lab classes (Adjust structure)
const labClassesData: CourseSection[] = [
  {
    id: 5, // Renumbered ID
    sectionIdentifier: '772811201', // Example: Need a unique identifier
    courseCode: '7728112',
    courseName: 'Học máy',
    sectionCode: '66MHT1', // This seems like the "Lớp học phần"
    department: 'Công nghệ thông tin',
    lecturer: { id: 1, code: '00139', name: 'Nguyễn Đình Anh' },
    capacity: 30,
    enrolled: 28,
    schedules: [
      {
        id: 1,
        day: 'Thứ 3',
        timeSlot: 'T1 -> T3',
        room: '56',
        building: 'H3',
        campus: 'Cơ sở chính',
        startDate: '31/12/2024',
        endDate: '25/02/2025'
      },
      {
        id: 2,
        day: 'Thứ 3',
        timeSlot: 'T1 -> T3',
        room: 'MSTeams 80',
        building: 'A1',
        campus: 'Cơ sở chính',
        startDate: '21/01/2025',
        endDate: '21/01/2025'
      }
    ],
    semester: 'HK2',
    academicYear: '2024-2025',
    notes: 'Lớp thực hành'
  }
];

// Sample data for semesters
const initialSemestersData: Semester[] = [
    {
      id: 1,
      code: "HK1",
      name: "Học kỳ 1",
      academicYear: "2024-2025",
      startDate: "01/09/2024",
      endDate: "31/12/2024",
      registrationStartDate: "15/08/2024",
      registrationEndDate: "25/08/2024",
      status: "active"
    },
    {
      id: 2,
      code: "HK2",
      name: "Học kỳ 2",
      academicYear: "2024-2025",
      startDate: "15/01/2025",
      endDate: "15/05/2025",
      registrationStartDate: "01/01/2025",
      registrationEndDate: "10/01/2025",
      status: "upcoming"
    },
    {
      id: 3,
      code: "HK3",
      name: "Học kỳ 3",
      academicYear: "2024-2025",
      startDate: "01/06/2025",
      endDate: "15/08/2025",
      registrationStartDate: "15/05/2025",
      registrationEndDate: "25/05/2025",
      status: "upcoming"
    },
    {
      id: 4,
      code: "HK1",
      name: "Học kỳ 1",
      academicYear: "2023-2024",
      startDate: "01/09/2023",
      endDate: "31/12/2023",
      registrationStartDate: "15/08/2023",
      registrationEndDate: "25/08/2023",
      status: "completed"
    }
  ];

// Combine lectures and labs
const allSectionsData = [...initialSections, ...labClassesData]; // Adjust IDs if needed to ensure uniqueness

// Helper function for deep comparison of schedules
const compareSchedules = (schedules1: any[], schedules2: any[]): boolean => {
    if (schedules1.length !== schedules2.length) return false;
    for (let i = 0; i < schedules1.length; i++) {
        const s1 = schedules1[i];
        const s2 = schedules2[i];
        if (
            s1.day !== s2.day ||
            s1.timeSlot !== s2.timeSlot ||
            s1.room !== s2.room ||
            s1.building !== s2.building ||
            s1.campus !== s2.campus ||
            s1.startDate !== s2.startDate ||
            s1.endDate !== s2.endDate
        ) {
            return false;
        }
    }
    return true;
};


const QuanLyLopHocPhan: React.FC = () => {
  // State variables
  const [sections, setSections] = useState<CourseSection[]>(allSectionsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState<SearchFilter>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentFilter>('all');

  // --- Semester State ---
  const [semesters, setSemesters] = useState<Semester[]>(initialSemestersData);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    semesters.find(s => s.status === 'active') || semesters[0] || null // Default to active or first
  );
  const [showCreateSemesterModal, setShowCreateSemesterModal] = useState(false);
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(false);
  const [showDeleteSemesterConfirm, setShowDeleteSemesterConfirm] = useState(false);
  const [semesterFormData, setSemesterFormData] = useState<Omit<Semester, 'id'>>({
    code: '', name: '', academicYear: '', startDate: '', endDate: '',
    registrationStartDate: '', registrationEndDate: '', status: 'upcoming'
  });
  const [editSemesterFormData, setEditSemesterFormData] = useState<Semester | null>(null);
  const [semesterToDelete, setSemesterToDelete] = useState<number | null>(null);
  // --- End Semester State ---

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- Alert Modal State ---
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  // --- End Alert Modal State ---

  // --- Confirmation Modal States ---
  const [showConfirmCreateSemester, setShowConfirmCreateSemester] = useState(false);
  const [showConfirmEditSemester, setShowConfirmEditSemester] = useState(false);
  const [showConfirmCreateSection, setShowConfirmCreateSection] = useState(false);
  const [showConfirmEditSection, setShowConfirmEditSection] = useState(false);
  // --- End Confirmation Modal States ---

  // Selected items states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);

  // Form data states (Add sectionIdentifierSuffix)
  const [formData, setFormData] = useState({
    sectionIdentifier: '', // Keep this for the final value if needed, or remove if always constructed
    sectionIdentifierSuffix: '', // Added for user input part
    courseId: '', // Keep this to link selected Course
    sectionCode: '', // Lớp học phần
    lecturerId: '',
    capacity: 40,
    schedules: [{
      day: 'Thứ 2' as Day,
      timeSlot: 'T7 -> T9' as TimeSlot,
      room: '',
      building: '',
      campus: 'Cơ sở chính',
      startDate: '',
      endDate: ''
    }],
    semester: selectedSemester?.code || '', // Initialize with selected semester code
    academicYear: selectedSemester?.academicYear || '' // Initialize with selected semester year
  });

  // State to hold the original data of the section being edited
  const [originalEditSectionData, setOriginalEditSectionData] = useState<CourseSection | null>(null);

  const [editFormData, setEditFormData] = useState({
    sectionIdentifier: '', // Keep this for the final value if needed, or remove if always constructed
    sectionIdentifierSuffix: '', // Added for user input part
    courseId: '',
    sectionCode: '', // Lớp học phần
    lecturerId: '',
    capacity: 40,
    schedules: [] as {
      id?: number;
      day: Day;
      timeSlot: TimeSlot;
      room: string;
      building: string;
      campus: string;
      startDate: string;
      endDate: string;
    }[],
    semester: '',
    academicYear: ''
  });

  const [viewSection, setViewSection] = useState<CourseSection | null>(null); // State to hold data for view modal
  const [showViewModal, setShowViewModal] = useState(false); // State to control view modal visibility

  // List of departments (derived from courses)
  const departments = Array.from(new Set(coursesData.map(course => course.department)));

  // Dropdown options for departments
  const departmentOptions = [
    { value: 'all', label: 'Tất cả khoa' },
    ...departments.map(dept => ({ value: dept, label: dept }))
  ];

  // Dropdown options for courses (Label uses course code and name)
  const courseOptions = coursesData.map(course => ({
    value: course.id.toString(),
    label: `${course.code} - ${course.name}`, // Display Mã môn học and Tên môn học
    data: course // Keep course data for reference
  }));

  // Dropdown options for lecturers
  const lecturerOptions = lecturersData.map(lecturer => ({
    value: lecturer.id.toString(),
    label: `${lecturer.code} - ${lecturer.name}`,
    data: lecturer
  }));

  // --- Semester Dropdown Options ---
  const semesterDropdownOptions = useMemo(() => {
    return semesters
      .sort((a, b) => {
        // Sort by academic year descending, then by semester code ascending (HK1, HK2, HK3)
        if (a.academicYear !== b.academicYear) {
          return b.academicYear.localeCompare(a.academicYear);
        }
        return a.code.localeCompare(b.code);
      })
      .map(semester => ({
        value: semester.id.toString(),
        label: `${semester.code} ${semester.academicYear} (${semester.status})`,
        data: semester
      }));
  }, [semesters]);
  // --- End Semester Dropdown Options ---

  // Dropdown options for days
  const dayOptions = [
    { value: 'Thứ 2', label: 'Thứ 2' },
    { value: 'Thứ 3', label: 'Thứ 3' },
    { value: 'Thứ 4', label: 'Thứ 4' },
    { value: 'Thứ 5', label: 'Thứ 5' },
    { value: 'Thứ 6', label: 'Thứ 6' },
    { value: 'Thứ 7', label: 'Thứ 7' },
    { value: 'Chủ nhật', label: 'Chủ nhật' }
  ];

  // Dropdown options for time slots
  const timeSlotOptions = [
    { value: 'T1 -> T3', label: 'T1 -> T3' },
    { value: 'T4 -> T6', label: 'T4 -> T6' },
    { value: 'T7 -> T9', label: 'T7 -> T9' },
    { value: 'T10 -> T12', label: 'T10 -> T12' },
    { value: 'T13 -> T15', label: 'T13 -> T15' }
  ];

  // Dropdown options for buildings
  const buildingOptions = [
    { value: 'H1', label: 'H1' },
    { value: 'H2', label: 'H2' },
    { value: 'H3', label: 'H3' },
    { value: 'A1', label: 'A1' }
  ];

  // --- Alert Modal Handler ---
  const handleShowAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => {
    setShowAlertModal(false);
    setAlertTitle('');
    setAlertMessage('');
  };
  // --- End Alert Modal Handler ---

  // --- Semester Handlers ---
  const handleSemesterChange = (selectedOption: any) => {
    const semester = semesters.find(s => s.id.toString() === selectedOption?.value);
    setSelectedSemester(semester || null);
  };

  const openCreateSemesterModal = () => {
    setSemesterFormData({
      code: '', name: '', academicYear: '', startDate: '', endDate: '',
      registrationStartDate: '', registrationEndDate: '', status: 'upcoming'
    });
    setShowCreateSemesterModal(true);
  };

  const handleCloseCreateSemesterModal = () => {
    setShowCreateSemesterModal(false);
  };

  const handleSemesterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSemesterFormData(prev => ({ ...prev, [name]: value }));
  };

  // Show confirmation before creating semester
  const handleCreateSemester = () => {
    // Basic validation (can be enhanced)
    setShowConfirmCreateSemester(true); // Show confirmation modal
  };

  // Actual semester creation logic
  const executeCreateSemester = () => {
    const newSemester: Semester = {
      id: Math.max(0, ...semesters.map(s => s.id)) + 1, // Simple ID generation
      ...semesterFormData
    };
    setSemesters([...semesters, newSemester]);
    setShowCreateSemesterModal(false); // Close the form modal
    setShowConfirmCreateSemester(false); // Close the confirmation modal
  };

  const cancelCreateSemester = () => {
    setShowConfirmCreateSemester(false); // Close the confirmation modal
  };

  const openEditSemesterModal = () => {
    if (selectedSemester) {
      setEditSemesterFormData(selectedSemester);
      setShowEditSemesterModal(true);
    } else {
      handleShowAlert("Thông báo", "Vui lòng chọn một học kỳ để chỉnh sửa.");
    }
  };

  const handleCloseEditSemesterModal = () => {
    setShowEditSemesterModal(false);
    setEditSemesterFormData(null);
  };

  const handleEditSemesterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editSemesterFormData) return;
    const { name, value } = e.target;
    setEditSemesterFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Show confirmation before saving semester edits
  const handleSaveEditSemester = () => {
    if (!editSemesterFormData) return;
    // Basic validation
    if (!editSemesterFormData.code || !editSemesterFormData.name || !editSemesterFormData.academicYear || !editSemesterFormData.startDate || !editSemesterFormData.endDate) {
        handleShowAlert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc cho học kỳ.");
        return;
    }
    setShowConfirmEditSemester(true); // Show confirmation modal
  };

  // Actual semester edit saving logic
  const executeSaveEditSemester = () => {
    if (!editSemesterFormData) return;
    setSemesters(semesters.map(s => s.id === editSemesterFormData.id ? editSemesterFormData : s));
    // If the edited semester was the selected one, update selectedSemester state as well
    if (selectedSemester && selectedSemester.id === editSemesterFormData.id) {
        setSelectedSemester(editSemesterFormData);
    }
    setShowEditSemesterModal(false); // Close the form modal
    setShowConfirmEditSemester(false); // Close the confirmation modal
    setEditSemesterFormData(null);
  };

  const cancelEditSemester = () => {
    setShowConfirmEditSemester(false); // Close the confirmation modal
  };

  const handleDeleteSemester = () => {
    if (selectedSemester) {
      // Check if any sections are associated with this semester
      const sectionsInSemester = sections.filter(sec =>
        sec.semester === selectedSemester.code && sec.academicYear === selectedSemester.academicYear
      );
      if (sectionsInSemester.length > 0) {
        handleShowAlert("Không thể xóa", "Không thể xóa học kỳ này vì vẫn còn lớp học phần thuộc học kỳ.");
        return;
      }
      setSemesterToDelete(selectedSemester.id);
      setShowDeleteSemesterConfirm(true);
    } else {
      handleShowAlert("Thông báo", "Vui lòng chọn một học kỳ để xóa.");
    }
  };

  const confirmDeleteSemester = () => {
    if (semesterToDelete !== null) {
      setSemesters(semesters.filter(s => s.id !== semesterToDelete));
      // If the deleted semester was the selected one, select another (e.g., the first one)
      if (selectedSemester && selectedSemester.id === semesterToDelete) {
        const activeSemester = semesters.find(s => s.status === 'active' && s.id !== semesterToDelete);
        setSelectedSemester(activeSemester || semesters.filter(s => s.id !== semesterToDelete)[0] || null);
      }
      setShowDeleteSemesterConfirm(false);
      setSemesterToDelete(null);
    }
  };

  const cancelDeleteSemester = () => {
    setShowDeleteSemesterConfirm(false);
    setSemesterToDelete(null);
  };
  // --- End Semester Handlers ---


  // Event handlers
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

  const handleDepartmentChange = (option: any) => {
    setDepartmentFilter(option.value);
  };

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, sectionId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedSectionId(sectionId);
  };

  // Chỉ đóng menu, không xóa ID state
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // View handlers
  const handleViewSection = () => {
    const sectionToView = sections.find(section => section.id === selectedSectionId);
    if (sectionToView) {
      setViewSection(sectionToView);
      setShowViewModal(true); // Set state to show the view modal
    }
    setAnchorEl(null); // Đóng menu trực tiếp
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false); // Set state to hide the view modal
    setViewSection(null); // Clear the data
    setSelectedSectionId(null); // Xóa ID khi modal đóng
  };

  // Create handlers
  const openCreateModal = () => {
    if (!selectedSemester) {
        handleShowAlert("Thông báo", "Vui lòng chọn học kỳ trước khi thêm lớp học phần.");
        return;
    }
    // Add condition to check semester status
    if (selectedSemester.status === 'completed') {
        handleShowAlert("Không thể tạo", "Không thể tạo lớp học phần cho học kỳ đã kết thúc.");
        return;
    }
    // Reset form data and set current semester/year
    setFormData({
      sectionIdentifier: '', // Reset
      sectionIdentifierSuffix: '', // Reset
      courseId: '',
      sectionCode: '', // Lớp học phần
      lecturerId: '',
      capacity: 0,
      schedules: [{
        day: 'Thứ 2' as Day,
        timeSlot: 'T7 -> T9' as TimeSlot,
        room: '',
        building: '',
        campus: 'Cơ sở chính',
        startDate: '',
        endDate: ''
      }],
      semester: selectedSemester.code, // Use selected semester code
      academicYear: selectedSemester.academicYear // Use selected semester year
    });
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCourseChange = (selectedOption: any) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        courseId: selectedOption.value,
        sectionIdentifierSuffix: '', // Clear suffix when course changes
      });
    } else {
      // Handle case where course is cleared
      setFormData({
        ...formData,
        courseId: '',
        sectionIdentifierSuffix: '',
      });
    }
  };

  const handleLecturerChange = (selectedOption: any) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        lecturerId: selectedOption.value
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Prevent changing semester/year in this form
    if (name === 'semester' || name === 'academicYear') return;
    // Handle the suffix input
    if (name === 'sectionIdentifierSuffix') {
        // Optional: Add validation/formatting for the suffix if needed (e.g., only numbers)
    }
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const updatedSchedules = [...formData.schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value
    };

    setFormData({
      ...formData,
      schedules: updatedSchedules
    });
  };

  const handleAddSchedule = () => {
    setFormData({
      ...formData,
      schedules: [
        ...formData.schedules,
        {
          day: 'Thứ 2' as Day,
          timeSlot: 'T7 -> T9' as TimeSlot,
          room: '',
          building: '',
          campus: 'Cơ sở chính',
          startDate: '',
          endDate: ''
        }
      ]
    });
  };

  const handleRemoveSchedule = (index: number) => {
    const updatedSchedules = formData.schedules.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      schedules: updatedSchedules
    });
  };

  // Show confirmation before creating section
  const handleCreateSection = () => {
    const selectedCourse = coursesData.find(course => course.id.toString() === formData.courseId);
    const selectedLecturer = lecturersData.find(lecturer => lecturer.id.toString() === formData.lecturerId);

    // Basic validation including new fields
    if (!selectedCourse) {
        handleShowAlert("Lỗi", "Vui lòng chọn Môn học.");
        return;
    }
    if (!formData.sectionIdentifierSuffix) { // Validate the suffix input
        handleShowAlert("Lỗi", "Vui lòng nhập phần còn lại của Mã lớp học phần.");
        return;
    }
    if (!formData.sectionCode) {
        handleShowAlert("Lỗi", "Vui lòng nhập Lớp học phần.");
        return;
    }
    if (!selectedLecturer) {
        handleShowAlert("Lỗi", "Vui lòng chọn Giảng viên.");
        return;
    }
    // Add more validation as needed

    setShowConfirmCreateSection(true); // Show confirmation modal
  };

  // Actual section creation logic
  const executeCreateSection = () => {
    const selectedCourse = coursesData.find(course => course.id.toString() === formData.courseId);
    const selectedLecturer = lecturersData.find(lecturer => lecturer.id.toString() === formData.lecturerId);

    if (selectedCourse && selectedLecturer && selectedSemester && formData.sectionIdentifierSuffix) { // Check suffix too
      // Construct the full section identifier
      const fullSectionIdentifier = `${selectedCourse.code}${formData.sectionIdentifierSuffix}`;

      // Optional: Check if the constructed identifier already exists for this semester
      const identifierExists = sections.some(sec =>
          sec.sectionIdentifier === fullSectionIdentifier &&
          sec.semester === selectedSemester.code &&
          sec.academicYear === selectedSemester.academicYear
      );
      if (identifierExists) {
          handleShowAlert("Lỗi", `Mã lớp học phần "${fullSectionIdentifier}" đã tồn tại trong học kỳ này.`);
          setShowConfirmCreateSection(false);
          return;
      }

      const newSection: CourseSection = {
        id: Math.max(0, ...sections.map(s => s.id)) + 1, // Simple ID generation
        sectionIdentifier: fullSectionIdentifier, // Use constructed identifier
        courseCode: selectedCourse.code, // Get from selected course
        courseName: selectedCourse.name, // Get from selected course
        sectionCode: formData.sectionCode, // Use new field
        department: selectedCourse.department,
        lecturer: {
          id: selectedLecturer.id,
          code: selectedLecturer.code,
          name: selectedLecturer.name
        },
        capacity: formData.capacity,
        enrolled: 0,
        schedules: formData.schedules.map((schedule, index) => ({
          id: index + 1, // Simple ID for schedule within section
          ...schedule
        })),
        semester: selectedSemester.code, // Use selected semester code
        academicYear: selectedSemester.academicYear // Use selected semester year
      };

      setSections([...sections, newSection]);
      setShowCreateModal(false); // Close the form modal
      setShowConfirmCreateSection(false); // Close the confirmation modal
      // Reset form might need adjustment
      setFormData({
        sectionIdentifier: '', sectionIdentifierSuffix: '', // Reset suffix
        courseId: '', sectionCode: '', lecturerId: '', capacity: 40,
        schedules: [{
          day: 'Thứ 2' as Day,
          timeSlot: 'T7 -> T9' as TimeSlot,
          room: '',
          building: '',
          campus: 'Cơ sở chính',
          startDate: '',
          endDate: ''
        }],
        semester: selectedSemester.code, academicYear: selectedSemester.academicYear
      });
    } else {
        handleShowAlert("Lỗi", "Lỗi: Vui lòng điền đầy đủ thông tin bắt buộc.");
        setShowConfirmCreateSection(false); // Close confirm modal on error too
    }
  };

  const cancelCreateSection = () => {
    setShowConfirmCreateSection(false); // Close the confirmation modal
  };

  // Edit handlers
  const handleEditSection = () => {
    const sectionToEdit = sections.find(section => section.id === selectedSectionId);

    if (sectionToEdit) {
      // Store the original section data for comparison later
      setOriginalEditSectionData(sectionToEdit);

      const selectedCourse = coursesData.find(course => course.code === sectionToEdit.courseCode); // Find course by code
      const selectedLecturer = lecturersData.find(lecturer => lecturer.code === sectionToEdit.lecturer.code);
      // Find the semester object based on code and year
      const sectionSemester = semesters.find(s => s.code === sectionToEdit.semester && s.academicYear === sectionToEdit.academicYear);

      // Extract the suffix from the sectionIdentifier
      let suffix = '';
      if (selectedCourse && sectionToEdit.sectionIdentifier.startsWith(selectedCourse.code)) {
          suffix = sectionToEdit.sectionIdentifier.substring(selectedCourse.code.length);
      } else {
          // Fallback or error handling if identifier doesn't match course code format
          console.warn("Section identifier does not start with the expected course code.");
          // You might want to just put the whole identifier in the suffix field in this edge case
          // suffix = sectionToEdit.sectionIdentifier;
      }

      setEditFormData({
        sectionIdentifier: sectionToEdit.sectionIdentifier, // Keep original for reference if needed
        sectionIdentifierSuffix: suffix, // Populate the suffix
        courseId: selectedCourse ? selectedCourse.id.toString() : '', // Find course ID for dropdown
        sectionCode: sectionToEdit.sectionCode, // Populate Lớp học phần
        lecturerId: selectedLecturer ? selectedLecturer.id.toString() : '',
        capacity: sectionToEdit.capacity,
        schedules: sectionToEdit.schedules.map((schedule, idx) => ({
          id: typeof schedule.id === 'number' ? schedule.id : idx + 1,
          day: schedule.day,
          timeSlot: schedule.timeSlot,
          room: schedule.room,
          building: schedule.building,
          campus: schedule.campus,
          startDate: schedule.startDate,
          endDate: schedule.endDate
        })),
        semester: sectionSemester?.id.toString() || '', // Store semester ID for dropdown
        academicYear: sectionToEdit.academicYear // Keep academic year for context if needed, but dropdown uses ID
      });

      setShowEditModal(true);
    }

    setAnchorEl(null); // Đóng menu trực tiếp
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setOriginalEditSectionData(null); // Clear original data when closing
    setSelectedSectionId(null); // Xóa ID khi modal đóng
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // If semester dropdown changes, update academic year too
    if (name === 'semester') {
        const selectedSem = semesters.find(s => s.id.toString() === value);
        setEditFormData({
            ...editFormData,
            semester: value,
            academicYear: selectedSem?.academicYear || ''
        });
    } else {
        // Handle the suffix input
        if (name === 'sectionIdentifierSuffix') {
            // Optional: Add validation/formatting for the suffix if needed
        }
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    }
  };

  const handleEditCourseChange = (selectedOption: any) => {
    if (selectedOption) {
      setEditFormData({
        ...editFormData,
        courseId: selectedOption.value,
        sectionIdentifierSuffix: '', // Clear suffix when course changes
      });
    } else {
       // Handle case where course is cleared
       setEditFormData({
        ...editFormData,
        courseId: '',
        sectionIdentifierSuffix: '',
      });
    }
  };

  const handleEditLecturerChange = (selectedOption: any) => {
    if (selectedOption) {
      setEditFormData({
        ...editFormData,
        lecturerId: selectedOption.value
      });
    }
  };

  const handleEditScheduleChange = (index: number, field: string, value: string) => {
    const updatedSchedules = [...editFormData.schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value
    };

    setEditFormData({
      ...editFormData,
      schedules: updatedSchedules
    });
  };

  const handleAddEditSchedule = () => {
    setEditFormData({
      ...editFormData,
      schedules: [
        ...editFormData.schedules,
        {
          day: 'Thứ 2' as Day,
          timeSlot: 'T7 -> T9' as TimeSlot,
          room: '',
          building: '',
          campus: 'Cơ sở chính',
          startDate: '',
          endDate: ''
        }
      ]
    });
  };

  const handleRemoveEditSchedule = (index: number) => {
    const updatedSchedules = editFormData.schedules.filter((_, i) => i !== index);
    setEditFormData({
      ...editFormData,
      schedules: updatedSchedules
    });
  };

  // Show confirmation before saving section edits
  const handleSaveEdit = () => {
    const selectedCourse = coursesData.find(course => course.id.toString() === editFormData.courseId);
    const selectedLecturer = lecturersData.find(lecturer => lecturer.id.toString() === editFormData.lecturerId);
    const selectedSem = semesters.find(s => s.id.toString() === editFormData.semester); // Find semester by ID
    const currentSectionId = selectedSectionId; // Lấy ID đang được chọn

    // Kiểm tra tất cả giá trị cần thiết, bao gồm cả currentSectionId
    if (!selectedCourse || !selectedLecturer || !selectedSem || !currentSectionId || !editFormData.sectionIdentifierSuffix) {
        // Log chi tiết lỗi để debug (tùy chọn)
        console.error("handleSaveEdit validation failed:", {
            selectedCourse: !!selectedCourse,
            selectedLecturer: !!selectedLecturer,
            selectedSem: !!selectedSem,
            currentSectionId: currentSectionId,
            sectionIdentifierSuffix: editFormData.sectionIdentifierSuffix
        });
        handleShowAlert("Lỗi", "Lỗi: Vui lòng điền đầy đủ thông tin bắt buộc.");
        return; // Dừng lại nếu thiếu thông tin
    }

    // Construct the full section identifier
    const fullSectionIdentifier = `${selectedCourse.code}${editFormData.sectionIdentifierSuffix}`;

    // Optional: Check if the new identifier conflicts with another section in the same semester
    const identifierExists = sections.some(sec =>
        sec.id !== currentSectionId && // Exclude the current section being edited
        sec.sectionIdentifier === fullSectionIdentifier &&
        sec.semester === selectedSem.code &&
        sec.academicYear === selectedSem.academicYear
    );
    if (identifierExists) {
        handleShowAlert("Lỗi", `Mã lớp học phần "${fullSectionIdentifier}" đã tồn tại cho lớp khác trong học kỳ này.`);
        // setShowConfirmEditSection(false); // Không cần dòng này ở đây
        return; // Dừng lại nếu có xung đột
    }

    // --- Di chuyển logic lưu vào executeSaveEdit ---
    // Nếu tất cả kiểm tra đều qua, hiển thị modal xác nhận
    setShowConfirmEditSection(true);
    // --- Kết thúc phần di chuyển ---

    /*
    // --- Logic cũ bị xóa khỏi đây ---
    // Convert capacity to number before saving
    const numericCapacity = typeof editFormData.capacity === 'string' ? parseInt(editFormData.capacity, 10) : editFormData.capacity;

    const updatedSections = sections.map(section => {
      // ... (mapping logic) ...
    });

    setSections(updatedSections);
    setShowConfirmEditSection(false); // Close the confirmation modal
    handleCloseEditModal(); // Gọi hàm này để đóng modal và xóa ID
    // --- Hết logic cũ ---
    */
  };

  // Actual save logic after confirmation
  const executeSaveEdit = () => {
    const selectedCourse = coursesData.find(course => course.id.toString() === editFormData.courseId);
    const selectedLecturer = lecturersData.find(lecturer => lecturer.id.toString() === editFormData.lecturerId);
    const selectedSem = semesters.find(s => s.id.toString() === editFormData.semester);
    const currentSectionId = selectedSectionId;

    // Thực hiện lại kiểm tra cơ bản phòng trường hợp state thay đổi (hoặc tin tưởng vào kiểm tra trước đó)
    if (selectedCourse && selectedLecturer && selectedSem && currentSectionId && editFormData.sectionIdentifierSuffix) {
        // Construct the full section identifier again (hoặc lấy từ state nếu bạn lưu nó)
        const fullSectionIdentifier = `${selectedCourse.code}${editFormData.sectionIdentifierSuffix}`;

        // Convert capacity to number before saving
        const numericCapacity = typeof editFormData.capacity === 'string' ? parseInt(editFormData.capacity, 10) : editFormData.capacity;

        const updatedSections = sections.map(section => {
            if (section.id === currentSectionId) { // Sử dụng currentSectionId để cập nhật
                return {
                    ...section,
                    sectionIdentifier: fullSectionIdentifier, // Save constructed identifier
                    courseCode: selectedCourse.code, // Update from selected course
                    courseName: selectedCourse.name, // Update from selected course
                    sectionCode: editFormData.sectionCode, // Save Lớp học phần
                    department: selectedCourse.department,
                    lecturer: {
                        id: selectedLecturer.id,
                        code: selectedLecturer.code,
                        name: selectedLecturer.name
                    },
                    capacity: numericCapacity, // Save numeric capacity
                    schedules: editFormData.schedules.map((schedule, idx) => ({
                        id: typeof schedule.id === 'number' ? schedule.id : Math.random(), // Use a better ID strategy if needed
                        day: schedule.day,
                        timeSlot: schedule.timeSlot,
                        room: schedule.room,
                        building: schedule.building,
                        campus: schedule.campus,
                        startDate: schedule.startDate,
                        endDate: schedule.endDate
                    })),
                    semester: selectedSem.code, // Save semester code
                    academicYear: selectedSem.academicYear // Save academic year
                };
            }
            return section;
        });

        setSections(updatedSections);
        setShowConfirmEditSection(false); // Đóng modal xác nhận
        handleCloseEditModal(); // Đóng modal chỉnh sửa và xóa ID
    } else {
        // Xử lý lỗi nếu có gì đó không ổn xảy ra giữa lúc hiển thị confirm và lúc nhấn xác nhận
        console.error("executeSaveEdit failed checks unexpectedly!");
        handleShowAlert("Lỗi", "Đã xảy ra lỗi không mong muốn khi lưu. Vui lòng thử lại.");
        setShowConfirmEditSection(false); // Đóng modal xác nhận trong trường hợp lỗi
    }
  };


  const cancelEditSection = () => {
    setShowConfirmEditSection(false); // Close the confirmation modal
    // Không cần đóng edit modal hay xóa ID ở đây, vì người dùng có thể muốn tiếp tục sửa
  };

  // Delete handlers
  const handleDeleteSection = () => {
    // selectedSectionId vẫn hợp lệ ở đây
    setSectionToDelete(selectedSectionId);
    setShowDeleteConfirm(true);
    setAnchorEl(null); // Đóng menu trực tiếp
  };

  const confirmDelete = () => {
    if (sectionToDelete) {
      const updatedSections = sections.filter(section => section.id !== sectionToDelete);
      setSections(updatedSections);
      setShowDeleteConfirm(false);
      setSectionToDelete(null);
      setSelectedSectionId(null); // Xóa ID khi xóa thành công
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSectionToDelete(null);
    setSelectedSectionId(null); // Xóa ID khi hủy xóa
  };

  // Filter sections based on search, department filter, and selected semester
  let filteredSections = sections.filter(section => {
    // Apply semester filter first
    if (selectedSemester && (section.semester !== selectedSemester.code || section.academicYear !== selectedSemester.academicYear)) {
        return false;
    }
    if (!selectedSemester) return false; // If no semester selected, show nothing

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      switch (searchFilter) {
        case 'name':
          if (!section.courseName.toLowerCase().includes(term)) return false;
          break;
        case 'courseCode': // Search by Mã môn học
          if (!section.courseCode.toLowerCase().includes(term)) return false;
          break;
        case 'sectionIdentifier': // Search by Mã lớp học phần
          if (!section.sectionIdentifier.toLowerCase().includes(term)) return false;
          break;
        case 'sectionCode': // Search by Lớp học phần
          if (!section.sectionCode.toLowerCase().includes(term)) return false;
          break;
        case 'lecturer':
          if (!section.lecturer.name.toLowerCase().includes(term)) return false;
          break;
      }
    }

    // Apply department filter
    if (departmentFilter !== 'all' && section.department !== departmentFilter) {
      return false;
    }

    return true;
  });

  // Apply sorting if needed
  if (sortDirection !== 'none') {
    filteredSections = [...filteredSections].sort((a, b) => {
      const nameA = a.courseName.toLowerCase();
      const nameB = b.courseName.toLowerCase();

      if (sortDirection === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  return (
    <motion.div
      className="section-management"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* --- Semester Selection and Management --- */}
      <div className="semester-controls">
        <div className="semester-select-group">
            <label htmlFor="semester-select">Chọn học kỳ:</label>
            <Select
                id="semester-select"
                className="semester-dropdown"
                options={semesterDropdownOptions}
                value={semesterDropdownOptions.find(option => option.value === selectedSemester?.id.toString())}
                onChange={handleSemesterChange}
                placeholder="Chọn học kỳ..."
                isSearchable={false}
            />
        </div>
        <div className="semester-actions">
            <button className="semester-action-btn create" onClick={openCreateSemesterModal}>
                <FaPlus /> Tạo HK
            </button>
            <button className="semester-action-btn edit" onClick={openEditSemesterModal} disabled={!selectedSemester}>
                <FaEdit /> Sửa HK
            </button>
            <button className="semester-action-btn delete" onClick={handleDeleteSemester} disabled={!selectedSemester}>
                <FaTrash /> Xóa HK
            </button>
        </div>
      </div>
      {/* --- End Semester Selection --- */}


      {/* Search and filter section */}
      <div className="top-actions">
        <div className="search-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={`Tìm kiếm theo ${
                searchFilter === 'name' ? 'tên môn học' :
                searchFilter === 'courseCode' ? 'mã môn học' :
                searchFilter === 'sectionIdentifier' ? 'mã lớp học phần' :
                searchFilter === 'sectionCode' ? 'lớp học phần' : 'giảng viên'
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
                  Tên môn học
                </button>
                 <button
                  className={`filter-option ${searchFilter === 'courseCode' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('courseCode')}
                >
                  Mã môn học
                </button>
                 <button
                  className={`filter-option ${searchFilter === 'sectionIdentifier' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('sectionIdentifier')}
                >
                  Mã lớp học phần
                </button>
                <button
                  className={`filter-option ${searchFilter === 'sectionCode' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('sectionCode')}
                >
                  Lớp học phần
                </button>
                <button
                  className={`filter-option ${searchFilter === 'lecturer' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('lecturer')}
                >
                  Giảng viên
                </button>
              </div>
            </div>

            <div className="advanced-filters">
              <div className="sort-filter">
                <button
                  className={`sort-button ${sortDirection !== 'none' ? 'active' : ''}`}
                  onClick={toggleSort}
                  title="Sắp xếp theo tên môn học"
                >
                  {sortDirection === 'asc' ? <FaSortAlphaDown /> :
                  sortDirection === 'desc' ? <FaSortAlphaUp /> :
                  <FaSortAlphaDown />}
                  <span>A-Z</span>
                </button>
              </div>

              <div className="department-filter">
                <div className="dropdown-container">
                  <Select
                    className="department-dropdown"
                    options={departmentOptions}
                    placeholder="Khoa"
                    defaultValue={departmentOptions[0]}
                    onChange={handleDepartmentChange}
                    isSearchable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="add-section-btn" onClick={openCreateModal} disabled={!selectedSemester}>
          <span className="add-icon">+</span> Thêm lớp học phần
        </button>
      </div>

      <h2 className="section-title">
        Danh sách lớp học phần {selectedSemester ? `(${selectedSemester.code} ${selectedSemester.academicYear})` : ''}
      </h2>

      {/* Update Table Headers */}
      <div className="sections-table-container">
        <table className="sections-table">
          <thead>
            <tr>
              <th className="id-col">STT</th>
              <th className="code-col">Mã lớp học phần</th> {/* Changed */}
              <th className="code-col">Mã môn học</th> {/* Changed */}
              <th className="name-col">Tên môn học</th>
              <th className="code-col">Lớp học phần</th> {/* Added */}
              <th className="lecturer-col">Giảng viên</th>
              <th className="capacity-col">Sĩ số</th>
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {filteredSections.map((section, index) => (
              <tr key={section.id}>
                <td>{index + 1}</td>
                <td>{section.sectionIdentifier}</td> {/* Changed */}
                <td>{section.courseCode}</td> {/* Changed */}
                <td>{section.courseName}</td>
                <td>{section.sectionCode}</td> {/* Added */}
                <td>{section.lecturer.name}</td>
                <td>{`${section.enrolled}/${section.capacity}`}</td>
                <td>
                  <button
                    className="action-btn"
                    onClick={(e) => handleMenuOpen(e, section.id)}
                  >
                    {/* Replace FaEdit with FaEllipsisH */}
                    <FaEllipsisH /> {/* Using FaEllipsisH as the trigger icon */}
                  </button>
                </td>
              </tr>
            ))}
            {!selectedSemester ? (
              <tr>
                {/* Use colSpan={8} because we added a column */}
                <td colSpan={8} className="no-results">Vui lòng chọn học kỳ để xem lớp học phần.</td>
              </tr>
            ) : sections.filter(s => s.semester === selectedSemester.code && s.academicYear === selectedSemester.academicYear).length === 0 ? ( // Check if original sections for the semester are empty
              <tr>
                 {/* Use colSpan={8} */}
                <td colSpan={8} className="no-results">Không có dữ liệu lớp học phần cho học kỳ này.</td>
              </tr>
            ) : filteredSections.length === 0 && ( // Check if filtered results are empty
              <tr>
                 {/* Use colSpan={8} */}
                <td colSpan={8} className="no-results">Không tìm thấy kết quả phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dropdown Menu - Cập nhật onClose */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose} // Sử dụng handleMenuClose mới chỉ đóng anchor
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* Các MenuItem giữ nguyên onClick vì các hàm xử lý đã được cập nhật */}
        <MenuItem onClick={handleViewSection}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem thông tin</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditSection}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa thông tin</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteSection} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Xóa thông tin</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create Course Section Modal (Update Form Fields) */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="create-section-modal section-modal" // Added section-modal class
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="modal-title">Tạo lớp học phần ({selectedSemester?.code} {selectedSemester?.academicYear})</h2>

              <div className="section-form">
                 {/* 1. Môn học Dropdown */}
                 <div className="form-group">
                  <label htmlFor="course">Môn học *</label>
                  <Select
                    id="course"
                    className="form-select"
                    options={courseOptions}
                    placeholder="Chọn môn học"
                    onChange={handleCourseChange} // This sets formData.courseId
                    value={courseOptions.find(option => option.value === formData.courseId)} // Control the value
                    required
                  />
                  {/* 2. Display Mã môn học */}
                  {formData.courseId && (
                    <div className="form-hint course-code-display"> {/* Added class for styling */}
                      Mã môn học: {coursesData.find(c => c.id.toString() === formData.courseId)?.code}
                    </div>
                  )}
                </div>

                 {/* 3. Mã lớp học phần (Split Input) */}
                 <div className="form-group">
                  <label htmlFor="sectionIdentifierSuffix">Mã lớp học phần *</label>
                  <div className="split-input-group"> {/* Wrapper for styling */}
                      <span className="split-input-prefix"> {/* Non-editable part */}
                          {formData.courseId ? coursesData.find(c => c.id.toString() === formData.courseId)?.code : 'Chọn môn học'}
                      </span>
                      <input
                        type="text"
                        id="sectionIdentifierSuffix"
                        name="sectionIdentifierSuffix"
                        value={formData.sectionIdentifierSuffix}
                        onChange={handleInputChange}
                        placeholder="Nhập phần còn lại (vd: 01)"
                        className="form-input split-input-suffix" // Input part
                        required
                        disabled={!formData.courseId} // Disable until course is selected
                      />
                  </div>
                   {/* Display the full constructed identifier */}
                   {formData.courseId && formData.sectionIdentifierSuffix && (
                        <div className="form-hint">
                            Mã lớp đầy đủ: {`${coursesData.find(c => c.id.toString() === formData.courseId)?.code}${formData.sectionIdentifierSuffix}`}
                        </div>
                    )}
                </div>

                {/* Other fields remain in their logical order */}
                <div className="form-group">
                  <label htmlFor="sectionCode">Lớp học phần *</label>
                  <input
                    type="text"
                    id="sectionCode"
                    name="sectionCode"
                    value={formData.sectionCode}
                    onChange={handleInputChange}
                    placeholder="Nhập lớp học phần (vd: 66CS1)"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lecturer">Giảng viên *</label>
                  <Select
                    id="lecturer"
                    className="form-select"
                    options={lecturerOptions}
                    placeholder="Chọn giảng viên"
                    onChange={handleLecturerChange}
                    value={lecturerOptions.find(option => option.value === formData.lecturerId)} // Control value
                    required
                  />
                </div>

                 <div className="form-group">
                  <label htmlFor="capacity">Sĩ số tối đa *</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min={1}
                    className="form-input"
                    required
                  />
                </div>

                <div className="schedules-section">
                  <div className="schedules-header">
                    <h3>Lịch học</h3>
                    <button
                      type="button"
                      className="add-schedule-btn"
                      onClick={handleAddSchedule}
                    >
                      <FaPlus /> Thêm lịch học
                    </button>
                  </div>

                  {formData.schedules.map((schedule, index) => (
                    <div className="schedule-item" key={index}>
                      <div className="schedule-header">
                        <h4>Lịch học {index + 1}</h4>
                        {index > 0 && (
                          <button
                            type="button"
                            className="remove-schedule-btn"
                            onClick={() => handleRemoveSchedule(index)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Thứ</label>
                          <select
                            value={schedule.day}
                            onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                            className="form-select"
                          >
                            {dayOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Tiết</label>
                          <select
                            value={schedule.timeSlot}
                            onChange={(e) => handleScheduleChange(index, 'timeSlot', e.target.value)}
                            className="form-select"
                          >
                            {timeSlotOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Phòng học</label>
                          <input
                            type="text"
                            value={schedule.room}
                            onChange={(e) => handleScheduleChange(index, 'room', e.target.value)}
                            placeholder="Nhập phòng học (vd: 107.H1)"
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Dãy nhà</label>
                          <select
                            value={schedule.building}
                            onChange={(e) => handleScheduleChange(index, 'building', e.target.value)}
                            className="form-select"
                          >
                            <option value="">Chọn dãy nhà</option>
                            {buildingOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Ngày bắt đầu</label>
                          <input
                            type="text" // Consider using type="date" for better UX
                            value={schedule.startDate}
                            onChange={(e) => handleScheduleChange(index, 'startDate', e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="form-input date-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Ngày kết thúc</label>
                          <input
                            type="text" // Consider using type="date"
                            value={schedule.endDate}
                            onChange={(e) => handleScheduleChange(index, 'endDate', e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="form-input date-input"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Cơ sở</label>
                        <select
                          value={schedule.campus}
                          onChange={(e) => handleScheduleChange(index, 'campus', e.target.value)}
                          className="form-select"
                        >
                          <option value="Cơ sở chính">Cơ sở chính</option>
                          <option value="Cơ sở 2">Cơ sở 2</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="confirm-btn"
                  onClick={handleCreateSection}
                  // Update disabled check for suffix
                  disabled={!formData.courseId || !formData.sectionIdentifierSuffix || !formData.sectionCode || !formData.lecturerId}
                >
                  Xác nhận
                </button>
                <button className="cancel-btn" onClick={handleCloseCreateModal}>
                  Hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Course Section Modal (Update Form Fields) */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="edit-section-modal section-modal" // Added section-modal class
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="modal-title">Chỉnh sửa lớp học phần</h2>

              <div className="section-form">
                 {/* 1. Môn học Dropdown */}
                 <div className="form-group">
                  <label htmlFor="edit-course">Môn học *</label>
                  <Select
                    id="edit-course"
                    className="form-select"
                    options={courseOptions}
                    placeholder="Chọn môn học"
                    value={courseOptions.find(option => option.value === editFormData.courseId)}
                    onChange={handleEditCourseChange}
                    required
                  />
                   {/* 2. Display Mã môn học */}
                  {editFormData.courseId && (
                    <div className="form-hint course-code-display"> {/* Added class */}
                      Mã môn học: {coursesData.find(c => c.id.toString() === editFormData.courseId)?.code}
                    </div>
                  )}
                </div>

                 {/* 3. Mã lớp học phần (Split Input) */}
                 <div className="form-group">
                  <label htmlFor="edit-sectionIdentifierSuffix">Mã lớp học phần *</label>
                   <div className="split-input-group"> {/* Wrapper */}
                      <span className="split-input-prefix"> {/* Prefix */}
                          {editFormData.courseId ? coursesData.find(c => c.id.toString() === editFormData.courseId)?.code : 'Chọn môn học'}
                      </span>
                      <input
                        type="text"
                        id="edit-sectionIdentifierSuffix"
                        name="sectionIdentifierSuffix"
                        value={editFormData.sectionIdentifierSuffix}
                        onChange={handleEditInputChange}
                        placeholder="Nhập phần còn lại"
                        className="form-input split-input-suffix" // Suffix input
                        required
                        disabled={!editFormData.courseId}
                      />
                  </div>
                  {/* Display the full constructed identifier */}
                   {editFormData.courseId && editFormData.sectionIdentifierSuffix && (
                        <div className="form-hint">
                            Mã lớp đầy đủ: {`${coursesData.find(c => c.id.toString() === editFormData.courseId)?.code}${editFormData.sectionIdentifierSuffix}`}
                        </div>
                    )}
                </div>

                 {/* Other fields */}
                 <div className="form-group">
                  <label htmlFor="edit-sectionCode">Lớp học phần *</label>
                  <input
                    type="text"
                    id="edit-sectionCode"
                    name="sectionCode"
                    value={editFormData.sectionCode}
                    onChange={handleEditInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-lecturer">Giảng viên *</label>
                  <Select
                    id="edit-lecturer"
                    className="form-select"
                    options={lecturerOptions}
                    placeholder="Chọn giảng viên"
                    value={lecturerOptions.find(option => option.value === editFormData.lecturerId)}
                    onChange={handleEditLecturerChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-capacity">Sĩ số tối đa *</label>
                  <input
                    type="number"
                    id="edit-capacity"
                    name="capacity"
                    value={editFormData.capacity}
                    onChange={handleEditInputChange}
                    min={1}
                    className="form-input"
                    required
                  />
                </div>

                {/* Semester Dropdown for Editing */}
                <div className="form-group">
                    <label htmlFor="edit-semester">Học kỳ</label>
                    <select
                        id="edit-semester"
                        name="semester" // Name matches the state key
                        value={editFormData.semester} // Value is the semester ID string
                        onChange={handleEditInputChange}
                        className="form-select"
                    >
                        {semesterDropdownOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Academic Year is updated automatically when semester changes */}
                {/* <div className="form-group"> ... </div> */}


                <div className="schedules-section">
                  <div className="schedules-header">
                    <h3>Lịch học</h3>
                    <button
                      type="button"
                      className="add-schedule-btn"
                      onClick={handleAddEditSchedule}
                    >
                      <FaPlus /> Thêm lịch học
                    </button>
                  </div>

                  {editFormData.schedules.map((schedule, index) => (
                    <div className="schedule-item" key={schedule.id || index}> {/* Use schedule.id if available */}
                      <div className="schedule-header">
                        <h4>Lịch học {index + 1}</h4>
                        {/* Allow removing only newly added schedules or all? For simplicity, allow removing any */}
                        {/* {index >= (originalEditSectionData?.schedules.length || 0) && ( */}
                        {editFormData.schedules.length > 0 && ( // Allow removing if there's at least one schedule
                          <button
                            type="button"
                            className="remove-schedule-btn"
                            onClick={() =>handleRemoveEditSchedule(index)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Thứ</label>
                          <select
                            value={schedule.day}
                            onChange={(e) => handleEditScheduleChange(index, 'day', e.target.value)}
                            className="form-select"
                          >
                            {dayOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Tiết</label>
                          <select
                            value={schedule.timeSlot}
                            onChange={(e) => handleEditScheduleChange(index, 'timeSlot', e.target.value)}
                            className="form-select"
                          >
                            {timeSlotOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Phòng học</label>
                          <input
                            type="text"
                            value={schedule.room}
                            onChange={(e) => handleEditScheduleChange(index, 'room', e.target.value)}
                            placeholder="Nhập phòng học (vd: 107.H1)"
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Dãy nhà</label>
                          <select
                            value={schedule.building}
                            onChange={(e) => handleEditScheduleChange(index, 'building', e.target.value)}
                            className="form-select"
                          >
                            <option value="">Chọn dãy nhà</option>
                            {buildingOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Ngày bắt đầu</label>
                          <input
                            type="text" // Consider using type="date"
                            value={schedule.startDate}
                            onChange={(e) => handleEditScheduleChange(index, 'startDate', e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="form-input date-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Ngày kết thúc</label>
                          <input
                            type="text" // Consider using type="date"
                            value={schedule.endDate}
                            onChange={(e) => handleEditScheduleChange(index, 'endDate', e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="form-input date-input"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Cơ sở</label>
                        <select
                          value={schedule.campus}
                          onChange={(e) => handleEditScheduleChange(index, 'campus', e.target.value)}
                          className="form-select"
                        >
                          <option value="Cơ sở chính">Cơ sở chính</option>
                          <option value="Cơ sở 2">Cơ sở 2</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="confirm-btn"
                  onClick={handleSaveEdit} // Nút này gọi handleSaveEdit để hiển thị xác nhận
                   // Update disabled check for suffix
                  disabled={!editFormData.courseId || !editFormData.sectionIdentifierSuffix || !editFormData.sectionCode || !editFormData.lecturerId || !editFormData.semester}
                >
                  Lưu thay đổi
                </button>
                <button className="cancel-btn" onClick={handleCloseEditModal}>
                  Hủy
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
              <h2 className="confirm-title">
                Xác nhận xóa
              </h2>
              <p className="confirm-text">Bạn có chắc chắn muốn xóa lớp học phần này? Hành động này không thể hoàn tác.</p>

              <div className="confirm-actions">
                <button
                  className="confirm-btn danger"
                  onClick={confirmDelete}
                >
                  Xóa
                </button>
                <button
                  className="cancel-btn"
                  onClick={cancelDelete}
                >
                  Hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Course Section Modal */}
      <AnimatePresence>
        {showViewModal && viewSection && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="view-section-modal section-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Title remains outside the scrollable area */}
              <h2 className="modal-title">Thông tin chi tiết lớp học phần</h2>

              {/* Container for scrollable content */}
              <div className="view-section-content">
                <div className="section-details"> {/* Container for details */}
                  <div className="detail-item"><strong>Mã lớp học phần:</strong> {viewSection.sectionIdentifier}</div>
                  <div className="detail-item"><strong>Mã môn học:</strong> {viewSection.courseCode}</div>
                  <div className="detail-item"><strong>Tên môn học:</strong> {viewSection.courseName}</div>
                  <div className="detail-item"><strong>Lớp học phần:</strong> {viewSection.sectionCode}</div>
                  <div className="detail-item"><strong>Khoa:</strong> {viewSection.department}</div>
                  <div className="detail-item"><strong>Giảng viên:</strong> {viewSection.lecturer.name} ({viewSection.lecturer.code})</div>
                  <div className="detail-item"><strong>Sĩ số:</strong> {viewSection.enrolled} / {viewSection.capacity}</div>
                  <div className="detail-item"><strong>Học kỳ:</strong> {viewSection.semester} - {viewSection.academicYear}</div>

                  <h3 className="details-subtitle">Lịch học</h3>
                  {viewSection.schedules.length > 0 ? (
                    <ul className="schedule-list">
                      {viewSection.schedules.map((schedule, index) => (
                        <li key={schedule.id || index} className="schedule-detail-item">
                          <strong>Lịch {index + 1}:</strong> {schedule.day}, {schedule.timeSlot}, Phòng: {schedule.room}, Dãy: {schedule.building}, Cơ sở: {schedule.campus} (Từ {schedule.startDate} đến {schedule.endDate})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Không có lịch học.</p>
                  )}
                </div>
                {/* Actions are MOVED OUTSIDE this div */}
              </div> {/* End of view-section-content */}

              {/* Actions are now outside the scrollable content, directly in the modal */}
              <div className="modal-actions view-modal-actions"> {/* Added specific class */}
                <button className="cancel-btn" onClick={handleCloseViewModal}>
                  Đóng
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Semester Modals --- */}
      {/* Create Semester Modal */}
      <AnimatePresence>
        {showCreateSemesterModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="semester-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="modal-title">Tạo học kỳ mới</h2>
              <div className="semester-form">
                {/* Form fields for semester */}
                <div className="form-group">
                  <label htmlFor="semesterCode">Mã học kỳ (vd: HK1)</label>
                  <input type="text" id="semesterCode" name="code" value={semesterFormData.code} onChange={handleSemesterInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="semesterName">Tên học kỳ (vd: Học kỳ 1)</label>
                  <input type="text" id="semesterName" name="name" value={semesterFormData.name} onChange={handleSemesterInputChange} className="form-input" />
                </div>
                <div className="form-group">
                <div className="form-group">
                  <label htmlFor="academicYear">Năm học (vd: 2024-2025)</label>
                  <input type="text" id="academicYear" name="academicYear" value={semesterFormData.academicYear} onChange={handleSemesterInputChange} className="form-input" />
                </div>
                  <label htmlFor="startDate">Ngày bắt đầu (DD/MM/YYYY)</label>
                  <input type="text" id="startDate" name="startDate" value={semesterFormData.startDate} onChange={handleSemesterInputChange} className="form-input date-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">Ngày kết thúc (DD/MM/YYYY)</label>
                  <input type="text" id="endDate" name="endDate" value={semesterFormData.endDate} onChange={handleSemesterInputChange} className="form-input date-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="registrationStartDate">Ngày bắt đầu ĐKHP (DD/MM/YYYY)</label>
                  <input type="text" id="registrationStartDate" name="registrationStartDate" value={semesterFormData.registrationStartDate} onChange={handleSemesterInputChange} className="form-input date-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="registrationEndDate">Ngày kết thúc ĐKHP (DD/MM/YYYY)</label>
                  <input type="text" id="registrationEndDate" name="registrationEndDate" value={semesterFormData.registrationEndDate} onChange={handleSemesterInputChange} className="form-input date-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select id="status" name="status" value={semesterFormData.status} onChange={handleSemesterInputChange} className="form-select">
                    <option value="upcoming">Sắp tới</option>
                    <option value="active">Đang diễn ra</option>
                    <option value="completed">Đã kết thúc</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button 
                className="confirm-btn" 
                onClick={handleCreateSemester}
                disabled={!semesterFormData.code || !semesterFormData.name || !semesterFormData.academicYear || !semesterFormData.startDate || !semesterFormData.endDate}
                >Xác nhận</button> {/* Changed to show confirmation */}
                <button className="cancel-btn" onClick={handleCloseCreateSemesterModal}>Hủy</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Semester Modal */}
      <AnimatePresence>
        {showEditSemesterModal && editSemesterFormData && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="semester-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="modal-title">Chỉnh sửa học kỳ</h2>
              <div className="semester-form">
                <div className="form-group">
                  <label htmlFor="editSemesterCode">Mã học kỳ</label>
                  <input type="text" id="editSemesterCode" name="code" value={editSemesterFormData.code} onChange={handleEditSemesterInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="editSemesterName">Tên học kỳ</label>
                  <input type="text" id="editSemesterName" name="name" value={editSemesterFormData.name} onChange={handleEditSemesterInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="editAcademicYear">Năm học</label>
                  <input type="text" id="editAcademicYear" name="academicYear" value={editSemesterFormData.academicYear} onChange={handleEditSemesterInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="editStartDate">Ngày bắt đầu</label>
                  <input type="text" id="editStartDate" name="startDate" value={editSemesterFormData.startDate} onChange={handleEditSemesterInputChange} className="form-input date-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="editEndDate">Ngày kết thúc</label>
                  <input type="text" id="editEndDate" name="endDate" value={editSemesterFormData.endDate} onChange={handleEditSemesterInputChange} className="form-input date-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="editRegistrationStartDate">Ngày bắt đầu ĐKHP</label>
                  <input type="text" id="editRegistrationStartDate" name="registrationStartDate" value={editSemesterFormData.registrationStartDate} onChange={handleEditSemesterInputChange} className="form-input date-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="editRegistrationEndDate">Ngày kết thúc ĐKHP</label>
                  <input type="text" id="editRegistrationEndDate" name="registrationEndDate" value={editSemesterFormData.registrationEndDate} onChange={handleEditSemesterInputChange} className="form-input date-input" />
                </div>
                <div className="form-group">
                  <label htmlFor="editStatus">Trạng thái</label>
                  <select id="editStatus" name="status" value={editSemesterFormData.status} onChange={handleEditSemesterInputChange} className="form-select">
                    <option value="upcoming">Sắp tới</option>
                    <option value="active">Đang diễn ra</option>
                    <option value="completed">Đã kết thúc</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button className="confirm-btn" 
                onClick={handleSaveEditSemester}
                disabled={!editSemesterFormData.code || !editSemesterFormData.name || !editSemesterFormData.academicYear || !editSemesterFormData.startDate || !editSemesterFormData.endDate}
                >Lưu thay đổi</button> {/* Changed to show confirmation */}
                <button className="cancel-btn" onClick={handleCloseEditSemesterModal}>Hủy</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Semester Confirmation Modal */}
      <AnimatePresence>
        {showDeleteSemesterConfirm && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="confirmation-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="confirm-title">
                Xác nhận xóa học kỳ
              </h2>
              <p className="confirm-text">Bạn có chắc chắn muốn xóa học kỳ "{semesters.find(s => s.id === semesterToDelete)?.name} ({semesters.find(s => s.id === semesterToDelete)?.academicYear})"? Hành động này không thể hoàn tác.</p>
              <div className="confirm-actions">
                <button className="confirm-btn danger" onClick={confirmDeleteSemester}>Xóa</button>
                <button className="cancel-btn" onClick={cancelDeleteSemester}>Hủy</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- End Semester Modals --- */}

      {/* --- General Confirmation Modals --- */}
      {/* Confirm Create Semester */}
      <AnimatePresence>
        {showConfirmCreateSemester && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="confirmation-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="confirm-title">
                Xác nhận tạo học kỳ
              </h2>
              <p className="confirm-text">Bạn có chắc chắn muốn tạo học kỳ mới với thông tin đã nhập?</p>
              <div className="confirm-actions">
                <button className="confirm-btn" onClick={executeCreateSemester}>Xác nhận</button>
                <button className="cancel-btn" onClick={cancelCreateSemester}>Hủy</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Edit Semester */}
      <AnimatePresence>
        {showConfirmEditSemester && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="confirmation-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="confirm-title">
                Xác nhận lưu thay đổi
              </h2>
              <p className="confirm-text">Bạn có chắc chắn muốn lưu các thay đổi cho học kỳ này?</p>
              <div className="confirm-actions">
                <button className="confirm-btn" onClick={executeSaveEditSemester}>Xác nhận</button>
                <button className="cancel-btn" onClick={cancelEditSemester}>Hủy</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Create Section */}
      <AnimatePresence>
        {showConfirmCreateSection && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="confirmation-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="confirm-title">
                Xác nhận tạo lớp học phần
              </h2>
              <p className="confirm-text">Bạn có chắc chắn muốn tạo lớp học phần mới với thông tin đã nhập?</p>
              <div className="confirm-actions">
                <button className="confirm-btn" onClick={executeCreateSection}>Xác nhận</button>
                <button className="cancel-btn" onClick={cancelCreateSection}>Hủy</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Edit Section */}
      <AnimatePresence>
        {showConfirmEditSection && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="confirmation-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="confirm-title">
                Xác nhận lưu thay đổi
              </h2>
              <p className="confirm-text">Bạn có chắc chắn muốn lưu các thay đổi cho lớp học phần này?</p>
              <div className="confirm-actions">
                 {/* Nút này gọi executeSaveEdit để thực hiện lưu */}
                <button className="confirm-btn" onClick={executeSaveEdit}>Xác nhận</button>
                <button className="cancel-btn" onClick={cancelEditSection}>Hủy</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- End General Confirmation Modals --- */}


      {/* --- Alert Modal --- */}
      <AnimatePresence>
        {showAlertModal && (
          <motion.div
            className="modal-overlay alert-overlay" // Added alert-overlay class
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="alert-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="alert-header">
                <h3 className="alert-title">{alertTitle}</h3>
              </div>
              <p className="alert-message">{alertMessage}</p>
              <div className="alert-actions">
                <button className="alert-ok-btn" onClick={handleCloseAlertModal}>
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default QuanLyLopHocPhan;