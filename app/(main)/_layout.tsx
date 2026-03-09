import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="collaborators" />
      <Stack.Screen name="add-expense" />
      <Stack.Screen name="expenses" />
      <Stack.Screen name="expense-detail" />
      <Stack.Screen name="edit-expense" />
    </Stack>
  );
}
