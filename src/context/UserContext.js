import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadPrideUser = async () => {
      try {
        const storedPrideUser = await AsyncStorage.getItem('currentUser');
        if (storedPrideUser) {
          setUser(JSON.parse(storedPrideUser));
        }
      } catch (error) {
        console.error('Error loading storedPrideUser user:', error);
      }
    };
    loadPrideUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
