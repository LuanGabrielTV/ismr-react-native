import { useState, useEffect, useCallback } from 'react';
import { Alert, Linking, AppState } from 'react-native'; // <-- Import AppState
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const [hasPermission, setHasPermission] = useState(false);

  const checkPermissions = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      setHasPermission(finalStatus === 'granted');
    }
  };

  useEffect(() => {
    checkPermissions();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkPermissions();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const promptForSettings = () => {
    Alert.alert(
      "Notifications Disabled",
      "To receive updates, please enable notifications for this app in your device settings.",
      [
        { text: "Not Now", style: "cancel" },
        { 
          text: "Open Settings", 
          onPress: () => Linking.openSettings() 
        }
      ]
    );
  };

  const notify = useCallback(async (title: string, body: string, data?: Record<string, any>) => {
    const { status } = await Notifications.getPermissionsAsync();
    
    if (status !== 'granted') {
      promptForSettings();
      return;
    }

    setHasPermission(true); 

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, 
    });
  }, []); 

  return { notify, hasPermission };
}