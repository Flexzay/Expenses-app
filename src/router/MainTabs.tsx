import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 
import { HomeScreen } from "@/screens/HomeScreen";
import { CategoriasScreen } from "@/screens/CategoriasScreen";
import { PredictionsScreen } from "@/screens/PredictionsScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import colors from "@/constants/colors";

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Predictions: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const insets = useSafeAreaInsets(); 
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />;
          } else if (route.name === 'Categories') {
            return <Ionicons name={focused ? "grid" : "grid-outline"} size={size} color={color} />;
          } else if (route.name === 'Predictions') {
            return <MaterialIcons name="trending-up" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />;
          }
          return <Ionicons name="help-circle-outline" size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.white[100],
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          height: 60,
          paddingBottom: 4 + insets.bottom, 
          paddingTop: 4,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Categories" component={CategoriasScreen} options={{ tabBarLabel: 'Categorías' }} />
      <Tab.Screen name="Predictions" component={PredictionsScreen} options={{ tabBarLabel: 'Predicciones' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}
