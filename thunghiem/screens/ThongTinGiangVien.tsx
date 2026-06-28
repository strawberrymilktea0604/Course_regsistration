import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Cần cài đặt thư viện này: expo install @expo/vector-icons
import { StackNavigationProp } from '@react-navigation/stack';

// Định nghĩa kiểu cho Navigation
type RootStackParamList = {
  ThongBao: undefined;
  ThongTinGiangVien: { instructorId: string; instructorName: string };
  // Thêm các màn hình khác nếu cần
};

type ThongTinGiangVienNavigationProp = StackNavigationProp<RootStackParamList, 'ThongTinGiangVien'>;

interface Props {
  navigation: ThongTinGiangVienNavigationProp;
  route: any;
}

const ThongTinGiangVien = ({ navigation, route }: Props) => {
  // Thông tin giảng viên
  const instructor = {
    name: 'Lê Văn Minh',
    degree: 'Kỹ sư',
    id: '01011003',
    phone: '0342 999 591',
    email: 'minhlv2@huce.edu.vn',
    avatar: require('../assets/avatar1.png'), // Đường dẫn ảnh đại diện
  };

  // Xử lý khi nhấn nút thông báo
  const handleNotificationPress = () => {
    navigation.navigate('ThongBao');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin giảng viên</Text>
        <TouchableOpacity onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Nội dung chính */}
      <View style={styles.content}>
        <View style={styles.card}>
          {/* Avatar và thông tin cơ bản trong layout ngang */}
          <View style={styles.profileSection}>
            {/* Ảnh đại diện */}
            <Image source={instructor.avatar} style={styles.avatar} />

            {/* Thông tin bên phải avatar */}
            <View style={styles.basicInfo}>
              <View style={styles.infoRowTop}>
                <Text style={styles.labelTop}>Họ tên:</Text>
                <Text style={styles.valueTop}>{instructor.name}</Text>
              </View>
              <View style={styles.infoRowTop}>
                <Text style={styles.labelTop}>Học vấn:</Text>
                <Text style={styles.valueTop}>{instructor.degree}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Thông tin bổ sung */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mã giảng viên:</Text>
              <Text style={styles.value}>{instructor.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Số điện thoại:</Text>
              <Text style={styles.value}>{instructor.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{instructor.email}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Styles không thay đổi...
const styles = StyleSheet.create({
  // ... giữ nguyên các styles hiện tại
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0066CC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40, // Điều chỉnh padding top cho status bar
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    paddingTop: 30, // Giảm xuống để thông tin lên cao hơn
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileSection: {
    flexDirection: 'row', // Layout ngang cho avatar và thông tin cơ bản
    marginBottom: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 16,
  },
  basicInfo: {
    flex: 1,
    justifyContent: 'center', // Căn giữa thông tin theo chiều dọc
  },
  infoContainer: {
    width: '100%',
  },
  // Style riêng cho phần trên (bên cạnh avatar)
  infoRowTop: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  labelTop: {
    fontSize: 16,
    color: '#777', // Nhạt hơn
    fontWeight: '400',
    width: 80, // Độ rộng nhỏ hơn cho phần bên cạnh avatar
    marginRight: 4,
  },
  valueTop: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Đậm hơn
    flex: 1,
  },
  // Style cho phần thông tin chính bên dưới
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    paddingLeft: 2, // Thêm padding để thẳng hàng với các mục khác
  },
  label: {
    fontSize: 16,
    color: '#777', // Nhạt hơn
    fontWeight: '400',
    width: 120, // Tăng độ rộng để chứa các label dài như "Mã giảng viên:"
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Đậm hơn
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
    width: '100%',
  },
});

export default ThongTinGiangVien;