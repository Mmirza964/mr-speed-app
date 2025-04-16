import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

// Import your screens correctly from the screens directory
import Rides from '../app/screens/rides';
import Analysis from '../app/screens/analysis';
import Schedule from '../app/screens/schedule';
import Account from '../app/screens/account';

const Tab = createBottomTabNavigator();

export default function Navbar() {
  return (
    <Tab.Navigator
      initialRouteName="Rides"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconPath;

          if (route.name === 'Rides') {
            iconPath = require('../assets/images/schedule.png');
          } else if (route.name === 'Analysis') {
            iconPath = require('../assets/images/analysis.png');
          } else if (route.name === 'Schedule') {
            iconPath = require('../assets/images/car-insurance.png');
          } else if (route.name === 'Account') {
            iconPath = require('../assets/images/user.png');
          }

          return (
            <Image
              source={iconPath}
              style={{ width: 24, height: 24, tintColor: focused ? '#ffffff' : '#cccccc' }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#cccccc',
        tabBarStyle: {
          backgroundColor: '#2e68ff',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Rides" component={Rides} />
      <Tab.Screen name="Analysis" component={Analysis} />
      <Tab.Screen name="Schedule" component={Schedule} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
}
