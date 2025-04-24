import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Share,
    StyleSheet
} from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

import fishesFactsData from '../components/fishesFactsData';

const fontInterRegular = 'Inter-Regular';


const ChroniclesFactsScreen = ({ setSelectedTimeChroniclesPage }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isPreviewVisibled, setIsPreviewVisibled] = useState(false);
    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const styles = createChroniclesFactsStyles(dimensions);

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
        <SafeAreaView style={{ flex: 1 }}>
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
                            if (isPreviewVisibled)
                                setIsPreviewVisibled(false);
                            else setSelectedTimeChroniclesPage('Home');
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
                            Interesting facts
                        </Text>
                    </View>
                </View>

                {!isPreviewVisibled ? (
                    <>
                        <Image
                            source={require('../assets/images/factsPreviewMessageImage.png')}
                            style={{
                                width: dimensions.width * 0.898,
                                height: dimensions.height * 0.15,
                                marginTop: dimensions.height * 0.02,
                                alignSelf: 'center',
                            }}
                            resizeMode='contain'
                        />

                        <TouchableOpacity
                            onPress={() => {
                                setIsPreviewVisibled(true);
                            }}
                            style={[styles.button, {
                                marginRight: dimensions.width * 0.03,
                                alignSelf: 'flex-start',
                                marginTop: -dimensions.height * 0.025,
                                marginLeft: dimensions.width * 0.0502,
                                zIndex: 9999999
                            }]}>
                            <Text style={styles.buttonText}>
                                Start
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Image
                            source={fishesFactsData[currentFactIndex].fishesFactImage}
                            style={{
                                width: dimensions.width * 0.65,
                                height: dimensions.height * 0.18,
                                borderColor: '#1E67E6',
                                borderWidth: dimensions.width * 0.004,
                                alignSelf: 'center',
                                marginTop: dimensions.height * 0.04,
                                borderRadius: dimensions.width * 0.04444,
                            }}
                            resizeMode='stretch'
                        />

                        <Text
                            style={{
                                textAlign: 'center',
                                color: 'white',
                                fontSize: dimensions.width * 0.04,
                                alignSelf: 'center',
                                fontFamily: fontInterRegular,
                                fontWeight: 500,
                                paddingHorizontal: dimensions.width * 0.16,
                                marginTop: dimensions.height * 0.03
                            }}>
                            {fishesFactsData[currentFactIndex].fishesFact}
                        </Text>

                        <View style={{
                            position: 'absolute',
                            bottom: dimensions.height * 0.1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: dimensions.width,
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setCurrentFactIndex((prevIndex) => (prevIndex + 1) % fishesFactsData.length);
                                }}
                                style={styles.button}>
                                <Text style={styles.buttonText}>
                                    Next
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    onShareFact(fishesFactsData[currentFactIndex].fishesFact);
                                }}
                                style={[styles.button, {
                                    backgroundColor: 'transparent',
                                    borderWidth: dimensions.width * 0.004,
                                    borderColor: 'white',
                                    zIndex: 9999999,
                                    marginTop: dimensions.height * 0.02,
                                }]}>
                                <Text style={styles.buttonText}>
                                    Share
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </>
                )}

                {!isPreviewVisibled && (
                    <Image
                        source={require('../assets/images/factsPreviewFisherImage.png')}
                        style={{
                            width: dimensions.width,
                            height: dimensions.height * 0.8,
                            alignSelf: 'flex-end',
                            position: 'absolute',
                            bottom: -dimensions.height * 0.15,
                            right: -dimensions.width * 0.2,
                        }}
                        resizeMode='contain'
                    />
                )}
            </View>
        </SafeAreaView>
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

export default ChroniclesFactsScreen;
