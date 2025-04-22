import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Share
} from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

const fontInterRegular = 'Inter-Regular';

const ChroniclesInformationScreen = ({ setSelectedTimeChroniclesPage }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const onShare = async () => {
        try {
            await Share.share({
                message: "Fishin' Time Chronicles is your personal fishing guide where you can record your fishing achievements, catch new fish species and create a unique aquarium. Save your best catches, learn interesting facts about fish and improve your fishing skills while enjoying an exciting game!",
            });
        } catch (error) {
            console.error('Error sharing text:', error);
        }
    };

    return (
        <SafeAreaView style={{ width: dimensions.width }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * 0.7,
                alignSelf: 'center',
            }}>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedTimeChroniclesPage('Home');
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
                            fontSize: dimensions.width * 0.059,
                            alignSelf: 'center',
                            fontFamily: fontInterRegular,
                            fontWeight: 700,
                        }}>
                        Information
                    </Text>
                </View>

            </View>
            <Image
                source={require('../assets/images/informationImage.png')}
                style={{
                    width: dimensions.width * 0.9,
                    height: dimensions.height * 0.4,
                    marginTop: dimensions.height * 0.02,
                    alignSelf: 'flex-end',
                }}
                resizeMode='contain'
            />

            <View style={{
                width: dimensions.width * 0.898,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: dimensions.width * 0.05551,
                paddingVertical: dimensions.height * 0.020101,
                paddingHorizontal: dimensions.width * 0.05,
            }}>
                <Text
                    style={{
                        textAlign: 'left',
                        color: '#000',
                        fontSize: dimensions.width * 0.04,
                        alignSelf: 'center',
                        fontFamily: fontInterRegular,
                        fontWeight: 500,
                    }}>
                    Fishin' Time Chronicles is your personal fishing guide where you can record your fishing achievements, catch new fish species and create a unique aquarium.

                    {'\n\n'}Save your best catches, learn interesting facts about fish and improve your fishing skills while enjoying an exciting game.
                </Text>
            </View>

            <TouchableOpacity
                onPress={onShare}
                style={{
                    width: dimensions.width * 0.5,
                    height: dimensions.height * 0.09,
                    borderRadius: dimensions.width * 0.04444,
                    backgroundColor: '#1E67E6',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: dimensions.width * 0.03,
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.022222,
                }}>
                <Text
                    style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: dimensions.width * 0.065,
                        alignSelf: 'center',
                        fontFamily: fontInterRegular,
                        fontWeight: 700,
                    }}>
                    Share
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ChroniclesInformationScreen;
