export const Colors = {
  primary: "#3B82F6", // blue-500
  secondary: "#6B7280", // gray-500
  background: "#F3F4F6", // gray-100
  card: "#FFFFFF",
  text: "#1F2937", // gray-800
  textDim: "#6B7280", // gray-500
  border: "#E5E7EB", // gray-200
  error: "#EF4444", // red-500
  errorBackground: "#FEE2E2", // red-100
  success: "#10B981", // green-500
  warning: "#F59E0B", // amber-500
  white: "#FFFFFF",
  light: {
    text: "#1F2937",
    background: "#F3F4F6",
    tint: "#3B82F6",
    tabIconDefault: "#6B7280",
    tabIconSelected: "#3B82F6",
  },
  dark: {
    text: "#F3F4F6",
    background: "#1F2937",
    tint: "#60A5FA",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: "#60A5FA",
  },
} as const;

export type ColorsType = typeof Colors;
