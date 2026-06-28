import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Define the navigation param list type
type RootStackParamList = {
  ThongBao: undefined;
  ThongTinLop: undefined;
  Calendar: undefined;
  ThongTinGiangVien: { instructorId: string; instructorName: string };
  // Add other screens as needed
};

const ThongTinLop = () => {
  // Properly typed navigation
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleBackPress = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  const handleNotificationPress = () => {
    navigation.navigate('ThongBao'); // Now TypeScript won't complain
  };

  // Xử lý khi nhấn vào tên giảng viên
  const handleInstructorPress = (instructorId: string, instructorName: string) => {
    // Chỉ điều hướng khi tên giảng viên là "Lê Văn Minh"
    if (instructorName === 'Lê Văn Minh') {
      navigation.navigate('ThongTinGiangVien', { 
        instructorId, 
        instructorName 
      });
    } else {
      // Có thể hiển thị thông báo hoặc không làm gì cả
      // Alert.alert('Thông báo', 'Chức năng đang được phát triển');
      // Hoặc không làm gì
    }
  };

  // Mock data for the class list
  const students = [
    { id: '1', name: 'Nguyễn Phúc An', studentId: '0207867' },
    { id: '2', name: 'Mai Phạm Lan Anh', studentId: '0263367' },
    { id: '3', name: 'Nguyễn Diệu Anh', studentId: '0267067' },
    { id: '4', name: 'Nguyễn Duy Anh', studentId: '0042067' },
    { id: '5', name: 'Nguyễn Thế Anh', studentId: '0042267' },
    { id: '6', name: 'Trịnh Quỳnh Anh', studentId: '0279367' },
    { id: '7', name: 'Văn Đức Anh', studentId: '0279567' },
    { id: '8', name: 'Lê Bảo Chung', studentId: '0131467' },
    { id: '9', name: 'Nguyễn Hải Cường', studentId: '0174067' },
    { id: '10', name: 'Lê Quốc Đạt', studentId: '0216567' },
    { id: '11', name: 'Nguyễn Văn Đông', studentId: '0225167' },
    { id: '12', name: 'Đỗ Văn Dũng', studentId: '0300467' },
    { id: '13', name: 'Tô Tiến Dũng', studentId: '0300567' },
  ];

  const renderStudentItem = ({ item }: { item: { name: string; studentId: string } }) => (
    <View style={styles.studentItem}>
      <Image source={require('../assets/avatar.png')} style={styles.avatar} />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentId}>MSSV: {item.studentId}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with notification button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin lớp học</Text>
        <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
          <Icon name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={students}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListHeaderComponent={
          <View>
            {/* Subject Information */}
            <View style={styles.card}>
              <Text style={styles.subjectTitle}>608820 - Phát triển ứng dụng phía máy chủ</Text>
              <View style={styles.divider} />

              {/* Class Details */}
              <Text style={styles.detailText}>
                <Text style={styles.label}>Mã lớp: </Text>60882001
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Loại hình: </Text>Lý thuyết
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Kỳ: </Text>HK2 2024 - 2025
              </Text>

              {/* Instructors */}
              <Text style={styles.detailText}>
                <Text style={styles.label}>GVHD: </Text>
                <TouchableOpacity onPress={() => handleInstructorPress('001', 'Hoàng Nam Thắng')} style={styles.inlineButton}>
                  <Text style={styles.link}>Hoàng Nam Thắng</Text>
                </TouchableOpacity>
                <Text>, </Text>
                <TouchableOpacity onPress={() => handleInstructorPress('002', 'Lê Văn Minh')} style={styles.inlineButton}>
                  <Text style={styles.link}>Lê Văn Minh</Text>
                </TouchableOpacity>
              </Text>

              {/* Student Count */}
              <Text style={styles.detailText}>
                <Text style={styles.label}>Số sinh viên: </Text>60
              </Text>

              <View style={styles.divider} />

              {/* Schedule */}
              <Text style={styles.scheduleText}>
                <Text style={styles.bold}>Tiết 1-3 </Text>
                <Text style={styles.bold}>Sáng thứ Hai</Text> H3.56{'\n'}
                Ngày: 17/03/2025 đến 05/05/2025
              </Text>
              <Text style={styles.scheduleText}>
                <Text style={styles.bold}>Tiết 1-3 </Text>
                <Text style={styles.bold}>Sáng thứ Tư</Text> H3.54{'\n'}
                Ngày: 19/03/2025 đến 07/05/2025
              </Text>
              <Text style={styles.scheduleText}>
                <Text style={styles.bold}>Tiết 1-3 </Text>
                <Text style={styles.bold}>Sáng thứ Sáu</Text> H3.56{'\n'}
                Ngày: 02/05/2025
              </Text>
            </View>

            {/* Class List Title */}
            <Text style={styles.classListTitle}>Danh sách lớp (60)</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 16, // Add margin to match ScrollView style
    marginTop: 16,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  link: {
    color: '#0066CC',
    textDecorationLine: 'underline',
  },
  scheduleText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  classListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginLeft: 16, // Dịch tiêu đề sang bên phải
    marginTop: 16, // Hạ tiêu đề xuống một chút
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16, // Add padding to the sides
    backgroundColor: '#fff', // Add background color for better contrast
    borderRadius: 8, // Add rounded corners
    marginHorizontal: 16, // Add margin to the sides
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#0066CC',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  studentId: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 16, // Add padding to the bottom of the list
  },
  inlineButton: {
    // Button without background that works inline with text
    marginHorizontal: 0,
    padding: 0,
  },
});

export default ThongTinLop;