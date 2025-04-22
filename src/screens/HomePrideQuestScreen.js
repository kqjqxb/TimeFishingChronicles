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
  ScrollView,
} from 'react-native';

import PrideSettingsScreen from './PrideSettingsScreen';
import PrideArticlesScreen from './PrideArticlesScreen';

import homeAnimalsData from '../components/homeAnimalsData';
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from 'react-native-heroicons/solid';
import LionDetailsModalComponent from '../components/LionDetailsModalComponent';
import AddNewLionModalComponent from '../components/AddNewLionModalComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PrideDetailsModalComponent from '../components/PrideDetailsModalComponent';
import PrideGameScreen from './PrideGameScreen';
import { BookOpenIcon, Cog8ToothIcon, HomeIcon, PuzzlePieceIcon } from 'react-native-heroicons/outline';

const prideFontPoppinsRegular = 'Poppins-Regular';

const prideFontInterRegular = 'Inter-Regular';


const HomePrideQuestScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedPrideQuestScreen, setSelectedPrideQuestScreen] = useState('Home');
  const [prideModalVisible, setPrideModalVisible] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [addLionModalVisible, setAddLionModalVisible] = useState(false);
  const styles = createPrideQuestHomeStyles(dimensions);
  const [myPrides, setMyPrides] = useState([]);
  const [selectedPride, setSelectedPride] = useState(null);
  const [prideDetailsModalVisible, setPrideDetailsModalVisible] = useState(false);
  const [prideNotificationsEnabled, setPrideNotificationsEnabled] = useState(false);

  const prideQuestButtons = [
    {
      prideScreenQuest: 'Home',
      prideTitleQuest: 'Home',
      icon: <HomeIcon size={dimensions.width * 0.08} color='white' />,
      prideQuestButtonImage: require('../assets/images/prideButtonImages/homeImage.png'),
    },
    {
      prideScreenQuest: 'PrideGame',
      prideTitleQuest: 'Game',
      icon: <PuzzlePieceIcon size={dimensions.width * 0.08} color='white' />,
      prideQuestButtonImage: require('../assets/images/prideButtonImages/gameImage.png'),
    },
    {
      prideScreenQuest: 'PrideArticles',
      prideTitleQuest: 'Articles',
      icon: <BookOpenIcon size={dimensions.width * 0.08} color='white' />,
      prideQuestButtonImage: require('../assets/images/prideButtonImages/articlesImages.png'),
    },
    {
      prideScreenQuest: 'PrideSettings',
      prideTitleQuest: 'Settings',
      icon: <Cog8ToothIcon size={dimensions.width * 0.08} color='white' />,
      prideQuestButtonImage: require('../assets/images/prideButtonImages/settingsImage.png'),
    },
  ];

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
        backgroundColor: '#967228',
        height: dimensions.height,
      }}>
        {selectedPrideQuestScreen === 'Home' ? (
          <SafeAreaView style={{
            flex: 1,
            alignItems: 'center',
          }}>
            <Text
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: dimensions.width * 0.075,
                alignSelf: 'flex-start',
                marginLeft: dimensions.width * 0.04,
                fontFamily: prideFontPoppinsRegular,
                fontWeight: 600,
                marginBottom: dimensions.height * 0.02,
              }}>
              Home
            </Text>

            <ScrollView style={{
              alignSelf: 'center',
            }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: dimensions.height * 0.2,
              }}
            >
              <Text
                style={{
                  textAlign: 'left',
                  color: 'white',
                  fontSize: dimensions.width * 0.04,
                  alignSelf: 'flex-start',
                  fontFamily: prideFontPoppinsRegular,
                  fontWeight: 500,
                }}>
                Encyclopedia
              </Text>
              {homeAnimalsData.map((animal, index) => (
                <TouchableOpacity
                  onPress={() => {
                    // setSelectedAnimal(animal);
                    // setPrideModalVisible(true);

                    openLionDetailsModal();
                  }}
                  key={animal.id} style={{
                    width: dimensions.width * 0.93,
                    height: dimensions.height * 0.12,
                    backgroundColor: '#BF9539',
                    borderRadius: dimensions.width * 0.033,
                    marginTop: dimensions.height * 0.007,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                  }}>
                  <Image
                    source={animal.image}
                    style={{
                      width: dimensions.height * 0.12,
                      height: dimensions.height * 0.12,
                      borderTopLeftRadius: dimensions.width * 0.033,
                      borderBottomLeftRadius: dimensions.width * 0.033,
                    }}
                    resizeMode='cover'
                  />

                  <Text
                    style={{
                      textAlign: 'left',
                      color: 'white',
                      fontSize: dimensions.width * 0.05,
                      fontFamily: prideFontPoppinsRegular,
                      fontWeight: 600,
                      marginLeft: dimensions.width * 0.04,
                    }}>
                    {animal.title}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text
                style={{
                  textAlign: 'left',
                  color: 'white',
                  fontSize: dimensions.width * 0.04,
                  alignSelf: 'flex-start',
                  fontFamily: prideFontPoppinsRegular,
                  fontWeight: 500,
                  marginTop: dimensions.height * 0.04,
                }}>
                My Pride
              </Text>

              {myPrides.length === 0 ? (
                <View style={{
                  width: dimensions.width * 0.93,
                  height: dimensions.height * 0.09,
                  backgroundColor: '#BF9539',
                  borderRadius: dimensions.width * 0.033,
                  marginTop: dimensions.height * 0.007,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontSize: dimensions.width * 0.04,
                      fontFamily: prideFontPoppinsRegular,
                      fontWeight: 500,
                    }}>
                    There are no animals in your pride yet...
                  </Text>
                </View>
              ) : (
                myPrides.map((pride, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedPride(pride);
                      setPrideDetailsModalVisible(true);
                    }}
                    key={pride.id} style={{
                      width: dimensions.width * 0.93,
                      height: dimensions.height * 0.12,
                      backgroundColor: '#BF9539',
                      borderRadius: dimensions.width * 0.033,
                      marginTop: dimensions.height * 0.007,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <Image
                      source={{ uri: pride.image }}
                      style={{
                        width: dimensions.height * 0.12,
                        height: dimensions.height * 0.12,
                        borderTopLeftRadius: dimensions.width * 0.033,
                        borderBottomLeftRadius: dimensions.width * 0.033,
                      }}
                      resizeMode='cover'
                    />
                    <View style={{
                      flex: 1,
                      alignItems: 'flex-start',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <View>
                        <View style={{
                          backgroundColor: '#FFC81F',
                          borderRadius: dimensions.width * 0.5,
                          paddingVertical: dimensions.height * 0.005,
                          paddingHorizontal: dimensions.width * 0.035,
                          marginTop: dimensions.height * 0.005,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: dimensions.width * 0.04,
                        }}>
                          <Text
                            style={{
                              textAlign: 'left',
                              color: 'white',
                              fontSize: dimensions.width * 0.043,
                              fontFamily: prideFontPoppinsRegular,
                              fontWeight: 600,

                            }}>
                            {pride.type}
                          </Text>
                        </View>
                        <Text
                          style={{
                            textAlign: 'left',
                            color: 'white',
                            fontSize: dimensions.width * 0.05,
                            fontFamily: prideFontPoppinsRegular,
                            fontWeight: 600,
                            marginLeft: dimensions.width * 0.04,
                          }}>
                          {pride.name}
                        </Text>
                      </View>
                      <Text
                        style={{
                          textAlign: 'left',
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: dimensions.width * 0.043,
                          fontFamily: prideFontPoppinsRegular,
                          fontWeight: 400,
                          marginRight: dimensions.width * 0.04,
                        }}>
                        {pride.dateOfBirth}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}


              <TouchableOpacity
                onPress={() => {
                  setAddLionModalVisible(true);
                }}
                style={{
                  alignSelf: 'center',
                  width: dimensions.width * 0.15,
                  height: dimensions.width * 0.15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFC81F',
                  borderRadius: dimensions.width * 0.1,
                  marginTop: dimensions.height * 0.015,
                }}>
                <PlusIcon size={dimensions.width * 0.1} color='white' />

              </TouchableOpacity>

            </ScrollView>
          </SafeAreaView>
        ) : selectedPrideQuestScreen === 'PrideSettings' ? (
          <PrideSettingsScreen setSelectedPrideQuestScreen={setSelectedPrideQuestScreen} selectedPrideQuestScreen={selectedPrideQuestScreen} 
            prideNotificationsEnabled={prideNotificationsEnabled} setPrideNotificationsEnabled={setPrideNotificationsEnabled}
          />
        ) : selectedPrideQuestScreen === 'PrideArticles' ? (
          <PrideArticlesScreen setSelectedPrideQuestScreen={setSelectedPrideQuestScreen} prideNotificationsEnabled={prideNotificationsEnabled} setPrideNotificationsEnabled={setPrideNotificationsEnabled}
          />
        ) : selectedPrideQuestScreen === 'PrideGame' ? (
          <PrideGameScreen setSelectedPrideQuestScreen={setSelectedPrideQuestScreen} />
        ) : null}


        <View
          style={{
            zIndex: 3535,
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: '#BF9539',
            bottom: dimensions.height * 0.04,
            height: dimensions.height * 0.08,
            paddingBottom: dimensions.height * 0.01,
            justifyContent: 'space-between',
            flexDirection: 'row',
            borderRadius: dimensions.width * 0.04,
            position: 'absolute',
            width: dimensions.width * 0.93,
            paddingHorizontal: dimensions.width * 0.1,
            shadowColor: 'black',
            shadowOffset: {
              width: 0,
            },
            shadowOpacity: 0.2,
            shadowRadius: 5.84,
          }}
        >
          {prideQuestButtons.map((prideButton, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedPrideQuestScreen(prideButton.prideScreenQuest)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                textDecorationLineColor: '#fff',
                borderTopWidth: selectedPrideQuestScreen === prideButton.prideScreenQuest ? dimensions.width * 0.007 : 0,
                textDecorationLine: 'underline',
                borderTopColor: '#fff',
                textDecorationLineWidth: dimensions.width * 0.005,
                height: dimensions.height * 0.068,
                opacity: selectedPrideQuestScreen === prideButton.prideScreenQuest ? 1 : 0.5,
              }}
            >
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: dimensions.height * 0.01,
              }}>
                {/* <Image
                  source={prideButton.prideQuestButtonImage}
                  style={{
                    height: dimensions.height * 0.02999,
                    textAlign: 'center',
                    width: dimensions.height * 0.02999,
                  }}
                  resizeMode="contain"
                /> */}
                {prideButton.icon}
              </View>

              <Text
                style={{
                  marginTop: dimensions.height * 0.01,
                  fontFamily: prideFontInterRegular,
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: dimensions.width * 0.033,
                  alignSelf: 'flex-start',
                }}
              >
                {prideButton.prideTitleQuest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={prideModalVisible}
          onRequestClose={() => {
            setPrideModalVisible(!prideModalVisible);
          }}
        >
          <View style={{ flex: 1 }}>
            <SafeAreaView style={{
              flex: 1,
              backgroundColor: '#967228',
            }}>
              <TouchableOpacity
                onPress={() => {
                  setPrideModalVisible(false);
                  setSelectedAnimal(null);
                }}
                style={{
                  backgroundColor: '#FFC81F',
                  width: dimensions.width * 0.17,
                  height: dimensions.width * 0.17,
                  borderRadius: dimensions.width * 0.1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  marginLeft: dimensions.width * 0.03,
                }}>
                <ArrowLeftIcon size={dimensions.width * 0.09} color='white' />
              </TouchableOpacity>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: dimensions.height * 0.2,
                }}
              >
                <LionDetailsModalComponent selectedAnimal={selectedAnimal} />
              </ScrollView>


            </SafeAreaView>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={addLionModalVisible}
          onRequestClose={() => {
            setAddLionModalVisible(!addLionModalVisible);
          }}
        >
          <View style={{ flex: 1 }}>
            <SafeAreaView style={{
              flex: 1,
              backgroundColor: '#967228',
            }}>
              <TouchableOpacity
                onPress={() => {
                  setAddLionModalVisible(false);
                }}
                style={{
                  backgroundColor: '#FFC81F',
                  width: dimensions.width * 0.17,
                  height: dimensions.width * 0.17,
                  borderRadius: dimensions.width * 0.1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  marginLeft: dimensions.width * 0.03,
                }}>
                <ArrowLeftIcon size={dimensions.width * 0.09} color='white' />
              </TouchableOpacity>

              <AddNewLionModalComponent setAddLionModalVisible={setAddLionModalVisible} />

            </SafeAreaView>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={prideDetailsModalVisible}
          onRequestClose={() => {
            setPrideDetailsModalVisible(!prideDetailsModalVisible);
          }}
        >
          <View style={{ flex: 1 }}>
            <SafeAreaView style={{
              flex: 1,
              backgroundColor: '#967228',
            }}>
              <TouchableOpacity
                onPress={() => {
                  setPrideDetailsModalVisible(false);
                }}
                style={{
                  backgroundColor: '#FFC81F',
                  width: dimensions.width * 0.17,
                  height: dimensions.width * 0.17,
                  borderRadius: dimensions.width * 0.1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  marginLeft: dimensions.width * 0.03,
                }}>
                <ArrowLeftIcon size={dimensions.width * 0.09} color='white' />
              </TouchableOpacity>

              <PrideDetailsModalComponent setPrideDetailsModalVisible={setPrideDetailsModalVisible} setSelectedPride={setSelectedPride} selectedPride={selectedPride} />

            </SafeAreaView>
          </View>
        </Modal>
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
