import React, { useEffect, useState } from 'react';
import { AuthProvider } from '../src/api/context/AuthContext';
import Navigation from '../navigation/Navigation';
import { StatusBar } from 'expo-status-bar';
import LoadingScreen from '../screens/LoadingScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppRegistry } from 'react-native';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Simulate some startup time for loading screen
    const prepareApp = async () => {
      try {
        // Perform any startup operations here
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  if (!appIsReady) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
          <StatusBar style="auto" />
          <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const appName = 'dkhpmobile';
AppRegistry.registerComponent(appName, () => App);