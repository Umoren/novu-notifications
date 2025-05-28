# Expo Push Notifications App

React Native app built with Expo that demonstrates push notification integration with Knock.app backend system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g @expo/eas-cli`
- Physical device (push notifications don't work in simulators)
- Expo account (free)

### Installation
```bash
npm install
```

### Development
```bash
# Start Expo dev server
npx expo start

# Start with specific platform
npx expo start --android
npx expo start --ios
```

### Building for Production
```bash
# Build development version
eas build --platform android --profile development
eas build --platform ios --profile development

# Build production version  
eas build --platform android --profile production
eas build --platform ios --profile production
```

## 📱 Features

### ✅ Implemented
- [x] Push notification permissions handling
- [x] Expo push token generation and management
- [x] Token registration with backend
- [x] Foreground and background notification handling
- [x] Notification response handling (when user taps)
- [x] Real-time notification display
- [x] Test notification functionality

### 🔔 Notification Capabilities
- **Permission Requests**: Automatic permission handling on app start
- **Token Management**: Automatic push token generation and registration
- **Notification Display**: Show notifications when app is open
- **Background Handling**: Receive notifications when app is closed
- **Tap Handling**: Handle user interaction with notifications
- **Channel Configuration**: Proper Android notification channels

## 📁 Project Structure

```
expo-push-demo/
├── App.js                 # Main app component with notification logic
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
├── google-services.json  # Firebase configuration (for FCM)
├── index.js              # Entry point
├── assets/               # App icons and images
└── package.json
```

## 🔧 Configuration Files

### app.json - Expo Configuration
Key configuration for notifications:
```json
{
  "expo": {
    "name": "expo-push-demo",
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#ffffff",
      "androidMode": "default",
      "androidCollapsedTitle": "#{unread_notifications} new notifications"
    },
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### eas.json - EAS Build Configuration
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

## 🛠️ Core Implementation

### Push Token Registration
The app automatically:
1. **Requests permissions** for notifications on startup
2. **Generates Expo push token** using device and project ID
3. **Registers token** with backend API
4. **Sets up notification listeners** for foreground and background

### Key Code Sections

**Permission Handling:**
```javascript
const { status: existingStatus } = await Notifications.getPermissionsAsync();
let finalStatus = existingStatus;
if (existingStatus !== 'granted') {
  const { status } = await Notifications.requestPermissionsAsync();
  finalStatus = status;
}
```

**Token Generation:**
```javascript
const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
```

**Backend Registration:**
```javascript
// Registers token with your backend API
const response = await fetch(`${backendUrl}/api/notifications/register-push-token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'test-123',
    expoPushToken: token,
    channelId: 'your-expo-channel-id'
  })
});
```

## 🔔 Notification Handling

### Notification States
- **Foreground**: App is open and visible
- **Background**: App is running but not visible
- **Killed**: App is completely closed

### Event Listeners
```javascript
// Notification received (foreground)
Notifications.addNotificationReceivedListener(notification => {
  console.log('Notification received:', notification);
  setNotification(notification);
});

// Notification tapped (background/killed)
Notifications.addNotificationResponseReceivedListener(response => {
  console.log('Notification response:', response);
  // Handle navigation or actions
});
```

## 🧪 Testing

### Manual Testing
1. **Start the app** on a physical device
2. **Grant notification permissions** when prompted
3. **Copy the push token** displayed in the app
4. **Use test button** in app to send notification via backend
5. **Verify notification appears** in device notification tray

### Backend Integration Testing
```bash
# Test with your device's token
curl -X POST http://your-backend-url/api/notifications/push-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-123",
    "title": "Test from Backend",
    "body": "This notification came from the backend API"
  }'
```

### Test Scenarios
- [x] **App Open**: Notification appears as banner
- [x] **App Background**: Notification appears in system tray
- [x] **App Killed**: Notification appears in system tray
- [x] **Notification Tap**: App opens and handles response

## 🎨 UI Components

### Main Screen Features
- **Push Token Display**: Shows current device token
- **Test Button**: Send test notification via backend
- **Notification Display**: Shows received notification details
- **Real-time Updates**: Live notification content display

### Styling
```javascript
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
  },
  buttonContainer: {
    marginVertical: 20,
  },
});
```

## 🔧 Development Setup

### EAS CLI Setup
```bash
# Install EAS CLI globally
npm install -g @expo/eas-cli

# Login to your Expo account
eas login

# Initialize EAS in your project
eas build:configure
```

### Device Testing Setup
```bash
# Register your device for development builds
eas device:create

# Build development version
eas build --platform android --profile development

# Install via QR code or direct download
```

## 🚀 Building and Distribution

### Development Builds
Development builds include the Expo development client for testing:
```bash
eas build --platform android --profile development
eas build --platform ios --profile development
```

### Production Builds
Production builds are optimized for app stores:
```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Internal Distribution
```bash
# Share with team members
eas build --platform android --profile development
eas submit --platform android
```

## 🐛 Troubleshooting

### Common Issues

**Push notifications not working:**
- ✅ Ensure using physical device (not simulator)
- ✅ Check notification permissions are granted
- ✅ Verify google-services.json is configured
- ✅ Confirm backend is registering tokens correctly
- ✅ Check Expo project ID matches in backend

**Token registration failing:**
- ✅ Verify backend URL is correct and accessible
- ✅ Check backend API endpoints are working
- ✅ Confirm network connectivity from device

**Build failures:**
- ✅ Run `expo doctor` to check configuration
- ✅ Verify EAS CLI is logged in: `eas whoami`
- ✅ Check eas.json configuration
- ✅ Ensure google-services.json is present for Android

### Debug Commands
```bash
# Check Expo configuration
expo config

# Validate project setup
expo doctor

# Check EAS login status
eas whoami

# View build logs
eas build:list
```

## 📱 Platform-Specific Notes

### Android
- **Requires**: google-services.json for FCM
- **Channels**: Notification channels configured automatically
- **Permissions**: Requested automatically on first run
- **Background**: Works reliably in background/killed states

### iOS
- **Requires**: Apple Developer account for production
- **Permissions**: Must be explicitly requested
- **Background**: Limited background processing
- **Development**: Works on iOS Simulator for development builds

## 🔗 Dependencies

### Core Dependencies
- **expo**: Expo SDK
- **expo-device**: Device information
- **expo-notifications**: Push notification handling
- **expo-constants**: Access to app constants
- **react-native**: React Native framework

### Development Dependencies
- **@expo/eas-cli**: EAS command line tools

## 📚 Related Documentation

- [Expo Push Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Notifications](https://reactnative.dev/docs/pushnotificationios)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/notification-feature`
3. **Test on physical device**
4. **Commit changes**: `git commit -m 'Add notification feature'`
5. **Push to branch**: `git push origin feature/notification-feature`
6. **Open Pull Request**