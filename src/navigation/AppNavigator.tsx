import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../constants';
import LoginScreen from '../screens/auth/LoginScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import IncidentsScreen from '../screens/incidents/IncidentsScreen';
import StudentsScreen from '../screens/students/StudentsScreen';
import AchievementsScreen from '../screens/achievements/AchievementsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import IncidentDetailsScreen from '../screens/incidents/IncidentDetailsScreen';
import CreateIncidentScreen from '../screens/incidents/CreateIncidentScreen';
import QuickIncidentScreen from '../screens/incidents/QuickIncidentScreen';
import ScannerScreen from '../screens/incidents/ScannerScreen';
import StudentDetailsScreen from '../screens/students/StudentDetailsScreen';
import AchievementDetailsScreen from '../screens/achievements/AchievementDetailsScreen';
import CreateAchievementScreen from '../screens/achievements/CreateAchievementScreen';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { user } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Incidents':
              iconName = 'warning';
              break;
            case 'Students':
              iconName = 'people';
              break;
            case 'Achievements':
              iconName = 'emoji-events';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.disabled,
        headerStyle: {
          backgroundColor: THEME.colors.primary,
        },
        headerTintColor: THEME.colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Incidents" 
        component={IncidentsScreen}
        options={{ title: 'Incidents' }}
      />
      <Tab.Screen 
        name="Students" 
        component={StudentsScreen}
        options={{ title: 'Students' }}
      />
      <Tab.Screen 
        name="Achievements" 
        component={AchievementsScreen}
        options={{ title: 'Achievements' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen 
        name="IncidentDetails" 
        component={IncidentDetailsScreen}
        options={{ headerShown: true, title: 'Incident Details' }}
      />
      <Stack.Screen 
        name="CreateIncident" 
        component={CreateIncidentScreen}
        options={{ headerShown: true, title: 'Create Incident' }}
      />
      <Stack.Screen 
        name="QuickIncident" 
        component={QuickIncidentScreen}
        options={{ headerShown: true, title: 'Quick Incident' }}
      />
      <Stack.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{ headerShown: true, title: 'Scan ID' }}
      />
      <Stack.Screen 
        name="StudentDetails" 
        component={StudentDetailsScreen}
        options={{ headerShown: true, title: 'Student Details' }}
      />
      <Stack.Screen 
        name="AchievementDetails" 
        component={AchievementDetailsScreen}
        options={{ headerShown: true, title: 'Achievement Details' }}
      />
      <Stack.Screen 
        name="CreateAchievement" 
        component={CreateAchievementScreen}
        options={{ headerShown: true, title: 'Create Achievement' }}
      />
      <Stack.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ headerShown: true, title: 'Analytics' }}
      />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You could return a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AdminStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
