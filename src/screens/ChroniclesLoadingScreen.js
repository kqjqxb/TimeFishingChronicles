import { useNavigation } from '@react-navigation/native';
import { Image, View, ActivityIndicator } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserData } from '../redux/userSlice';
import { UserContext } from '../context/UserContext';

const ChroniclesLoadingScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const dispatch = useDispatch();

  const [isCallEnOnboardingToSportVisibled, setIsCallEnOnboardingToSportVisibled] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  useEffect(() => {
    const loadCallEnToSportUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedCallEnToSportUser = await AsyncStorage.getItem(storageKey);
        const isCallEnOnboardingWasVisibled = await AsyncStorage.getItem('isCallEnOnboardingWasVisibled');

        if (storedCallEnToSportUser) {
          setUser(JSON.parse(storedCallEnToSportUser));
          setIsCallEnOnboardingToSportVisibled(false);
        } else if (isCallEnOnboardingWasVisibled) {
          setIsCallEnOnboardingToSportVisibled(false);
        } else {
          setIsCallEnOnboardingToSportVisibled(true);
          await AsyncStorage.setItem('isCallEnOnboardingWasVisibled', 'true');
        }
      } catch (error) {
        console.error('Error loading of montYou Real user', error);
      } finally {
        setInitializationComplete(true);
      }
    };

    loadCallEnToSportUser();
  }, [setUser]);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    if (initializationComplete) {
      const timer = setTimeout(() => {
        const destination = isCallEnOnboardingToSportVisibled ? 'TimeChroniclesOnboarding' : 'TimeChroniclesHome';
        navigation.replace(destination);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [initializationComplete, isCallEnOnboardingToSportVisibled, navigation]);

  return (
    <View style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#002357',
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
    }}>
      <ActivityIndicator size="large" color="#3b8efb" />
    </View>
  );
};

export default ChroniclesLoadingScreen;
