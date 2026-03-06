import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LandingScreen from '../screens/auth/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ExploreScreen from '../screens/main/ExploreScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import DemoScreen from '../screens/main/DemoScreen';
import IdeasScreen from '../screens/main/IdeasScreen';
import WishlistDetailScreen from '../screens/wishlist/WishlistDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="MyLists" component={DashboardScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Demo" component={DemoScreen} />
        <Stack.Screen name="Ideas" component={IdeasScreen} />
        
        <Stack.Screen name="WishlistDetail" component={WishlistDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
