import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ThongBao = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFilterPress = () => {
    console.log('Filter button pressed');
  };

  // Mock data for notifications
  const notifications = [
    {
      id: '1',
      title: 'Thông báo hủy lớp học kỳ III năm học 2024-2025 (Thông báo lần 2)',
      date: '04/04/2025',
      source: 'Đại học Xây dựng Hà Nội',
    },
    {
      id: '2',
      title: 'Thông báo Về việc tổ chức khóa học tiếng Anh tăng cường cho sinh viên từ K62 đến K69 hệ đại học chính quy thi Chuẩn đầu ra ngoại ngữ',
      date: '04/04/2025',
      source: 'Đại học Xây dựng Hà Nội',
    },
    {
      id: '3',
      title: 'Thông báo hủy lớp môn học học kỳ III năm học 2024-2025',
      date: '02/04/2025',
      source: 'Đại học Xây dựng Hà Nội',
    },

    {
        id: '4',
        title: 'Kết quả thi đánh giá trình độ tiếng Anh tháng 3.2025 ',
        date: '31/03/2025',
        source: 'Đại học Xây dựng Hà Nội',
      },

      {
        id: '5',
        title: 'Thông báo về việc triển khai công tác lấy ý kiến phản hồi của người học về hoạt động giảng dạy học phần Block I học kỳ 2 năm học 2024-2025',
        date: '25/03/2025',
        source: 'Đại học Xây dựng Hà Nội',
      },
  ];

  const renderNotification = ({ item }: { item: typeof notifications[0] }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.sourceText}>{item.source}</Text>
      <Text style={styles.dateText}>{item.date}</Text>
      <Text style={styles.titleText}>{item.title}</Text>
      <TouchableOpacity>
        <Text style={styles.detailLink}>Chi tiết</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity onPress={handleFilterPress} style={styles.iconButton}>
          <Icon name="filter" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationList}
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
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  notificationList: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sourceText: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailLink: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: 'bold',
  },
});

export default ThongBao;