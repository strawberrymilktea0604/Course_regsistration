import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import TrangChuScreen from '../screens/TrangChu';
import ThongTinCaNhan from '../screens/ThongTinCaNhan';
import ChuongTrinhKhung from '../screens/ChuongTrinhKhung';
import DangKyHocPhan from '../screens/DangKyHocPhan';
import DanhSachMonHocdangky from '../screens/DanhSachMonHocdangky';
import Calendar from '../screens/Calendar';
import ThongBao from '../screens/ThongBao';
import ThongTinLop from '../screens/ThongTinLop'; 
import ThongTinGiangVien from '../screens/ThongTinGiangVien'; // Import ThongTinGiangVien

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tạo một Stack Navigator cho tab Trang chủ và các màn hình con của nó
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrangChuScreen" component={TrangChuScreen} />
      <Stack.Screen name="ChuongTrinhKhung" component={ChuongTrinhKhung} />
      <Stack.Screen name="DangKyHocPhan" component={DangKyHocPhan} />
      <Stack.Screen name="DanhSachMonHocdangky" component={DanhSachMonHocdangky} />
      <Stack.Screen name="Calendar" component={Calendar} />
      <Stack.Screen name="ThongBao" component={ThongBao} />
      <Stack.Screen name="ThongTinLop" component={ThongTinLop} />
      <Stack.Screen name="ThongTinGiangVien" component={ThongTinGiangVien} />
    </Stack.Navigator>
  );
};

// New stack for ThongTinCaNhan
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ThongTinCaNhan} />
      <Stack.Screen name="ThongBao" component={ThongBao} />
      <Stack.Screen name="ThongTinGiangVien" component={ThongTinGiangVien} />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'TrangChuTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'ThongTinCaNhanTab') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Icon name={iconName || 'person-outline'} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0066CC',
          tabBarInactiveTintColor: '#666',
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 14,
            paddingBottom: 8,
          },
        };
      }}
    >
      <Tab.Screen 
        name="TrangChuTab" 
        component={HomeStack} 
        options={({ route }) => ({
          title: 'Trang chủ',
          // Ẩn tabBar khi ở các màn hình con
          tabBarStyle: (() => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'TrangChuScreen';
            if (routeName === 'ChuongTrinhKhung' || routeName === 'DangKyHocPhan' || 
                routeName === 'DanhSachMonHocdangky' || routeName === 'Calendar' || 
                routeName === 'ThongBao' || routeName === 'ThongTinLop' || 
                routeName === 'ThongTinGiangVien') { // Thêm ThongTinGiangVien
              return { display: 'none' };
            }
            return {
              height: 60,
              backgroundColor: '#fff',
              borderTopWidth: 0,
              position: 'absolute',
              bottom: 20,
              left: 40,
              right: 40,
              borderRadius: 35,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            };
          })(),
        })}
      />
      <Tab.Screen 
        name="ThongTinCaNhanTab" 
        component={ProfileStack} 
        options={({ route }) => ({
          title: 'Thông tin cá nhân',
          // Ẩn tabBar khi ở màn hình ThongBao và ThongTinGiangVien
          tabBarStyle: (() => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'ProfileScreen';
            if (routeName === 'ThongBao' || routeName === 'ThongTinGiangVien') {
              return { display: 'none' };
            }
            return {
              height: 60,
              backgroundColor: '#fff',
              borderTopWidth: 0,
              position: 'absolute',
              bottom: 20,
              left: 40,
              right: 40,
              borderRadius: 35,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            };
          })(),
        })}
      />
    </Tab.Navigator>
  );
};

export default Navigation;