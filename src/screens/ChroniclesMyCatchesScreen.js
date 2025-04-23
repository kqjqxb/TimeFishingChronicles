import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Share,
    StyleSheet,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Pressable
} from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { BlurView } from '@react-native-community/blur';
import MapView, { Marker } from 'react-native-maps';
import { MagnifyingGlassIcon, MapIcon } from 'react-native-heroicons/outline';
import { launchImageLibrary } from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fontInterRegular = 'Inter-Regular';

const ChroniclesMyCatchesScreen = ({ setSelectedTimeChroniclesPage }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isAddingMyCatchVisible, setAddingMyCatchVisible] = useState(false);
    const [isMapVisible, setMapVisible] = useState(false);
    const [myCatches, setMyCatches] = useState([]);
    const [catchDetailsModalVisible, setCatchDetailsModalVisible] = useState(false);
    const styles = createChroniclesFactsStyles(dimensions);

    const [searchInput, setSearchInput] = useState('');
    const [fishingSpotInput, setFishingSpotInput] = useState('');
    const [typeOfFishInput, setTypeOfFishInput] = useState('');
    const [fishingDateInput, setFishingDateInput] = useState('');
    const [imageOfFishing, setImageOfFishing] = useState('');
    const [fishingCoordinates, setFishingCoordinates] = useState({
        latitude: null,
        longitude: null,
    });
    const [selectedLocationCoordinates, setSelectedLocationCoordinates] = useState({
        latitude: 65.81515774443307,
        longitude: -16.384618945093,
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCatchedFish, setSelectedCatchedFish] = useState(null);

    const isCanSave =
        (fishingSpotInput.replace(/\s/g, '').length > 0 ||
            (fishingCoordinates.latitude !== null && fishingCoordinates.longitude !== null)) &&
        typeOfFishInput.replace(/\s/g, '').length > 0 &&
        fishingDateInput.replace(/\s/g, '').length === 10 &&
        (imageOfFishing !== '' && imageOfFishing !== null);

    const shareCatched = async (catchedFish) => {
        try {
            await Share.share({
                message: `I catched${catchedFish.typeOfFish} at ${catchedFish.fishingSpot ? catchedFish.fishingSpot : `(${Number(catchedFish.coordinates.latitude).toFixed(4)}, ${Number(catchedFish.coordinates.longitude).toFixed(4)})`} on ${catchedFish.fishingDate}. Check it out!`,
            });
        } catch (error) {
            console.error('Error sharing text:', error);
        }
    };

    useEffect(() => {
        const loadMyCatches = async () => {
            try {
                const storedCatches = await AsyncStorage.getItem('myCatches');
                if (storedCatches !== null) {
                    setMyCatches(JSON.parse(storedCatches));
                }
            } catch (error) {
                console.error('Error loading my catches:', error);
            }
        };
        loadMyCatches();
    }, [isAddingMyCatchVisible]);



    const clearVariables = () => {
        setFishingSpotInput('');
        setTypeOfFishInput('');
        setFishingDateInput('');
        setImageOfFishing('');
        setFishingCoordinates({
            latitude: null,
            longitude: null,
        });
    };

    const handleSelectImage = () => {
        if (imageOfFishing) {
            setShowDeleteModal(true);
        } else {
            launchImageLibrary(
                { mediaType: 'photo', quality: 0.7 },
                (response) => {
                    if (!response.didCancel && response.assets && response.assets.length > 0) {
                        setImageOfFishing(response.assets[0].uri);
                    }
                }
            );
        }
    };

    const handleDateChange = (input) => {
        let chroniclesDigits = input.replace(/\D/g, '');
        if (chroniclesDigits.length > 8) chroniclesDigits = chroniclesDigits.substr(0, 8);

        let chroniclesFormatted = '';
        if (chroniclesDigits.length <= 4) {
            chroniclesFormatted = chroniclesDigits;
        } else if (chroniclesDigits.length <= 6) {
            chroniclesFormatted = chroniclesDigits.substr(0, 4) + '.' + chroniclesDigits.substr(4);
        } else {
            chroniclesFormatted = chroniclesDigits.substr(0, 4) + '.' + chroniclesDigits.substr(4, 2) + '.' + chroniclesDigits.substr(6);
        }

        if (chroniclesDigits.length >= 6) {
            const chroniclesYear = parseInt(chroniclesDigits.substr(0, 4), 10);
            let chroniclesMonth = parseInt(chroniclesDigits.substr(4, 2), 10);
            if (chroniclesMonth > 12) {
                chroniclesMonth = 12;
                chroniclesDigits = chroniclesDigits.substr(0, 4) + '12' + chroniclesDigits.substr(6);
                chroniclesFormatted = chroniclesDigits.length <= 6
                    ? chroniclesDigits.substr(0, 4) + '.' + chroniclesDigits.substr(4)
                    : chroniclesDigits.substr(0, 4) + '.' + chroniclesDigits.substr(4, 2) + '.' + chroniclesDigits.substr(6);
            }
            let chroniclesMaxDay = 31;
            if (chroniclesMonth === 2) {
                chroniclesMaxDay = ((chroniclesYear % 4 === 0 && chroniclesYear % 100 !== 0) || (chroniclesYear % 400 === 0)) ? 29 : 28;
            } else if ([4, 6, 9, 11].includes(chroniclesMonth)) {
                chroniclesMaxDay = 30;
            }
            if (chroniclesDigits.length >= 8) {
                let chroniclesDay = parseInt(chroniclesDigits.substr(6, 2), 10);
                if (chroniclesDay > chroniclesMaxDay) {
                    chroniclesDay = chroniclesMaxDay;
                    const dayStr = chroniclesDay < 10 ? '0' + chroniclesDay : '' + chroniclesDay;
                    chroniclesDigits = chroniclesDigits.substr(0, 6) + dayStr;
                    chroniclesFormatted = chroniclesDigits.substr(0, 4) + '.' + chroniclesDigits.substr(4, 2) + '.' + chroniclesDigits.substr(6, 2);
                }
                const inputDate = new Date(chroniclesYear, chroniclesMonth - 1, chroniclesDay);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (inputDate > today) {
                    const curYear = today.getFullYear();
                    const chroniclesCurMonth = today.getMonth() + 1;
                    const chroniclesCurDay = today.getDate();
                    const chroniclesMonthStr = chroniclesCurMonth < 10 ? '0' + chroniclesCurMonth : '' + chroniclesCurMonth;
                    const curDayStr = chroniclesCurDay < 10 ? '0' + chroniclesCurDay : '' + chroniclesCurDay;
                    chroniclesFormatted = curYear + '.' + chroniclesMonthStr + '.' + curDayStr;
                }
            }
        }
        setFishingDateInput(chroniclesFormatted);
    };

    const handleSaveCatch = async () => {
        let newId = Date.now().toString();

        const newCatch = {
            id: newId,
            fishingSpot: fishingSpotInput,
            typeOfFish: typeOfFishInput,
            fishingDate: fishingDateInput,
            image: imageOfFishing,
            coordinates: fishingCoordinates,
        };

        const updatedCatches = [...myCatches, newCatch];
        setMyCatches(updatedCatches);

        try {
            await AsyncStorage.setItem('myCatches', JSON.stringify(updatedCatches));
        } catch (error) {
            console.error('Error saving catch:', error);
        }

        clearVariables();
        setAddingMyCatchVisible(false);
    };

    const handleDeleteCatch = async () => {
        if (!selectedCatchedFish) return;
        const updatedCatches = myCatches.filter(item => item.id !== selectedCatchedFish.id);
        setMyCatches(updatedCatches);
        try {
            await AsyncStorage.setItem('myCatches', JSON.stringify(updatedCatches));
        } catch (error) {
            console.error('Error deleting catch:', error);
        }
        setSelectedCatchedFish(null);
        setCatchDetailsModalVisible(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }} accessible={false}>


                <View style={{ flex: 1, position: 'relative' }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: dimensions.width * 0.7,
                        alignSelf: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (isMapVisible) {
                                    setMapVisible(false);
                                    setFishingCoordinates({
                                        latitude: selectedLocationCoordinates.latitude,
                                        longitude: selectedLocationCoordinates.longitude,
                                    });
                                }
                                else if (isAddingMyCatchVisible)
                                    setAddingMyCatchVisible(false);
                                else {
                                    setSelectedTimeChroniclesPage('Home');
                                    clearVariables();
                                }
                            }}
                            style={{
                                width: dimensions.width * 0.16,
                                height: dimensions.width * 0.16,
                                borderRadius: dimensions.width * 0.03,
                                backgroundColor: '#1E67E6',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: dimensions.width * 0.03,
                            }}>
                            <ArrowLeftIcon size={dimensions.width * 0.06} color='white' />
                        </TouchableOpacity>

                        <View style={{
                            width: dimensions.width * 0.5,
                            height: dimensions.width * 0.16,
                            borderRadius: dimensions.width * 0.03,
                            borderWidth: dimensions.width * 0.004,
                            borderColor: '#1E67E6',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: 'white',
                                    fontSize: dimensions.width * 0.05,
                                    alignSelf: 'center',
                                    fontFamily: fontInterRegular,
                                    fontWeight: 700,
                                }}>
                                {isAddingMyCatchVisible ? 'Add catch' : 'My catches'}
                            </Text>
                        </View>
                    </View>

                    {!isAddingMyCatchVisible ? (
                        <>
                            {myCatches.length === 0 ? (
                                <>
                                    <Text style={[styles.buttonText, {
                                        fontWeight: 400,
                                        marginTop: dimensions.height * 0.2,
                                        marginBottom: dimensions.height * 0.01,
                                    }]}>
                                        No cathes
                                    </Text>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setAddingMyCatchVisible(true);
                                        }}
                                        style={[styles.button, {
                                            alignSelf: 'center',
                                            zIndex: 9999999
                                        }]}>
                                        <Text style={styles.buttonText}>
                                            Add
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <View
                                        onPress={() => {
                                            setAddingMyCatchVisible(true);
                                        }}
                                        style={[styles.button, {
                                            alignSelf: 'center',
                                            width: dimensions.width * 0.898,
                                            height: dimensions.height * 0.07,
                                            marginBottom: dimensions.height * 0.03,
                                            marginTop: dimensions.height * 0.03,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: dimensions.width * 0.04,
                                        }]}>
                                        <TextInput
                                            style={{
                                                width: dimensions.width * 0.7,
                                                height: dimensions.height * 0.07,
                                                backgroundColor: 'transparent',
                                                borderWidth: dimensions.width * 0.004,
                                                borderColor: '#1E67E6',
                                                borderRadius: dimensions.width * 0.05551,
                                                alignSelf: 'flex-start',
                                                color: 'white',
                                                fontWeight: searchInput.replace(/\s/g, '').length > 0 ? 600 : 500,
                                                fontSize: dimensions.width * 0.04,
                                            }}
                                            placeholder='Search'
                                            placeholderTextColor='#B5D0FF'
                                            value={searchInput}
                                            onChangeText={setSearchInput}
                                        />

                                        <MagnifyingGlassIcon size={dimensions.height * 0.04} color='#B5D0FF' />
                                    </View>

                                    <ScrollView showsVerticalScrollIndicator={false} style={{}}
                                        contentContainerStyle={{
                                            paddingBottom: dimensions.height * 0.21212121,
                                        }}
                                    >
                                        {myCatches
                                            .filter(item =>
                                                item.typeOfFish.toLowerCase().includes(searchInput.toLowerCase())
                                            ).map((catchedItem, index) => (
                                                <Pressable key={catchedItem.id} style={{
                                                    width: dimensions.width * 0.898,
                                                    backgroundColor: 'transparent',
                                                    borderWidth: dimensions.width * 0.004,
                                                    borderColor: '#1E67E6',
                                                    borderRadius: dimensions.width * 0.05551,
                                                    marginBottom: dimensions.height * 0.01,
                                                    alignSelf: 'center',
                                                    paddingHorizontal: dimensions.width * 0.04,
                                                    paddingVertical: dimensions.height * 0.02,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}>
                                                    <View style={{
                                                        width: '45%',
                                                    }}>
                                                        <Text style={[styles.buttonText, {
                                                            textAlign: 'left',
                                                            alignSelf: 'flex-start',
                                                            maxWidth: '100%',
                                                        }]}
                                                            numberOfLines={1}
                                                            ellipsizeMode='tail'
                                                        >
                                                            {catchedItem.typeOfFish}
                                                        </Text>

                                                        <View style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'flex-start',
                                                            marginTop: dimensions.height * 0.01,
                                                        }}>
                                                            <MapIcon size={dimensions.width * 0.06} color='#B5D0FF' />
                                                            <Text style={[styles.buttonText, {
                                                                textAlign: 'left',
                                                                fontSize: dimensions.width * 0.04,
                                                                marginLeft: dimensions.width * 0.02,
                                                                fontWeight: 500,
                                                            }]}>
                                                                {catchedItem.fishingSpot
                                                                    ? catchedItem.fishingSpot
                                                                    : `${Number(catchedItem.coordinates.latitude).toFixed(4)}, ${Number(catchedItem.coordinates.longitude).toFixed(4)}`}
                                                            </Text>
                                                        </View>

                                                        <View style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'flex-start',
                                                            marginTop: dimensions.height * 0.01,
                                                        }}>
                                                            <Image
                                                                source={require('../assets/images/chroniclesCalendarImage.png')}
                                                                style={{
                                                                    width: dimensions.width * 0.05,
                                                                    height: dimensions.width * 0.05,
                                                                }}
                                                                resizeMode='contain'
                                                            />
                                                            <Text style={[styles.buttonText, {
                                                                textAlign: 'left',
                                                                fontSize: dimensions.width * 0.04,
                                                                marginLeft: dimensions.width * 0.02,
                                                                fontWeight: 500,
                                                            }]}>
                                                                {catchedItem.fishingDate}
                                                            </Text>
                                                        </View>

                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setSelectedCatchedFish(catchedItem);
                                                                setCatchDetailsModalVisible(true);
                                                            }}
                                                            style={[styles.button, {
                                                                alignSelf: 'center',
                                                                width: '100%',
                                                                height: dimensions.height * 0.06,
                                                                marginTop: dimensions.height * 0.03,
                                                            }]}>
                                                            <Text style={styles.buttonText}>
                                                                Open
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <Image
                                                        source={{ uri: catchedItem.image }}
                                                        style={{
                                                            width: '50%',
                                                            height: undefined,
                                                            aspectRatio: 1,
                                                            borderRadius: dimensions.width * 0.04,
                                                            borderColor: '#1E67E6',
                                                            borderWidth: dimensions.width * 0.004,
                                                        }}
                                                        resizeMode='stretch'
                                                    />

                                                </Pressable>
                                            ))}
                                    </ScrollView>


                                    <TouchableOpacity
                                        onPress={() => {
                                            setAddingMyCatchVisible(true);
                                        }}
                                        style={[styles.button, {
                                            alignSelf: 'center',
                                            zIndex: 9999999,
                                            position: 'absolute',
                                            bottom: dimensions.height * 0.03,
                                            shadowColor: '#002357',
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.7,
                                            shadowRadius: dimensions.width * 0.04,
                                            elevation: 5,
                                        }]}>
                                        <Text style={styles.buttonText}>
                                            Add
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {!isMapVisible ? (
                                <>
                                    <View style={{
                                        width: dimensions.width * 0.898,
                                        alignSelf: 'center',
                                        marginTop: dimensions.height * 0.03,
                                    }}>
                                        <Text style={styles.lineTitleText}>
                                            Fishing spot:
                                        </Text>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: dimensions.height * 0.01,
                                        }}>
                                            <TextInput
                                                style={{
                                                    width: dimensions.width * 0.7,
                                                    height: dimensions.height * 0.08,
                                                    backgroundColor: 'transparent',
                                                    borderWidth: dimensions.width * 0.004,
                                                    borderColor: '#1E67E6',
                                                    borderRadius: dimensions.width * 0.05551,
                                                    paddingHorizontal: dimensions.width * 0.03,
                                                    alignSelf: 'flex-start',
                                                    color: 'white',
                                                    fontWeight: 500,
                                                }}
                                                placeholder='Write a place or select it on the map'
                                                placeholderTextColor='white'
                                                value={fishingSpotInput}
                                                onChangeText={setFishingSpotInput}
                                            />

                                            <TouchableOpacity
                                                onPress={() => {
                                                    setMapVisible(true);
                                                }}
                                                style={{
                                                    width: dimensions.width * 0.16,
                                                    height: dimensions.height * 0.08,
                                                    borderRadius: dimensions.width * 0.04,
                                                    backgroundColor: '#1E67E6',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                <MapIcon size={dimensions.width * 0.07} color='white' />
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={styles.lineTitleText}>
                                            Type of fish:
                                        </Text>

                                        <TextInput
                                            style={styles.chroniclesInput}
                                            placeholder='Write type of fish'
                                            placeholderTextColor='white'
                                            value={typeOfFishInput}
                                            onChangeText={setTypeOfFishInput}
                                        />

                                        <Text style={styles.lineTitleText}>
                                            Date:
                                        </Text>

                                        <TextInput
                                            style={styles.chroniclesInput}
                                            placeholder='yyyy-mm-dd'
                                            placeholderTextColor='white'
                                            value={fishingDateInput}
                                            onChangeText={handleDateChange}
                                            keyboardType='numeric'
                                        />

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: dimensions.height * 0.03,
                                        }}>
                                            <Text style={[styles.buttonText, {
                                                fontWeight: 700,
                                                fontSize: dimensions.width * 0.04,
                                            }]}>
                                                Photo of the catch:
                                            </Text>

                                            {imageOfFishing ? (
                                                <TouchableOpacity
                                                    onPress={handleSelectImage}
                                                    style={{
                                                    }}>
                                                    <Image
                                                        source={{ uri: imageOfFishing }}
                                                        style={{
                                                            width: dimensions.width * 0.5,
                                                            height: dimensions.height * 0.125,
                                                            borderRadius: dimensions.width * 0.04,
                                                        }}
                                                        resizeMode='stretch'
                                                    />

                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={handleSelectImage}
                                                    style={{
                                                        width: dimensions.width * 0.5,
                                                        flex: 1,
                                                        marginLeft: dimensions.width * 0.03,
                                                        height: dimensions.height * 0.125,
                                                        borderRadius: dimensions.width * 0.04,
                                                        backgroundColor: '#1E67E6',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                    <Image
                                                        source={require('../assets/images/chroniclesCameraImage.png')}
                                                        style={{
                                                            width: dimensions.width * 0.1,
                                                            height: dimensions.width * 0.1,
                                                        }}
                                                        resizeMode='contain'
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        disabled={!isCanSave}
                                        onPress={handleSaveCatch}
                                        style={[styles.button, {
                                            alignSelf: 'center',
                                            zIndex: 9999999,
                                            marginTop: dimensions.height * 0.1,
                                            opacity: isCanSave ? 1 : 0.5,
                                        }]}>
                                        <Text style={styles.buttonText}>
                                            Save
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <MapView
                                        style={{
                                            marginTop: dimensions.height * 0.01,
                                            zIndex: 50,
                                            alignSelf: 'center',
                                            height: dimensions.height * 0.8,
                                            width: dimensions.width,
                                        }}
                                        region={{
                                            latitude: selectedLocationCoordinates.latitude,
                                            longitude: selectedLocationCoordinates.longitude,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01,
                                        }}
                                        onPress={(e) => {
                                            const { coordinate } = e.nativeEvent;
                                            setSelectedLocationCoordinates(coordinate);
                                        }}
                                    >
                                        <Marker
                                            coordinate={selectedLocationCoordinates}
                                            pinColor={"#1E67E6"}
                                        />
                                    </MapView>
                                </>
                            )}
                        </>
                    )}
                </View>
            </TouchableWithoutFeedback>

            <Modal
                animationType="fade"
                transparent={true}
                visible={catchDetailsModalVisible}
                onRequestClose={() => {
                    setCatchDetailsModalVisible(!catchDetailsModalVisible);
                }}
            >
                <TouchableWithoutFeedback onPress={() => {
                    setCatchDetailsModalVisible(false);
                    setTimeout(() => {
                        setSelectedCatchedFish(null);
                    }, 100);
                }}>


                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                backgroundColor: 'rgba(0, 35, 87, 0.3)'
                            }}
                        />
                        <BlurView
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                            }}
                            blurType="dark"
                            blurAmount={5}
                        />

                        

                        <View style={{
                            width: dimensions.width * 0.898,
                            backgroundColor: 'transparent',
                            borderWidth: dimensions.width * 0.004,
                            borderColor: '#1E67E6',
                            borderRadius: dimensions.width * 0.05551,
                            marginBottom: dimensions.height * 0.01,
                            alignSelf: 'center',
                            paddingHorizontal: dimensions.width * 0.04,
                            paddingVertical: dimensions.height * 0.02,
                        }}>
                            <Image
                                source={{ uri: selectedCatchedFish?.image }}
                                style={{
                                    width: '100%',
                                    height: dimensions.height * 0.185,
                                    borderRadius: dimensions.width * 0.04,
                                    borderColor: '#1E67E6',
                                    borderWidth: dimensions.width * 0.004,
                                }}
                                resizeMode='stretch'
                            />
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: dimensions.height * 0.02,
                            }}>
                                <Text style={[styles.buttonText, {
                                    textAlign: 'left',
                                    alignSelf: 'flex-start',
                                    maxWidth: '65%',
                                }]}

                                >
                                    {selectedCatchedFish?.typeOfFish} f f f f f f  f f f f f f f f f f
                                </Text>

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    alignSelf: 'flex-start',
                                }}>
                                    <Image
                                        source={require('../assets/images/chroniclesCalendarImage.png')}
                                        style={{
                                            width: dimensions.width * 0.045,
                                            height: dimensions.width * 0.045,
                                        }}
                                        resizeMode='contain'
                                    />
                                    <Text style={[styles.buttonText, {
                                        textAlign: 'left',
                                        fontSize: dimensions.width * 0.035,
                                        marginLeft: dimensions.width * 0.02,
                                        fontWeight: 500,
                                    }]}>
                                        {selectedCatchedFish?.fishingDate}
                                    </Text>
                                </View>


                            </View>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginTop: dimensions.height * 0.01,
                            }}>
                                <MapIcon size={dimensions.width * 0.055} color='#B5D0FF' />
                                <Text style={[styles.buttonText, {
                                    textAlign: 'left',
                                    fontSize: dimensions.width * 0.04,
                                    marginLeft: dimensions.width * 0.02,
                                    fontWeight: 500,
                                }]}>
                                    {selectedCatchedFish?.fishingSpot}
                                </Text>
                            </View>


                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                marginTop: dimensions.height * 0.01,
                            }}>
                                <TouchableOpacity
                                    onPress={handleDeleteCatch}
                                    style={[styles.button, {
                                        alignSelf: 'center',
                                        width: '33%',
                                        height: dimensions.height * 0.06,
                                        backgroundColor: '#FF6C6C',
                                        marginTop: 0,
                                    }]}>
                                    <Text style={[styles.buttonText, {
                                        fontSize: dimensions.width * 0.043,
                                    }]}>
                                        Delete
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        shareCatched(selectedCatchedFish);
                                    }}
                                    style={[styles.button, {
                                        alignSelf: 'center',
                                        width: '33%',
                                        marginLeft: dimensions.width * 0.025,
                                        height: dimensions.height * 0.06,
                                        marginTop: 0,
                                    }]}>
                                    <Text style={[styles.buttonText, {
                                        fontSize: dimensions.width * 0.043,
                                    }]}>
                                        Share
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal
                transparent
                visible={showDeleteModal}
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Animatable.View
                        animation="bounceIn"
                        duration={500}
                        style={{
                            width: dimensions.width * 0.8,
                            padding: 20,
                            backgroundColor: '#1E67E6',
                            borderRadius: 10,
                            alignItems: 'center'
                        }}
                    >
                        <Text style={[styles.buttonText, {
                            marginBottom: dimensions.height * 0.02,
                        }]}>
                            Are you sure you want to delete this image?
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                            <TouchableOpacity
                                onPress={() => setShowDeleteModal(false)}
                                style={{
                                    backgroundColor: '#5bc0de',
                                    padding: dimensions.width * 0.03,
                                    borderRadius: dimensions.width * 0.02,
                                    width: '40%',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={[styles.buttonText, {
                                    fontSize: dimensions.width * 0.045,
                                }]}>No</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setImageOfFishing('');
                                    setShowDeleteModal(false);
                                }}
                                style={{
                                    backgroundColor: '#d9534f',
                                    padding: dimensions.width * 0.03,
                                    borderRadius: dimensions.width * 0.02,
                                    width: '40%',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={[styles.buttonText, {
                                    fontSize: dimensions.width * 0.045,
                                }]}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const createChroniclesFactsStyles = (dimensions) => StyleSheet.create({
    button: {
        width: dimensions.width * 0.34,
        height: dimensions.height * 0.085,
        borderRadius: dimensions.width * 0.04444,
        backgroundColor: '#1E67E6',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: dimensions.height * 0.05,
        zIndex: 9999999
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: dimensions.width * 0.05,
        alignSelf: 'center',
        fontFamily: fontInterRegular,
        fontWeight: 700,
    },
    lineTitleText: {
        textAlign: 'left',
        color: 'white',
        fontSize: dimensions.width * 0.05,
        alignSelf: 'flex-start',
        marginTop: dimensions.height * 0.02,
        fontFamily: fontInterRegular,
        fontWeight: 700,
    },
    chroniclesInput: {
        width: dimensions.width * 0.898,
        height: dimensions.height * 0.08,
        backgroundColor: 'transparent',
        borderWidth: dimensions.width * 0.004,
        borderColor: '#1E67E6',
        borderRadius: dimensions.width * 0.05551,
        paddingHorizontal: dimensions.width * 0.03,
        alignSelf: 'center',
        marginTop: dimensions.height * 0.01,
        color: 'white',
        fontWeight: 500,
    }
});

export default ChroniclesMyCatchesScreen;
