import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import ChroniclesLoadingScreen from './src/screens/ChroniclesLoadingScreen';
import TimeChroniclesOnboardingScreen from './src/screens/TimeChroniclesOnboardingScreen';

const Stack = createNativeStackNavigator();

const TimeChroniclesStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName={'LoadPrideQuestScreen'}>
          <Stack.Screen name="TimeChroniclesHome" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoadPrideQuestScreen" component={ChroniclesLoadingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TimeChroniclesOnboarding" component={TimeChroniclesOnboardingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};


export default TimeChroniclesStack;
