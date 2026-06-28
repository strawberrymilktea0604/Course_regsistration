import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarStrip from 'react-native-calendar-strip';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

// Định nghĩa kiểu dữ liệu cho navigation
type RootStackParamList = {
  TrangChu: undefined;
  ChuongTrinhKhung: undefined;
  DangKyHocPhan: undefined; // Thêm màn hình DangKyHocPhan
  DanhSachMonHocdangky: undefined; // Add this line
  Calendar: undefined; // Add this line for the Calendar screen
  ThongBao: undefined; // Add this line for ThongBao screen
};

type NavigationProps = NavigationProp<RootStackParamList>;

// Định nghĩa lại interface CalendarStripProps
interface CalendarStripProps {
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  calendarColor?: string;
  startingDate?: Date;
  selectedDate?: Date;
  onDateSelected?: (date: Date) => void;
  showMonth?: boolean;
  showDayName?: boolean;
  showDayNumber?: boolean;
  scrollable?: boolean;
  iconContainer?: StyleProp<ViewStyle>;
  calendarHeaderStyle?: StyleProp<ViewStyle>;
  calendarHeaderFormat?: string;
  dateNameStyle?: StyleProp<TextStyle>;
  dateNumberStyle?: StyleProp<TextStyle>;
  highlightDateNameStyle?: StyleProp<TextStyle>;
  highlightDateNumberStyle?: StyleProp<TextStyle>;
  styleWeekend?: boolean;
  daySelectionAnimation?: {
    type: string;
    duration?: number;
    borderWidth?: number;
    borderHighlightColor?: string;
    highlightColor?: string;
    animType?: string;
    animUpdateType?: string;
    animProperty?: string;
    animSpringDamping?: number;
  };
  customDatesStyles?: Array<{
    startDate: Date;
    dateContainerStyle?: StyleProp<ViewStyle>;
    dateNameStyle?: StyleProp<TextStyle>;
    dateNumberStyle?: StyleProp<TextStyle>;
  }>;
  dayComponentHeight?: number;
  upperCaseDays?: boolean;
  shouldAllowFontScaling?: boolean;
  useIsoWeekday?: boolean;
  minDate?: Date;
  maxDate?: Date;
  onWeekChanged?: (start: Date) => void;
  locale?: {
    name: string;
    config: {
      dayNames: string[];
      dayNamesShort: string[];
      monthNames: string[];
      monthNamesShort: string[];
    };
  };
  disabledDateNameStyle?: StyleProp<TextStyle>;
  disabledDateNumberStyle?: StyleProp<TextStyle>;
}

// Thêm hàm tính toán ngày bắt đầu tuần
const getWeekStartDate = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // Lấy thứ trong tuần (0: CN, 1: T2, ...)
  const diff = d.getDate() - day; // Tính ngày đầu tuần (CN)
  return new Date(d.setDate(diff));
};

