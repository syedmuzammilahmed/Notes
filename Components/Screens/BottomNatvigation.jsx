import * as React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FolderScreen from './FolderPage';
import NotesPage from './NotesPage';
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Notes"
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'black',
          style: { backgroundColor: 'white' },
        }}
      >
        <Tab.Screen
          name="home"
          component={NotesPage}
          options={{
            tabBarIcon: ({ color }) => (
            <Ionicons name="home" color={color} size={20} />
            ),
          }}
        />
        <Tab.Screen
          name="Folder"
          component={FolderScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="folder" color={color} size={20} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
