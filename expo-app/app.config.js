export default {
    expo: {
        name: "expo-push-demo",
        slug: "expo-push-demo",
        owner: "sammy23",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
            googleServicesFile: "./google-services.json",
            package: "com.sammy23.expopushdemo"
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            [
                "expo-notifications",
                {
                    icon: "./assets/notification-icon.png",
                    color: "#ffffff"
                }
            ],
            [
                "expo-build-properties",
                {
                    android: {
                        usesCleartextTraffic: true
                    }
                }
            ]
        ],
        extra: {
            eas: {
                projectId: process.env.EXPO_PUBLIC_PROJECT_ID
            }
        }
    }
}