const TrangChu = () => {
  // Lấy navigation object
  const navigation = useNavigation<NavigationProps>();

  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [startingDate, setStartingDate] = React.useState(() => getWeekStartDate(new Date())); // Khởi tạo startingDate là Chủ nhật của tuần hiện tại
  
  // Mảng tên ngày đầy đủ để hiển thị ở header
  const fullDayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  // Hàm format ngày tháng cho header
  const formatHeaderDate = (date: Date) => {
    const dayName = fullDayNames[date.getDay()];
    return `${dayName}, ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
  };

  // Mock data cho user
  const userData = {
    name: "Lâ Minh Khánh",
    studentId: "4004267",
    class: "67CS1"
  };

  // Mock data cho thời khóa biểu theo ngày
  const schedulesByDate: { [key: string]: any[] } = {
    '2025-03-21': [
      {
        startTime: '09:25',
        endTime: '11:50',
        subjectCode: '608811',
        subjectName: 'Xử lý ngôn ngữ tự nhiên',
        room: 'H3.56',
        teacher: 'Nguyễn Đình Quý',
      },
    ],
    // Có thể thêm các ngày khác nếu cần
  };

  const renderSchedule = () => {
    const selectedDateKey = selectedDate.toLocaleDateString('en-CA'); // Format ngày thành yyyy-MM-dd
    const schedules = schedulesByDate[selectedDateKey] || []; // Lấy lịch học theo ngày
  
    if (schedules.length === 0) {
      return (
        <Text style={styles.noScheduleText}>Không có lịch học</Text>
      );
    }
  
    return schedules.map((schedule, index) => (
      <View key={index} style={styles.scheduleCard}>
        <View style={styles.timeColumn}>
          <Text style={styles.timeText}>{schedule.startTime}</Text>
          <Text style={styles.timeText}>{schedule.endTime}</Text>
        </View>
        <View style={styles.scheduleContent}>
          <Text style={styles.subjectText}>
            {schedule.subjectCode} - {schedule.subjectName}
          </Text>
          <View style={styles.scheduleDetail}>
            <Text style={styles.detailText}>
              Sáng thứ sáu, {schedule.startTime} - {schedule.endTime}, {schedule.room}
            </Text>
          </View>
          <View style={styles.scheduleDetail}>
            <Text style={styles.detailText}>
              Giảng viên: {schedule.teacher}
            </Text>
          </View>
        </View>
      </View>
    ));
  };

  // Hàm xử lý khi chọn ngày mới
  const handleDateSelected = (date: Date) => {
    const newDate = new Date(date);
    setSelectedDate(newDate);
  };

  // Thêm hàm getCustomDatesStyles vào trong component TrangChu
  const getCustomDatesStyles = () => {
    const styles = [];
    
    // Thêm style cho các ngày có lịch học (chữ màu xanh)
    Object.keys(schedulesByDate).forEach(dateKey => {
      const scheduleDate = new Date(dateKey);
      
      // Chỉ đánh dấu màu xanh cho ngày có lịch học nếu không phải ngày đang chọn
      if (selectedDate.toLocaleDateString('en-CA') !== dateKey) {
        styles.push({
          startDate: scheduleDate,
          dateNameStyle: { color: '#0066CC' }, // Tên ngày màu xanh
          dateNumberStyle: { color: '#0066CC' }, // Số ngày màu xanh
        });
      }
    });
    
    // Thêm style cho ngày được chọn (sau cùng để có độ ưu tiên cao nhất)
    styles.push({
      startDate: selectedDate,
      dateContainerStyle: {
        backgroundColor: '#0066CC',
        borderRadius: 25,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
      },
      dateNameStyle: { color: '#fff' }, // Tên ngày màu trắng
      dateNumberStyle: { color: '#fff' }, // Số ngày màu trắng
    });
    
    return styles;
  };

  // Hàm xử lý chuyển đến màn hình chương trình khung
  const navigateToChuongTrinhKhung = () => {
    navigation.navigate('ChuongTrinhKhung');
  };

  // Hàm xử lý chuyển đến màn hình đăng ký học phần
  const navigateToDangKyHocPhan = () => {
    navigation.navigate('DangKyHocPhan');
  };

  // Hàm xử lý chuyển đến màn hình danh sách môn học đã đăng ký
  const navigateToDanhSachMonHocdangky = () => {
    navigation.navigate('DanhSachMonHocdangky');
  };

  // Hàm xử lý chuyển đến màn hình thời khóa biểu
  const navigateToCalendar = () => {
    navigation.navigate('Calendar');
  };

  // Hàm xử lý chuyển đến màn hình thông báo
  const navigateToThongBao = () => {
    navigation.navigate('ThongBao');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo}
            />
          </View>
          <Text style={styles.headerTitle}>Welcome to HUCE</Text>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={navigateToThongBao}
          >
            <Icon 
              name="notifications-outline"
              size={28} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.whiteSpace} />
      </View>

      {/* Nội dung có thể scroll */}
      <ScrollView 
        style={[styles.scrollContent, { paddingTop: 20 }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Icon name="person-outline" size={30} color="#fff" />
          </View>
          <View style={styles.userTextContainer}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userIdSeparator}>|</Text>
              <Text style={styles.userId}>{userData.studentId}</Text>
            </View>
            <Text style={styles.userClass}>{userData.class}</Text>
          </View>
        </View>

        {/* Calendar và Schedule */}
        <View style={styles.calendarContainer}>
          <Text style={styles.dateHeader}>
            {formatHeaderDate(selectedDate)}
          </Text>
          
          <CalendarStrip
            style={styles.calendar}
            calendarColor={'white'}
            calendarHeaderStyle={styles.calendarHeader}
            dateNumberStyle={styles.dateNumber}
            dateNameStyle={styles.dateName}
            highlightDateNumberStyle={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold'
            }}
            highlightDateNameStyle={{
              color: '#fff',
              fontSize: 12,
              fontWeight: 'bold'
            }}
            disabledDateNameStyle={styles.disabledDateName}
            disabledDateNumberStyle={styles.disabledDateNumber}
            iconContainer={{ flex: 0.1 }}
            selectedDate={selectedDate}
            startingDate={startingDate} // Đồng bộ startingDate
            onDateSelected={handleDateSelected} // Gọi hàm xử lý khi chọn ngày
            shouldAllowFontScaling={false} // Thêm thuộc tính này
            useIsoWeekday={false} // Đảm bảo tuần bắt đầu từ Chủ nhật
            minDate={new Date(2020, 1, 1)}
            maxDate={new Date(2025, 12, 31)}
            onWeekChanged={(start) => {
              // Khi tuần thay đổi do người dùng vuốt, cập nhật startingDate
              setStartingDate(new Date(start));
            }}
            locale={{
              name: 'vi',
              config: {
                dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
                dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                monthNamesShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 
                             'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12']
              }
            }}
            customDatesStyles={getCustomDatesStyles()}
          />
          <View style={styles.divider} />
          {renderSchedule()}
        </View>

        {/* Feature Grid */}
        <View style={styles.featureGrid}>
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={navigateToCalendar}
              >
                <Icon name="calendar-outline" size={60} color="#0066CC" />
              </TouchableOpacity>
              <Text style={styles.featureText}>Thời khóa biểu</Text>
            </View>
            <View style={styles.featureItem}>
              {/* Thêm onPress vào button này */}
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={navigateToChuongTrinhKhung}
              >
                <Icon name="book" size={60} color="#0066CC" />
              </TouchableOpacity>
              <Text style={styles.featureText}>Chương trình khung</Text>
            </View>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={navigateToDangKyHocPhan}
              >
                <Icon name="create" size={60} color="#0066CC" />
              </TouchableOpacity>
              <Text style={styles.featureText}>Đăng ký học phần</Text>
            </View>
            <View style={styles.featureItem}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={navigateToDanhSachMonHocdangky}
              >
                <Icon name="list" size={60} color="#0066CC" />
              </TouchableOpacity>
              <Text style={styles.featureText}>Danh sách môn học {"\n"} đã đăng ký</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0066CC',
    paddingTop: 40, // Cho status bar
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Căn giữa các phần tử
    paddingHorizontal: 16,
    paddingBottom: 16,
    height: 100, // Điều chỉnh chiều cao header
  },
  logoContainer: {
    position: 'absolute',
    left: 16,
    bottom: -30, // Tăng từ -20 lên -30 để logo thò ra nhiều hơn
    zIndex: 1,
  },
  logo: {
    width: 80,  // Tăng kích thước logo nếu cần
    height: 80,
    resizeMode: 'contain',
    backgroundColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    bottom: -20,
  },
  notificationButton: {
    position: 'absolute',
    right: 16,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 15,
  },
  whiteSpace: {
    height: 30,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingTop: 25,
    marginTop: -15,
    width: '100%',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 15,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  userIdSeparator: {
    marginHorizontal: 8,
    color: '#666',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userId: {
    fontSize: 18,
    color: '#666',
  },
  userClass: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  calendarContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateHeader: {
    fontSize: 20,
    color: '#666',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  timeColumn: {
    marginRight: 16,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  scheduleContent: {
    flex: 1,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  scheduleDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  featureGrid: {
    padding: 16,
    marginTop: 10,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureItem: {
    width: '48%',
    alignItems: 'center',
  },
  iconButton: {
    width: 100,  // Button nhỏ hơn
    height: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 8,
  },
  featureText: {
    textAlign: 'center',
    color: '#0066CC',
    fontSize: 13,
    fontWeight: '400',
    marginTop: 4,
  },
  bottomPadding: {
    height: 80, // Điều chỉnh theo chiều cao của tab bar
  },
  calendar: {
    height: 100,
    paddingVertical: 10,
  },
  calendarHeader: {
    color: '#000',
    fontSize: 14,
  },
  dateNumber: {
    color: '#666',
    fontSize: 16,
  },
  dateName: {
    color: '#666',
    fontSize: 12,
  },
  disabledDateName: {
    color: '#ccc',
    fontSize: 12,
  },
  disabledDateNumber: {
    color: '#ccc',
    fontSize: 16,
  },
  noScheduleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default TrangChu;
