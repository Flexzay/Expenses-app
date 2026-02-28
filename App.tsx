import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppNavigator from "@/router/AppNavigator";


const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
    </QueryClientProvider>
  );
}