import { useNavigation } from '@react-navigation/native';
import { Image, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserData } from '../redux/userSlice';
import { UserContext } from '../context/UserContext';

const LoadingPrideQuestAppScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadPrideQuestUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedPrideQuestUser = await AsyncStorage.getItem(storageKey);

        if (storedPrideQuestUser) {
          setUser(JSON.parse(storedPrideQuestUser || '{}'));
        }
      } catch (error) {
        console.error('Error loading DeepDive user', error);
      }
    };
    loadPrideQuestUser();
  }, [setUser]);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, 4000);
  }, []);

  return (
    <View style={{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      zIndex: 1,
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: '#967228',
    }}>
      <Image
        source={require('../assets/images/loadingMolahImage.png')}
        style={{
          width: '80%',
          height: '40%',
        }}
      />
    </View>
  );
};

export default LoadingPrideQuestAppScreen;
