import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { auth } from "./../configure/firebaseConfig";
import Login from "../app/Login";
import { User } from "firebase/auth"; // Import User type

export default function Index() {
  const [user, setUser] = useState<User | null>(null); // ✅ Define correct type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser); // ✅ Now TypeScript understands the type
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return user ? <Redirect href="/myTrip" /> : <Login />;
}
