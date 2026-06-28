import React, { useState, useMemo } from 'react';
import './QuanLyMonHoc.css';
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp, FaEllipsisH } from 'react-icons/fa';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
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
import ViewMajorModal from '../../components/ViewMajorModal';

// --- Thêm dữ liệu cho bậc Cử nhân ---
export interface BacDaoTao {
  id: number;
  tenBac: string;
  tongTinChi: number;
  hocKyList: HocKy[];
}

// Cập nhật interface MajorDetails
export interface MajorDetails {
  id: number;
  maNganh: string;
  tenNganh: string;
  khoa: string;
  chuyenNganh: string;
  bacDaoTaoList: BacDaoTao[]; // Thay thế tongTinChi và hocKyList
}

const khoaHocMayTinhData: MajorDetails = {
  id: 1,
  maNganh: '7210110',
  tenNganh: 'Khoa học máy tính',
  khoa: 'Công nghệ thông tin',
  chuyenNganh: 'Khoa học máy tính',
  bacDaoTaoList: [
    // Bậc Kỹ sư
    {
      id: 1,
      tenBac: 'Cử nhân',
      tongTinChi: 132,
      hocKyList: [
        // Học kỳ 1
        {
          id: 1, name: 'Học kỳ 1', monHocList: [
            { id: 1, maMon: '608800', tenMon: 'Giới thiệu ngành Khoa học Máy tính', soTinChi: 1, isNonCumulative: false },
            { id: 2, maMon: '538801', tenMon: 'Nhập môn lập trình', soTinChi: 3, isNonCumulative: false },
            { id: 3, maMon: '398802', tenMon: 'Nhập môn giải tích kỹ thuật', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '398801', tenMon: 'Đại số tuyến tính kỹ thuật', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '258811', tenMon: 'Vật lý kỹ thuật 1', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '258803', tenMon: 'Thực hành vật lý kỹ thuật 1', soTinChi: 1, isNonCumulative: false },
            { id: 7, maMon: '608805', tenMon: 'Tham quan, thực tập', soTinChi: 1, isNonCumulative: false },
            { id: 8, maMon: '518001', tenMon: 'Pháp luật đại cương', soTinChi: 2, isNonCumulative: false },
            { id: 9, maMon: '480111', tenMon: 'Giáo dục quốc phòng 1', soTinChi: 3, isNonCumulative: true },
            { id: 10, maMon: '480112', tenMon: 'Giáo dục quốc phòng 2', soTinChi: 2, isNonCumulative: true },
            { id: 11, maMon: '480113', tenMon: 'Giáo dục quốc phòng 3', soTinChi: 2, isNonCumulative: true },
            { id: 12, maMon: '480114', tenMon: 'Giáo dục quốc phòng 4', soTinChi: 1, isNonCumulative: true },
            { id: 13, maMon: '430101', tenMon: 'GD thể chất 1', soTinChi: 1, isNonCumulative: true },
          ]
        },
        // Học kỳ 2
        {
          id: 2, name: 'Học kỳ 2', monHocList: [
            { id: 1, maMon: '428801', tenMon: 'Triết học Mác – Lê Nin', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448803', tenMon: 'Tiếng anh cơ bản 1', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '468801', tenMon: 'Lập trình nâng cao', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '258812', tenMon: 'Vật lý kỹ thuật 2', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '258804', tenMon: 'Thực hành vật lý kỹ thuật 2', soTinChi: 1, isNonCumulative: false },
            { id: 6, maMon: '398803', tenMon: 'Giải tích ứng dụng kỹ thuật', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '608803', tenMon: 'Lập trình nhúng cho kỹ thuật', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '468802', tenMon: 'Lập trình C++', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '430102', tenMon: 'GD thể chất 2', soTinChi: 1, isNonCumulative: true },
          ]
        },
        // Học kỳ 3
        {
          id: 3, name: 'Học kỳ 3', monHocList: [
            { id: 1, maMon: '428802', tenMon: 'Kinh tế chính trị Mác – Lê Nin', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448804', tenMon: 'Tiếng anh cơ bản 2', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '478801', tenMon: 'Cấu trúc dữ liệu và thuật toán', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '538803', tenMon: 'Kiến trúc máy tính', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '408804', tenMon: 'Toán rời rạc', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '408801', tenMon: 'Xác suất thống kê kỹ thuật', soTinChi: 2, isNonCumulative: false },
            { id: 7, maMon: '478802', tenMon: 'Lập trình Web', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '368802', tenMon: 'Kinh tế kỹ thuật', soTinChi: 2, isNonCumulative: false },
            { id: 9, maMon: '538804', tenMon: 'Nguyên lý hệ điều hành', soTinChi: 2, isNonCumulative: false },
            { id: 10, maMon: '430103', tenMon: 'GD thể chất 3', soTinChi: 1, isNonCumulative: true },
          ]
        },
         // Học kỳ 4
         {
          id: 4, name: 'Học kỳ 4', monHocList: [
            { id: 1, maMon: '428803', tenMon: 'Chủ nghĩa xã hội khoa học', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448807', tenMon: 'Tiếng anh cơ bản 3', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '408809', tenMon: 'Đại số hiện đại ứng dụng', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '408810', tenMon: 'Các mô hình tính toán', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '608825', tenMon: 'Nhập môn Trí tuệ nhân tạo', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '478803', tenMon: 'Hệ cơ sở dữ liệu', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '478804', tenMon: 'Đồ án hệ cơ sở dữ liệu', soTinChi: 1, isNonCumulative: false },
            { id: 8, maMon: '468804', tenMon: 'Mạng máy tính', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '608806', tenMon: 'Phân tích và thiết kế thuật toán', soTinChi: 3, isNonCumulative: false },
          ]
        },
        // Học kỳ 5
        {
          id: 5, name: 'Học kỳ 5', monHocList: [
            { id: 1, maMon: '418801', tenMon: 'Lịch sử Đảng Cộng sản Việt Nam', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448808', tenMon: 'Tiếng anh cơ bản 4', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '608809', tenMon: 'Xử lý ảnh', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '608810', tenMon: 'Đồ án Xử lý ảnh', soTinChi: 1, isNonCumulative: false },
            { id: 5, maMon: '608813', tenMon: 'Nhập môn dữ liệu lớn', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '608808', tenMon: 'Nguyên lý ngôn ngữ lập trình', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '478805', tenMon: 'Công nghệ phần mềm', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '478807', tenMon: 'Đồ án công nghệ phần mềm', soTinChi: 1, isNonCumulative: false },
            { id: 9, maMon: '608807', tenMon: 'Học máy', soTinChi: 3, isNonCumulative: false },
          ]
        },
        // Học kỳ 6
        {
          id: 6, name: 'Học kỳ 6', monHocList: [
            { id: 1, maMon: '418802', tenMon: 'Tư tưởng Hồ Chí Minh', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '440218', tenMon: 'Tiếng anh NC', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '608820', tenMon: 'Phát triển ứng dụng phía máy chủ', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '608811', tenMon: 'Xử lý ngôn ngữ tự nhiên', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '608814', tenMon: 'Thị giác máy tính', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '608815', tenMon: 'Đồ án Thị giác máy tính', soTinChi: 1, isNonCumulative: false },
            { id: 7, maMon: '608816', tenMon: 'Khai phá dữ liệu', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '608818', tenMon: 'Phát triển ứng dụng đa nền tảng', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '608819', tenMon: 'Đồ án Phát triển ứng dụng đa nền tảng', soTinChi: 1, isNonCumulative: false },
          ]
        },
        {
          id: 7, name: 'Học kỳ 7', monHocList: [
            { id: 1, maMon: '608821', tenMon: 'Thực tập tốt nghiệp', soTinChi: 3, isNonCumulative: false },
            { id: 2, maMon: '608822', tenMon: 'Đồ án tốt nghiệp', soTinChi: 7, isNonCumulative: false },
          ]
        },
      ]
    },

    {
      id: 2,
      tenBac: 'Kỹ sư',
      tongTinChi: 184,
      hocKyList: [
        // Học kỳ 1
        {
          id: 1, name: 'Học kỳ 1', monHocList: [
            { id: 1, maMon: '608800', tenMon: 'Giới thiệu ngành Khoa học Máy tính', soTinChi: 1, isNonCumulative: false },
            { id: 2, maMon: '538801', tenMon: 'Nhập môn lập trình', soTinChi: 3, isNonCumulative: false },
            { id: 3, maMon: '398802', tenMon: 'Nhập môn giải tích kỹ thuật', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '398801', tenMon: 'Đại số tuyến tính kỹ thuật', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '258811', tenMon: 'Vật lý kỹ thuật 1', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '258803', tenMon: 'Thực hành vật lý kỹ thuật 1', soTinChi: 1, isNonCumulative: false },
            { id: 7, maMon: '608805', tenMon: 'Tham quan, thực tập', soTinChi: 1, isNonCumulative: false },
            { id: 8, maMon: '518001', tenMon: 'Pháp luật đại cương', soTinChi: 2, isNonCumulative: false },
            { id: 9, maMon: '480111', tenMon: 'Giáo dục quốc phòng 1', soTinChi: 3, isNonCumulative: true },
            { id: 10, maMon: '480112', tenMon: 'Giáo dục quốc phòng 2', soTinChi: 2, isNonCumulative: true },
            { id: 11, maMon: '480113', tenMon: 'Giáo dục quốc phòng 3', soTinChi: 2, isNonCumulative: true },
            { id: 12, maMon: '480114', tenMon: 'Giáo dục quốc phòng 4', soTinChi: 1, isNonCumulative: true },
            { id: 13, maMon: '430101', tenMon: 'GD thể chất 1', soTinChi: 1, isNonCumulative: true },
          ]
        },
        {
          id: 2, name: 'Học kỳ 2', monHocList: [
            { id: 1, maMon: '428801', tenMon: 'Triết học Mác – Lê Nin', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448803', tenMon: 'Tiếng anh cơ bản 1', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '468801', tenMon: 'Lập trình nâng cao', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '258812', tenMon: 'Vật lý kỹ thuật 2', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '258804', tenMon: 'Thực hành vật lý kỹ thuật 2', soTinChi: 1, isNonCumulative: false },
            { id: 6, maMon: '398803', tenMon: 'Giải tích ứng dụng kỹ thuật', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '608803', tenMon: 'Lập trình nhúng cho kỹ thuật', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '468802', tenMon: 'Lập trình C++', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '430102', tenMon: 'GD thể chất 2', soTinChi: 1, isNonCumulative: true }, // GDTC thường không tích lũy
          ]
        },
        // Học kỳ 3
        {
          id: 3, name: 'Học kỳ 3', monHocList: [
            { id: 1, maMon: '428802', tenMon: 'Kinh tế chính trị Mác – Lê Nin', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448804', tenMon: 'Tiếng anh cơ bản 2', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '478801', tenMon: 'Cấu trúc dữ liệu và thuật toán', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '538803', tenMon: 'Kiến trúc máy tính', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '408804', tenMon: 'Toán rời rạc', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '408801', tenMon: 'Xác suất thống kê kỹ thuật', soTinChi: 2, isNonCumulative: false },
            { id: 7, maMon: '478802', tenMon: 'Lập trình Web', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '368802', tenMon: 'Kinh tế kỹ thuật', soTinChi: 2, isNonCumulative: false },
            { id: 9, maMon: '538804', tenMon: 'Nguyên lý hệ điều hành', soTinChi: 2, isNonCumulative: false },
            { id: 10, maMon: '430103', tenMon: 'GD thể chất 3', soTinChi: 1, isNonCumulative: true }, // GDTC thường không tích lũy
          ]
        },
         // Học kỳ 4
         {
          id: 4, name: 'Học kỳ 4', monHocList: [
            { id: 1, maMon: '428803', tenMon: 'Chủ nghĩa xã hội khoa học', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448807', tenMon: 'Tiếng anh cơ bản 3', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '408809', tenMon: 'Đại số hiện đại ứng dụng', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '408810', tenMon: 'Các mô hình tính toán', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '608825', tenMon: 'Nhập môn Trí tuệ nhân tạo', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '478803', tenMon: 'Hệ cơ sở dữ liệu', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '478804', tenMon: 'Đồ án hệ cơ sở dữ liệu', soTinChi: 1, isNonCumulative: false },
            { id: 8, maMon: '468804', tenMon: 'Mạng máy tính', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '608806', tenMon: 'Phân tích và thiết kế thuật toán', soTinChi: 3, isNonCumulative: false },
          ]
        },
        // Học kỳ 5
        {
          id: 5, name: 'Học kỳ 5', monHocList: [
            { id: 1, maMon: '418801', tenMon: 'Lịch sử Đảng Cộng sản Việt Nam', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448808', tenMon: 'Tiếng anh cơ bản 4', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '608809', tenMon: 'Xử lý ảnh', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '608810', tenMon: 'Đồ án Xử lý ảnh', soTinChi: 1, isNonCumulative: false },
            { id: 5, maMon: '608813', tenMon: 'Nhập môn dữ liệu lớn', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '608808', tenMon: 'Nguyên lý ngôn ngữ lập trình', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '478805', tenMon: 'Công nghệ phần mềm', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '478807', tenMon: 'Đồ án công nghệ phần mềm', soTinChi: 1, isNonCumulative: false },
            { id: 9, maMon: '608807', tenMon: 'Học máy', soTinChi: 3, isNonCumulative: false },
          ]
        },
        // Học kỳ 6
        {
          id: 6, name: 'Học kỳ 6', monHocList: [
            { id: 1, maMon: '418802', tenMon: 'Tư tưởng Hồ Chí Minh', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '440218', tenMon: 'Tiếng anh NC', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '608820', tenMon: 'Phát triển ứng dụng phía máy chủ', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '608811', tenMon: 'Xử lý ngôn ngữ tự nhiên', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '608814', tenMon: 'Thị giác máy tính', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '608815', tenMon: 'Đồ án Thị giác máy tính', soTinChi: 1, isNonCumulative: false },
            { id: 7, maMon: '608816', tenMon: 'Khai phá dữ liệu', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '608818', tenMon: 'Phát triển ứng dụng đa nền tảng', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '608819', tenMon: 'Đồ án Phát triển ứng dụng đa nền tảng', soTinChi: 1, isNonCumulative: false },
          ]
        },
        // Học kỳ 7
        {
          id: 7, name: 'Học kỳ 7', monHocList: [
            { id: 1, maMon: '607708', tenMon: 'Chuyên đề tổng hợp Ngành KHMT', soTinChi: 3, isNonCumulative: false },
            { id: 2, maMon: '471798', tenMon: 'Lập trình Linux', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '461751', tenMon: 'An toàn bảo mật thông tin', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '607702', tenMon: 'Phát triển ứng dụng phía máy chủ nâng cao', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '607703', tenMon: 'Đồ án phát triển ứng dụng phía máy chủ nâng cao', soTinChi: 1, isNonCumulative: false },
            { id: 6, maMon: '607704', tenMon: 'Học máy nâng cao', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '607705', tenMon: 'Đồ án học máy nâng cao', soTinChi: 1, isNonCumulative: false },
            { id: 8, maMon: '471781', tenMon: 'Cơ sở dữ liệu nâng cao', soTinChi: 2, isNonCumulative: false },
          ]
        },
        // Học kỳ 8
        {
          id: 8, name: 'Học kỳ 8', monHocList: [
            { id: 1, maMon: '361801', tenMon: 'Khoa học quản lý và quản trị', soTinChi: 3, isNonCumulative: false }, // Mã môn trùng? Giữ nguyên theo ảnh
            { id: 2, maMon: '461785', tenMon: 'An Ninh Mạng', soTinChi: 3, isNonCumulative: false },
            { id: 3, maMon: '607706', tenMon: 'Phát triển ứng dụng đa nền tảng nâng cao', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '607707', tenMon: 'Đồ án phát triển ứng dụng đa nền tảng nâng cao', soTinChi: 1, isNonCumulative: false },
            { id: 5, maMon: '471797', tenMon: 'Thiết kế giao diện và tương tác người máy', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '467701', tenMon: 'Công nghệ chuyển đổi số', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '471796', tenMon: 'Quản lý dự án Công nghệ thông tin', soTinChi: 2, isNonCumulative: false },
          ]
        },
        // Học kỳ 9 (đã có từ trước)
        {
          id: 9, name: 'Học kỳ 9', monHocList: [
            { id: 1, maMon: '607781', tenMon: 'Đồ án tốt nghiệp', soTinChi: 14, isNonCumulative: false },
            { id: 2, maMon: '607780', tenMon: 'Thực tập tốt nghiệp', soTinChi: 11, isNonCumulative: false },
          ]
        },
      ]
    },
  ]
};

// Dữ liệu cho ngành Công nghệ Đa phương tiện
const congNgheDaPhuongTienData: MajorDetails = {
  id: 2,
  maNganh: '7480201_01',
  tenNganh: 'Công nghệ đa phương tiện',
  khoa: 'Công nghệ thông tin',
  chuyenNganh: 'Công nghệ đa phương tiện',
  bacDaoTaoList: [
    {
      id: 1,
      tenBac: 'Cử nhân',
      tongTinChi: 134,
      hocKyList: [
        // Học kỳ 1
        {
          id: 1, name: 'Học kỳ 1', monHocList: [
            { id: 1, maMon: '531800', tenMon: 'CĐGT hành CNĐPT', soTinChi: 1, isNonCumulative: false },
            { id: 2, maMon: '531801', tenMon: 'Mỹ thuật cơ bản', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '390111', tenMon: 'Đại số TT', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '531802', tenMon: 'KT Nhiệp ảnh', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '450101', tenMon: 'Tin học đại cương', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '531803', tenMon: 'Cơ sở tạo hình', soTinChi: 2, isNonCumulative: false },
            { id: 7, maMon: '480111', tenMon: 'Giáo dục quốc phòng 1', soTinChi: 3, isNonCumulative: true },
            { id: 8, maMon: '480112', tenMon: 'Giáo dục quốc phòng 2', soTinChi: 2, isNonCumulative: true },
            { id: 9, maMon: '480113', tenMon: 'Giáo dục quốc phòng 3', soTinChi: 2, isNonCumulative: true },
            { id: 10, maMon: '480114', tenMon: 'Giáo dục quốc phòng 4', soTinChi: 1, isNonCumulative: true },
            { id: 11, maMon: '430120', tenMon: 'GD thể chất 1', soTinChi: 1, isNonCumulative: true },
          ]
        },
        // Học kỳ 2
        {
          id: 2, name: 'Học kỳ 2', monHocList: [
            { id: 1, maMon: '428801', tenMon: 'Triết học Mác-Lênin', soTinChi: 3, isNonCumulative: false },
            { id: 2, maMon: '440211', tenMon: 'Tiếng Anh cơ bản 1', soTinChi: 3, isNonCumulative: false },
            { id: 3, maMon: '531804', tenMon: 'Tham quan và thực hành', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '390121', tenMon: 'Giải tích 1', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '531805', tenMon: 'Kỹ thuật đồ họa', soTinChi: 2, isNonCumulative: false },
            { id: 6, maMon: '400101', tenMon: 'Xác suất thống kê', soTinChi: 2, isNonCumulative: false },
            { id: 7, maMon: '531811', tenMon: 'KT quay phim', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '471756', tenMon: 'Hệ cơ sở dữ liệu', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '531806', tenMon: 'Thiết kế đồ họa 1', soTinChi: 1, isNonCumulative: false },
            { id: 10, maMon: '430121', tenMon: 'GD thể chất 2', soTinChi: 1, isNonCumulative: true },
          ]
        },
        // Học kỳ 3
        {
          id: 3, name: 'Học kỳ 3', monHocList: [
            { id: 1, maMon: '428802', tenMon: 'KTCT Mác-Lênin', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '440212', tenMon: 'Tiếng Anh CB2', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '471754', tenMon: 'CTDL và thuật toán', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '531809', tenMon: 'KTXL tín hiệu và TT ĐPT', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '396602', tenMon: 'Giải tích 2', soTinChi: 2, isNonCumulative: false },
            { id: 6, maMon: '531810', tenMon: 'TK ấn phẩm điện tử', soTinChi: 2, isNonCumulative: false },
            { id: 7, maMon: '471732', tenMon: 'CN phần mềm', soTinChi: 2, isNonCumulative: false },
            { id: 8, maMon: '531807', tenMon: 'Thiết kế đồ họa 2', soTinChi: 2, isNonCumulative: false },
            { id: 9, maMon: '531808', tenMon: 'ĐA Thiết kế đồ họa', soTinChi: 1, isNonCumulative: false },
            { id: 10, maMon: '531812', tenMon: 'Kịch bản và kỹ xảo đa phương tiện', soTinChi: 3, isNonCumulative: false },
            { id: 11, maMon: '531813', tenMon: 'ĐA Kịch bản và kỹ xảo đa phương tiện', soTinChi: 1, isNonCumulative: false },
            { id: 12, maMon: '430122', tenMon: 'GD thể chất 3', soTinChi: 1, isNonCumulative: true },
          ]
        },
        // Học kỳ 4
        {
          id: 4, name: 'Học kỳ 4', monHocList: [
            { id: 1, maMon: '428803', tenMon: 'CNXH Khoa học', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448807', tenMon: 'Tiếng Anh CB3', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '536602', tenMon: 'Kiến trúc MT', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '510211', tenMon: 'Pháp luật đại cương', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '471787', tenMon: 'CN thiết kế WEB', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '531814', tenMon: 'Lập trình game', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '531816', tenMon: 'Ngôn ngữ LT', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '531817', tenMon: 'TK tương tác ĐPT', soTinChi: 2, isNonCumulative: false },
            { id: 9, maMon: '531818', tenMon: 'Xử lý ảnh và video', soTinChi: 3, isNonCumulative: false },
            { id: 10, maMon: '531819', tenMon: 'KT dựng audio và video', soTinChi: 3, isNonCumulative: false },
            { id: 11, maMon: '531820', tenMon: 'ĐA KT dựng audio và video', soTinChi: 1, isNonCumulative: false },
          ]
        },
        // Học kỳ 5
        {
          id: 5, name: 'Học kỳ 5', monHocList: [
            { id: 1, maMon: '418801', tenMon: 'Lịch sử ĐCSVN', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448808', tenMon: 'Tiếng Anh CB4', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '531821', tenMon: 'Trí tuệ nhân tạo UD trong ĐPT', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '531822', tenMon: 'LT UD trên đầu cuối di động', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '531823', tenMon: 'Kiểm thử và đảm bảo CLSP ĐPT', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '531702', tenMon: 'CS hệ điều hành', soTinChi: 2, isNonCumulative: false },
            { id: 7, maMon: '531825', tenMon: 'KT hình động', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '531826', tenMon: 'TK sản phẩm ĐPT', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '531827', tenMon: 'ĐA TKSP đa phương tiện', soTinChi: 1, isNonCumulative: false },
            { id: 10, maMon: '531834', tenMon: 'Lập trình âm thanh', soTinChi: 2, isNonCumulative: false },
            { id: 11, maMon: '531835', tenMon: 'Kỹ thuật âm thanh', soTinChi: 2, isNonCumulative: false },
          ]
        },
        // Học kỳ 6
        {
          id: 6, name: 'Học kỳ 6', monHocList: [
            { id: 1, maMon: '418802', tenMon: 'Tư tưởng HCM', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '440218', tenMon: 'Tiếng Anh NC', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '531828', tenMon: 'Bản quyền số', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '531829', tenMon: 'PT UD thực tại ảo', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '531830', tenMon: 'ĐA PT UD thực tại ảo', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '531831', tenMon: 'TCSX và PT UD ĐPT', soTinChi: 2, isNonCumulative: false },
            { id: 7, maMon: '531832', tenMon: 'ĐA TCSX và PT UD ĐPT', soTinChi: 1, isNonCumulative: false },
            { id: 8, maMon: '531835', tenMon: 'Marketing truyền thông', soTinChi: 2, isNonCumulative: false },
            { id: 9, maMon: '531836', tenMon: 'Thiết kế mỹ thuật CN', soTinChi: 2, isNonCumulative: false },
          ]
        },
        // Học kỳ 7
        {
          id: 7, name: 'Học kỳ 7', monHocList: [
            { id: 1, maMon: '531880', tenMon: 'Thực tập TN', soTinChi: 3, isNonCumulative: false },
            { id: 2, maMon: '531881', tenMon: 'ĐA tốt nghiệp', soTinChi: 7, isNonCumulative: false },
          ]
        },
      ]
    }
  ]
};

// 1. Chuyên ngành Công nghệ phần mềm
const congNghePhanMemData: MajorDetails = {
  id: 3,
  maNganh: '7480201',
  tenNganh: 'Công nghệ thông tin',
  khoa: 'Công nghệ thông tin',
  chuyenNganh: 'Công nghệ phần mềm',
  bacDaoTaoList: [
    {
      id: 1,
      tenBac: 'Kỹ sư',
      tongTinChi: 200,
      hocKyList: [
        // Học kỳ 1
        {
          id: 1, name: 'Học kỳ 1', monHocList: [
            { id: 1, maMon: '420111', tenMon: 'Triết học Mác-Lênin', soTinChi: 3, isNonCumulative: false },
            { id: 2, maMon: '390111', tenMon: 'Đại số TT', soTinChi: 3, isNonCumulative: false },
            { id: 3, maMon: '390121', tenMon: 'Giải tích 1', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '250101', tenMon: 'Vật lí 1', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '250103', tenMon: 'TH Vật lí', soTinChi: 1, isNonCumulative: false },
            { id: 6, maMon: '241701', tenMon: 'Chuyên đề giới thiệu ngành CNTT', soTinChi: 1, isNonCumulative: false },
            { id: 7, maMon: '450101', tenMon: 'Tin học đại cương', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '480111', tenMon: 'Giáo dục quốc phòng 1', soTinChi: 3, isNonCumulative: true },
            { id: 9, maMon: '480112', tenMon: 'Giáo dục quốc phòng 2', soTinChi: 2, isNonCumulative: true },
            { id: 10, maMon: '480113', tenMon: 'Giáo dục quốc phòng 3', soTinChi: 2, isNonCumulative: true },
            { id: 11, maMon: '480114', tenMon: 'Giáo dục quốc phòng 4', soTinChi: 1, isNonCumulative: true },
            {id: 12, maMon: '430120', tenMon: 'GD thể chất 1', soTinChi: 1, isNonCumulative: true},
            {id: 13, maMon: '430102', tenMon: 'GD thể chất 2', soTinChi: 1, isNonCumulative: true},
            {id: 14, maMon: '430103', tenMon: 'GD thể chất 3', soTinChi: 1, isNonCumulative: true},
          ]
        },
        // Học kỳ 2
        {
          id: 2, name: 'Học kỳ 2', monHocList: [
            { id: 1, maMon: '420113', tenMon: 'CNXH Khoa học', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '440211', tenMon: 'Tiếng Anh CB1', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '510201', tenMon: 'Pháp luật đại cương', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '396602', tenMon: 'Giải tích 2', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '250102', tenMon: 'Vật lí 2', soTinChi: 2, isNonCumulative: false },
            { id: 6, maMon: '471756', tenMon: 'Hệ cơ sở dữ liệu', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '471757', tenMon: 'ĐA Hệ cơ sở dữ liệu', soTinChi: 1, isNonCumulative: false },
            { id: 8, maMon: '536602', tenMon: 'Kiến trúc MT', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '461727', tenMon: 'Ngôn ngữ LT C++', soTinChi: 3, isNonCumulative: false },
            { id: 10, maMon: '471754', tenMon: 'CTDL và thuật toán 1', soTinChi: 2, isNonCumulative: false },
            { id: 11, maMon: '531701', tenMon: 'Thẩm quan, thực hành', soTinChi: 2, isNonCumulative: false },
          ]
        },
        // Học kỳ 3
        {
          id: 3, name: 'Học kỳ 3', monHocList: [
            { id: 1, maMon: '418802', tenMon: 'Tư tưởng Hồ Chí Minh', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '440212', tenMon: 'Tiếng Anh CB2', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '531702', tenMon: 'CS hệ điều hành', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '471755', tenMon: 'CTDL và thuật toán 2', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '406601', tenMon: 'Toán học tính toán', soTinChi: 2, isNonCumulative: false },
            { id: 6, maMon: '461762', tenMon: 'KT truyền thông', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '461706', tenMon: 'Mạng máy tính', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '461730', tenMon: 'PPLT hướng đối tượng', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '461731', tenMon: 'ĐA PPLT hướng đối tượng', soTinChi: 1, isNonCumulative: false },
            { id: 10, maMon: '531732', tenMon: 'LT ứng dụng cho KT', soTinChi: 2, isNonCumulative: false },
          ]
        },
        // Học kỳ 4
        {
          id: 4, name: 'Học kỳ 4', monHocList: [
            { id: 1, maMon: '420112', tenMon: 'Kinh tế chính trị Mác-Lênin', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448807', tenMon: 'Tiếng Anh CB3', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '471732', tenMon: 'CN phần mềm', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '401712', tenMon: 'Toán rời rạc', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '471733', tenMon: 'PT và TK hệ thống thông tin', soTinChi: 2, isNonCumulative: false },
            { id: 6, maMon: '471734', tenMon: 'ĐA PT và TK hệ thống thông tin', soTinChi: 1, isNonCumulative: false },
            { id: 7, maMon: '461751', tenMon: 'An toàn bảo mật tt', soTinChi: 2, isNonCumulative: false },
            { id: 8, maMon: '471787', tenMon: 'Công nghệ thiết kế WEB', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '400101', tenMon: 'Xác suất thống kê', soTinChi: 2, isNonCumulative: false },
          ]
        },
        // Học kỳ 5
        {
          id: 5, name: 'Học kỳ 5', monHocList: [
            { id: 1, maMon: '410111', tenMon: 'Lịch sử ĐCSVN', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448808', tenMon: 'Tiếng Anh CB4', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '471737', tenMon: 'Ngôn ngữ CN', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '461716', tenMon: 'Trí tuệ nhân tạo', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '471797', tenMon: 'TK giao diện và tương tác người máy', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '471790', tenMon: 'C# Winform', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '471788', tenMon: 'CN thiết kế WEB nâng cao', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '471789', tenMon: 'ĐA CN thiết kế WEB nâng cao', soTinChi: 1, isNonCumulative: false },
            { id: 9, maMon: '471791', tenMon: 'Cơ sở dữ liệu nâng cao', soTinChi: 3, isNonCumulative: false },
          ]
        },
        // Học kỳ 6
        {
          id: 6, name: 'Học kỳ 6', monHocList: [
            { id: 1, maMon: '448809', tenMon: 'Tiếng Anh NC', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '531787', tenMon: 'Vi xử lý', soTinChi: 3, isNonCumulative: false },
            { id: 3, maMon: '471793', tenMon: 'Công nghệ Java', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '471794', tenMon: 'Phát triển ứng dụng cho thiết bị di động', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '471795', tenMon: 'ĐA Phát triển ứng dụng cho thiết bị di động', soTinChi: 1, isNonCumulative: false },
            { id: 6, maMon: '471796', tenMon: 'Quản lý dự án công nghệ TT', soTinChi: 2, isNonCumulative: false },
            { id: 7, maMon: '471793', tenMon: 'Phần mềm nguồn mở', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '471798', tenMon: 'Lập trình Linux', soTinChi: 2, isNonCumulative: false },
            { id: 9, maMon: '361801', tenMon: 'Khoa học quản lý và quản trị', soTinChi: 3, isNonCumulative: false },
          ]
        },
        // Học kỳ 7
        {
          id: 7, name: 'Học kỳ 7', monHocList: [
            { id: 1, maMon: '477702', tenMon: 'Phần mềm nguồn mở nâng cao', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '477703', tenMon: 'Đồ án Phần mềm nguồn mở nâng cao', soTinChi: 1, isNonCumulative: false },
            { id: 3, maMon: '477702', tenMon: 'Lý thuyết tối ưu và đồ thị', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '608807', tenMon: 'Học máy', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '461718', tenMon: 'Hệ chuyên gia', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '471725', tenMon: 'Công nghệ đa phương tiện', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '477710', tenMon: 'Chuyển đề tổng hợp ngành CNTT', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '467701', tenMon: 'Công nghệ chuyển đổi số', soTinChi: 3, isNonCumulative: false },
          ]
        },
        // Học kỳ 8
        {
          id: 8, name: 'Học kỳ 8', monHocList: [
            { id: 1, maMon: '477704', tenMon: 'Thiết kế kiến trúc phần mềm', soTinChi: 3, isNonCumulative: false },
            { id: 2, maMon: '477705', tenMon: 'Đồ án thiết kế kiến trúc phần mềm', soTinChi: 1, isNonCumulative: false },
            { id: 3, maMon: '7728119', tenMon: 'Công nghệ điện toán đám mây', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '7728120', tenMon: 'Hệ thống thông minh', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '7728121', tenMon: 'Phân tích thiết kế hệ thống thông tin nâng cao', soTinChi: 2, isNonCumulative: false },
            { id: 6, maMon: '7728122', tenMon: 'Kiểm thử và đảm bảo chất lượng phần mềm', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '477780', tenMon: 'Thực tập tốt nghiệp', soTinChi: 11, isNonCumulative: false },
          ]
        },
        // Học kỳ 9
        {
          id: 9, name: 'Học kỳ 9', monHocList: [
            { id: 1, maMon: '477781', tenMon: 'Đồ án tốt nghiệp', soTinChi: 14, isNonCumulative: false },
          ]
        },
      ]
    }
  ]
};

// 2. Chuyên ngành Mạng và Hệ thống thông tin
const mangVaHeThongThongTinData: MajorDetails = {
  id: 4,
  maNganh: '7480201',
  tenNganh: 'Công nghệ thông tin',
  khoa: 'Công nghệ thông tin',
  chuyenNganh: 'Mạng và hệ thống thông tin',
  bacDaoTaoList: [
    {
      id: 1,
      tenBac: 'Kỹ sư',
      tongTinChi: 200,
      hocKyList: [
        // Học kỳ 1
        {
          id: 1, name: 'Học kỳ 1', monHocList: [
            { id: 1, maMon: '420111', tenMon: 'Triết học Mác-Lênin', soTinChi: 3, isNonCumulative: false },
            { id: 2, maMon: '390111', tenMon: 'Đại số TT', soTinChi: 3, isNonCumulative: false },
            { id: 3, maMon: '390121', tenMon: 'Giải tích 1', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '250101', tenMon: 'Vật lí 1', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '250103', tenMon: 'TH Vật lí', soTinChi: 1, isNonCumulative: false },
            { id: 6, maMon: '241701', tenMon: 'Chuyên đề giới thiệu ngành CNTT', soTinChi: 1, isNonCumulative: false },
            { id: 7, maMon: '450101', tenMon: 'Tin học đại cương', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '480111', tenMon: 'Giáo dục quốc phòng 1', soTinChi: 3, isNonCumulative: true },
            { id: 9, maMon: '480112', tenMon: 'Giáo dục quốc phòng 2', soTinChi: 2, isNonCumulative: true },
            { id: 10, maMon: '480113', tenMon: 'Giáo dục quốc phòng 3', soTinChi: 2, isNonCumulative: true },
            { id: 11, maMon: '480114', tenMon: 'Giáo dục quốc phòng 4', soTinChi: 1, isNonCumulative: true },
            {id: 12, maMon: '430120', tenMon: 'GD thể chất 1', soTinChi: 1, isNonCumulative: true},
            {id: 13, maMon: '430102', tenMon: 'GD thể chất 2', soTinChi: 1, isNonCumulative: true},
            {id: 14, maMon: '430103', tenMon: 'GD thể chất 3', soTinChi: 1, isNonCumulative: true},
          ]
        },
        // Học kỳ 2
        {
          id: 2, name: 'Học kỳ 2', monHocList: [
            { id: 1, maMon: '420113', tenMon: 'CNXH Khoa học', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '440211', tenMon: 'Tiếng Anh CB1', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '396602', tenMon: 'Giải tích 2', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '250102', tenMon: 'Vật lí 2', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '471756', tenMon: 'Hệ cơ sở dữ liệu', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '471757', tenMon: 'ĐA Hệ cơ sở dữ liệu', soTinChi: 1, isNonCumulative: false },
            { id: 7, maMon: '536602', tenMon: 'Kiến trúc MT', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '461727', tenMon: 'Ngôn ngữ LT C++', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '471754', tenMon: 'CTDL và thuật toán 1', soTinChi: 2, isNonCumulative: false },
            { id: 10, maMon: '531701', tenMon: 'Thẩm quan, thực hành', soTinChi: 2, isNonCumulative: false },
          ]
        },
        // Học kỳ 3
        {
          id: 3, name: 'Học kỳ 3', monHocList: [
            { id: 1, maMon: '418802', tenMon: 'Tư tưởng Hồ Chí Minh', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '440212', tenMon: 'Tiếng Anh CB2', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '531702', tenMon: 'CS hệ điều hành', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '471755', tenMon: 'CTDL và thuật toán 2', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '406601', tenMon: 'Toán học tính toán', soTinChi: 2, isNonCumulative: false },
            { id: 6, maMon: '461762', tenMon: 'KT truyền thông', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '461706', tenMon: 'Mạng máy tính', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '461730', tenMon: 'PPLT hướng đối tượng', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '461731', tenMon: 'ĐA PPLT hướng đối tượng', soTinChi: 1, isNonCumulative: false },
            { id: 10, maMon: '531732', tenMon: 'LT ứng dụng cho KT', soTinChi: 2, isNonCumulative: false },
          ]
        },
        // Học kỳ 4
        {
          id: 4, name: 'Học kỳ 4', monHocList: [
            { id: 1, maMon: '420112', tenMon: 'Kinh tế chính trị Mác-Lênin', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448807', tenMon: 'Tiếng Anh CB3', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '471732', tenMon: 'CN phần mềm', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '401712', tenMon: 'Toán rời rạc', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '471733', tenMon: 'PT và TK hệ thống thông tin', soTinChi: 2, isNonCumulative: false },
            { id: 6, maMon: '471734', tenMon: 'ĐA PT và TK hệ thống thông tin', soTinChi: 1, isNonCumulative: false },
            { id: 7, maMon: '461751', tenMon: 'An toàn bảo mật tt', soTinChi: 2, isNonCumulative: false },
            { id: 8, maMon: '471787', tenMon: 'Công nghệ thiết kế WEB', soTinChi: 3, isNonCumulative: false },
            { id: 9, maMon: '400101', tenMon: 'Xác suất thống kê', soTinChi: 2, isNonCumulative: false },
          ]
        },
        // Học kỳ 5
        {
          id: 5, name: 'Học kỳ 5', monHocList: [
            { id: 1, maMon: '410111', tenMon: 'Lịch sử ĐCSVN', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '448808', tenMon: 'Tiếng Anh CB4', soTinChi: 2, isNonCumulative: false },
            { id: 3, maMon: '471737', tenMon: 'Ngôn ngữ CN', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '461716', tenMon: 'Trí tuệ nhân tạo', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '461791', tenMon: 'Tương tác đa phương tiện', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '461785', tenMon: 'An ninh mạng', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '461789', tenMon: 'Lập trình hệ thống mạng', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '461790', tenMon: 'ĐA Lập trình hệ thống mạng', soTinChi: 1, isNonCumulative: false },
          ]
        },
        // Học kỳ 6
        {
          id: 6, name: 'Học kỳ 6', monHocList: [
            { id: 1, maMon: '440218', tenMon: 'Tiếng Anh NC', soTinChi: 2, isNonCumulative: false },
            { id: 2, maMon: '531787', tenMon: 'Vi xử lý', soTinChi: 3, isNonCumulative: false },
            { id: 3, maMon: '461792', tenMon: 'Phát triển ứng dụng IoT', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '461793', tenMon: 'Lập trình ứng dụng mạng', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '461794', tenMon: 'ĐA Lập trình ứng dụng mạng', soTinChi: 1, isNonCumulative: false },
            { id: 6, maMon: '461795', tenMon: 'Quản trị hệ thống thông tin', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '461796', tenMon: 'Phân tích dữ liệu', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '461798', tenMon: 'Bảo mật web và ứng dụng', soTinChi: 2, isNonCumulative: false },
            { id: 9, maMon: '361801', tenMon: 'Khoa học quản lý và quản trị', soTinChi: 3, isNonCumulative: false },
          ]
        },
        // Học kỳ 7
        {
          id: 7, name: 'Học kỳ 7', monHocList: [
            { id: 1, maMon: '407701', tenMon: 'Lý thuyết tối ưu và đồ thị', soTinChi: 3, isNonCumulative: false },
            { id: 2, maMon: '608807', tenMon: 'Học máy', soTinChi: 3, isNonCumulative: false },
            { id: 3, maMon: '461718', tenMon: 'Hệ chuyên gia', soTinChi: 3, isNonCumulative: false },
            { id: 4, maMon: '471725', tenMon: 'Công nghệ đa phương tiện', soTinChi: 3, isNonCumulative: false },
            { id: 5, maMon: '467711', tenMon: 'Chuyển đề tổng hợp ngành CNTT', soTinChi: 3, isNonCumulative: false },
            { id: 6, maMon: '467701', tenMon: 'Công nghệ chuyển đổi số', soTinChi: 3, isNonCumulative: false },
            { id: 7, maMon: '467705', tenMon: 'An ninh đa phương tiện', soTinChi: 3, isNonCumulative: false },
            { id: 8, maMon: '467704', tenMon: 'Đồ án An ninh đa phương tiện', soTinChi: 1, isNonCumulative: false },
          ]
        },
        // Học kỳ 8
        {
          id: 8, name: 'Học kỳ 8', monHocList: [
            { id: 1, maMon: '467706', tenMon: 'Phát triển hệ thống IoT', soTinChi: 3, isNonCumulative: false },
            { id: 2, maMon: '467707', tenMon: 'Đồ án Phát triển hệ thống IoT', soTinChi: 1, isNonCumulative: false },
            { id: 3, maMon: '467703', tenMon: 'Truyền thông đa phương tiện', soTinChi: 2, isNonCumulative: false },
            { id: 4, maMon: '467710', tenMon: 'Bảo vệ Bản quyền số', soTinChi: 2, isNonCumulative: false },
            { id: 5, maMon: '467712', tenMon: 'Hệ phân tán và ứng dụng', soTinChi: 2, isNonCumulative: false },
            { id: 6, maMon: '467713', tenMon: 'Ứng dụng thuật toán', soTinChi: 2, isNonCumulative: false },
            { id: 7, maMon: '467780', tenMon: 'Thực tập tốt nghiệp', soTinChi: 11, isNonCumulative: false },
          ]
        },
        // Học kỳ 9
        {
          id: 9, name: 'Học kỳ 9', monHocList: [
            { id: 1, maMon: '467781', tenMon: 'Đồ án tốt nghiệp', soTinChi: 14, isNonCumulative: false },
          ]
        },
      ]
    }
  ]
};

// Tạo một đối tượng để lưu trữ dữ liệu chi tiết theo mã ngành
const majorDetailsDataStore: { [key: string]: MajorDetails[] } = {
  [khoaHocMayTinhData.maNganh]: [khoaHocMayTinhData],
  [congNgheDaPhuongTienData.maNganh]: [congNgheDaPhuongTienData],
  '7480201': [congNghePhanMemData, mangVaHeThongThongTinData] // Lưu cả hai chuyên ngành với cùng 1 mã ngành
};


export interface NganhHoc {
  id: number;
  maNganh: string;
  tenNganh: string;
  khoa: string;
}

interface ChuyenNganh {
  id: number;
  tenChuyenNganh: string;
  nganhId: number;
}

interface BacDaiHoc {
  ten: string;
  soTinChi: number;
}

// Add these new interfaces
export interface MonHoc {
  id: number;
  maMon: string;
  tenMon: string;
  soTinChi: number;
  loaiHinh?: string; // Thêm trường loại hình
  isNonCumulative?: boolean;
}

export interface HocKy {
  id: number;
  name: string;
  monHocList: MonHoc[];
}

// Define search filter type
type SearchFilter = 'tenNganh' | 'maNganh';
type SortDirection = 'asc' | 'desc' | 'none';

// Option type for react-select
interface DropdownOption {
  value: string;
  label: string;
}

const QuanLyMonHoc: React.FC = () => {
  const [nganhHocList, setNganhHocList] = useState<NganhHoc[]>(
    [
      { id: 1, maNganh: '7210110', tenNganh: 'Khoa học máy tính', khoa: 'Công nghệ thông tin' },
      { id: 2, maNganh: '7480201_01', tenNganh: 'Công nghệ đa phương tiện', khoa: 'Công nghệ thông tin' },
      { id: 3, maNganh: '7480201', tenNganh: 'Công nghệ thông tin', khoa: 'Công nghệ thông tin' },
      { id: 4, maNganh: '7510605', tenNganh: 'Logistics và Quản lý chuỗi cung ứng', khoa: 'Công trình thủy' },
      { id: 5, maNganh: '7510605_01', tenNganh: 'Logistic đô thị', khoa: 'Công trình thủy' },
      { id: 6, maNganh: '7520201', tenNganh: 'Kỹ thuật điện', khoa: 'Cơ khí' },
      { id: 7, maNganh: '7520309', tenNganh: 'Kỹ thuật vật liệu', khoa: 'Vật liệu Xây dựng' },
    ]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState<SearchFilter>('tenNganh');
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const [khoanFilter, setKhoaFilter] = useState<string>('all');
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNganhId, setSelectedNganhId] = useState<number | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [showBacDaiHocConfirm, setShowBacDaiHocConfirm] = useState(false);
  
  // Form data for new major
  const [formData, setFormData] = useState({
    maNganh: '',
    tenNganh: '',
    khoa: ''
  });

  // States for specialized major functionality
  const [showChuyenNganhForm, setShowChuyenNganhForm] = useState(false);
  const [chuyenNganhName, setChuyenNganhName] = useState('');
  const [showChuyenNganhConfirm, setShowChuyenNganhConfirm] = useState(false);
  const [chuyenNganhList, setChuyenNganhList] = useState<ChuyenNganh[]>([]);
  const [confirmedChuyenNganh, setConfirmedChuyenNganh] = useState<string>('');
  const [showBacDaiHocButton, setShowBacDaiHocButton] = useState(false);

  // Bachelor degree form states
  const [showBacDaiHocForm, setShowBacDaiHocForm] = useState(false);
  const [bacDaiHocData, setBacDaiHocData] = useState<BacDaiHoc>({
    ten: '',
    soTinChi: 0
  });
  const [confirmedBacDaiHoc, setConfirmedBacDaiHoc] = useState<BacDaiHoc | null>(null);
  const [showHocKyButton, setShowHocKyButton] = useState(false);

  // Add this to your state variables
  const [createdChuyenNganhs, setCreatedChuyenNganhs] = useState<{id: number, name: string}[]>([]);
  const [selectedChuyenNganhId, setSelectedChuyenNganhId] = useState<number | null>(null);

  // Add these state variables for bachelor degree management
  const [createdBacDaiHocs, setCreatedBacDaiHocs] = useState<{id: number, ten: string, soTinChi: number}[]>([]);
  const [selectedBacDaiHocId, setSelectedBacDaiHocId] = useState<number | null>(null);

  // First, update the state to track bachelor degrees per specialized major
  const [bacDaiHocByChuyenNganh, setBacDaiHocByChuyenNganh] = useState<{
    [chuyenNganhId: number]: {id: number, ten: string, soTinChi: number}[]
  }>({});

  // Add these new state variables
  const [hocKyByBacDaiHoc, setHocKyByBacDaiHoc] = useState<{
    [bacDaiHocId: number]: HocKy[]
  }>({});

  const [showMonHocForm, setShowMonHocForm] = useState(false);
  const [selectedHocKyId, setSelectedHocKyId] = useState<number | null>(null);
  const [monHocData, setMonHocData] = useState<MonHoc>({
    id: 0,
    maMon: '',
    tenMon: '',
    soTinChi: 0,
    loaiHinh: '',
    isNonCumulative: false
  });

  const [showMonHocConfirm, setShowMonHocConfirm] = useState(false);
  const [creditError, setCreditError] = useState<string | null>(null);

  // Add these new state variables for editing courses
  const [editingMonHocId, setEditingMonHocId] = useState<number | null>(null);
  const [editingHocKyId, setEditingHocKyId] = useState<number | null>(null);

  // Add these state variables for editing specialized majors and bachelor degrees
  const [editingChuyenNganhId, setEditingChuyenNganhId] = useState<number | null>(null);
  const [editingBacDaiHocId, setEditingBacDaiHocId] = useState<number | null>(null);

  // Add state for viewing major details
  const [currentMajorData, setCurrentMajorData] = useState<NganhHoc | null>(null);
  const [currentMajorDetails, setCurrentMajorDetails] = useState<MajorDetails[] | null>(null); // <-- Thêm state này
  const [showViewModal, setShowViewModal] = useState(false);

  // Thêm các state mới để quản lý việc chỉnh sửa
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [editingNganhId, setEditingNganhId] = useState<number | null>(null);
  const [editingMajorDetails, setEditingMajorDetails] = useState<MajorDetails | null>(null);

  // Add new state variables for managing specialized majors in the form
  const [availableSpecializations, setAvailableSpecializations] = useState<Array<{id: number, name: string}>>([]);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState<number | null>(null);


  // Thêm state cho xác nhận xóa
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [nganhToDelete, setNganhToDelete] = useState<number | null>(null);


  // Enhanced reset function to clear all data
  const resetAllData = () => {
    // Reset form data for ngành (major)
    setFormData({
      maNganh: '',
      tenNganh: '',
      khoa: ''
    });
    
    // Reset chuyên ngành (specialized major) data
    setChuyenNganhName('');
    setChuyenNganhList([]);
    setCreatedChuyenNganhs([]);
    setConfirmedChuyenNganh('');
    setSelectedChuyenNganhId(null);
    setShowChuyenNganhForm(false);
    setShowChuyenNganhConfirm(false);
    setShowBacDaiHocButton(false);
    
    // Reset bậc đại học (bachelor degree) data
    setBacDaiHocData({
      ten: '',
      soTinChi: 0
    });
    setCreatedBacDaiHocs([]);
    setConfirmedBacDaiHoc(null);
    setSelectedBacDaiHocId(null);
    setShowBacDaiHocForm(false);
    setShowBacDaiHocConfirm(false);
    
    // Reset học kỳ (semester) data
    setShowHocKyButton(false);
    setHocKyByBacDaiHoc({});
    
    // Reset môn học (course) data
    setMonHocData({
      id: 0,
      maMon: '',
      tenMon: '',
      soTinChi: 0
    });
    setSelectedHocKyId(null);
    setShowMonHocForm(false);
    setShowMonHocConfirm(false);
    setCreditError(null);
    setEditingMonHocId(null);
    setEditingHocKyId(null);
    
    // Reset any editing states
    setEditingChuyenNganhId(null);
    setEditingBacDaiHocId(null);

    // Thêm dòng này để reset dropdown chuyên ngành
    setAvailableSpecializations([]);
    setSelectedSpecializationId(null);
  };

  // Extract unique faculty names for filtering
  const uniqueKhoas = useMemo(() => {
    const khoaSet = new Set<string>();
    nganhHocList.forEach(nganh => khoaSet.add(nganh.khoa));
    return ['all', ...Array.from(khoaSet)];
  }, [nganhHocList]);

  // Convert unique khoas to dropdown options
  const khoaOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Tất cả' },
      ...Array.from(new Set(nganhHocList.map(nganh => nganh.khoa)))
        .map(khoa => ({ value: khoa, label: khoa }))
    ];
  }, [nganhHocList]);

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

  const handleKhoaDropdownChange = (selectedOption: DropdownOption | null) => {
    setKhoaFilter(selectedOption?.value || 'all');
  };

  // Update handleAddNganh to ensure we start with a clean slate
  const handleAddNganh = () => {
    resetAllData();
    setShowAddModal(true);
  };
  
  // Update handleCloseAddModal to use resetAllData
  const handleCloseAddModal = () => {
    resetAllData();
    setShowAddModal(false);
  };

  // Thêm hàm đóng modal chỉnh sửa
const handleCloseEditModal = () => {
  setShowEditModal(false);
  setEditingNganhId(null);
  resetAllData();
};
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddChuyenNganh = () => {
    setShowChuyenNganhForm(true);
    setChuyenNganhName('');
  };
  
  const handleChuyenNganhNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChuyenNganhName(e.target.value);
  };
  
  // Update all cancel handlers to use resetAllData
  const handleChuyenNganhCancel = () => {
    setChuyenNganhName('');
    setShowChuyenNganhForm(false);
    setEditingChuyenNganhId(null);
  };
  
  const handleChuyenNganhConfirmOpen = () => {
    // Only proceed if name is entered
    if (chuyenNganhName.trim()) {
      setShowChuyenNganhConfirm(true);
    }
  };
  
  // For cancel buttons in confirmation modals
  const handleChuyenNganhConfirmClose = () => {
    setShowChuyenNganhConfirm(false);
  };
  
  // Update handleChuyenNganhCreate to reset bachelor degree data
  const handleChuyenNganhCreate = () => {
    if (editingChuyenNganhId !== null) {
      // Update existing specialized major
      const updatedChuyenNganhList = chuyenNganhList.map(cn =>
        cn.id === editingChuyenNganhId
          ? { ...cn, tenChuyenNganh: chuyenNganhName.trim() }
          : cn
      )

      const updatedCreatedChuyenNganhs = createdChuyenNganhs.map(cn =>
        cn.id === editingChuyenNganhId
          ? { ...cn, name: chuyenNganhName.trim() }
          : cn
      )

      setChuyenNganhList(updatedChuyenNganhList);
      setCreatedChuyenNganhs(updatedCreatedChuyenNganhs);

      // Update the selected one if it was being edited
      if (selectedChuyenNganhId === editingChuyenNganhId) {
        setConfirmedChuyenNganh(chuyenNganhName.trim());
      }

      // Update the dropdown options if editing a major
      if (editingNganhId) {
        const updatedSpec = {
          id: editingChuyenNganhId,
          name: chuyenNganhName.trim()
        };

        setAvailableSpecializations(prev =>
          prev.map(spec => spec.id === editingChuyenNganhId ? updatedSpec : spec)
        );
        // If the edited specialization was the currently selected one in the dropdown, ensure it stays selected
        if (selectedSpecializationId === editingChuyenNganhId) {
             // No need to change selectedSpecializationId here, just ensure the label updates
        }
      }

      setEditingChuyenNganhId(null);
      console.log(`Đã cập nhật chuyên ngành: ${chuyenNganhName.trim()}`);
    } else {
      // Create a new specialized major
      // Use a more robust way to generate ID, e.g., max existing ID + 1 or UUID
      const newId = (Math.max(0, ...createdChuyenNganhs.map(cn => cn.id), ...availableSpecializations.map(s => s.id)) || 0) + 1;

      const newChuyenNganh: ChuyenNganh = {
        id: newId,
        tenChuyenNganh: chuyenNganhName.trim(),
        nganhId: editingNganhId || 0 // Associate with the major being edited if applicable
      };

      const newCreatedChuyenNganh = {
        id: newId,
        name: chuyenNganhName.trim()
      };

      setChuyenNganhList([...chuyenNganhList, newChuyenNganh]);
      setCreatedChuyenNganhs([...createdChuyenNganhs, newCreatedChuyenNganh]);
      setConfirmedChuyenNganh(chuyenNganhName.trim());
      setSelectedChuyenNganhId(newId); // Select the new one internally
      setShowBacDaiHocButton(true);

      // Initialize an empty array for bachelor degrees for this new specialized major
      setBacDaiHocByChuyenNganh({
        ...bacDaiHocByChuyenNganh,
        [newId]: []
      });

      // Reset current bachelor degree display for the new specialized major
      setCreatedBacDaiHocs([]);
      setConfirmedBacDaiHoc(null);
      setSelectedBacDaiHocId(null);
      setShowHocKyButton(false);
      setHocKyByBacDaiHoc(prev => ({ ...prev, [newId]: [] })); // Ensure semesters are cleared too

      // Update dropdown options and select the new one if editing a major
      if (editingNganhId) {
        const newSpec = {
          id: newId,
          name: chuyenNganhName.trim()
        };
        setAvailableSpecializations(prev => [...prev, newSpec]);
        // *** FIX for Bug 1: Explicitly set the dropdown selection to the new specialization ***
        setSelectedSpecializationId(newId);
        // *** Also reset editingMajorDetails to signify we are working on a new detail structure ***
        setEditingMajorDetails(null);
      }

      console.log(`Đã tạo chuyên ngành: ${chuyenNganhName.trim()} with ID ${newId}`);
    }

    // Close both the form and the confirmation
    setShowChuyenNganhConfirm(false);
    setShowChuyenNganhForm(false);
  };
  
  const handleConfirmAdd = () => {
    // Create new major
  const newNganhId = nganhHocList.length + 1;
  const newNganh: NganhHoc = {
    id: newNganhId,
    maNganh: formData.maNganh,
    tenNganh: formData.tenNganh,
    khoa: formData.khoa
  };
  
  // Add to list
  setNganhHocList([...nganhHocList, newNganh]);
  
  // Tạo dữ liệu chi tiết về ngành
  if (selectedChuyenNganhId && confirmedChuyenNganh) {
    // Tạo danh sách bậc đào tạo
    const bacDaoTaoList: BacDaoTao[] = [];
    
    // Lấy dữ liệu của bậc đại học đã tạo
    const bacDaiHocsList = bacDaiHocByChuyenNganh[selectedChuyenNganhId] || [];
    
    // Chuyển đổi từ danh sách bậc đại học sang định dạng BacDaoTao
    bacDaiHocsList.forEach(bacDH => {
      const hocKyList = hocKyByBacDaiHoc[bacDH.id] || [];
      
      bacDaoTaoList.push({
        id: bacDH.id,
        tenBac: bacDH.ten,
        tongTinChi: bacDH.soTinChi,
        hocKyList: hocKyList
      });
    });
    
    // Tạo đối tượng MajorDetails
    const newMajorDetails: MajorDetails = {
      id: newNganhId,
      maNganh: formData.maNganh,
      tenNganh: formData.tenNganh,
      khoa: formData.khoa,
      chuyenNganh: confirmedChuyenNganh,
      bacDaoTaoList: bacDaoTaoList
    };
    
    // Thêm vào majorDetailsDataStore
    const existingDetails = majorDetailsDataStore[formData.maNganh] || [];
    majorDetailsDataStore[formData.maNganh] = [...existingDetails, newMajorDetails];
    
    console.log('Đã lưu chi tiết ngành:', newMajorDetails);
  }
  
  setShowAddConfirm(false);
  setShowAddModal(false);
  resetAllData();
  };

  const handleConfirmEdit = () => {
    if (editingNganhId === null) return;

    // 1. Update basic major info in the list
    const updatedNganhList = nganhHocList.map(nganh =>
      nganh.id === editingNganhId ?
      { ...nganh, maNganh: formData.maNganh, tenNganh: formData.tenNganh, khoa: formData.khoa } :
      nganh
    );
    setNganhHocList(updatedNganhList);

    // 2. Prepare the updated/new MajorDetails data
    const currentSpecializationId = selectedSpecializationId; // ID of the specialization being worked on
    if (!currentSpecializationId) {
        console.error("No specialization selected for saving.");
        // Optionally handle this error, maybe prevent saving
        setShowEditConfirm(false);
        return;
    }

    // Build the BacDaoTao list for the current specialization being edited
    let updatedBacDaoTaoList: BacDaoTao[] = [];
    const currentBacDaiHocs = bacDaiHocByChuyenNganh[selectedChuyenNganhId || -1] || createdBacDaiHocs; // Get the correct list

    currentBacDaiHocs.forEach(bacDH => {
        const hocKyList = hocKyByBacDaiHoc[bacDH.id] || [];
        updatedBacDaoTaoList.push({
            id: bacDH.id, // Use the ID from the bachelor degree state
            tenBac: bacDH.ten,
            tongTinChi: bacDH.soTinChi,
            hocKyList: hocKyList
        });
    });


    // 3. Update majorDetailsDataStore
    const majorCode = formData.maNganh;
    let detailsArray = majorDetailsDataStore[majorCode] ? [...majorDetailsDataStore[majorCode]] : [];

    // Find if a detail object already exists for this specialization ID
    const existingDetailIndex = detailsArray.findIndex(d => d.id === currentSpecializationId);

    if (existingDetailIndex !== -1) {
        // *** Update Existing Specialization Detail ***
        const updatedDetail: MajorDetails = {
            ...detailsArray[existingDetailIndex], // Start with existing data
            maNganh: formData.maNganh,
            tenNganh: formData.tenNganh,
            khoa: formData.khoa,
            chuyenNganh: confirmedChuyenNganh, // Use the confirmed name
            bacDaoTaoList: updatedBacDaoTaoList
        };
        detailsArray[existingDetailIndex] = updatedDetail;
        console.log("Đã cập nhật dữ liệu chi tiết chuyên ngành (ID:", currentSpecializationId, "):", updatedDetail);

    } else {
        // *** Add New Specialization Detail ***
        // This case happens if a new specialization was added during the edit session
        const newMajorDetails: MajorDetails = {
            id: currentSpecializationId, // Use the ID of the new specialization
            maNganh: formData.maNganh,
            tenNganh: formData.tenNganh,
            khoa: formData.khoa,
            chuyenNganh: confirmedChuyenNganh, // Use the confirmed name
            bacDaoTaoList: updatedBacDaoTaoList
        };
        detailsArray.push(newMajorDetails);
        console.log("Đã thêm dữ liệu chi tiết chuyên ngành mới (ID:", currentSpecializationId, "):", newMajorDetails);
    }

    // Save the updated array back to the store
    majorDetailsDataStore[majorCode] = detailsArray;

    // 4. Reset state and close modals
    setShowEditConfirm(false);
    setShowEditModal(false);
    setEditingNganhId(null);
    setEditingMajorDetails(null);
    resetAllData(); // Ensure full reset
  };

  const handleAddBacDaiHoc = () => {
    setShowBacDaiHocForm(true);
    setBacDaiHocData({
      ten: '',
      soTinChi: 0
    });
  };
  
  const handleBacDaiHocInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBacDaiHocData(prev => ({
      ...prev,
      [name]: name === 'soTinChi' ? (parseInt(value) || 0) : value
    }));
  };
  
  // Update all cancel handlers to use resetAllData
  const handleBacDaiHocCancel = () => {
    setBacDaiHocData({
      ten: '',
      soTinChi: 0
    });
    setShowBacDaiHocForm(false);
    setEditingBacDaiHocId(null);
  };
  
  const handleBacDaiHocConfirmOpen = () => {
    if (isBacDaiHocFormValid) {
      setShowBacDaiHocConfirm(true);
    }
  };

  // For cancel buttons in confirmation modals
  const handleBacDaiHocConfirmClose = () => {
    setShowBacDaiHocConfirm(false);
  };

  // Modify handleBacDaiHocCreate to add to the dropdown list
  const handleBacDaiHocCreate = () => {
    if (!selectedChuyenNganhId) return;
    
    if (editingBacDaiHocId !== null) {
      // ... (code for updating existing bachelor degree - remains the same) ...
      
      setEditingBacDaiHocId(null);
      console.log(`Đã cập nhật bậc đại học: ${bacDaiHocData.ten} - ${bacDaiHocData.soTinChi} tín chỉ`);
    } else {
      // Create a new bachelor degree
      const existingBacDaiHocs = bacDaiHocByChuyenNganh[selectedChuyenNganhId] || [];
      // Ensure new ID is unique across all bachelor degrees, not just within the current specialization
      const allBacIds = Object.values(bacDaiHocByChuyenNganh).flat().map(b => b.id);
      const newId = (Math.max(0, ...allBacIds) || 0) + 1;
      
      // Create the new bachelor degree object
      const newBacDaiHoc = {
        id: newId,
        ten: bacDaiHocData.ten,
        soTinChi: bacDaiHocData.soTinChi
      };
      
      // Add to the list for this specialized major
      const updatedBacDaiHocs = [...existingBacDaiHocs, newBacDaiHoc];
      setBacDaiHocByChuyenNganh({
        ...bacDaiHocByChuyenNganh,
        [selectedChuyenNganhId]: updatedBacDaiHocs
      });
      
      // Update current display
      setCreatedBacDaiHocs(updatedBacDaiHocs);
      setConfirmedBacDaiHoc({
        ten: bacDaiHocData.ten,
        soTinChi: bacDaiHocData.soTinChi
      });
      setSelectedBacDaiHocId(newId); // Select the new one
      setShowHocKyButton(true);

      // *** FIX: Initialize the semester list for the NEW bachelor degree ID ***
      setHocKyByBacDaiHoc(prev => ({
        ...prev,
        [newId]: [] // Start with an empty array for semesters
      }));
      
      console.log(`Đã thêm bậc đại học: ${bacDaiHocData.ten} - ${bacDaiHocData.soTinChi} tín chỉ with ID ${newId}`);
    }
    
    // Update UI state
    setShowBacDaiHocForm(false);
    setShowBacDaiHocConfirm(false);
  };

  // Modify handleAddHocKy to add a new semester with proper counting
  const handleAddHocKy = () => {
    if (!selectedBacDaiHocId) return;
    
    // Get existing semesters for this bachelor degree
    const existingHocKy = hocKyByBacDaiHoc[selectedBacDaiHocId] || [];
    
    // Create a new semester with the next number
    const newHocKyId = existingHocKy.length + 1;
    const newHocKy: HocKy = {
      id: newHocKyId,
      name: `Học kỳ ${newHocKyId}`,
      monHocList: []
    };
    
    // Add the new semester to the list
    const updatedHocKy = [...existingHocKy, newHocKy];
    setHocKyByBacDaiHoc({
      ...hocKyByBacDaiHoc,
      [selectedBacDaiHocId]: updatedHocKy
    });
    
    console.log(`Đã thêm ${newHocKy.name} cho bậc đại học: ${confirmedBacDaiHoc?.ten}`);
  };

  // Add function to handle adding courses to a semester
  const handleAddMonHoc = (hocKyId: number) => {
    setSelectedHocKyId(hocKyId);
    setShowMonHocForm(true);
    setMonHocData({
      id: 0,
      maMon: '',
      tenMon: '',
      soTinChi: 0
    });
    setCreditError(null);
  };

  // Handle course input changes
  const handleMonHocInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMonHocData(prev => ({
      ...prev,
      [name]: name === 'soTinChi' ? (parseInt(value) || 0) : value
    }));
  };

  // Add function to validate and confirm adding a course
  const handleMonHocConfirmOpen = () => {
    if (!selectedBacDaiHocId || !selectedHocKyId || !isMonHocFormValid) return;
    
    // Calculate total credits across all courses in this bachelor degree
    const totalExistingCredits = calculateTotalCredits(selectedBacDaiHocId);
    const newTotalCredits = totalExistingCredits + monHocData.soTinChi;
    
    // Get the credit limit for this bachelor degree
    const bacDaiHoc = createdBacDaiHocs.find(bd => bd.id === selectedBacDaiHocId);
    if (!bacDaiHoc) return;
    
    // Check if adding this course would exceed the credit limit
    if (newTotalCredits > bacDaiHoc.soTinChi) {
      setCreditError(`Tổng số tín chỉ (${newTotalCredits}) vượt quá giới hạn (${bacDaiHoc.soTinChi})`);
      return;
    }
    
    // If valid, show confirmation
    setShowMonHocConfirm(true);
  };

  // Function to calculate total credits for a bachelor degree
  const calculateTotalCredits = (bacDaiHocId: number, excludeNonCumulative: boolean = false): number => {
    const hocKyList = hocKyByBacDaiHoc[bacDaiHocId] || [];
    
    return hocKyList.reduce((total, hocKy) => {
      const hocKyTotal = hocKy.monHocList.reduce(
        (sum, monHoc) => {
          // Skip non-cumulative courses if flag is true
          if (excludeNonCumulative && monHoc.isNonCumulative) {
            return sum;
          }
          return sum + monHoc.soTinChi;
        }, 
        0
      );
      return total + hocKyTotal;
    }, 0);
  };

  // Cancel adding a course
  const handleMonHocCancel = () => {
    setMonHocData({
      id: 0,
      maMon: '',
      tenMon: '',
      soTinChi: 0,
      loaiHinh: '',  // Đảm bảo reset này
      isNonCumulative: false  // Đảm bảo reset này
    });
    
    setShowMonHocForm(false);
    setSelectedHocKyId(null);
    setCreditError(null);
    setEditingMonHocId(null);
    setEditingHocKyId(null);
  };

  // Close the confirmation modal
  const handleMonHocConfirmClose = () => {
    setShowMonHocConfirm(false);
  };

  // Create the course after confirmation
  const handleMonHocCreate = () => {
    if (!selectedBacDaiHocId || !selectedHocKyId) return;
    
    // Get the current semester
    const hocKyList = [...(hocKyByBacDaiHoc[selectedBacDaiHocId] || [])];
    const hocKyIndex = hocKyList.findIndex(hk => hk.id === selectedHocKyId);
    
    if (hocKyIndex < 0) return;
    
    let updatedHocKy = [...hocKyList];
    
    // Check if we're editing or creating
    if (editingMonHocId !== null && editingHocKyId === selectedHocKyId) {
      // Update existing course
      const monHocIndex = updatedHocKy[hocKyIndex].monHocList.findIndex(
        mh => mh.id === editingMonHocId
      );
      
      if (monHocIndex >= 0) {
        // Get the old course to calculate credit difference
        const oldMonHoc = updatedHocKy[hocKyIndex].monHocList[monHocIndex];
        
        // Chỉ tính chênh lệch tín chỉ nếu môn học cũ và mới đều là môn tích lũy
        let creditDifference = 0;
        if (!oldMonHoc.isNonCumulative && !monHocData.isNonCumulative) {
          creditDifference = monHocData.soTinChi - oldMonHoc.soTinChi;
        } else if (oldMonHoc.isNonCumulative && !monHocData.isNonCumulative) {
          // Môn học chuyển từ không tích lũy sang tích lũy
          creditDifference = monHocData.soTinChi;
        } else if (!oldMonHoc.isNonCumulative && monHocData.isNonCumulative) {
          // Môn học chuyển từ tích lũy sang không tích lũy
          creditDifference = -oldMonHoc.soTinChi;
        }
        
        // Chỉ kiểm tra giới hạn tín chỉ khi môn học mới là môn tích lũy
        if (!monHocData.isNonCumulative && creditDifference > 0) {
          // Calculate new total credits, excluding non-cumulative courses
          const totalExistingCredits = calculateTotalCredits(selectedBacDaiHocId, true);
          const newTotalCredits = totalExistingCredits + creditDifference;
          
          // Kiểm tra giới hạn
          const bacDaiHoc = createdBacDaiHocs.find(b => b.id === selectedBacDaiHocId);
          if (!bacDaiHoc) return;
          
          if (newTotalCredits > bacDaiHoc.soTinChi) {
            setCreditError(`Tổng số tín chỉ tích lũy (${newTotalCredits}) vượt quá giới hạn (${bacDaiHoc.soTinChi})`);
            return;
          }
        }
        
        // Update course...
        const updatedMonHocList = [...updatedHocKy[hocKyIndex].monHocList];
        updatedMonHocList[monHocIndex] = {
          ...monHocData
        };
        
        updatedHocKy[hocKyIndex] = {
          ...updatedHocKy[hocKyIndex],
          monHocList: updatedMonHocList
        };
        
        console.log(`Đã cập nhật môn học: ${monHocData.tenMon} (${monHocData.soTinChi} tín chỉ)`);
      }
    } else {
      // Create a new course
      const newMonHoc: MonHoc = {
        id: updatedHocKy[hocKyIndex].monHocList.length + 1,
        maMon: monHocData.maMon,
        tenMon: monHocData.tenMon,
        soTinChi: monHocData.soTinChi,
        loaiHinh: monHocData.loaiHinh,
        isNonCumulative: monHocData.isNonCumulative
      };
      
      // Add the course to the semester
      updatedHocKy[hocKyIndex] = {
        ...updatedHocKy[hocKyIndex],
        monHocList: [...updatedHocKy[hocKyIndex].monHocList, newMonHoc]
      };
      
      console.log(`Đã thêm môn học: ${newMonHoc.tenMon} (${newMonHoc.soTinChi} tín chỉ) vào ${updatedHocKy[hocKyIndex].name}`);
    }
    
    // Update the state
    setHocKyByBacDaiHoc({
      ...hocKyByBacDaiHoc,
      [selectedBacDaiHocId]: updatedHocKy
    });
    
    // Reset form and close modals
    setShowMonHocForm(false);
    setShowMonHocConfirm(false);
    setSelectedHocKyId(null);
    setEditingMonHocId(null);
    setEditingHocKyId(null);
    setCreditError(null);
  };

  // Form validation for bachelor degree
  const isBacDaiHocFormValid = 
    bacDaiHocData.ten.trim() !== '' && 
    bacDaiHocData.soTinChi > 100;

  // Validation for course form
  const isMonHocFormValid = 
    monHocData.maMon.trim() !== '' && 
    monHocData.tenMon.trim() !== '' && 
    monHocData.soTinChi > 0;

  // Add this function to check if all required fields are filled and criteria are met
  const isAddNganhFormValid = () => {
    // Check if the basic fields are filled
    const basicFieldsFilled = 
      formData.maNganh.trim() !== '' && 
      formData.tenNganh.trim() !== '' && 
      formData.khoa.trim() !== '';
    
    // Check if there is at least one semester with at least one course
    let hasCoursesInSemester = false;
    
    if (selectedBacDaiHocId) {
      const semesters = hocKyByBacDaiHoc[selectedBacDaiHocId] || [];
      
      // Check if any semester has courses
      for (const semester of semesters) {
        if (semester.monHocList.length > 0) {
          hasCoursesInSemester = true;
          break;
        }
      }
    }
    
    return basicFieldsFilled && hasCoursesInSemester;
  };

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, nganhId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedNganhId(nganhId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNganhId(null);
  };

  const handleViewNganh = () => {
    const selectedMajorBasic = nganhHocList.find(nganh => nganh.id === selectedNganhId);
    if (selectedMajorBasic) {
      // Set basic data
      setCurrentMajorData(selectedMajorBasic); 
      
      // Find detailed data based on major code
      const details = majorDetailsDataStore[selectedMajorBasic.maNganh];
      setCurrentMajorDetails(details || null);
      
      setShowViewModal(true);
    }
    handleMenuClose();
  };

  // Cập nhật hàm handleEditNganh để hiển thị modal chỉnh sửa
  const handleEditNganh = () => {
    const nganhToEdit = nganhHocList.find(nganh => nganh.id === selectedNganhId);
    if (!nganhToEdit) return;

    // Fill basic major info
    setFormData({
      maNganh: nganhToEdit.maNganh,
      tenNganh: nganhToEdit.tenNganh,
      khoa: nganhToEdit.khoa
    });

    // Load detailed data from store based on major code
    const detailsArray = majorDetailsDataStore[nganhToEdit.maNganh] || [];

    if (detailsArray.length > 0) {
        // Find the specific MajorDetails that corresponds to the nganhToEdit.id
        // This assumes MajorDetails.id uniquely identifies the specialization within the major code
        let initialMajorDetails = detailsArray.find(d => d.id === nganhToEdit.id);

        // Fallback if no direct match (e.g., if IDs got desynced, though they shouldn't)
        if (!initialMajorDetails) {
            console.warn(`No MajorDetails found for id ${nganhToEdit.id} in ${nganhToEdit.maNganh}. Defaulting to first.`);
            initialMajorDetails = detailsArray[0];
        }

        if (!initialMajorDetails) {
             console.error(`Cannot load details for major ${nganhToEdit.maNganh}`);
             // Handle error state - maybe close menu and show an error?
             handleMenuClose();
             return;
        }

        setEditingMajorDetails(initialMajorDetails); // Set the details being edited

        // Populate available specializations for the dropdown
        const specializations = detailsArray.map(detail => ({
            id: detail.id, // Use the unique ID from MajorDetails
            name: detail.chuyenNganh
        }));
        setAvailableSpecializations(specializations);

        // *** Set the initial dropdown selection ***
        setSelectedSpecializationId(initialMajorDetails.id);

        // Load data for the initially selected specialization
        setConfirmedChuyenNganh(initialMajorDetails.chuyenNganh);
        // We need a consistent way to manage chuyenNganhList and createdChuyenNganhs during edit
        // For simplicity, let's just use availableSpecializations for the dropdown source
        // And rely on confirmedChuyenNganh for display below the dropdown
        setChuyenNganhList(detailsArray.map(d => ({ id: d.id, tenChuyenNganh: d.chuyenNganh, nganhId: nganhToEdit.id }))); // Populate internal list if needed elsewhere
        setCreatedChuyenNganhs(specializations); // Keep this consistent with dropdown
        setSelectedChuyenNganhId(initialMajorDetails.id); // Internal tracking ID
        setShowBacDaiHocButton(true); // Show next step button

        // Load bachelor degrees for this initial specialization
        const initialBacDaiHocList = initialMajorDetails.bacDaoTaoList.map((bac, index) => ({
            // Use a consistent ID generation/mapping if bac.id is not reliable or doesn't exist
            id: bac.id || index + 1, // Prefer bac.id if available
            ten: bac.tenBac,
            soTinChi: bac.tongTinChi
        }));

        setCreatedBacDaiHocs(initialBacDaiHocList); // For the dropdown/display
        // Store bachelor degrees mapped by the *internal* selectedChuyenNganhId
        setBacDaiHocByChuyenNganh(prev => ({
            ...prev,
            [initialMajorDetails.id]: initialBacDaiHocList
        }));


        // Load semesters and courses, mapping them correctly
        const hocKyMapping: {[bacId: number]: HocKy[]} = {};
        let firstBacDaiHocId: number | null = null;

        initialMajorDetails.bacDaoTaoList.forEach((bac, index) => {
            const bacId = bac.id || index + 1; // Use consistent ID
            if (index === 0) firstBacDaiHocId = bacId; // Get ID of the first one
            if (bac.hocKyList && bac.hocKyList.length > 0) {
                hocKyMapping[bacId] = bac.hocKyList;
            } else {
                hocKyMapping[bacId] = []; // Ensure empty array if no semesters
            }
        });
        setHocKyByBacDaiHoc(hocKyMapping); // Load all semesters for all bachelor degrees

        // Select the first bachelor degree by default
        if (initialBacDaiHocList.length > 0 && firstBacDaiHocId !== null) {
            setSelectedBacDaiHocId(firstBacDaiHocId);
            setConfirmedBacDaiHoc({
                ten: initialBacDaiHocList[0].ten,
                soTinChi: initialBacDaiHocList[0].soTinChi
            });
            setShowHocKyButton(true);
        } else {
            // No bachelor degrees loaded
            setSelectedBacDaiHocId(null);
            setConfirmedBacDaiHoc(null);
            setShowHocKyButton(false); // Or true if you want to allow adding immediately
        }

    } else {
        // No details found in the store for this major code - start fresh
        console.warn(`No details found for major code ${nganhToEdit.maNganh}. Starting fresh.`);
        resetAllData(); // Reset sub-forms
        setAvailableSpecializations([]);
        setSelectedSpecializationId(null);
        // Keep basic form data filled
        setFormData({
            maNganh: nganhToEdit.maNganh,
            tenNganh: nganhToEdit.tenNganh,
            khoa: nganhToEdit.khoa
        });
    }

    setEditingNganhId(selectedNganhId); // Set the ID of the major being edited
    setShowEditModal(true);
    handleMenuClose();
  };
  // Sửa hàm handleDeleteNganh
  const handleDeleteNganh = () => {
    setNganhToDelete(selectedNganhId);
    setShowDeleteConfirm(true);
    handleMenuClose();
  };

  // Thêm hàm xử lý xóa thực sự
  const confirmDeleteNganh = () => {
    if (nganhToDelete) {
      console.log(`Đang xóa ngành có ID: ${nganhToDelete}`);
      
      // Tìm ngành cần xóa để lấy thông tin chi tiết
      const nganhToBeDeleted = nganhHocList.find(nganh => nganh.id === nganhToDelete);
      console.log('Thông tin ngành cần xóa:', nganhToBeDeleted);
      
      // Xóa khỏi danh sách ngành
      let updatedNganhList = nganhHocList.filter(nganh => nganh.id !== nganhToDelete);
      
      // Cập nhật lại STT cho tất cả các ngành còn lại
      updatedNganhList = updatedNganhList.map((nganh, index) => ({
        ...nganh,
        id: index + 1 // Đánh lại số thứ tự từ 1
      }));
      
      console.log('Số lượng ngành sau khi xóa:', updatedNganhList.length);
      
      // Cập nhật state
      setNganhHocList(updatedNganhList);
      
      // Xóa khỏi majorDetailsDataStore nếu có
      if (nganhToBeDeleted) {
        const { maNganh } = nganhToBeDeleted;
        
        if (majorDetailsDataStore[maNganh]) {
          // Lọc ra các details không thuộc ngành bị xóa
          const updatedDetails = majorDetailsDataStore[maNganh].filter(
            detail => detail.id !== nganhToDelete
          );
          
          // Cập nhật lại ID của details tương ứng với ID ngành mới
          const reindexedDetails = updatedDetails.map(detail => {
            const correspondingNganh = updatedNganhList.find(n => n.maNganh === detail.maNganh);
            return correspondingNganh ? { ...detail, id: correspondingNganh.id } : detail;
          });
          
          if (reindexedDetails.length === 0) {
            delete majorDetailsDataStore[maNganh];
          } else {
            majorDetailsDataStore[maNganh] = reindexedDetails;
          }
          
          console.log('Đã xóa và cập nhật thông tin chi tiết của ngành:', maNganh);
        }
      }
      
      // Reset sau khi xóa xong
      setNganhToDelete(null);
    } else {
      console.log('Không có ID ngành để xóa');
    }
    setShowDeleteConfirm(false);
  };

  // Update handleChuyenNganhSelectChange to load bachelor degrees for the selected specialized major
  const handleChuyenNganhSelectChange = (option: any) => {
    if (!option) return;
    
    const selectedId = option.value;
    setSelectedChuyenNganhId(selectedId);
    
    // Find the selected chuyên ngành
    const selected = chuyenNganhList.find(cn => cn.id === selectedId);
    if (selected) {
      setConfirmedChuyenNganh(selected.tenChuyenNganh);
      
      // Load bachelor degrees for this specialized major
      const bacDaiHocsForChuyenNganh = bacDaiHocByChuyenNganh[selectedId] || [];
      setCreatedBacDaiHocs(bacDaiHocsForChuyenNganh);
      
      // Reset selected bachelor degree
      setConfirmedBacDaiHoc(null);
      setSelectedBacDaiHocId(null);
      setShowHocKyButton(false);
    }
  };

  // Add handler for bachelor degree dropdown change
  const handleBacDaiHocSelectChange = (option: any) => {
    if (!option) return;
    
    const selectedId = option.value;
    setSelectedBacDaiHocId(selectedId);
    
    // Find the selected bachelor degree
    const selected = createdBacDaiHocs.find(bd => bd.id === selectedId);
    if (selected) {
      setConfirmedBacDaiHoc({
        ten: selected.ten,
        soTinChi: selected.soTinChi
      });
      setShowHocKyButton(true);
    }
  };

  // Filter and sort ngành học
  const filteredAndSortedNganhHoc = useMemo(() => {
    // First apply search term filtering
    let filtered = nganhHocList.filter(nganh => {
      // Apply search filter
      if (searchTerm !== '') {
        if (searchFilter === 'tenNganh') {
          if (!nganh.tenNganh.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
          }
        } else {
          if (!nganh.maNganh.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
          }
        }
      }
      
      // Apply khoa filter
      if (khoanFilter !== 'all' && nganh.khoa !== khoanFilter) {
        return false;
      }
      
      return true;
    });
    
    // Then apply sorting
    if (sortDirection !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        const nameA = a.tenNganh.toLowerCase();
        const nameB = b.tenNganh.toLowerCase();
        
        if (sortDirection === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }
    
    return filtered;
  }, [nganhHocList, searchTerm, searchFilter, khoanFilter, sortDirection]);

  // Add these new handler functions for deletion
  const handleDeleteMonHoc = (hocKyId: number, monHocId: number) => {
    if (!selectedBacDaiHocId) return;
    
    // Get the current list of semesters
    const hocKyList = [...(hocKyByBacDaiHoc[selectedBacDaiHocId] || [])];
    const hocKyIndex = hocKyList.findIndex(hk => hk.id === hocKyId);
    
    if (hocKyIndex < 0) return;
    
    // Filter out the course to delete
    const updatedMonHocList = hocKyList[hocKyIndex].monHocList.filter(
      mh => mh.id !== monHocId
    );
    
    // Update the semester with the filtered course list
    const updatedHocKy = [...hocKyList];
    updatedHocKy[hocKyIndex] = {
      ...updatedHocKy[hocKyIndex],
      monHocList: updatedMonHocList
    };
    
    // Update the state
    setHocKyByBacDaiHoc({
      ...hocKyByBacDaiHoc,
      [selectedBacDaiHocId]: updatedHocKy
    });
    
    console.log(`Đã xóa môn học ID: ${monHocId} khỏi ${hocKyList[hocKyIndex].name}`);
  };

  const handleDeleteHocKy = (hocKyId: number) => {
    if (!selectedBacDaiHocId) return;
    
    // Filter out the semester to delete
    const updatedHocKyList = (hocKyByBacDaiHoc[selectedBacDaiHocId] || [])
      .filter(hk => hk.id !== hocKyId);
    
    // Update the state
    setHocKyByBacDaiHoc({
      ...hocKyByBacDaiHoc,
      [selectedBacDaiHocId]: updatedHocKyList
    });
    
    console.log(`Đã xóa Học kỳ ID: ${hocKyId}`);
  };

  // Add function to handle editing a course
  const handleEditMonHoc = (hocKyId: number, monHoc: MonHoc) => {
    setEditingHocKyId(hocKyId);
    setEditingMonHocId(monHoc.id);
    setSelectedHocKyId(hocKyId);
    setMonHocData({
      id: monHoc.id,
      maMon: monHoc.maMon,
      tenMon: monHoc.tenMon,
      soTinChi: monHoc.soTinChi,
      loaiHinh: monHoc.loaiHinh || '',
      isNonCumulative: monHoc.isNonCumulative || false
    });
    setCreditError(null);
  };

  // Add function to handle editing a specialized major
  const handleEditChuyenNganh = (chuyenNganhId: number) => {
    const chuyenNganh = chuyenNganhList.find(cn => cn.id === chuyenNganhId);
    if (!chuyenNganh) return;
    
    setEditingChuyenNganhId(chuyenNganhId);
    setChuyenNganhName(chuyenNganh.tenChuyenNganh);
    setShowChuyenNganhForm(true);
  };

  // Update handleDeleteChuyenNganh to show confirmation first
  const [chuyenNganhToDelete, setChuyenNganhToDelete] = useState<number | null>(null);
  const [showDeleteChuyenNganhConfirm, setShowDeleteChuyenNganhConfirm] = useState<boolean>(false);
  const handleDeleteChuyenNganh = (chuyenNganhId: number) => {
    setChuyenNganhToDelete(chuyenNganhId);
    setShowDeleteChuyenNganhConfirm(true);
  };

  // Add confirmDeleteChuyenNganh to perform the actual deletion after confirmation
  const confirmDeleteChuyenNganh = () => {
    if (chuyenNganhToDelete === null) return;
    
    // Remove the specialized major
    const updatedChuyenNganhList = chuyenNganhList.filter(cn => cn.id !== chuyenNganhToDelete);
    const updatedCreatedChuyenNganhs = createdChuyenNganhs.filter(cn => cn.id !== chuyenNganhToDelete);
    
    setChuyenNganhList(updatedChuyenNganhList);
    setCreatedChuyenNganhs(updatedCreatedChuyenNganhs);
    
    // Also remove its bachelor degrees
    const updatedBacDaiHocByChuyenNganh = { ...bacDaiHocByChuyenNganh };
    delete updatedBacDaiHocByChuyenNganh[chuyenNganhToDelete];
    setBacDaiHocByChuyenNganh(updatedBacDaiHocByChuyenNganh);
    
    // Reset selections if the deleted one was selected
    if (selectedChuyenNganhId === chuyenNganhToDelete) {
      setSelectedChuyenNganhId(null);
      setConfirmedChuyenNganh('');
      setCreatedBacDaiHocs([]);
      setConfirmedBacDaiHoc(null);
      setSelectedBacDaiHocId(null);
      setShowHocKyButton(false);
    }
    
    // Close the confirmation modal
    setChuyenNganhToDelete(null);
    setShowDeleteChuyenNganhConfirm(false);
    
    console.log(`Đã xóa chuyên ngành có ID: ${chuyenNganhToDelete}`);
  };

  // Add function to handle editing a bachelor degree
  const handleEditBacDaiHoc = (bacDaiHocId: number) => {
    if (!selectedChuyenNganhId) return;
    
    const bacDaiHocs = bacDaiHocByChuyenNganh[selectedChuyenNganhId] || [];
    const bacDaiHoc = bacDaiHocs.find(bd => bd.id === bacDaiHocId);
    
    if (!bacDaiHoc) return;
    
    setEditingBacDaiHocId(bacDaiHocId);
    setBacDaiHocData({
      ten: bacDaiHoc.ten,
      soTinChi: bacDaiHoc.soTinChi
    });
    setShowBacDaiHocForm(true);
  };

  // Update handleDeleteBacDaiHoc to show confirmation first
  const [bacDaiHocToDelete, setBacDaiHocToDelete] = useState<number | null>(null);
  const [showDeleteBacDaiHocConfirm, setShowDeleteBacDaiHocConfirm] = useState<boolean>(false);
  const handleDeleteBacDaiHoc = (bacDaiHocId: number) => {
    setBacDaiHocToDelete(bacDaiHocId);
    setShowDeleteBacDaiHocConfirm(true);
  };

  // Add confirmDeleteBacDaiHoc to perform the actual deletion after confirmation
  const confirmDeleteBacDaiHoc = () => {
    if (!selectedChuyenNganhId || bacDaiHocToDelete === null) return;
    
    // Remove the bachelor degree from its specialized major
    const updatedBacDaiHocs = (bacDaiHocByChuyenNganh[selectedChuyenNganhId] || [])
      .filter(bd => bd.id !== bacDaiHocToDelete);
    
    setBacDaiHocByChuyenNganh({
      ...bacDaiHocByChuyenNganh,
      [selectedChuyenNganhId]: updatedBacDaiHocs
    });
    
    // Update the displayed bachelor degrees
    setCreatedBacDaiHocs(updatedBacDaiHocs);
    
    // Also remove all semesters and courses for this bachelor degree
    const updatedHocKyByBacDaiHoc = { ...hocKyByBacDaiHoc };
    delete updatedHocKyByBacDaiHoc[bacDaiHocToDelete];
    setHocKyByBacDaiHoc(updatedHocKyByBacDaiHoc);
    
    // Reset selections if the deleted one was selected
    if (selectedBacDaiHocId === bacDaiHocToDelete) {
      setSelectedBacDaiHocId(null);
      setConfirmedBacDaiHoc(null);
      setShowHocKyButton(false);
    }
    
    // Close the confirmation modal
    setBacDaiHocToDelete(null);
    setShowDeleteBacDaiHocConfirm(false);
    
    console.log(`Đã xóa bậc đại học có ID: ${bacDaiHocToDelete}`);
  };

  // Update the handler for the "Thêm môn học" button click
  const handleAddMonHocClick = (hocKyId: number) => {
    // Reset course data to initial state
    setMonHocData({
      id: 0,
      maMon: '',
      tenMon: '',
      soTinChi: 0
    });
    
    // Reset editing state
    setEditingMonHocId(null);
    setEditingHocKyId(null);
    
    // Clear any previous credit error
    setCreditError(null);
    
    // Toggle the form visibility for the selected semester
    setSelectedHocKyId(prevId => (prevId === hocKyId ? null : hocKyId));
  };

  return (
    <div className="nganh-management-container">
      <div className="nganh-management-controls">
        <div className="search-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={`Tìm kiếm theo ${searchFilter === 'tenNganh' ? 'tên ngành' : 'mã ngành'}`}
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
                  className={`filter-option ${searchFilter === 'tenNganh' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('tenNganh')}
                >
                  Tên ngành
                </button>
                <button 
                  className={`filter-option ${searchFilter === 'maNganh' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('maNganh')}
                >
                  Mã ngành
                </button>
              </div>
            </div>
            
            <div className="advanced-filters">
              <div className="sort-filter">
                <button 
                  className={`sort-button ${sortDirection !== 'none' ? 'active' : ''}`}
                  onClick={toggleSort}
                  title="Sắp xếp theo tên ngành"
                >
                  {sortDirection === 'asc' ? <FaSortAlphaDown /> : 
                   sortDirection === 'desc' ? <FaSortAlphaUp /> : 
                   <FaSortAlphaDown />} 
                  <span>A-Z</span>
                </button>
              </div>
              
              <div className="khoa-filter">
                <span className="filter-label">Khoa:</span>
                <div className="dropdown-container">
                  <Select
                    className="khoa-dropdown"
                    options={khoaOptions}
                    placeholder="Chọn khoa"
                    value={khoaOptions.find(option => option.value === khoanFilter)}
                    onChange={handleKhoaDropdownChange}
                    isClearable={false}
                    isSearchable={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="add-button" onClick={handleAddNganh}>
          <span>+</span> Thêm thông tin ngành
        </button>
      </div>

      <h2 className="nganh-title">Danh sách ngành</h2>

      <div className="nganh-table-container">
        <table className="nganh-table">
          <thead>
            <tr>
              <th className="id-col">STT</th>
              <th className="ma-nganh-col">Mã ngành</th>
              <th className="ten-nganh-col">Ngành</th>
              <th className="khoa-col">Khoa</th>
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {nganhHocList.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-results">Không có dữ liệu</td>
              </tr>
            ) : filteredAndSortedNganhHoc.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-results">Không tìm thấy kết quả phù hợp</td>
              </tr>
            ) : (
              // Update the row in the table to use FaEllipsisH icon
              filteredAndSortedNganhHoc.map((nganh) => (
                <tr key={nganh.id}>
                  <td>{nganh.id}</td>
                  <td>{nganh.maNganh}</td>
                  <td>{nganh.tenNganh}</td>
                  <td>{nganh.khoa}</td>
                  <td>
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleMenuOpen(e, nganh.id)}
                      aria-label="actions"
                    >
                      <FaEllipsisH />
                    </IconButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Major Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="create-nganh-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h2 className="modal-title">Tạo thông tin ngành học</h2>
              
              <div className="nganh-form">
                <div className="form-row">
                  <label htmlFor="maNganh">Mã ngành</label>
                  <input
                    type="text"
                    id="maNganh"
                    name="maNganh"
                    value={formData.maNganh}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-row">
                  <label htmlFor="tenNganh">Ngành</label>
                  <input
                    type="text"
                    id="tenNganh"
                    name="tenNganh"
                    value={formData.tenNganh}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-row">
                  <label htmlFor="khoa">Khoa</label>
                  <input
                    type="text"
                    id="khoa"
                    name="khoa"
                    value={formData.khoa}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Display the button to add specialized major when all form fields are filled */}
                {!showChuyenNganhForm && formData.maNganh && formData.tenNganh && formData.khoa && (
                  <div className="button-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <button className="chuyen-nganh-btn" onClick={handleAddChuyenNganh}>
                      Thêm Chuyên ngành
                    </button>
                  </div>
                )}

                {/* Display the specialized majors dropdown if any have been created */}
                {createdChuyenNganhs.length > 0 && (
                  <div className="chuyen-nganh-dropdown-container">
                    <label htmlFor="chuyenNganhDropdown">Chọn Chuyên ngành:</label>
                    <Select
                      id="chuyenNganhDropdown"
                      className="chuyen-nganh-dropdown"
                      value={selectedChuyenNganhId ? 
                        { value: selectedChuyenNganhId, label: createdChuyenNganhs.find(cn => cn.id === selectedChuyenNganhId)?.name || '' } : 
                        null
                      }
                      onChange={handleChuyenNganhSelectChange}
                      options={createdChuyenNganhs.map(cn => ({ value: cn.id, label: cn.name }))}
                      placeholder="Chọn chuyên ngành"
                      isClearable={false}
                    />
                  </div>
                )}

                {/* Specialized major form */}
                {showChuyenNganhForm && (
                  <div className="chuyen-nganh-form">
                    <div className="form-row">
                      <label htmlFor="tenChuyenNganh">Tên Chuyên ngành</label>
                      <input
                        type="text"
                        id="tenChuyenNganh"
                        name="tenChuyenNganh"
                        value={chuyenNganhName}
                        onChange={handleChuyenNganhNameChange}
                        placeholder="Nhập tên chuyên ngành"
                      />
                    </div>
                    
                    <div className="chuyen-nganh-actions">
                      <button 
                        className="confirm-btn" 
                        onClick={handleChuyenNganhConfirmOpen}
                        disabled={!chuyenNganhName.trim()}
                      >
                        Xác nhận
                      </button>
                      <button 
                        className="cancel-btn" 
                        onClick={handleChuyenNganhCancel}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Display the currently selected specialized major with edit/delete buttons */}
                {showBacDaiHocButton && confirmedChuyenNganh && selectedChuyenNganhId && (
                  <div className="added-chuyen-nganh">
                    <div className="chuyen-nganh-header">
                      <div className="chuyen-nganh-info">
                        <span className="chuyen-nganh-label">Chuyên ngành:</span>
                        <span className="chuyen-nganh-value">{confirmedChuyenNganh}</span>
                      </div>
                      <div className="chuyen-nganh-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditChuyenNganh(selectedChuyenNganhId)}
                        >
                          Sửa
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteChuyenNganh(selectedChuyenNganhId)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                    
                    {/* Always show the button to add bachelor degree */}
                    {!showBacDaiHocForm && (
                      <div className="button-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <button className="bac-dai-hoc-btn" onClick={handleAddBacDaiHoc}>
                          Thêm Bậc đại học
                        </button>
                      </div>
                    )}
                    
                    {/* Display the bachelor degrees dropdown if any have been created */}
                    {createdBacDaiHocs.length > 0 && (
                      <div className="bac-dai-hoc-dropdown-container">
                        <label htmlFor="bacDaiHocDropdown">Chọn Bậc đại học:</label>
                        <Select
                          id="bacDaiHocDropdown"
                          className="bac-dai-hoc-dropdown"
                          value={selectedBacDaiHocId ? 
                            { 
                              value: selectedBacDaiHocId, 
                              label: createdBacDaiHocs.find(bd => bd.id === selectedBacDaiHocId)?.ten || '' 
                            } : 
                            null
                          }
                          onChange={handleBacDaiHocSelectChange}
                          options={createdBacDaiHocs.map(bd => ({ 
                            value: bd.id, 
                            label: `${bd.ten} (${bd.soTinChi} tín chỉ)`
                          }))}
                          placeholder="Chọn bậc đại học"
                          isClearable={false}
                        />
                      </div>
                    )}
                    
                    {/* Bachelor Degree Form */}
                    {showBacDaiHocForm && (
                      <div className="bac-dai-hoc-form">
                        <div className="form-row">
                          <label htmlFor="ten">Tên bậc đại học</label>
                          <input
                            type="text"
                            id="ten"
                            name="ten"
                            value={bacDaiHocData.ten}
                            onChange={handleBacDaiHocInputChange}
                            placeholder="Nhập tên bậc đại học"
                          />
                        </div>
                        
                        <div className="form-row">
                          <label htmlFor="soTinChi">Số tín chỉ</label>
                          <input
                            type="number"
                            id="soTinChi"
                            name="soTinChi"
                            value={bacDaiHocData.soTinChi || ''}
                            onChange={handleBacDaiHocInputChange}
                            placeholder="Nhập số tín chỉ (>100)"
                          />
                        </div>
                        
                        {bacDaiHocData.soTinChi > 0 && bacDaiHocData.soTinChi <= 100 && (
                          <div className="validation-error">
                            Số tín chỉ phải lớn hơn 100
                          </div>
                        )}
                        
                        <div className="bac-dai-hoc-actions">
                          <button 
                            className="confirm-btn" 
                            onClick={handleBacDaiHocConfirmOpen}
                            disabled={!isBacDaiHocFormValid}
                          >
                            Xác nhận
                          </button>
                          <button 
                            className="cancel-btn" 
                            onClick={handleBacDaiHocCancel}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Display confirmed bachelor degree with edit/delete buttons */}
                    {confirmedBacDaiHoc && selectedBacDaiHocId && (
                      <div className="added-bac-dai-hoc">
                        <div className="bac-dai-hoc-header">
                          <div className="bac-dai-hoc-info">
                            <div className="info-row">
                              <span className="info-label">Bậc đại học:</span>
                              <span className="info-value">{confirmedBacDaiHoc.ten}</span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Số tín chỉ:</span>
                              <span className="info-value">{confirmedBacDaiHoc.soTinChi}</span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Đã sử dụng:</span>
                              <span className="info-value">{calculateTotalCredits(selectedBacDaiHocId, true)} tín chỉ</span>
                            </div>                            <div className="info-row">
                              <span className="info-label">Tổng tín chỉ:</span>
                              <span className="info-value">{confirmedBacDaiHoc.soTinChi}</span>
                            </div>
                          </div>
                          <div className="bac-dai-hoc-actions">
                            <button 
                              className="edit-btn"
                              onClick={() => handleEditBacDaiHoc(selectedBacDaiHocId)}
                            >
                              Sửa
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteBacDaiHoc(selectedBacDaiHocId)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                        
                        <div className="button-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                          <button className="hoc-ky-btn" onClick={handleAddHocKy}>
                            Thêm học kỳ
                          </button>
                        </div>
                        
                        {/* Display list of semesters */}
                        {hocKyByBacDaiHoc[selectedBacDaiHocId]?.map(hocKy => (
                          <div key={hocKy.id} className="hoc-ky-container">
                            <div className="hoc-ky-header">
                              <h3>{hocKy.name}</h3>
                              <div className="hoc-ky-actions">
                                <button 
                                  className="add-mon-hoc-btn"
                                  // Use the updated handler function here
                                  onClick={() => handleAddMonHocClick(hocKy.id)} 
                                >
                                  {selectedHocKyId === hocKy.id ? "Hủy thêm" : "Thêm môn học"}
                                </button>
                                <button 
                                  className="delete-btn"
                                  onClick={() => handleDeleteHocKy(hocKy.id)}
                                >
                                  Xóa học kỳ
                                </button>
                              </div>
                            </div>
                            
                            {/* Embedded course addition form - appears within the semester */}
                            {selectedHocKyId === hocKy.id && (
                              <div className="embedded-mon-hoc-form">
                                <div className="form-row">
                                  <label htmlFor="maMon">Mã môn học</label>
                                  <input
                                    type="text"
                                    id="maMon"
                                    name="maMon"
                                    value={monHocData.maMon}
                                    onChange={handleMonHocInputChange}
                                    placeholder="Nhập mã môn học"
                                  />
                                </div>
                                
                                <div className="form-row">
                                  <label htmlFor="tenMon">Tên môn học</label>
                                  <input
                                    type="text"
                                    id="tenMon"
                                    name="tenMon"
                                    value={monHocData.tenMon}
                                    onChange={handleMonHocInputChange}
                                    placeholder="Nhập tên môn học"
                                  />
                                </div>
                                
                                {/* Thêm trường Loại hình */}
                                <div className="form-row">
                                  <label htmlFor="loaiHinh">Loại hình</label>
                                  <input
                                    type="text"
                                    id="loaiHinh"
                                    name="loaiHinh"
                                    value={monHocData.loaiHinh || ''}
                                    onChange={handleMonHocInputChange}
                                    placeholder="Nhập loại hình"
                                  />
                                </div>
                                
                                <div className="form-row">
                                  <label htmlFor="soTinChi">Số tín chỉ</label>
                                  <input
                                    type="number"
                                    id="soTinChi"
                                    name="soTinChi"
                                    value={monHocData.soTinChi || ''}
                                    onChange={handleMonHocInputChange}
                                    placeholder="Nhập số tín chỉ"
                                  />
                                </div>
                                
                                <div className="form-row checkbox-row">
                                  <label htmlFor="isNonCumulative">
                                    <input
                                      type="checkbox"
                                      id="isNonCumulative"
                                      name="isNonCumulative"
                                      checked={monHocData.isNonCumulative || false}
                                      onChange={(e) => {
                                        setMonHocData(prev => ({
                                          ...prev,
                                          isNonCumulative: e.target.checked
                                        }));
                                      }}
                                    />
                                    <span className="checkbox-label">Không tính vào tín chỉ tích lũy</span>
                                  </label>
                                </div>
                                
                                {creditError && (
                                  <div className="validation-error">
                                    {creditError}
                                  </div>
                                )}
                                
                                <div className="form-actions">
                                  <button 
                                    className="confirm-btn" 
                                    onClick={() => {
                                      // Validation logic
                                      if (!isMonHocFormValid) return;
                                      
                                      // Calculate total credits, excluding non-cumulative courses
                                      const totalExistingCredits = calculateTotalCredits(selectedBacDaiHocId, true);
                                      
                                      // Only check credit limit if this is a cumulative course
                                      if (!monHocData.isNonCumulative) {
                                        const newTotalCredits = totalExistingCredits + monHocData.soTinChi;
                                        
                                        const bacDaiHoc = createdBacDaiHocs.find(b => b.id === selectedBacDaiHocId);
                                        if (!bacDaiHoc) return;
                                        
                                        if (newTotalCredits > bacDaiHoc.soTinChi) {
                                          setCreditError(`Tổng số tín chỉ (${newTotalCredits}) vượt quá giới hạn (${bacDaiHoc.soTinChi})`);
                                          return;
                                        }
                                      }
                                      
                                      // Add the course
                                      handleMonHocCreate();
                                    }}
                                    disabled={!isMonHocFormValid}
                                  >
                                    {editingMonHocId !== null ? "Cập nhật" : "Thêm"}
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            {/* Display courses in this semester */}
                            {hocKy.monHocList.length > 0 ? (
                              <div className="mon-hoc-list">
                                <table className="mon-hoc-table">
                                  <thead>
                                    <tr>
                                      <th>Mã môn học</th>
                                      <th>Tên môn học</th>
                                      <th>Loại hình</th> {/* Thêm cột loại hình */}
                                      <th>Số tín chỉ</th>
                                      <th>Thao tác</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {hocKy.monHocList.map(monHoc => (
                                      <tr key={monHoc.id} className={monHoc.isNonCumulative ? "non-cumulative-course" : ""}>
                                        <td>{monHoc.maMon}</td>
                                        <td>
                                          {monHoc.tenMon}
                                          {monHoc.isNonCumulative && (
                                            <span className="non-cumulative-badge">*</span>
                                          )}
                                        </td>
                                        <td>{monHoc.loaiHinh || '-'}</td> {/* Hiển thị loại hình */}
                                        <td>{monHoc.soTinChi}</td>
                                        <td className="action-buttons">
                                          <button 
                                            className="action-btn edit-btn"
                                            onClick={() => handleEditMonHoc(hocKy.id, monHoc)}
                                          >
                                            Sửa
                                          </button>
                                          <button 
                                            className="action-btn delete-btn"
                                            onClick={() => handleDeleteMonHoc(hocKy.id, monHoc.id)}
                                          >
                                            Xóa
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng tín chỉ:</td>
                                      <td colSpan={2} style={{ fontWeight: 'bold' }}>
                                        {hocKy.monHocList.reduce((sum, mh) => sum + mh.soTinChi, 0)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={3} style={{ textAlign: 'right' }}>Tích lũy:</td>
                                      <td colSpan={2}>
                                        {hocKy.monHocList.reduce((sum, mh) => mh.isNonCumulative ? sum : sum + mh.soTinChi, 0)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={3} style={{ textAlign: 'right' }}>Không tích lũy:</td>
                                      <td colSpan={2}>
                                        {hocKy.monHocList.reduce((sum, mh) => mh.isNonCumulative ? sum + mh.soTinChi : sum, 0)}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            ) : (
                              <div className="no-mon-hoc">Chưa có môn học nào</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button 
                  className="confirm-btn" 
                  onClick={() => setShowAddConfirm(true)}
                  disabled={!isAddNganhFormValid()}
                >
                  Xác nhận
                </button>
                <button className="cancel-btn" onClick={handleCloseAddModal}>
                  Hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add Confirmation Modal */}
      <AnimatePresence>
        {showAddConfirm && (
          <motion.div 
            className="confirmation-overlay"
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
              <h2 className="confirm-title">Bạn có xác nhận muốn tạo thông tin ngành không?</h2>
              
              <div className="confirm-actions">
                <button className="confirm-btn" onClick={handleConfirmAdd}>
                  Có
                </button>
                <button className="cancel-btn" onClick={() => setShowAddConfirm(false)}>
                  Không
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chuyên ngành Confirmation Modal */}
      <AnimatePresence>
        {showChuyenNganhConfirm && (
          <motion.div 
            className="confirmation-overlay"
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
              <h2 className="confirm-title">Bạn có muốn xác nhận tạo chuyên ngành?</h2>
              
              <div className="confirm-actions">
                <button className="confirm-btn" onClick={handleChuyenNganhCreate}>
                  Có
                </button>
                <button className="cancel-btn" onClick={handleChuyenNganhConfirmClose}>
                  Không
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bachelor Degree Confirmation Modal */}
      <AnimatePresence>
        {showBacDaiHocConfirm && (
          <motion.div 
            className="confirmation-overlay"
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
              <h2 className="confirm-title">Bạn có muốn xác nhận tạo bậc đại học?</h2>
              
              <div className="confirm-actions">
                <button className="confirm-btn" onClick={handleBacDaiHocCreate}>
                  Có
                </button>
                <button className="cancel-btn" onClick={handleBacDaiHocConfirmClose}>
                  Không
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chuyên ngành Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteChuyenNganhConfirm && (
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
              <h2 className="confirm-title">Bạn có chắc chắn muốn xóa chuyên ngành này?</h2>
              
              <div className="confirm-actions">
                <button className="confirm-btn" onClick={confirmDeleteChuyenNganh}>
                  Có
                </button>
                <button className="cancel-btn" onClick={() => setShowDeleteChuyenNganhConfirm(false)}>
                  Không
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bachelor Degree Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteBacDaiHocConfirm && (
          <motion.div 
            className="confirmation-overlay"
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
              <h2 className="confirm-title">Bạn có chắc chắn muốn xóa bậc đại học này?</h2>
              
              <div className="confirm-actions">
                <button className="confirm-btn" onClick={confirmDeleteBacDaiHoc}>
                  Có
                </button>
                <button className="cancel-btn" onClick={() => setShowDeleteBacDaiHocConfirm(false)}>
                  Không
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
  {showEditModal && (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="create-nganh-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <h2 className="modal-title">Chỉnh sửa thông tin ngành học</h2>
        
        <div className="nganh-form">
          <div className="form-row">
            <label htmlFor="maNganh">Mã ngành</label>
            <input
              type="text"
              id="maNganh"
              name="maNganh"
              value={formData.maNganh}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="tenNganh">Ngành</label>
            <input
              type="text"
              id="tenNganh"
              name="tenNganh"
              value={formData.tenNganh}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="khoa">Khoa</label>
            <input
              type="text"
              id="khoa"
              name="khoa"
              value={formData.khoa}
              onChange={handleInputChange}
            />
          </div>

          {/* Add the specialized majors dropdown right here */}
          {availableSpecializations.length > 1 && (
  <div className="specialized-major-dropdown-container">
    <label htmlFor="specializedMajorDropdown">Chọn Chuyên ngành:</label>
    <Select
      id="specializedMajorDropdown"
      className="specialized-major-dropdown"
      value={
        selectedSpecializationId
          ? { value: selectedSpecializationId, label: availableSpecializations.find(s => s.id === selectedSpecializationId)?.name || '' }
          : null
      }
      onChange={(option) => {
        if (!option) return;

        const newSpecializationId = option.value;
        setSelectedSpecializationId(newSpecializationId); // Update dropdown selection state

        // Find the major details for this newly selected specialization in the main store
        const detailsArray = majorDetailsDataStore[formData.maNganh] || [];
        const selectedDetails = detailsArray.find(d => d.id === newSpecializationId);

        if (selectedDetails) {
          // --- Case 1: Specialization exists in the store (already saved) ---
          // ... (code for loading existing data - remains the same) ...
          console.log("Loading existing specialization details from store:", newSpecializationId);
          setEditingMajorDetails(selectedDetails);
          setConfirmedChuyenNganh(selectedDetails.chuyenNganh);
          setSelectedChuyenNganhId(newSpecializationId);

          const bacDaiHocList = selectedDetails.bacDaoTaoList.map((bac, index) => ({
            id: bac.id || index + 1,
            ten: bac.tenBac,
            soTinChi: bac.tongTinChi
          }));
          setCreatedBacDaiHocs(bacDaiHocList);

          setBacDaiHocByChuyenNganh(prev => ({
              ...prev,
              [newSpecializationId]: bacDaiHocList
          }));

          const hocKyMapping: {[bacId: number]: HocKy[]} = {};
          let firstBacDaiHocId: number | null = null;
          selectedDetails.bacDaoTaoList.forEach((bac, index) => {
            const bacId = bac.id || index + 1;
            if (index === 0) firstBacDaiHocId = bacId;
            hocKyMapping[bacId] = bac.hocKyList || [];
          });
          setHocKyByBacDaiHoc(hocKyMapping); // Overwrite with stored data

          if (bacDaiHocList.length > 0 && firstBacDaiHocId !== null) {
            setSelectedBacDaiHocId(firstBacDaiHocId);
            setConfirmedBacDaiHoc({
              ten: bacDaiHocList[0].ten,
              soTinChi: bacDaiHocList[0].soTinChi
            });
            setShowHocKyButton(true);
          } else {
            setSelectedBacDaiHocId(null);
            setConfirmedBacDaiHoc(null);
            setShowHocKyButton(false);
          }
        } else {
          // --- Case 2: Specialization does NOT exist in the store (newly created in this session) ---
          console.log("Loading new specialization details from component state:", newSpecializationId);
          const specInfo = availableSpecializations.find(s => s.id === newSpecializationId);
          if (specInfo) {
              setConfirmedChuyenNganh(specInfo.name);
          } else {
              setConfirmedChuyenNganh('');
              console.error("Could not find name for new specialization ID:", newSpecializationId);
          }
          setSelectedChuyenNganhId(newSpecializationId);
          setEditingMajorDetails(null);

          // Load bachelor degrees from component state map
          const bacDaiHocList = bacDaiHocByChuyenNganh[newSpecializationId] || [];
          setCreatedBacDaiHocs(bacDaiHocList); // Update display/dropdown

          // *** FIX: Correctly handle semester data loading for the selected bachelor degree ***
          if (bacDaiHocList.length > 0) {
            const firstBacDaiHocId = bacDaiHocList[0].id; // Get the ID of the first bachelor degree
            setSelectedBacDaiHocId(firstBacDaiHocId);
            setConfirmedBacDaiHoc({
              ten: bacDaiHocList[0].ten,
              soTinChi: bacDaiHocList[0].soTinChi
            });
            setShowHocKyButton(true);

            // Ensure the hocKyByBacDaiHoc state has an entry for this bachelor degree ID.
            // If it doesn't exist (e.g., first time selecting after creation), initialize it.
            // This prevents carrying over data from another specialization's bachelor degree.
            if (!hocKyByBacDaiHoc[firstBacDaiHocId]) {
                 setHocKyByBacDaiHoc(prev => ({
                     ...prev,
                     [firstBacDaiHocId]: [] // Initialize if not present
                 }));
            }
            // No need to explicitly load semesters here, as they should be in hocKyByBacDaiHoc
            // if they were added. The key is ensuring the entry exists and isn't stale data.

          } else {
            // No bachelor degrees yet for this new specialization
            setSelectedBacDaiHocId(null);
            setConfirmedBacDaiHoc(null);
            setShowHocKyButton(false);
          }
        }
      }}
      options={availableSpecializations.map(s => ({ value: s.id, label: s.name }))}
      placeholder="Chọn chuyên ngành"
      isClearable={false}
    />
  </div>
)}
          
          {/* Hiển thị phần chuyên ngành nếu có */}
          {!showChuyenNganhForm && formData.maNganh && formData.tenNganh && formData.khoa && (
            <div className="button-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button className="chuyen-nganh-btn" onClick={handleAddChuyenNganh}>
                {confirmedChuyenNganh ? "Thêm Chuyên ngành" : "Thêm Chuyên ngành"}
              </button>
            </div>
          )}

          {/* Hiển thị form chuyên ngành */}
          {showChuyenNganhForm && (
            <div className="chuyen-nganh-form">
              <div className="form-row">
                <label htmlFor="tenChuyenNganh">Tên Chuyên ngành</label>
                <input
                  type="text"
                  id="tenChuyenNganh"
                  name="tenChuyenNganh"
                  value={chuyenNganhName}
                  onChange={handleChuyenNganhNameChange}
                  placeholder="Nhập tên chuyên ngành"
                />
              </div>
              
              <div className="chuyen-nganh-actions">
                <button 
                  className="confirm-btn" 
                  onClick={handleChuyenNganhConfirmOpen}
                  disabled={!chuyenNganhName.trim()}
                >
                  Xác nhận
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={handleChuyenNganhCancel}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
          
          {/* Hiển thị thông tin chuyên ngành */}
          {showBacDaiHocButton && confirmedChuyenNganh && selectedChuyenNganhId && (
            <div className="added-chuyen-nganh">
              <div className="chuyen-nganh-header">
                <div className="chuyen-nganh-info">
                  <span className="chuyen-nganh-label">Chuyên ngành:</span>
                  <span className="chuyen-nganh-value">{confirmedChuyenNganh}</span>
                </div>
                <div className="chuyen-nganh-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditChuyenNganh(selectedChuyenNganhId)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteChuyenNganh(selectedChuyenNganhId)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
              
              {/* Button thêm bậc đại học */}
              {!showBacDaiHocForm && (
                <div className="button-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <button className="bac-dai-hoc-btn" onClick={handleAddBacDaiHoc}>
                    {createdBacDaiHocs.length > 0 ? "Thêm Bậc đại học" : "Thêm Bậc đại học"}
                  </button>
                </div>
              )}
              
              {/* Dropdown chọn bậc đại học */}
              {createdBacDaiHocs.length > 0 && (
                <div className="bac-dai-hoc-dropdown-container">
                  <label htmlFor="bacDaiHocDropdown">Chọn Bậc đại học:</label>
                  <Select
                    id="bacDaiHocDropdown"
                    className="bac-dai-hoc-dropdown"
                    value={selectedBacDaiHocId ? 
                      { 
                        value: selectedBacDaiHocId, 
                        label: createdBacDaiHocs.find(bd => bd.id === selectedBacDaiHocId)?.ten || '' 
                      } : 
                      null
                    }
                    onChange={handleBacDaiHocSelectChange}
                    options={createdBacDaiHocs.map(bd => ({ 
                      value: bd.id, 
                      label: `${bd.ten} (${bd.soTinChi} tín chỉ)`
                    }))}
                    placeholder="Chọn bậc đại học"
                    isClearable={false}
                  />
                </div>
              )}
              
              {/* Form thêm/chỉnh sửa bậc đại học */}
              {showBacDaiHocForm && (
                <div className="bac-dai-hoc-form">
                  <div className="form-row">
                    <label htmlFor="ten">Tên bậc đại học</label>
                    <input
                      type="text"
                      id="ten"
                      name="ten"
                      value={bacDaiHocData.ten}
                      onChange={handleBacDaiHocInputChange}
                      placeholder="Nhập tên bậc đại học"
                    />
                  </div>
                  
                  <div className="form-row">
                    <label htmlFor="soTinChi">Số tín chỉ</label>
                    <input
                      type="number"
                      id="soTinChi"
                      name="soTinChi"
                      value={bacDaiHocData.soTinChi || ''}
                      onChange={handleBacDaiHocInputChange}
                      placeholder="Nhập số tín chỉ (>100)"
                    />
                  </div>
                  
                  {bacDaiHocData.soTinChi > 0 && bacDaiHocData.soTinChi <= 100 && (
                    <div className="validation-error">
                      Số tín chỉ phải lớn hơn 100
                    </div>
                  )}
                  
                  <div className="bac-dai-hoc-actions">
                    <button 
                      className="confirm-btn" 
                      onClick={handleBacDaiHocConfirmOpen}
                      disabled={!isBacDaiHocFormValid}
                    >
                      Xác nhận
                    </button>
                    <button 
                      className="cancel-btn" 
                      onClick={handleBacDaiHocCancel}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
              
              {/* Hiển thị thông tin bậc đại học đã chọn */}
              {confirmedBacDaiHoc && selectedBacDaiHocId && (
                <div className="added-bac-dai-hoc">
                  <div className="bac-dai-hoc-header">
                    <div className="bac-dai-hoc-info">
                      <div className="info-row">
                        <span className="info-label">Bậc đại học:</span>
                        <span className="info-value">{confirmedBacDaiHoc.ten}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Số tín chỉ:</span>
                        <span className="info-value">{confirmedBacDaiHoc.soTinChi}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Đã sử dụng:</span>
                        <span className="info-value">{calculateTotalCredits(selectedBacDaiHocId, true)} tín chỉ</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Tổng tín chỉ:</span>
                        <span className="info-value">{confirmedBacDaiHoc.soTinChi}</span>
                      </div>
                    </div>
                    <div className="bac-dai-hoc-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditBacDaiHoc(selectedBacDaiHocId)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteBacDaiHoc(selectedBacDaiHocId)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="button-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <button className="hoc-ky-btn" onClick={handleAddHocKy}>
                      Thêm học kỳ
                    </button>
                  </div>
                  
                  {/* Hiển thị danh sách học kỳ */}
                  {hocKyByBacDaiHoc[selectedBacDaiHocId]?.map(hocKy => (
                    <div key={hocKy.id} className="hoc-ky-container">
                      <div className="hoc-ky-header">
                        <h3>{hocKy.name}</h3>
                        <div className="hoc-ky-actions">
                          <button 
                            className="add-mon-hoc-btn"
                            onClick={() => handleAddMonHocClick(hocKy.id)} 
                          >
                            {selectedHocKyId === hocKy.id ? "Hủy thêm" : "Thêm môn học"}
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteHocKy(hocKy.id)}
                          >
                            Xóa học kỳ
                          </button>
                        </div>
                      </div>
                      
                      {/* Form thêm/chỉnh sửa môn học */}
                      {selectedHocKyId === hocKy.id && (
                        <div className="embedded-mon-hoc-form">
                          <div className="form-row">
                            <label htmlFor="maMon">Mã môn học</label>
                            <input
                              type="text"
                              id="maMon"
                              name="maMon"
                              value={monHocData.maMon}
                              onChange={handleMonHocInputChange}
                              placeholder="Nhập mã môn học"
                            />
                          </div>
                          
                          <div className="form-row">
                            <label htmlFor="tenMon">Tên môn học</label>
                            <input
                              type="text"
                              id="tenMon"
                              name="tenMon"
                              value={monHocData.tenMon}
                              onChange={handleMonHocInputChange}
                              placeholder="Nhập tên môn học"
                            />
                          </div>
                          
                          <div className="form-row">
                            <label htmlFor="loaiHinh">Loại hình</label>
                            <input
                              type="text"
                              id="loaiHinh"
                              name="loaiHinh"
                              value={monHocData.loaiHinh || ''}
                              onChange={handleMonHocInputChange}
                              placeholder="Nhập loại hình"
                            />
                          </div>
                          
                          <div className="form-row">
                            <label htmlFor="soTinChi">Số tín chỉ</label>
                            <input
                              type="number"
                              id="soTinChi"
                              name="soTinChi"
                              value={monHocData.soTinChi || ''}
                              onChange={handleMonHocInputChange}
                              placeholder="Nhập số tín chỉ"
                            />
                          </div>
                          
                          <div className="form-row checkbox-row">
                            <label htmlFor="isNonCumulative">
                              <input
                                type="checkbox"
                                id="isNonCumulative"
                                name="isNonCumulative"
                                checked={monHocData.isNonCumulative || false}
                                onChange={(e) => {
                                  setMonHocData(prev => ({
                                    ...prev,
                                    isNonCumulative: e.target.checked
                                  }));
                                }}
                              />
                              <span className="checkbox-label">Không tính vào tín chỉ tích lũy</span>
                            </label>
                          </div>
                          
                          {creditError && (
                            <div className="validation-error">
                              {creditError}
                            </div>
                          )}
                          
                          <div className="form-actions">
                            <button 
                              className="confirm-btn" 
                              onClick={handleMonHocCreate}
                              disabled={!isMonHocFormValid}
                            >
                              {editingMonHocId !== null ? "Cập nhật" : "Thêm"}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Hiển thị danh sách môn học trong học kỳ */}
                      {hocKy.monHocList.length > 0 ? (
                        <div className="mon-hoc-list">
                          <table className="mon-hoc-table">
                            <thead>
                              <tr>
                                <th>Mã môn học</th>
                                <th>Tên môn học</th>
                                <th>Loại hình</th>
                                <th>Số tín chỉ</th>
                                <th>Thao tác</th>
                              </tr>
                            </thead>
                            <tbody>
                              {hocKy.monHocList.map(monHoc => (
                                <tr key={monHoc.id} className={monHoc.isNonCumulative ? "non-cumulative-course" : ""}>
                                  <td>{monHoc.maMon}</td>
                                  <td>
                                    {monHoc.tenMon}
                                    {monHoc.isNonCumulative && (
                                      <span className="non-cumulative-badge">*</span>
                                    )}
                                  </td>
                                  <td>{monHoc.loaiHinh || '-'}</td>
                                  <td>{monHoc.soTinChi}</td>
                                  <td className="action-buttons">
                                    <button 
                                      className="action-btn edit-btn"
                                      onClick={() => handleEditMonHoc(hocKy.id, monHoc)}
                                    >
                                      Sửa
                                    </button>
                                    <button 
                                      className="action-btn delete-btn"
                                      onClick={() => handleDeleteMonHoc(hocKy.id, monHoc.id)}
                                    >
                                      Xóa
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng tín chỉ:</td>
                                <td colSpan={2} style={{ fontWeight: 'bold' }}>
                                  {hocKy.monHocList.reduce((sum, mh) => sum + mh.soTinChi, 0)}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={3} style={{ textAlign: 'right' }}>Tích lũy:</td>
                                <td colSpan={2}>
                                  {hocKy.monHocList.reduce((sum, mh) => mh.isNonCumulative ? sum : sum + mh.soTinChi, 0)}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={3} style={{ textAlign: 'right' }}>Không tích lũy:</td>
                                <td colSpan={2}>
                                  {hocKy.monHocList.reduce((sum, mh) => mh.isNonCumulative ? sum + mh.soTinChi : sum, 0)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      ) : (
                        <div className="no-mon-hoc">Chưa có môn học nào</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="modal-actions">
          <button 
            className="confirm-btn" 
            onClick={() => setShowEditConfirm(true)}
            disabled={!isAddNganhFormValid()}
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
      className="confirmation-overlay"
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
        <h2 className="confirm-title">Bạn có xác nhận muốn lưu những thay đổi không?</h2>
        
        <div className="confirm-actions">
          <button className="confirm-btn" onClick={handleConfirmEdit}>
            Có
          </button>
          <button className="cancel-btn" onClick={() => setShowEditConfirm(false)}>
            Không
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
      </AnimatePresence>
      <AnimatePresence>
      {showDeleteConfirm && (
  <motion.div 
    className="confirmation-overlay"
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
      <h2 className="confirm-title">Bạn có chắc chắn muốn xóa ngành học này?</h2>
      
      <div className="confirm-actions" style={{ justifyContent: 'space-between', gap: '20px' }}>
        <button className="confirm-btn" onClick={confirmDeleteNganh}>
          Có
        </button>
        <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
          Không
        </button>
      </div>
    </motion.div>
  </motion.div>
)}
      </AnimatePresence>

      {/* Add this dropdown menu component right before the modals */}
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
        <MenuItem onClick={handleViewNganh}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem thông tin</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditNganh}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa thông tin</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteNganh} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Xóa thông tin</ListItemText>
        </MenuItem>
      </Menu>

      {/* Add this modal to your render method */}
      {showViewModal && (
        <ViewMajorModal 
          isOpen={showViewModal} 
          onClose={() => {
            setShowViewModal(false);
            setCurrentMajorData(null); // Reset khi đóng
            setCurrentMajorDetails(null); // Reset khi đóng
          }} 
          majorData={currentMajorData} 
          majorDetails={currentMajorDetails} // <-- Truyền dữ liệu chi tiết
        />
      )}
    </div>
  );
};

export default QuanLyMonHoc;