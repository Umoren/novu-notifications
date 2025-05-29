import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Enhanced logging function
const log = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data || '');
};

// Function to register for push notifications with detailed logging
async function registerForPushNotificationsAsync() {
  log('🚀 Starting push notification registration');

  let token;

  try {
    log('📱 Platform detected', { platform: Platform.OS, isDevice: Device.isDevice });

    if (Platform.OS === 'android') {
      log('🔧 Setting up Android notification channel');
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      log('✅ Android notification channel set up');
    }

    if (Device.isDevice) {
      log('📋 Checking existing permissions');
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      log('📋 Existing permission status', { status: existingStatus });

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        log('🔐 Requesting push notification permissions');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        log('🔐 Permission request result', { status });
      }

      if (finalStatus !== 'granted') {
        log('❌ Push notification permission denied');
        alert('Failed to get push token for push notification!');
        return null;
      }

      log('✅ Push notification permission granted');

      // Get the Expo push token
      const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
      log('🔑 Getting Expo push token', {
        projectId,
        hasProjectId: !!projectId,
        constantsProjectId: Constants?.expoConfig?.extra?.eas?.projectId
      });

      if (!projectId) {
        log('❌ No project ID found');
        alert('Project ID not configured. Check your .env file.');
        return null;
      }

      log('⏳ Requesting push token from Expo...');
      const tokenResult = await Notifications.getExpoPushTokenAsync({ projectId });
      token = tokenResult.data;

      log('✅ Expo push token received', {
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
      });

    } else {
      log('❌ Not a physical device');
      alert('Must use physical device for Push Notifications');
      return null;
    }

    return token;

  } catch (error) {
    log('💥 Error during push notification registration', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });

    Alert.alert(
      'Registration Error',
      `Failed to register for push notifications: ${error.message}`
    );
    return null;
  }
}

// Register token with your Novu backend with detailed logging
async function registerTokenWithBackend(expoPushToken) {
  log('📡 Registering token with backend');

  try {
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      log('❌ Backend URL not configured');
      Alert.alert('Config Error', 'Backend URL not configured in .env file');
      return;
    }

    log('🌐 Making registration request', {
      url: `${backendUrl}/api/notifications/register-push-token`,
      tokenPreview: expoPushToken ? `${expoPushToken.substring(0, 20)}...` : 'null'
    });

    const response = await fetch(`${backendUrl}/api/notifications/register-push-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test-user-123',
        token: expoPushToken
      })
    });

    log('📡 Registration response received', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    const result = await response.json();
    log('📊 Registration result', result);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${result.error || 'Unknown error'}`);
    }

  } catch (error) {
    log('💥 Backend registration error', {
      error: error.message,
      stack: error.stack
    });

    // Don't show alert for this - it's not critical since you have just-in-time registration
    console.warn('Token registration failed, but will retry during notification send');
  }
}

// Send test notification through your Novu backend with detailed logging
async function sendTestNotification(expoPushToken) {
  log('🚀 Starting test notification send');

  try {
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      log('❌ Backend URL not configured');
      Alert.alert('Config Error', 'Backend URL not configured');
      return;
    }

    if (!expoPushToken) {
      log('❌ No push token available');
      Alert.alert('Error', 'No push token available. Try restarting the app.');
      return;
    }

    log('🌐 Sending test notification', {
      url: `${backendUrl}/api/notifications/push-notification`,
      tokenPreview: `${expoPushToken.substring(0, 20)}...`
    });

    const requestBody = {
      userId: 'test-user-123',
      title: 'Test from Expo App!',
      body: 'This notification was sent through your Novu backend!',
      data: {
        screen: 'Home',
        timestamp: new Date().toISOString()
      },
      token: expoPushToken
    };

    log('📤 Request payload', {
      userId: requestBody.userId,
      title: requestBody.title,
      bodyLength: requestBody.body.length,
      dataKeys: Object.keys(requestBody.data)
    });

    const response = await fetch(`${backendUrl}/api/notifications/push-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    log('📡 Notification response received', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    const result = await response.json();
    log('📊 Notification result', result);

    if (result.success) {
      Alert.alert('Success', 'Test notification sent via Novu!');
    } else {
      Alert.alert('Error', result.error || 'Failed to send notification');
    }

  } catch (error) {
    log('💥 Test notification error', {
      error: error.message,
      stack: error.stack
    });

    Alert.alert('Error', `Failed to send notification: ${error.message}`);
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState('Initializing...');
  const [logs, setLogs] = useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Add logs to the UI for debugging
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-4), `${timestamp}: ${message}`]); // Keep last 5 logs
  };

  useEffect(() => {
    log('🎯 App component mounted, starting initialization');
    addLog('App started, registering for push notifications...');
    setRegistrationStatus('Registering for push notifications...');

    // Register for push notifications
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        log('✅ Token registration completed successfully');
        setExpoPushToken(token);
        setRegistrationStatus('✅ Ready to send notifications');
        addLog('Push token received successfully');

        // Register with backend
        registerTokenWithBackend(token);
      } else {
        log('❌ Token registration failed');
        setRegistrationStatus('❌ Failed to get push token');
        addLog('Failed to get push token');
      }
    });

    // Listen for notifications when app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      log('📩 Notification received', {
        title: notification.request.content.title,
        body: notification.request.content.body
      });
      addLog(`Notification received: ${notification.request.content.title}`);
      setNotification(notification);
    });

    // Listen for notification interactions (taps)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      log('👆 Notification tapped', {
        title: response.notification.request.content.title,
        data: response.notification.request.content.data
      });

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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Push Notifications with Novu + Expo</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Status:</Text>
        <Text style={styles.statusText}>{registrationStatus}</Text>
      </View>

      <Text style={styles.token}>
        Push Token: {expoPushToken ? `${expoPushToken.slice(0, 50)}...` : 'Loading...'}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Send Test Notification via Novu"
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

      <View style={styles.configContainer}>
        <Text style={styles.configTitle}>Configuration:</Text>
        <Text style={styles.configText}>
          Backend: {process.env.EXPO_PUBLIC_BACKEND_URL || '❌ Not configured'}
        </Text>
        <Text style={styles.configText}>
          Project ID: {process.env.EXPO_PUBLIC_PROJECT_ID || '❌ Not configured'}
        </Text>
        <Text style={styles.configText}>
          Platform: {Platform.OS} {Device.isDevice ? '(Physical Device)' : '(Simulator)'}
        </Text>
      </View>

      <View style={styles.logsContainer}>
        <Text style={styles.logsTitle}>Recent Activity:</Text>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  token: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    width: '100%',
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
  configContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    width: '100%',
  },
  configTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  configText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  logsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    width: '100%',
  },
  logsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  logText: {
    fontSize: 10,
    color: '#555',
    marginBottom: 2,
  },
});