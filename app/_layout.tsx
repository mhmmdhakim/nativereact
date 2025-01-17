//app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "./contexts/auth";
import { Suspense } from "react";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='(auth)' options={{ headerShown: false }} />
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
      </Suspense>
    </AuthProvider>
  );
}
