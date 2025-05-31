import * as React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import GalleryScreen from "./components/GalleryScreen";
import CategoryView from "./components/CategoryView"
import WallpaperViewer from "./components/WallpaperViewer"

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Gallery'}
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animationEnabled: true,
        }}
        mode={'modal'}>
        <Stack.Screen 
          name="Gallery" 
          component={GalleryScreen} 
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="CategoryView" 
          component={CategoryView} 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="WallpaperViewer" 
          component={WallpaperViewer} 
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}