import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadTimeChroniclesUser = async () => {
      try {
        const storedTimeChroniclesUser = await AsyncStorage.getItem('currentUser');
        if (storedTimeChroniclesUser) {
          setUser(JSON.parse(storedTimeChroniclesUser));
        }
      } catch (error) {
        console.error('Error loading storedTimeChroniclesUser user:', error);
      }
    };
    loadTimeChroniclesUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
