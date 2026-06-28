import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation param list type
type RootStackParamList = {
  TrangChuScreen: undefined;
  DanhSachMonHocdangky: undefined;
  ThongBao: undefined;
  // Add other screens as needed
};

// Define the navigation prop type for this screen
type DanhSachMonHocdangkyNavigationProp = StackNavigationProp<RootStackParamList, 'DanhSachMonHocdangky'>;

// Component Header riêng biệt
interface HeaderProps {
  title: string;
  onBackPress: () => void;
  onNotificationPress: () => void;
}

const Header = ({ title, onBackPress, onNotificationPress }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
        <Icon name="notifications-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

  // Màn hình chính DanhSachMonHocdangky
const DanhSachMonHocdangky = () => {
  // Use typed navigation
  const navigation = useNavigation<DanhSachMonHocdangkyNavigationProp>();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('HK2 2024 - 2025');

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Update this function to navigate to ThongBao screen
  const handleNotificationPress = () => {
    navigation.navigate('ThongBao');
  };

  const handleSemesterSelect = (semester: string) => {
    setSelectedSemester(semester);
    setDropdownVisible(false);
  };

  interface CourseItem {
    stt: number;
    maLHP: string;
    tenMH: string;
    lop: string;
    soTC: number;
    hocPhi: string;
    trangThaiDK: string;
    ngayDK: string;
    trangThaiLHP: string;
  }

  const courseData: CourseItem[] = [
    { stt: 1, maLHP: '60881901', tenMH: 'Đồ án Phát triển ứng dụng đa nền tảng', lop: '67CS1', soTC: 1, hocPhi: '465,000', trangThaiDK: 'Đăng ký mới', ngayDK: '01/12/2024', trangThaiLHP: 'Đã khóa' },
    { stt: 2, maLHP: '60881501', tenMH: 'Đồ án Thị giác máy tính', lop: '67CS1', soTC: 1, hocPhi: '465,000', trangThaiDK: 'Đăng ký mới', ngayDK: '01/12/2024', trangThaiLHP: 'Đã khóa' },
    { stt: 3, maLHP: '60881601', tenMH: 'Khai phá dữ liệu', lop: '67CS1', soTC: 3, hocPhi: '1,395,000', trangThaiDK: 'Đăng ký mới', ngayDK: '01/12/2024', trangThaiLHP: 'Đã khóa' },
    { stt: 4, maLHP: '60881801', tenMH: 'Phát triển ứng dụng đa nền tảng', lop: '67CS1', soTC: 3, hocPhi: '1,395,000', trangThaiDK: 'Đăng ký mới', ngayDK: '01/12/2024', trangThaiLHP: 'Đã khóa' },
    { stt: 5, maLHP: '60882001', tenMH: 'Phát triển ứng dụng phía máy chủ', lop: '67CS1', soTC: 3, hocPhi: '1,395,000', trangThaiDK: 'Đăng ký mới', ngayDK: '01/12/2024', trangThaiLHP: 'Đã khóa' },
    { stt: 6, maLHP: '60881401', tenMH: 'Thị giác máy tính', lop: '67CS1', soTC: 3, hocPhi: '1,395,000', trangThaiDK: 'Đăng ký mới', ngayDK: '01/12/2024', trangThaiLHP: 'Đã khóa' },
    { stt: 7, maLHP: '60881101', tenMH: 'Xử lý ngôn ngữ tự nhiên', lop: '67CS1', soTC: 3, hocPhi: '1,395,000', trangThaiDK: 'Đăng ký mới', ngayDK: '01/12/2024', trangThaiLHP: 'Đã khóa' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Danh sách môn học đã đăng ký"
        onBackPress={handleBackPress}
        onNotificationPress={handleNotificationPress}
      />

      {/* Dropdown Selector */}
      <View style={styles.semesterSelector}>
        <TouchableOpacity
          onPress={() => setDropdownVisible(!isDropdownVisible)} // Toggle dropdown
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}
        >
          <Text style={styles.semesterText}>{selectedSemester}</Text>
          <Icon name={isDropdownVisible ? 'chevron-up' : 'chevron-down'} size={24} color="#000" />
        </TouchableOpacity>

        {isDropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              onPress={() => {
                setSelectedSemester('HK1 2024 - 2025');
                setDropdownVisible(false); // Close dropdown
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownText}>HK1 2024 - 2025</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedSemester('HK2 2024 - 2025');
                setDropdownVisible(false); // Close dropdown
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownText}>HK2 2024 - 2025</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Nút In */}
      <TouchableOpacity style={styles.printButton}>
        <Icon name="print" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Phần bảng danh sách môn học */}
      {selectedSemester === 'HK2 2024 - 2025' ? (
        <View style={styles.tableContainer}>
          {/* Thêm ScrollView ngang để xử lý khi bảng quá rộng */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: '100%' }}>
              {/* Header của bảng */}
              <View style={styles.tableHeader}>
                <View style={[styles.headerCell, { width: 60 }]}>
                  <Text style={styles.headerCellText}>Thao tác</Text>
                </View>
                <View style={[styles.headerCell, { width: 50 }]}>
                  <Text style={styles.headerCellText}>STT</Text>
                </View>
                <View style={[styles.headerCell, { width: 100 }]}>
                  <Text style={styles.headerCellText}>Mã LHP</Text>
                </View>
                <View style={[styles.headerCell, { width: 200 }]}>
                  <Text style={styles.headerCellText}>Tên môn học</Text>
                </View>
                <View style={[styles.headerCell, { width: 100 }]}>
                  <Text style={styles.headerCellText}>Lớp</Text>
                </View>
                <View style={[styles.headerCell, { width: 60 }]}>
                  <Text style={styles.headerCellText}>Số TC</Text>
                </View>
                <View style={[styles.headerCell, { width: 80 }]}>
                  <Text style={styles.headerCellText}>Nhóm TH</Text>
                </View>
                <View style={[styles.headerCell, { width: 100 }]}>
                  <Text style={styles.headerCellText}>Học phí</Text>
                </View>
                <View style={[styles.headerCell, { width: 100 }]}>
                  <Text style={styles.headerCellText}>Hạn nộp</Text>
                </View>
                <View style={[styles.headerCell, { width: 60 }]}>
                  <Text style={styles.headerCellText}>Thu</Text>
                </View>
                <View style={[styles.headerCell, { width: 100 }]}>
                  <Text style={styles.headerCellText}>Trạng thái ĐK</Text>
                </View>
                <View style={[styles.headerCell, { width: 100 }]}>
                  <Text style={styles.headerCellText}>Ngày ĐK</Text>
                </View>
                <View style={[styles.headerCell, { width: 100 }]}>
                  <Text style={styles.headerCellText}>Trạng thái LHP</Text>
                </View>
              </View>

              {/* Body của bảng */}
              <FlatList
                data={courseData}
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      styles.tableRow,
                      { backgroundColor: index % 2 === 0 ? '#F9F9F9' : '#FFFFFF' },
                    ]}
                  >
                    {/* Cột Thao tác */}
                    <TouchableOpacity
                      style={[styles.tableCell, { width: 60 }]}
                      onPress={() => console.log(`Thao tác với môn học: ${item.tenMH}`)}
                    >
                      <Icon name="ellipsis-horizontal" size={20} color="#0066CC" />
                    </TouchableOpacity>

                    <Text style={[styles.tableCell, styles.centerText, { width: 50 }]}>{item.stt}</Text>
                    <Text style={[styles.tableCell, { width: 100 }]}>{item.maLHP}</Text>
                    <Text style={[styles.tableCell, styles.leftText, { width: 200 }]} numberOfLines={2}>{item.tenMH}</Text>
                    <Text style={[styles.tableCell, { width: 100 }]}>{item.lop}</Text>
                    <Text style={[styles.tableCell, styles.centerText, { width: 60 }]}>{item.soTC}</Text>
                    <Text style={[styles.tableCell, styles.centerText, { width: 80 }]}>-</Text>
                    <Text style={[styles.tableCell, styles.rightText, { width: 100 }]}>{item.hocPhi}</Text>
                    <Text style={[styles.tableCell, styles.centerText, { width: 100 }]}>-</Text>
                    <Text style={[styles.tableCell, styles.centerText, { width: 60 }]}>✔</Text>
                    <Text style={[styles.tableCell, { width: 100 }]}>{item.trangThaiDK}</Text>
                    <Text style={[styles.tableCell, { width: 100 }]}>{item.ngayDK}</Text>
                    <Text style={[styles.tableCell, { width: 100 }]}>{item.trangThaiLHP}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.stt.toString()}
              />
            </View>
          </ScrollView>
        </View>
      ) : (
        // Hiển thị thông báo khi chọn học kỳ khác
        <View style={styles.emptyStateContainer}>
          <Icon name="document-text-outline" size={60} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>Không có dữ liệu cho học kỳ này</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: '#0066CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  notificationButton: {
    padding: 8,
  },
  semesterSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  semesterText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 50, // Điều chỉnh vị trí dropdown
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  tableContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0066CC',
  },
  headerCell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.3)',
  },
  headerCellText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableCell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    justifyContent: 'center',
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  leftText: {
    textAlign: 'left',
  },
  rightText: {
    textAlign: 'right',
  },
  printButton: {
    backgroundColor: '#0066CC',
    width: 60,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end', // Đặt nút sang bên phải
    marginTop: 16,
    marginRight: 16, // Thêm khoảng cách với cạnh phải
  },
  printButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default DanhSachMonHocdangky;