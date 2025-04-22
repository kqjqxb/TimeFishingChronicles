import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { XMarkIcon } from 'react-native-heroicons/solid';

const prideFontPoppinsRegular = 'Poppins-Regular';

const prideFontInterRegular = 'Inter-Regular';

const AddNewLionModalComponent = ({ setAddLionModalVisible }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createPrideQuestHomeStyles(dimensions);

    const [lionNameInput, setLionNameInput] = useState('');
    const [lionImageInput, setLionImageInput] = useState(null);
    const [lionNotesInput, setLionNotesInput] = useState('');
    const [lionTypeInput, setLionTypeInput] = useState('');
    const [lionLocationInput, setLionLocationInput] = useState('');
    const [lionDateInput, setLionDateInput] = useState('');
    const [lionActionInput, setLionActionInput] = useState('');
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const isCanNext = lionNameInput.replace(/\s/g, '').length > 0
        && lionTypeInput.replace(/\s/g, '').length > 0 && lionLocationInput.replace(/\s/g, '').length > 0
        && lionImageInput !== null && lionImageInput !== null && lionDateInput.replace(/\s/g, '').length === 10;


    const saveNewPride = async () => {
        try {
            const storedMyPrides = await AsyncStorage.getItem('myPrides');
            const myPrides = storedMyPrides ? JSON.parse(storedMyPrides) : [];

            const newId = myPrides.length > 0
                ? Math.max(...myPrides.map(item => item.id)) + 1
                : 1;

            const newPride = {
                id: newId,
                name: lionNameInput,
                type: lionTypeInput,
                location: lionLocationInput,
                dateOfBirth: lionDateInput,
                notes: lionNotesInput ? lionNotesInput : 'No notes',
                action: lionActionInput ? lionActionInput : 'No action',
                image: lionImageInput,
            };

            myPrides.unshift(newPride);
            await AsyncStorage.setItem('myPrides', JSON.stringify(myPrides));
            setAddLionModalVisible(false);
            setLionNameInput('');
            setLionImageInput(null);
            setLionNotesInput('');
            setLionTypeInput('');
            setLionLocationInput('');
            setLionDateInput('');
            setLionActionInput('');

        } catch (error) {
            console.error('Error saving pride:', error);
        }
    };



    const pickImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
            maxWidth: 800,
            maxHeight: 800,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'An error occurred');
            } else {
                const uri = response.assets && response.assets.length > 0 ? response.assets[0].uri : null;
                if (uri) {
                    setLionImageInput(uri);
                }
            }
        });
    };

    const handleImagePress = () => {
        if (lionImageInput) {
            setShowRemoveModal(true);
        } else {
            pickImage();
        }
    };

    const getDaysInMonth = (year, month) => {
        month = parseInt(month, 10);
        year = parseInt(year, 10);
        if (isNaN(year) || isNaN(month)) return 31;
        if (month === 2) {
            return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
        } else if ([4, 6, 9, 11].includes(month)) {
            return 30;
        }
        return 31;
    };

    const handleDateInputChange = (text) => {
        const cleaned = text.replace(/[^\d]/g, '');
        let formatted = '';

        let yearPart = cleaned.slice(0, 4);
        const currentYear = new Date().getFullYear();
        if (yearPart.length === 4 && parseInt(yearPart, 10) > currentYear) {
            yearPart = currentYear.toString();
        }
        let monthPart = cleaned.slice(4, 6);
        let dayPart = cleaned.slice(6, 8);

        if (cleaned.length <= 4) {
            formatted = yearPart;
        } else if (cleaned.length <= 6) {
            if (monthPart.length === 2) {
                let monthNum = parseInt(monthPart, 10);
                if (monthNum > 12) {
                    monthNum = 12;
                }
                monthPart = monthNum.toString().padStart(2, '0');
            }
            formatted = `${yearPart}.${monthPart}`;
        } else {
            if (monthPart.length === 2) {
                let monthNum = parseInt(monthPart, 10);
                if (monthNum > 12) {
                    monthNum = 12;
                }
                monthPart = monthNum.toString().padStart(2, '0');
            }
            if (dayPart.length === 2) {
                let dayNum = parseInt(dayPart, 10);
                const maxDay = getDaysInMonth(yearPart, monthPart);
                if (dayNum > maxDay) {
                    dayNum = maxDay;
                }
                dayPart = dayNum.toString().padStart(2, '0');
            }
            formatted = `${yearPart}.${monthPart}.${dayPart}`;
        }
        setLionDateInput(formatted);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
                onPress={handleImagePress}
                style={{
                    width: dimensions.width * 0.4,
                    height: dimensions.width * 0.4,
                    borderRadius: dimensions.width * 0.5555,
                    marginLeft: dimensions.width * 0.03,
                    marginTop: dimensions.height * 0.02,
                    backgroundColor: '#BF9539',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-start',
                }}>
                {lionImageInput ? (
                    <Image
                        source={{ uri: lionImageInput }}
                        style={{
                            width: dimensions.width * 0.4,
                            height: dimensions.width * 0.4,
                            borderRadius: dimensions.width * 0.5555,
                        }}
                        resizeMode='cover'
                    />
                ) : (
                    <Image
                        source={require('../assets/images/prideCameraImage.png')}
                        style={{
                            width: dimensions.width * 0.15,
                            height: dimensions.width * 0.15,
                        }}
                        resizeMode='contain'
                    />
                )}
            </TouchableOpacity>

            <View style={styles.pridePlaceHolderViewStyles}>
                <TextInput
                    placeholder='Name'
                    maxLength={30}
                    placeholderTextColor='rgba(255, 255, 255, 0.6)'
                    value={lionNameInput}
                    onChangeText={setLionNameInput}
                    style={styles.pridePlaceHolderTextStyles}
                />

                {lionNameInput.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setLionNameInput('')}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <XMarkIcon size={dimensions.width * 0.065} color='rgba(255, 255, 255, 0.5)' />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.pridePlaceHolderViewStyles}>
                <TextInput
                    placeholder='Type'
                    maxLength={12}
                    placeholderTextColor='rgba(255, 255, 255, 0.6)'
                    value={lionTypeInput}
                    onChangeText={setLionTypeInput}
                    style={styles.pridePlaceHolderTextStyles}
                />

                {lionTypeInput.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setLionTypeInput('')}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <XMarkIcon size={dimensions.width * 0.065} color='rgba(255, 255, 255, 0.5)' />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.pridePlaceHolderViewStyles}>
                <TextInput
                    placeholder='Notes'
                    maxLength={30}
                    placeholderTextColor='rgba(255, 255, 255, 0.6)'
                    value={lionNotesInput}
                    onChangeText={setLionNotesInput}
                    style={styles.pridePlaceHolderTextStyles}
                />

                {lionNotesInput.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setLionNotesInput('')}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <XMarkIcon size={dimensions.width * 0.065} color='rgba(255, 255, 255, 0.5)' />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.pridePlaceHolderViewStyles}>
                <TextInput
                    placeholder='Location'
                    maxLength={30}
                    placeholderTextColor='rgba(255, 255, 255, 0.6)'
                    value={lionLocationInput}
                    onChangeText={setLionLocationInput}
                    style={styles.pridePlaceHolderTextStyles}
                />

                {lionLocationInput.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setLionLocationInput('')}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <XMarkIcon size={dimensions.width * 0.065} color='rgba(255, 255, 255, 0.5)' />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.pridePlaceHolderViewStyles}>
                <TextInput
                    placeholder='Actions (optional)'
                    maxLength={30}
                    placeholderTextColor='rgba(255, 255, 255, 0.6)'
                    value={lionActionInput}
                    onChangeText={setLionActionInput}
                    style={styles.pridePlaceHolderTextStyles}
                />

                {lionActionInput.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setLionActionInput('')}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <XMarkIcon size={dimensions.width * 0.065} color='rgba(255, 255, 255, 0.5)' />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.pridePlaceHolderViewStyles}>
                <TextInput
                    placeholder='Date of Birth (YYYY.MM.DD)'
                    maxLength={10}
                    keyboardType='numeric'
                    placeholderTextColor='rgba(255, 255, 255, 0.6)'
                    value={lionDateInput}
                    onChangeText={handleDateInputChange}
                    style={styles.pridePlaceHolderTextStyles}
                />

                {lionDateInput.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setLionDateInput('')}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <XMarkIcon size={dimensions.width * 0.065} color='rgba(255, 255, 255, 0.5)' />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                disabled={!isCanNext}
                onPress={saveNewPride}
                style={{
                    width: dimensions.width * 0.93,
                    height: dimensions.height * 0.07,
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: !isCanNext ? 'rgba(255, 200, 31, 0.25)' : '#FFC81F',
                    borderRadius: dimensions.width * 0.03,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                }}>

                <Text
                    style={{
                        fontFamily: prideFontInterRegular,
                        color: !isCanNext ? 'rgba(255, 192, 0, 1)' : 'white',
                        textAlign: 'center',
                        fontWeight: 800,
                        fontSize: dimensions.width * 0.055,
                    }}
                >
                    Next
                </Text>

            </TouchableOpacity>

            <Modal
                transparent={true}
                animationType="fade"
                visible={showRemoveModal}
                onRequestClose={() => setShowRemoveModal(false)}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                    <View style={{
                        width: dimensions.width * 0.8,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        padding: 20,
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: dimensions.width * 0.045,
                            marginBottom: dimensions.height * 0.02,
                        }}>
                            Do you want to remove the selected image?
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                            <TouchableOpacity
                                onPress={() => setShowRemoveModal(false)}
                                style={{
                                    flex: 1,
                                    marginRight: 10,
                                    backgroundColor: '#ccc',
                                    padding: 10,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                }}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setLionImageInput(null);
                                    setShowRemoveModal(false);
                                }}
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    backgroundColor: '#FFC81F',
                                    padding: 10,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                }}>
                                <Text>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const createPrideQuestHomeStyles = (dimensions) => StyleSheet.create({
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

export default AddNewLionModalComponent;
