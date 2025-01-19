import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeScreen from '../screens/HomeScreen';
import RecipesScreen from '../screens/RecipesScreen';
import BooksScreen from '../screens/BooksScreen';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#F5F5F5', height: 90, paddingBottom: 10, paddingTop: 10, borderTopLeftRadius: 15, borderTopRightRadius: 15, borderColor: '#800000', borderWidth: 1 },
        tabBarActiveTintColor: '#800000',
        tabBarInactiveTintColor: '#A52A2A',
        tabBarLabelStyle: { fontSize: 12, marginTop: 4 },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Recipes') {
            iconName = 'addfile';
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === 'Books') {
            iconName = 'table';
            return <AntDesign name={iconName} size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="Books" component={BooksScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
