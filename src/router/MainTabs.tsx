import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "@/screens/HomeScreen";
import { PredictionsScreen } from "@/screens/PredictionsScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";



export type MainTabParamList = {
  Home: undefined;
  Predictions: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Predictions" component={PredictionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}