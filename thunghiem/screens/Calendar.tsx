import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarStrip from 'react-native-calendar-strip';

// Define the navigation param list type
type RootStackParamList = {
  TrangChuScreen: undefined;
  Calendar: undefined;
  ThongBao: undefined;
  ThongTinLop: {
    subjectCode: string;
    subjectName: string;
    room: string;
    teacher: string;
    startTime: string;
    endTime: string;
  };
  // Add other screens as needed
};

// Define the navigation prop type for this screen
type CalendarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Calendar'>;

// Thêm hàm tính toán ngày bắt đầu tuần
const getWeekStartDate = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // Lấy thứ trong tuần (0: CN, 1: T2, ...)
  const diff = d.getDate() - day; // Tính ngày đầu tuần (CN)
  return new Date(d.setDate(diff));
};

const Calendar = () => {
  // Use the correct navigation type
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const today = new Date(); // Create a single instance of today's date
  const [selectedDate, setSelectedDate] = useState(today);
  const [startingDate, setStartingDate] = useState(() => getWeekStartDate(today));
  
  // Use effect to ensure calendar resets to today when mounting
  useEffect(() => {
    // Make sure the calendar starts with today as the selected date
    setSelectedDate(today);
    setStartingDate(getWeekStartDate(today));
  }, []);
  
  // Mảng tên ngày đầy đủ để hiển thị ở header
  const fullDayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  // Hàm format ngày tháng cho header
  const formatHeaderDate = (date: Date) => {
    const dayName = fullDayNames[date.getDay()];
    return `${dayName}, ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
  };

  // Hàm xử lý khi chọn ngày mới
  const handleDateSelected = (date: Date) => {
    const newDate = new Date(date);
    setSelectedDate(newDate);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Add this function inside the Calendar component
  const navigateToThongBao = () => {
    navigation.navigate('ThongBao');
  };

  // Add this function inside the Calendar component after the navigateToThongBao function
  const navigateToThongTinLop = (subject: any) => {
    navigation.navigate('ThongTinLop', {
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      room: subject.room,
      teacher: subject.teacher,
      startTime: subject.startTime,
      endTime: subject.endTime
    });
  };

  // Mock data cho thời khóa biểu theo ngày
  const schedulesByDate: { [key: string]: any[] } = {
    '2025-04-08': [
      {
        startTime: '06:45',
        endTime: '09:10',
        subjectCode: '60881101',
        subjectName: 'Xử lý ngôn ngữ tự nhiên',
        room: 'H3.56',
        teacher: 'Nguyễn Đình Quý',
      },
      {
        startTime: '09:25',
        endTime: '11:50',
        subjectCode: '60881901',
        subjectName: 'Đồ án Phát triển ứng dụng đa nền tảng',
        room: '109.H1',
        teacher: 'Hoàng Nam Thắng, Lê Văn Minh',
      },
    ],
    '2025-04-09': [
      {
        startTime: '06:45',
        endTime: '09:10',
        subjectCode: '60882001',
        subjectName: 'Phát triển ứng dụng phía máy chủ',
        room: 'H3.54',
        teacher: 'Hoàng Nam Thắng, Lê Văn Minh',
      },
      {
        startTime: '09:25',
        endTime: '11:50',
        subjectCode: '60881501',
        subjectName: 'Đồ án Thị giác máy tính',
        room: '109.H1',
        teacher: 'Thái Thị Nguyệt',
      },
    ],
    // Add other dates from your existing calendar implementation
    '2025-04-10': [
      {
        startTime: '06:45',
        endTime: '09:10',
        subjectCode: '60881601',
        subjectName: 'Khai phá dữ liệu',
        room: 'H3.54',
        teacher: 'Nguyễn Đức Thịnh',
      },
    ],
    '2025-04-11': [
      {
        startTime: '09:25',
        endTime: '11:50',
        subjectCode: '60881101',
        subjectName: 'Xử lý ngôn ngữ tự nhiên',
        room: 'H3.56',
        teacher: 'Nguyễn Đình Quý',
      },
    ],
  };

  const getCustomDatesStyles = () => {
    const styles: { startDate: Date; dateNameStyle: { color: string; }; dateNumberStyle: { color: string; fontWeight: string; }; }[] = [];
    
    // Thêm style cho các ngày có lịch học (chữ màu xanh)
    Object.keys(schedulesByDate).forEach(dateKey => {
      styles.push({
        startDate: new Date(dateKey),
        dateNameStyle: { color: '#0066CC' },
        dateNumberStyle: { color: '#0066CC', fontWeight: 'bold' },
      });
    });
    
    return styles;
  };

  // Update the renderSchedule function to make the schedule items clickable
  const renderSchedule = () => {
    // Format date as YYYY-MM-DD directly without timezone issues
    const selectedDateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    console.log("Looking for schedule on date:", selectedDateKey); // Debug output
    const schedules = schedulesByDate[selectedDateKey] || [];
  
    if (schedules.length === 0) {
      return (
        <Text style={styles.noScheduleText}>Không có lịch học</Text>
      );
    }
  
    return schedules.map((schedule, index) => (
      <TouchableOpacity 
        key={index} 
        style={[styles.scheduleItem, index % 2 === 1 ? styles.greenScheduleItem : {}]}
        onPress={() => {
          // If the subject is "Phát triển ứng dụng phía máy chủ", navigate to ThongTinLop
          if (schedule.subjectName === 'Phát triển ứng dụng phía máy chủ') {
            navigateToThongTinLop(schedule);
          }
        }}
      >
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{schedule.startTime}</Text>
          <Text style={styles.timeSeparator}>|</Text>
          <Text style={styles.timeText}>{schedule.endTime}</Text>
        </View>
        <View style={styles.eventContainer}>
          <Text style={styles.eventTitle}>{schedule.subjectCode}-{schedule.subjectName}</Text>
          <View style={styles.eventDetails}>
            <View style={styles.blueEventDot} />
            <Text style={styles.eventInfo}>Sáng: {schedule.startTime} - {schedule.endTime}, {schedule.room}</Text>
          </View>
          <View style={styles.eventDetails}>
            <View style={styles.blueEventDot} />
            <Text style={styles.eventInfo}>Giảng viên: {schedule.teacher}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thời khóa biểu</Text>
        <TouchableOpacity 
          style={styles.notificationButton} 
          onPress={navigateToThongBao}
        >
          <Icon name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Calendar Content */}
      <ScrollView style={styles.calendarContent}>
        {/* Date Header */}
        <Text style={styles.dateHeader}>
          {formatHeaderDate(selectedDate)}
        </Text>
        
        {/* Calendar Strip */}
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
          startingDate={startingDate}
          onDateSelected={handleDateSelected}
          shouldAllowFontScaling={false}
          useIsoWeekday={false}
          minDate={new Date(2020, 1, 1)}
          maxDate={new Date(2025, 12, 31)}
          onWeekChanged={(start) => {
            setStartingDate(new Date(start));
          }}
          daySelectionAnimation={{
            type: 'background',
            duration: 200,
            highlightColor: '#0066CC',
            animType: 'timing',
            animUpdateType: 'frame',
            animProperty: 'backgroundColor',
            animSpringDamping: 0.7
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
        
        {/* Schedule Items */}
        <View style={styles.scheduleContainer}>
          {renderSchedule()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0066CC',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 40, // For status bar
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  notificationButton: {
    padding: 8,
  },
  calendarContent: {
    flex: 1,
    padding: 16,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  calendar: {
    height: 100,
    marginBottom: 10,
    paddingBottom: 10,
  },
  calendarHeader: {
    color: '#000',
    fontSize: 14,
  },
  dateNumber: {
    fontSize: 14,
    color: '#333',
  },
  dateName: {
    fontSize: 12,
    color: '#666',
  },
  disabledDateName: {
    color: '#ccc',
  },
  disabledDateNumber: {
    color: '#ccc',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  noScheduleText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 30,
  },
  scheduleContainer: {
    flex: 1,
    marginTop: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  greenScheduleItem: {
    backgroundColor: '#f0fff0', // Light green background
  },
  timeContainer: {
    marginRight: 15,
    minWidth: 50,
    alignItems: 'center',
  },
  timeText: {
    color: '#666',
    fontSize: 15,
  },
  timeSeparator: {
    color: '#666',
    fontSize: 15,
    marginVertical: 2,
  },
  eventContainer: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventInfo: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  blueEventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0066cc',
    marginHorizontal: 1,
  },
});

export default Calendar;