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
import EditAquariumComponent from '../components/EditAquariumComponent';
import CatchFishComponent from '../components/CatchFishComponent';

const fontInterRegular = 'Inter-Regular';
const fontRubikRegular = 'Rubik-Regular';

const ChroniclesAquariumScreen = ({ setSelectedTimeChroniclesPage }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createChroniclesFactsStyles(dimensions);

    const [selectedAquariumPage, setSelectedAquariumPage] = useState('Aquarium');

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, position: 'relative' }}>
                <ImageBackground
                    source={selectedAquariumPage === 'Catch a fish' 
                        ? require('../assets/images/catchFishBgImage.png')
                        : require('../assets/images/chroniclesAquariumBackground.png')}
                    style={{
                        width: dimensions.width,
                        height: dimensions.height,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                    }}
                    resizeMode="cover"
                />
                <SafeAreaView style={{ flex: 1 }}>
                    {selectedAquariumPage === 'Aquarium' ? (
                        <>
                            <View style={{
                                width: dimensions.width * 0.898,
                                height: dimensions.height * 0.1,
                                borderRadius: dimensions.width * 0.065,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#E67C1E',
                                alignSelf: 'center',
                                marginTop: dimensions.height * 0.01,
                            }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: dimensions.width * 0.07,
                                        alignSelf: 'center',
                                        fontFamily: fontInterRegular,
                                        fontWeight: 800,

                                    }}>
                                    My Aquarium
                                </Text>
                            </View>

                            <Image
                                source={require('../assets/images/aquariumImage.png')}
                                style={{
                                    width: dimensions.width * 0.8,
                                    height: dimensions.height * 0.3,
                                    alignSelf: 'center',
                                }}
                                resizeMode='contain'
                            />

                            {['Catch a fish', 'Edit aquarium'].map((button, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        setSelectedAquariumPage(button);
                                    }}
                                    style={{
                                        width: dimensions.width * 0.7,
                                        height: dimensions.height * 0.1,
                                        backgroundColor: '#fff',
                                        borderRadius: dimensions.width * 0.04,
                                        marginBottom: dimensions.height * 0.01,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Text
                                        style={{
                                            paddingHorizontal: dimensions.width * 0.05,
                                            textAlign: 'center',
                                            fontSize: dimensions.width * 0.055,
                                            fontWeight: 800,
                                            alignSelf: 'center',
                                            maxWidth: dimensions.width * 0.89,
                                            fontFamily: fontRubikRegular,
                                            color: '#1D2F58',
                                        }}>
                                        {button}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedTimeChroniclesPage('Home');
                                }}
                                style={{
                                    width: dimensions.width * 0.3,
                                    height: dimensions.height * 0.1,
                                    backgroundColor: '#fff',
                                    borderRadius: dimensions.width * 0.04,
                                    marginTop: dimensions.height * 0.015,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Image 
                                        source={require('../assets/images/homeImage.png')}
                                        style={{
                                            width: dimensions.width * 0.09,
                                            height: dimensions.height * 0.05,
                                            alignSelf: 'center',
                                        }}
                                        resizeMode='contain'
                                    />
                            </TouchableOpacity>
                        </>
                    ) : selectedAquariumPage === 'Catch a fish' ? (
                        <>
                        <CatchFishComponent setSelectedAquariumPage={setSelectedAquariumPage} />
                        </>
                    ) : (
                        <>
                            <EditAquariumComponent setSelectedAquariumPage={setSelectedAquariumPage}/>
                        </>
                    )}

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

export default ChroniclesAquariumScreen;
