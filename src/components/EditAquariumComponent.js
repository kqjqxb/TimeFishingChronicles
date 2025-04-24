import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Share,
    StyleSheet,
    ImageBackground
} from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

const fontInterRegular = 'Inter-Regular';
const fontRubikRegular = 'Rubik-Regular';

const aquariumItems = [
    {
        id: 1,
        aquariumItemImage: require('../assets/images/aquariumItemsImages/chroniclesAquariumItem1.png'),
    },
    {
        id: 2,
        aquariumItemImage: require('../assets/images/aquariumItemsImages/chroniclesAquariumItem2.png'),
    },
    {
        id: 3,
        aquariumItemImage: require('../assets/images/aquariumItemsImages/chroniclesAquariumItem3.png'),
    },
    {
        id: 4,
        aquariumItemImage: require('../assets/images/aquariumItemsImages/chroniclesAquariumItem4.png'),
    },
]

const aquariumFishes = [
    {
        id: 1,
        aquariumFishesImage: require('../assets/images/aquariumFishesImages/chroniclesAquariumFish1.png'),
    },
    {
        id: 2,
        aquariumFishesImage: require('../assets/images/aquariumFishesImages/chroniclesAquariumFish2.png'),
    },
    {
        id: 3,
        aquariumFishesImage: require('../assets/images/aquariumFishesImages/chroniclesAquariumFish3.png'),
    },
    {
        id: 4,
        aquariumFishesImage: require('../assets/images/aquariumFishesImages/chroniclesAquariumFish4.png'),
    },
]

const EditAquariumComponent = ({ setSelectedAquariumPage }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createChroniclesFactsStyles(dimensions);
    const [userHasFishes, setUserHasFishes] = useState(0);
    const [isAddFishesVisible, setIsAddFishesVisible] = useState(false);

    const onShareFact = async (sharedFact) => {
        try {
            await Share.share({
                message: `${sharedFact}`,
            });
        } catch (error) {
            console.error('Error sharing text:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, position: 'relative' }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{
                        width: dimensions.width * 0.898,
                        height: dimensions.height * 0.1,
                        borderRadius: dimensions.width * 0.065,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingHorizontal: dimensions.width * 0.05,
                        backgroundColor: '#E67C1E',
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.01,
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity onPress={() => {
                            setSelectedAquariumPage('Aquarium');
                        }}>
                            <ArrowLeftIcon size={dimensions.width * 0.07} color='white' />
                        </TouchableOpacity>
                        <Text
                            style={{
                                textAlign: 'center',
                                color: 'white',
                                fontSize: dimensions.width * 0.07,
                                alignSelf: 'center',
                                fontFamily: fontInterRegular,
                                fontWeight: 800,
                                marginLeft: dimensions.width * 0.1,
                            }}>
                            My Aquarium
                        </Text>
                    </View>

                    <Image
                        source={require('../assets/images/editingAquariumPage.png')}
                        style={{
                            width: dimensions.width * 0.8,
                            height: dimensions.height * 0.3,
                            alignSelf: 'center',
                            opacity: 0.85,
                        }}
                        resizeMode='contain'
                    />

                    <View style={{
                        width: dimensions.width * 0.898,
                        paddingHorizontal: dimensions.width * 0.05,
                        paddingVertical: dimensions.height * 0.02,
                        borderRadius: dimensions.width * 0.05,
                        backgroundColor: 'white',
                        alignSelf: 'center',
                        marginTop: -dimensions.height * 0.01,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                            <View>
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        color: 'black',
                                        fontSize: dimensions.width * 0.055,
                                        fontFamily: fontInterRegular,
                                        fontWeight: 800,
                                    }}>
                                    Subjects
                                </Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        setIsAddFishesVisible((prev) => !prev);
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            color: '#486095',
                                            fontSize: dimensions.width * 0.035,
                                            fontFamily: fontInterRegular,
                                            fontWeight: 500,
                                            marginTop: dimensions.height * 0.005,
                                        }}>
                                        {!isAddFishesVisible ? 'Go to fishes' : 'Back to subjects'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                paddingHorizontal: dimensions.width * 0.05,
                                paddingVertical: dimensions.height * 0.02,
                                borderRadius: dimensions.width * 0.023,
                                borderColor: '#486095',
                                borderWidth: dimensions.width * 0.004,
                            }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: '#486095',
                                        fontSize: dimensions.width * 0.055,
                                        fontFamily: fontInterRegular,
                                        fontWeight: 800,
                                    }}>
                                    Fish: {userHasFishes}
                                </Text>

                            </View>

                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            flexWrap: 'wrap',
                            marginTop: dimensions.height * 0.01,
                        }}>
                            {isAddFishesVisible ? aquariumFishes.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        setUserHasFishes(userHasFishes + 1);
                                        onShareFact('You have caught a fish!');
                                    }}
                                    style={{
                                        width: dimensions.width * 0.38,
                                        height: dimensions.height * 0.16,
                                        borderRadius: dimensions.width * 0.03,
                                        backgroundColor: 'rgba(74, 112, 182, 0.15)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: dimensions.height * 0.012,
                                    }}>
                                    <Image
                                        source={item.aquariumFishesImage}
                                        style={{
                                            width: dimensions.width * 0.2,
                                            height: dimensions.width * 0.2,
                                            borderRadius: dimensions.width * 0.03,
                                        }}
                                        resizeMode='contain'
                                    />

                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#1E67E6',
                                            fontSize: dimensions.width * 0.033,
                                            fontFamily: fontInterRegular,
                                            fontWeight: 800,
                                        }}>
                                        Add Fish
                                    </Text>
                                </TouchableOpacity>

                            )) : aquariumItems.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setUserHasFishes(userHasFishes + 1);
                                            onShareFact('You have caught a fish!');
                                        }}
                                        style={{
                                            width: dimensions.width * 0.38,
                                            height: dimensions.height * 0.16,
                                            borderRadius: dimensions.width * 0.03,
                                            backgroundColor: 'rgba(74, 112, 182, 0.15)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: dimensions.height * 0.012,
                                        }}>
                                        <Image
                                            source={item.aquariumItemImage}
                                            style={{
                                                width: dimensions.width * 0.2,
                                                height: dimensions.width * 0.2,
                                                borderRadius: dimensions.width * 0.03,
                                            }}
                                            resizeMode='contain'
                                        />

                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                color: '#1E67E6',
                                                fontSize: dimensions.width * 0.033,
                                                fontFamily: fontInterRegular,
                                                fontWeight: 800,
                                            }}>
                                            Exchange for 10 fish
                                        </Text>
                                    </TouchableOpacity>
                                ))}

                        </View>


                    </View>




                </SafeAreaView>


            </View>
        </View>
    );
};

const createChroniclesFactsStyles = (dimensions) => StyleSheet.create({
    button: {
        width: dimensions.width * 0.5,
        height: dimensions.height * 0.09,
        borderRadius: dimensions.width * 0.04444,
        backgroundColor: '#1E67E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: dimensions.width * 0.03,
        alignSelf: 'center',
        marginTop: dimensions.height * 0.05,
        zIndex: 9999999
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: dimensions.width * 0.06,
        alignSelf: 'center',
        fontFamily: fontInterRegular,
        fontWeight: 700,
    }
});

export default EditAquariumComponent;
