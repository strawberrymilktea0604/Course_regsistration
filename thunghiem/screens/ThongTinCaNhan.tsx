import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation param list type
export type RootStackParamList = {
  TrangChuScreen: undefined;
  ThongTinCaNhan: undefined;
  ThongBao: undefined;
  TrangChuTab: { screen: string };
  // Add other screens as needed
};

// Define the navigation prop type for this screen
type ThongTinCaNhanNavigationProp = StackNavigationProp<RootStackParamList, 'ThongTinCaNhan'>;

const ThongTinCaNhan = () => {
  const navigation = useNavigation<ThongTinCaNhanNavigationProp>();
  
  // Updated navigation function - simplified to navigate within the same stack
  const navigateToThongBao = () => {
    navigation.navigate('ThongBao');
  };
  
  // Mock data
  const userInfo = {
    name: "Lâ Minh Khánh",
    birthDate: "06/04/2004",
    studentId: "4004267",
    educationType: "Chính quy - CDIO",
    phone: "085 742 9352",
    email: "4004267@st.huce.edu.vn",
    level: "Đại học-B7",
    faculty: "Công nghệ thông tin",
    major: "Khoa học máy tính",
    specialization: "Khoa học máy tính",
    class: "67CS1"
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
          <Text style={styles.headerTitle}>Thông tin sinh viên</Text>
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

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          {/* Avatar section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Icon name="person-outline" size={40} color="#666" />
            </View>
            <View style={styles.nameSection}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Họ tên: </Text>
                <Text style={styles.boldValue}>{userInfo.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Ngày sinh: </Text>
                <Text style={styles.boldValue}>{userInfo.birthDate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mã sinh viên: </Text>
              <Text style={styles.boldValue}>{userInfo.studentId}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Loại hình đào tạo: </Text>
              <Text style={styles.boldValue}>{userInfo.educationType}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Số điện thoại: </Text>
              <Text style={styles.boldValue}>{userInfo.phone}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email: </Text>
              <Text style={styles.boldValue}>{userInfo.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Hệ: </Text>
              <Text style={styles.boldValue}>{userInfo.level}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Khoa: </Text>
              <Text style={styles.boldValue}>{userInfo.faculty}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Ngành: </Text>
              <Text style={styles.boldValue}>{userInfo.major}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Chuyên ngành: </Text>
              <Text style={styles.boldValue}>{userInfo.specialization}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Lớp: </Text>
              <Text style={styles.boldValue}>{userInfo.class}</Text>
            </View>
          </View>
        </View>
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
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    height: 100,
  },
  logoContainer: {
    position: 'absolute',
    left: 16,
    bottom: -30,
    zIndex: 1,
  },
  logo: {
    width: 80,
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
  content: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatarSection: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameSection: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  infoList: {
    padding: 16,
    paddingTop: 0,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  boldValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
});

export default ThongTinCaNhan;
