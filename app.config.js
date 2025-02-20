export default {
    expo: {
      name: "my-trekio-app",
      slug: "my-trekio-app",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "myapp",  // ✅ Fix deep linking warning
      userInterfaceStyle: "automatic",
      newArchEnabled: true,  // ✅ Fix New Architecture warning
      ios: {
        supportsTablet: true
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/images/trekio-logo.png",
          backgroundColor: "#ffffff"
        },
        package: "com.gaurishtodi.mytrekioapp",
        compileSdkVersion: 33,
        targetSdkVersion: 33
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png"
      },
      plugins: [
        "expo-router",
        [
          "expo-splash-screen",
          {
            image: "./assets/images/splash-icon.png",
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#ffffff"
          }
        ]
      ],
      experiments: {
        typedRoutes: true
      },
      extra: {
        GOOGLE_GEMINI_API_KEY: "AIzaSyDmPF7JjWEDlmWfyWwIHDtTRJd3B2PB3ck",
        GOOGLE_MAPS_API_KEY: "AIzaSyBVKg0gt00ybo8sVliAWMbBbzfxzspJgLE",
        router: {
          origin: false
        },
        eas: {
          projectId: "afa25dd7-82b9-4deb-8a33-308d81f457e2"
        }
      }
    }
  };
  