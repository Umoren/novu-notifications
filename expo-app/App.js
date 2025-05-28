import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, StyleSheet, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { KnockProvider, KnockExpoPushNotificationProvider } from '@knocklabs/expo';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    // Get the Expo push token
    const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;

    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('Expo Push Token:', token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

// Function to send test notification to your backend
async function sendTestNotification(expoPushToken) {
  try {
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    console.log('=== DEBUG INFO ===');
    console.log('Backend URL:', backendUrl);
    console.log('Expo Push Token:', expoPushToken);
    console.log('================');
    const response = await fetch(`${backendUrl}/api/notifications/push-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test-123',
        title: 'Test from Expo App!',
        body: 'This notification was sent from your Expo app!',
        data: {
          screen: 'Home',
          expoPushToken: expoPushToken
        }
      })
    });

    const result = await response.json();
    console.log('Notification sent:', result);
    Alert.alert('Success', 'Test notification sent!');
  } catch (error) {
    console.error('Error sending notification:', error);
    Alert.alert('Error', 'Failed to send notification');
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token || ''));

    // Listen for notifications when app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      setNotification(notification);
    });

    // Listen for notification interactions (taps)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      const data = response.notification.request.content.data;
      if (data.screen) {
        Alert.alert('Notification Tapped!', `Navigate to: ${data.screen}`);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <KnockProvider
      apiKey={process.env.EXPO_PUBLIC_KNOCK_PUBLIC_KEY}
      userId="test-user-123"
    >
      <KnockExpoPushNotificationProvider
        knockExpoChannelId={process.env.EXPO_PUBLIC_KNOCK_EXPO_CHANNEL_ID}
        autoRegister={true}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Push Notifications with Knock + Expo</Text>

          <Text style={styles.token}>
            Your expo push token: {expoPushToken ? `${expoPushToken.slice(0, 50)}...` : 'Loading...'}
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Send Test Notification"
              onPress={() => sendTestNotification(expoPushToken)}
              disabled={!expoPushToken}
            />
          </View>

          {notification && (
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationTitle}>Last Notification:</Text>
              <Text style={styles.notificationText}>
                {notification.request.content.title}: {notification.request.content.body}
              </Text>
            </View>
          )}
        </View>
      </KnockExpoPushNotificationProvider>
    </KnockProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  token: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginVertical: 20,
    width: '100%',
  },
  notificationContainer: {
    backgroundColor: '#e6f3ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationText: {
    fontSize: 14,
  },
});