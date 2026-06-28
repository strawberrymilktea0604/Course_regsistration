import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Navigation Type Definitions
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  'Trang Chủ': undefined;
  'Đăng Ký': undefined;
  'Lịch Học': undefined;
  'Đăng Ký Môn': undefined;
  'Cá Nhân': undefined;
};

export type HomeStackParamList = {
  TrangChuMain: undefined;
  ThongBao: undefined;
  ThongTinLop: {
    subjectCode?: string;
    subjectName?: string;
    room?: string;
    teacher?: string;
    startTime?: string;
    endTime?: string;
  };
  ThongTinGiangVien: {
    teacherId?: string;
    teacherName?: string;
  };
};

export type RegistrationStackParamList = {
  DangKyHocPhanMain: undefined;
  DangKyHocPhanTest: undefined;
  ChuongTrinhKhung: undefined;
  ThongTinLop: {
    subjectCode?: string;
    subjectName?: string;
    room?: string;
    teacher?: string;
    startTime?: string;
    endTime?: string;
  };
  ThongTinGiangVien: {
    teacherId?: string;
    teacherName?: string;
  };
};

export type ScheduleStackParamList = {
  Calendar: undefined;
  ThongTinLop: {
    subjectCode?: string;
    subjectName?: string;
    room?: string;
    teacher?: string;
    startTime?: string;
    endTime?: string;
  };
  ThongTinGiangVien: {
    teacherId?: string;
    teacherName?: string;
  };
  ThongBao: undefined;
};

export type CoursesStackParamList = {
  DanhSachMonHocdangky: undefined;
  ThongTinLop: {
    subjectCode?: string;
    subjectName?: string;
    room?: string;
    teacher?: string;
    startTime?: string;
    endTime?: string;
  };
  ThongTinGiangVien: {
    teacherId?: string;
    teacherName?: string;
  };
  ThongBao: undefined;
};

export type ProfileStackParamList = {
  ThongTinCaNhanMain: undefined;
  ThongBao: undefined;
};

// Import screens
import LoginScreen from '../screens/LoginScreen';
import LoadingScreen from '../screens/LoadingScreen';
import TrangChu from '../screens/TrangChu';
import DangKyHocPhan from '../screens/DangKyHocPhan';
import DanhSachMonHocdangky from '../screens/DanhSachMonHocdangky';
import ThongTinCaNhan from '../screens/ThongTinCaNhan';
import ChuongTrinhKhung from '../screens/ChuongTrinhKhung';
import Calendar from '../screens/Calendar';
import ThongBao from '../screens/ThongBao';
import ThongTinLop from '../screens/ThongTinLop';
import ThongTinGiangVien from '../screens/ThongTinGiangVien';

// Import auth context
import { useAuth } from '../src/api/context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigation for authenticated users
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Trang Chủ') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Đăng Ký') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'Lịch Học') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Đăng Ký Môn') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Cá Nhân') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Trang Chủ" 
        component={HomeStackNavigator} 
      />
      <Tab.Screen 
        name="Đăng Ký" 
        component={RegistrationStackNavigator} 
      />
      <Tab.Screen 
        name="Lịch Học" 
        component={ScheduleStackNavigator}
        options={{ title: 'Lịch Học' }} 
      />
      <Tab.Screen 
        name="Đăng Ký Môn" 
        component={CoursesStackNavigator}
        options={{ title: 'Đăng Ký Môn' }} 
      />
      <Tab.Screen 
        name="Cá Nhân" 
        component={ProfileStackNavigator} 
      />
    </Tab.Navigator>
  );
};

// Stack navigator for home flow
const HomeStack = createNativeStackNavigator();
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen 
        name="TrangChuMain" 
        component={TrangChu} 
      />
      <HomeStack.Screen 
        name="ThongBao" 
        component={ThongBao} 
      />
      <HomeStack.Screen 
        name="ThongTinLop" 
        component={ThongTinLop} 
      />
      <HomeStack.Screen 
        name="ThongTinGiangVien" 
        component={ThongTinGiangVien} 
      />
    </HomeStack.Navigator>
  );
};

// Stack navigator for registration flow
const RegistrationStack = createNativeStackNavigator();
const RegistrationStackNavigator = () => {
  return (
    <RegistrationStack.Navigator screenOptions={{ headerShown: false }}>
      <RegistrationStack.Screen 
        name="DangKyHocPhanMain" 
        component={DangKyHocPhan} 
      />
      <RegistrationStack.Screen 
        name="ChuongTrinhKhung" 
        component={ChuongTrinhKhung}
      />
      <RegistrationStack.Screen 
        name="ThongTinLop" 
        component={ThongTinLop} 
      />
      <RegistrationStack.Screen 
        name="ThongTinGiangVien" 
        component={ThongTinGiangVien} 
      />
    </RegistrationStack.Navigator>
  );
};

// Stack navigator for schedule/calendar flow (only calendar now)
const ScheduleStack = createNativeStackNavigator();
const ScheduleStackNavigator = () => {
  return (
    <ScheduleStack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="Calendar"
    >
      <ScheduleStack.Screen 
        name="Calendar" 
        component={Calendar} 
      />
      <ScheduleStack.Screen 
        name="ThongTinLop" 
        component={ThongTinLop} 
      />
      <ScheduleStack.Screen 
        name="ThongTinGiangVien" 
        component={ThongTinGiangVien} 
      />
      <ScheduleStack.Screen 
        name="ThongBao" 
        component={ThongBao} 
      />
    </ScheduleStack.Navigator>
  );
};

// Stack navigator for registered courses flow
const CoursesStack = createNativeStackNavigator();
const CoursesStackNavigator = () => {
  return (
    <CoursesStack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="DanhSachMonHocdangky"
    >
      <CoursesStack.Screen 
        name="DanhSachMonHocdangky" 
        component={DanhSachMonHocdangky} 
      />
      <CoursesStack.Screen 
        name="ThongTinLop" 
        component={ThongTinLop} 
      />
      <CoursesStack.Screen 
        name="ThongTinGiangVien" 
        component={ThongTinGiangVien} 
      />
      <CoursesStack.Screen 
        name="ThongBao" 
        component={ThongBao} 
      />
    </CoursesStack.Navigator>
  );
};

// Stack navigator for profile flow
const ProfileStack = createNativeStackNavigator();
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen 
        name="ThongTinCaNhanMain" 
        component={ThongTinCaNhan} 
      />
      <ProfileStack.Screen 
        name="ThongBao" 
        component={ThongBao} 
      />
    </ProfileStack.Navigator>
  );
};

// Main navigation container that handles auth state
const Navigation = () => {
  const { isLoggedIn, isLoading } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        // User is logged in - show the main app
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
      ) : (
        // User is not logged in - show the login screen
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default Navigation;