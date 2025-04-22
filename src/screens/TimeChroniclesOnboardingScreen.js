import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native';
import fishingOnboardingData from '../components/fishingOnboardingData';
import { useNavigation } from '@react-navigation/native';

const fontRubikRegular = 'Rubik-Regular';

const TimeChroniclesOnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [currentTimeChroniclesIndex, setCurrentTimeChroniclesIndex] = useState(0);
  const timeChroniclesRef = useRef(null);
  const timeChroniclesRefHorizontalScrollX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);
    return () => {
      dimensionListener.remove();
    };
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentTimeChroniclesIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollNextTimeChroniclesSlide = () => {
    if (currentTimeChroniclesIndex >= fishingOnboardingData.length - 1) {
      navigation.replace('TimeChroniclesHome');
    } else {
      timeChroniclesRef.current.scrollToIndex({ index: currentTimeChroniclesIndex + 1 });
    }
  };

  const timechroniclesItemRender = ({ item }) => (
    <View style={{
      width: dimensions.width,
      alignItems: 'center',
      height: dimensions.height,
      flex: 1,
      justifyContent: 'space-between',
    }}>
      <View style={{
        width: dimensions.width,
        alignItems: 'center',
        alignSelf: 'flex-start',
      }}>
        <Image
          source={item.itemImage}
          style={{
            width: dimensions.width * 0.9,
            alignSelf: 'center',
            height: dimensions.height * 0.39999,
            marginTop: dimensions.height * 0.1,
          }}
          resizeMode="contain"
        />
        <View style={{
          paddingVertical: dimensions.height * 0.02,
          paddingHorizontal: dimensions.width * 0.03,
          width: dimensions.width * 0.898,
          backgroundColor: 'white',
          alignSelf: 'center',
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
              color: '#00286E',
            }}>
            {item.upText}
          </Text>
          <Text
            style={{
              maxWidth: dimensions.width * 0.8,
              fontFamily: fontRubikRegular,
              textAlign: 'center',
              paddingHorizontal: dimensions.width * 0.05,
              color: '#00286E',
              alignSelf: 'center',
              marginTop: dimensions.height * 0.015,
              fontSize: dimensions.width * 0.036,
              fontWeight: 700,
            }}>
            {item.bottomText}
          </Text>

          <TouchableOpacity
            onPress={() => {
              scrollNextTimeChroniclesSlide();
            }}
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: dimensions.height * 0.03,
              backgroundColor: '#00286E',
              height: dimensions.height * 0.08,
              width: dimensions.width * 0.45,
            }}
          >
            <Text
              style={{
                paddingHorizontal: dimensions.width * 0.05,
                color: '#fff',
                fontWeight: 700,
                fontFamily: fontRubikRegular,
                fontSize: dimensions.width * 0.06,
                textAlign: 'center',
              }}>
              {currentTimeChroniclesIndex === 0 ? 'Hello!' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView 
      style={{
        justifyContent: 'space-between',
        backgroundColor: '#002357',
        flex: 1,
        alignItems: 'center',
      }}
    >
      <View style={{ display: 'flex' }}>
        <FlatList
          horizontal
          scrollEventThrottle={32}
          keyExtractor={(item) => item.id.toString()}
          renderItem={timechroniclesItemRender}
          pagingEnabled
          onViewableItemsChanged={viewableItemsChanged}
          ref={timeChroniclesRef}
          bounces={false}
          data={fishingOnboardingData}
          viewabilityConfig={viewConfig}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: timeChroniclesRefHorizontalScrollX } } }], {
            useNativeDriver: false,
          })}
        />
      </View>
    </SafeAreaView>
  );
};

export default TimeChroniclesOnboardingScreen;
