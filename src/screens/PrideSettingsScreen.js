import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Switch,
    Modal,
    Animated,
    Linking
} from 'react-native';
import { ChevronRightIcon, StarIcon as SolidStarIcon } from 'react-native-heroicons/solid';
import { StarIcon as OutlineStarIcon } from 'react-native-heroicons/outline';

const prideFontPoppinsRegular = 'Poppins-Regular';

const PrideSettingsScreen = ({ prideNotificationsEnabled, setPrideNotificationsEnabled }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createPrideQuestSettingsStyles(dimensions);
    const [rateModalVisible, setRateModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const scaleValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (rateModalVisible) {
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
                friction: 5,
            }).start();
        } else {
            scaleValue.setValue(0);
        }
    }, [rateModalVisible]);

    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity activeOpacity={0.8} key={`star-${i}`} onPress={() => setRating(i)}>
                    {i <= rating
                        ? <SolidStarIcon size={dimensions.height * 0.04} color='rgba(191, 149, 57, 1)' />
                        : <OutlineStarIcon size={dimensions.height * 0.04} color='rgba(191, 149, 57, 1)' />
                    }
                </TouchableOpacity>
            );
        }
        return stars;
    };

    const saveRating = () => {
        setRateModalVisible(false);
        setRating(0);
        Linking.openURL(`https://apps.apple.com/us/app/molah-pride-quest/id6744814642`);

    };

    const closeRatingModal = () => {
        setRateModalVisible(false);
        setRating(0);
    };

    const toggleNotifications = async (value) => {
        try {
            setPrideNotificationsEnabled(value);
            await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));
        } catch (error) {
            console.error('Error updating notifications setting:', error);
        }
    };

    return (
        <SafeAreaView style={{ width: dimensions.width }}>
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
                Settings
            </Text>

            <Image
                source={require('../assets/images/modalLionImage.png')}
                style={{
                    width: dimensions.width * 0.7,
                    height: dimensions.height * 0.2,
                    marginLeft: dimensions.width * 0.05,
                    alignSelf: 'center',
                    position: 'relative',
                }}
                resizeMode='contain'
            />

            <View style={[styles.prideFlexRowViewStyles, { marginTop: dimensions.height * 0.03 }]}>
                <Text
                    style={{
                        textAlign: 'left',
                        color: 'white',
                        fontSize: dimensions.width * 0.045,
                        fontFamily: prideFontPoppinsRegular,
                        fontWeight: 500,
                    }}>
                    Notifications
                </Text>
                <Switch
                    trackColor={{ false: 'rgb(95, 74, 29)', true: '#FFC81F' }}
                    thumbColor={'white'}
                    ios_backgroundColor="rgb(95, 74, 29)"
                    value={prideNotificationsEnabled}
                    onValueChange={(value) => toggleNotifications(value)}
                />
            </View>

            <TouchableOpacity style={[styles.prideFlexRowViewStyles, { marginTop: dimensions.height * 0.03 }]}
                onPress={() => {
                    Linking.openURL('https://www.termsfeed.com/live/246251fc-0aa5-4f3a-8f63-26705af57a76');
                }}>
                <Text
                    style={{
                        textAlign: 'left',
                        color: 'white',
                        fontSize: dimensions.width * 0.045,
                        fontFamily: prideFontPoppinsRegular,
                        fontWeight: 500,
                    }}>
                    Privacy Policy
                </Text>
                <ChevronRightIcon size={dimensions.height * 0.03} color='white' />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.prideFlexRowViewStyles, { marginTop: dimensions.height * 0.03 }]}
                onPress={() => setRateModalVisible(true)}>
                <Text
                    style={{
                        textAlign: 'left',
                        color: 'white',
                        fontSize: dimensions.width * 0.045,
                        fontFamily: prideFontPoppinsRegular,
                        fontWeight: 500,
                    }}>
                    Rate Us
                </Text>
                <ChevronRightIcon size={dimensions.height * 0.03} color='white' />
            </TouchableOpacity>

            <Modal visible={rateModalVisible} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    <Animated.View style={{
                        width: dimensions.width * 0.8,
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.035,
                        padding: dimensions.width * 0.05,
                        alignItems: 'center',
                        transform: [{ scale: scaleValue }]
                    }}>
                        <Text style={{ fontSize: dimensions.width * 0.05, }}>Rate Us</Text>
                        <View style={{ flexDirection: 'row', marginVertical: dimensions.height * 0.02 }}>
                            {renderStars()}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <TouchableOpacity onPress={closeRatingModal}
                                style={{
                                    borderRadius: dimensions.width * 0.015,
                                    backgroundColor: '#ddd',
                                    flex: 1,
                                    marginRight: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Text style={{
                                    textAlign: 'left',
                                    color: 'black',
                                    fontSize: dimensions.width * 0.045,
                                    fontFamily: prideFontPoppinsRegular,
                                    fontWeight: 500,
                                }}>
                                    Close
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={saveRating}
                                style={{
                                    padding: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#FFC81F',
                                    flex: 1,
                                    marginLeft: 5,
                                    alignItems: 'center'
                                }}>
                                <Text style={{
                                    textAlign: 'left',
                                    color: 'black',
                                    fontSize: dimensions.width * 0.045,
                                    fontFamily: prideFontPoppinsRegular,
                                    fontWeight: 500,
                                }}>
                                    Save
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const createPrideQuestSettingsStyles = (dimensions) => StyleSheet.create({
    prideFlexRowViewStyles: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: dimensions.width * 0.93,
        borderBottomColor: 'rgba(255, 255, 255, 0.45)',
        borderBottomWidth: dimensions.width * 0.004,
        paddingBottom: dimensions.height * 0.015,
    }
});

export default PrideSettingsScreen;
