import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator, 
  Platform,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { useAuth } from '../src/api/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { API_URL } from '../src/api/config/api-config';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      console.log('Attempting login with:', { username, apiUrl: API_URL });
      // Always use 'student' role for mobile app users
      await login(username, password, 'student');
      // Navigation will be handled by the AuthNavigator based on isLoggedIn state
    } catch (error: any) {
      console.error('Login error:', error);
      
      let message = 'Đăng nhập thất bại';
      
      if (error.code === 'ERR_NETWORK') {
        message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc máy chủ.';
        // Show network troubleshooting alert
        Alert.alert(
          'Lỗi kết nối',
          `Không thể kết nối tới máy chủ. \n\nĐịa chỉ máy chủ: ${API_URL}`,
          [{ text: 'OK' }]
        );
      } else if (error.response) {
        // Server responded with error
        message = error.response.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng';
      }
      
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Test server connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(API_URL.replace('/api', ''));
        console.log('Server connection test:', response.status === 200 ? 'Success' : 'Failed');
      } catch (error) {
        console.error('Server connection test failed:', error);
      }
    };
    
    testConnection();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.title}>ĐĂNG KÝ HỌC PHẦN</Text>
            <Text style={styles.subtitle}>TRƯỜNG ĐẠI HỌC</Text>
          </View>

          <View style={styles.inputContainer}>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            
            <Text style={styles.label}>Tài khoản</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isLoading}
            />

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, (isLoading || !username || !password) && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
              )}
            </TouchableOpacity>
            
            <Text style={styles.serverInfo}>
              Server: {API_URL}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
  },
  errorText: {
    color: '#d9534f',
    backgroundColor: '#f9f2f2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#003366',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonDisabled: {
    backgroundColor: '#97a9b9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serverInfo: {
    marginTop: 20,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  }
});

export default LoginScreen;
