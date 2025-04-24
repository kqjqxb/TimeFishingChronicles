import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Keyboard,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
  Text,
  Modal,
  StyleSheet,
} from 'react-native';

import ChroniclesInformationScreen from './ChroniclesInformationScreen';

import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChroniclesFactsScreen from './ChroniclesFactsScreen';
import ChroniclesMyCatchesScreen from './ChroniclesMyCatchesScreen';
import ChroniclesAquariumScreen from './ChroniclesAquariumScreen';

const prideFontPoppinsRegular = 'Poppins-Regular';

const fontRubikRegular = 'Rubik-Regular';


const HomePrideQuestScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedTimeChroniclesPage, setSelectedTimeChroniclesPage] = useState('Home');
  const [addLionModalVisible, setAddLionModalVisible] = useState(false);
  const styles = createPrideQuestHomeStyles(dimensions);
  const [myPrides, setMyPrides] = useState([]);
  const [selectedPride, setSelectedPride] = useState(null);
  const [prideDetailsModalVisible, setPrideDetailsModalVisible] = useState(false);
  const [prideNotificationsEnabled, setPrideNotificationsEnabled] = useState(false);

  useEffect(() => {
    const loadMyPrides = async () => {
      try {
        const storedMyPrides = await AsyncStorage.getItem('myPrides');
        if (storedMyPrides !== null) {
          setMyPrides(JSON.parse(storedMyPrides));
        }
      } catch (error) {
        console.error('Error loading myPride items:', error);
      }
    };

    loadMyPrides();
  }, [addLionModalVisible, prideDetailsModalVisible]);


  useEffect(() => {
    const loadPrideNotificationsSetting = async () => {
      try {
        const storedPrideNotifications = await AsyncStorage.getItem('prideNotificationsEnabled');
        if (storedPrideNotifications !== null) {
          setPrideNotificationsEnabled(JSON.parse(storedPrideNotifications));
        }
      } catch (error) {
        console.error('Error loading pride notifications setting:', error);
      }
    };

    loadPrideNotificationsSetting();
  }, [])


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{
        flex: 1,
        width: '100%',
        backgroundColor: '#002357',
        height: dimensions.height,
      }}>
        {selectedTimeChroniclesPage === 'Home' ? (
          <SafeAreaView style={{
            flex: 1,
            alignItems: 'center',
          }}>
            <Image
              source={require('../assets/images/homeFisherImage.png')}
              style={{
                width: dimensions.width * 0.9,
                height: dimensions.height * 0.28,
                marginTop: dimensions.height * 0.02,
                alignSelf: 'flex-end',
              }}
              resizeMode='contain'
            />

            {['My catches', 'Interesting facts', 'My aquarium', 'Information'].map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedTimeChroniclesPage(button);
                }}
                style={{
                  width: dimensions.width * 0.898,
                  height: dimensions.height * 0.12,
                  backgroundColor: selectedTimeChroniclesPage === button ? 'E67C1E' : '#1E67E6',
                  borderRadius: dimensions.width * 0.05551,
                  marginBottom: dimensions.height * 0.01,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    paddingHorizontal: dimensions.width * 0.05,
                    textAlign: 'center',
                    fontSize: dimensions.width * 0.07,
                    fontWeight: 700,
                    alignSelf: 'center',
                    maxWidth: dimensions.width * 0.89,
                    fontFamily: fontRubikRegular,
                    color: '#ffffff',
                  }}>
                  {button}
                </Text>
              </TouchableOpacity>
            ))}

          </SafeAreaView>
        ) : selectedTimeChroniclesPage === 'Information' ? (
          <ChroniclesInformationScreen setSelectedTimeChroniclesPage={setSelectedTimeChroniclesPage} 
          />
        ) : selectedTimeChroniclesPage === 'Interesting facts' ? (
          <ChroniclesFactsScreen setSelectedTimeChroniclesPage={setSelectedTimeChroniclesPage} />
        ) : selectedTimeChroniclesPage === 'My catches' ? (
          <ChroniclesMyCatchesScreen setSelectedTimeChroniclesPage={setSelectedTimeChroniclesPage} />
        ) : selectedTimeChroniclesPage === 'My aquarium' ? (
          <ChroniclesAquariumScreen setSelectedTimeChroniclesPage={setSelectedTimeChroniclesPage} />
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const createPrideQuestHomeStyles = (dimensions) => StyleSheet.create({
  modalPrideTitleText: {
    textAlign: 'left',
    color: 'white',
    fontSize: dimensions.width * 0.04,
    fontFamily: prideFontPoppinsRegular,
    fontWeight: 300,
    marginLeft: dimensions.width * 0.03,
    marginTop: dimensions.height * 0.02,
  },
  pridePlaceHolderViewStyles: {
    width: dimensions.width * 0.93,
    height: dimensions.height * 0.068,
    backgroundColor: '#BF9539',
    borderRadius: dimensions.width * 0.033,
    marginTop: dimensions.height * 0.007,
    alignSelf: 'center',
    paddingHorizontal: dimensions.width * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pridePlaceHolderTextStyles: {
    maxWidth: dimensions.width * 0.75,
    color: 'white',
    fontFamily: prideFontPoppinsRegular,
    fontWeight: 600,
    fontSize: dimensions.width * 0.04,
    textAlign: 'left',
  },
});

export default HomePrideQuestScreen;
