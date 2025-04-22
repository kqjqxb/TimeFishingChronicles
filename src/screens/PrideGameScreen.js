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
    Modal,
    Animated,
    ImageBackground
} from 'react-native';
import { XCircleIcon } from 'react-native-heroicons/solid';

const prideFontPoppinsRegular = 'Poppins-Regular';

const gameElements = [
    {
        id: 1,
        image: require('../assets/images/prideGameElementsImages/element1.png'),
    },
    {
        id: 2,
        image: require('../assets/images/prideGameElementsImages/element2.png'),
    },
    {
        id: 3,
        image: require('../assets/images/prideGameElementsImages/element3.png'),
    },
    {
        id: 4,
        image: require('../assets/images/prideGameElementsImages/element4.png'),
    },
    {
        id: 5,
        image: require('../assets/images/prideGameElementsImages/element5.png'),
    },
    {
        id: 6,
        image: require('../assets/images/prideGameElementsImages/element6.png'),
    },
];

const generateGridElements = () => {
    let grid = [];
    for (let i = 0; i < 9; i++) {
        const randomElement = gameElements[Math.floor(Math.random() * gameElements.length)];
        grid.push({ ...randomElement, unique: `${randomElement.id}-${i}` });
    }
    return grid;
};

const PrideGameScreen = ({ }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createPrideQuestSettingsStyles(dimensions);
    const [isPrideGameStarted, setIsPrideGameStarted] = useState(false);
    const [isPrideGameFinished, setIsPrideGameFinished] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);
    const [currentSpinCount, setCurrentSpinCount] = useState(0);
    const [shuffledElements, setShuffledElements] = useState(generateGridElements());
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [congratsModalVisible, setCongratsModalVisible] = useState(false);
    const scaleCongrat = useRef(new Animated.Value(0)).current;
    const [congratsText, setCongratsText] = useState("This is streak!");
    const columns = 3;
    const [isSpinning, setIsSpinning] = useState(false);

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const calculateScore = (elements) => {
        if (elements.every(el => el.id === elements[0].id)) {
            return { score: 500, tripleFound: true, mega: true };
        }

        const rows = Math.ceil(elements.length / columns);
        let horizontalFound = false;
        let verticalFound = false;
        let pairCount = 0;

        for (let i = 0; i < rows; i++) {
            const rowElements = elements.slice(i * columns, i * columns + columns);
            if (rowElements.length === columns && rowElements.every(el => el.id === rowElements[0].id)) {
                horizontalFound = true;
            }
        }

        for (let col = 0; col < columns; col++) {
            const colElements = [];
            for (let row = 0; row < rows; row++) {
                const index = row * columns + col;
                if (index < elements.length) {
                    colElements.push(elements[index]);
                }
            }
            if (colElements.length === rows && colElements.every(el => el.id === colElements[0].id)) {
                verticalFound = true;
            }
        }

        if (horizontalFound && verticalFound) {
            return { score: 100, tripleFound: true, mega: false };
        } else if (horizontalFound || verticalFound) {
            return { score: 50, tripleFound: true, mega: false };
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const index = i * columns + j;
                if (index >= elements.length) break;
                const curr = elements[index].id;
                if (j < columns - 1 && index + 1 < elements.length && elements[index + 1].id === curr) {
                    pairCount++;
                }
                if (i < rows - 1 && index + columns < elements.length && elements[index + columns].id === curr) {
                    pairCount++;
                }
            }
        }

        if (pairCount >= 3) {
            return { score: 20, tripleFound: false, mega: false };
        } else {
            return { score: pairCount * 5, tripleFound: false, mega: false };
        }
    };

    const rotateElements = () => {
        setIsSpinning(true);
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            const newElements = generateGridElements();
            setShuffledElements(newElements);
            const result = calculateScore(newElements);
            const newScore = currentScore + result.score;
            setCurrentScore(newScore);
            setCurrentSpinCount(prevCount => {
                const updatedCount = prevCount + 1;
                if (updatedCount >= 5) {
                    if (result.tripleFound) {
                        setTimeout(() => {
                            setIsPrideGameFinished(true);
                        }, 1200);
                    } else {
                        setTimeout(() => {
                            setIsPrideGameFinished(true);
                        }, 700);
                    }
                    AsyncStorage.setItem('prideScores', JSON.stringify(newScore));
                }
                return updatedCount;
            });
            if (result.tripleFound) {
                setCongratsText(result.mega ? "MEGA WIIIIN" : "This is streak!");
                setCongratsModalVisible(true);
                Animated.spring(scaleCongrat, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 5,
                }).start(() => {
                    setTimeout(() => {
                        Animated.timing(scaleCongrat, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }).start(() => {
                            setCongratsModalVisible(false);
                        });
                    }, 3000);
                });
            }
            setIsSpinning(false);
        });
    };

    return (
        <SafeAreaView style={{ width: dimensions.width }}>
            <ImageBackground
                source={require('../assets/images/prideGameBg.png')}
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
                resizeMode='cover'
            />
            {congratsModalVisible && (
                <Modal visible={congratsModalVisible} transparent animationType="fade">
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: "center", alignItems: "center" }}>
                        <Animated.View style={{
                            transform: [{ scale: scaleCongrat }],
                            backgroundColor: '#FFC81F',
                            padding: 20,
                            borderRadius: 10,
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 20, color: '#fff', fontFamily: prideFontPoppinsRegular }}>
                                {congratsText}
                            </Text>
                        </Animated.View>
                    </View>
                </Modal>
            )}
            {!isPrideGameStarted ? (
                <>
                    <Text
                        style={{
                            textAlign: 'left',
                            color: '#3F3012',
                            fontSize: dimensions.width * 0.075,
                            alignSelf: 'center',
                            fontFamily: prideFontPoppinsRegular,
                            fontWeight: 700,
                            marginBottom: dimensions.height * 0.02,
                        }}>
                        Hunter's trail
                    </Text>
                    <TouchableOpacity onPress={() => {
                        setIsPrideGameStarted(true);
                    }}>
                        <Image
                            source={require('../assets/images/startPrideGameImage.png')}
                            style={{
                                width: dimensions.height * 0.17,
                                height: dimensions.height * 0.17,
                                marginTop: dimensions.height * 0.5,
                                alignSelf: 'center',
                                position: 'relative',
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </>
            ) : (
                !isPrideGameFinished ? (
                    <View style={{ height: dimensions.height * 0.9 }}>
                        <TouchableOpacity onPress={() => {
                            // setIsPrideGameFinished(false);
                            // setCurrentScore(0);
                            // setCurrentSpinCount(0);
                            // setShuffledElements(generateGridElements());
                            // setIsPrideGameStarted(false);
                            
                        }}>
                            <XCircleIcon
                                color={'#FF2C20'}
                                size={dimensions.height * 0.07}
                                style={{
                                    position: 'absolute',
                                    top: dimensions.height * 0.02,
                                    left: dimensions.width * 0.05,
                                }}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                textAlign: 'center',
                                color: '#3F3012',
                                fontSize: dimensions.width * 0.04,
                                marginTop: dimensions.height * 0.05,
                                alignSelf: 'center',
                                fontFamily: prideFontPoppinsRegular,
                                fontWeight: 400,
                            }}>
                            Current account
                        </Text>
                        <Text
                            style={{
                                textAlign: 'center',
                                color: '#3F3012',
                                fontSize: dimensions.width * 0.14,
                                alignSelf: 'center',
                                fontFamily: prideFontPoppinsRegular,
                                fontWeight: 700,
                            }}>
                            {currentScore}
                        </Text>
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'space-between',
                                width: dimensions.width * 0.93,
                                marginTop: dimensions.height * 0.01,
                                flexWrap: 'wrap',
                            }}>
                                {shuffledElements.map((element) => (
                                    <View key={element.unique} style={{
                                        width: dimensions.width * 0.3,
                                        height: dimensions.width * 0.3,
                                        borderRadius: dimensions.width * 0.03,
                                        backgroundColor: '#967228',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: dimensions.height * 0.01,
                                    }}>
                                        <Image
                                            source={element.image}
                                            style={{
                                                width: dimensions.width * 0.23,
                                                height: dimensions.width * 0.23,
                                            }}
                                            resizeMode='contain'
                                        />
                                    </View>
                                ))}
                            </View>
                        </Animated.View>
                        <TouchableOpacity
                            onPress={rotateElements}
                            disabled={isSpinning || currentSpinCount >= 5}
                            style={{
                                width: dimensions.width * 0.93,
                                height: dimensions.height * 0.07,
                                backgroundColor: '#FFC81F',
                                borderRadius: dimensions.width * 0.04,
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                bottom: dimensions.height * 0.1,
                                alignSelf: 'center',
                            }}>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: '#fff',
                                    fontSize: dimensions.width * 0.06,
                                    alignSelf: 'center',
                                    fontFamily: prideFontPoppinsRegular,
                                    fontWeight: 700,
                                }}>
                                Shake
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={{
                            alignSelf: 'center',
                            backgroundColor: '#967228',
                            borderRadius: dimensions.width * 0.05,
                            // width: dimensions.width * 0.93,
                            width: dimensions.width * 1.6,
                            paddingHorizontal: dimensions.width * 0.04,
                            paddingVertical: dimensions.height * 0.02,
                            marginTop: dimensions.height * 0.1,
                        }}>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: '#fff',
                                    fontSize: dimensions.width * 0.093,
                                    alignSelf: 'center',
                                    fontFamily: prideFontPoppinsRegular,
                                    fontWeight: 700,
                                }}>
                                Game over
                            </Text>

                            <Image
                                source={require('../assets/images/resultLionImage.png')}
                                style={{
                                    width: dimensions.width * 0.75,
                                    height: dimensions.height * 0.23,
                                    marginLeft: dimensions.width * 0.05,
                                    alignSelf: 'center',
                                    position: 'relative',
                                }}
                                resizeMode='contain'
                            />

                            <View style={styles.prideFlexRowViewStyles}>
                                <View>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#fff',
                                            fontSize: dimensions.width * 0.04,
                                            alignSelf: 'center',
                                            fontFamily: prideFontPoppinsRegular,
                                            fontWeight: 400,
                                        }}>
                                        Your title
                                    </Text>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#fff',
                                            fontSize: dimensions.width * 0.04,
                                            alignSelf: 'center',
                                            fontFamily: prideFontPoppinsRegular,
                                            fontWeight: 700,
                                        }}>
                                        {currentScore <= 50 ? 'Young lion' : currentScore > 100 && currentScore < 150 ? 'Strong Lion' : 'Pride leader'}
                                    </Text>
                                </View>

                                <View style={{
                                }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#fff',
                                            fontSize: dimensions.width * 0.04,
                                            alignSelf: 'center',
                                            fontFamily: prideFontPoppinsRegular,
                                            fontWeight: 400,
                                        }}>
                                        Total count
                                    </Text>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#fff',
                                            fontSize: dimensions.width * 0.05,
                                            alignSelf: 'center',
                                            fontFamily: prideFontPoppinsRegular,
                                            fontWeight: 700,
                                        }}>
                                        {currentScore}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.prideFlexRowViewStyles, { width: '95%', marginTop: dimensions.height * 0.03 }]}>
                                <TouchableOpacity style={[{
                                    backgroundColor: '#165AFF',
                                }, styles.restartExitButtonStyles]}
                                    onPress={() => {
                                        setIsPrideGameFinished(false);
                                        setCurrentScore(0);
                                        setCurrentSpinCount(0);
                                        setShuffledElements(generateGridElements());
                                    }}>
                                    <Text style={styles.restartExitTextStyles}>
                                        Restart
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[{
                                    backgroundColor: '#FF2C20',
                                }, styles.restartExitButtonStyles]}
                                    onPress={() => {
                                        setIsPrideGameStarted(false);
                                        setIsPrideGameFinished(false);
                                        setCurrentScore(0);
                                        setCurrentSpinCount(0);
                                        setShuffledElements(generateGridElements());
                                    }}>
                                    <Text style={styles.restartExitTextStyles}>
                                        Exit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )
            )}
        </SafeAreaView>
    );
};

const createPrideQuestSettingsStyles = (dimensions) => StyleSheet.create({
    prideFlexRowViewStyles: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: dimensions.width * 0.5,
        alignItems: 'flex-start'
    },
    restartExitButtonStyles: {
        width: dimensions.width * 0.37,
        height: dimensions.height * 0.07,
        borderRadius: dimensions.width * 0.04,
        alignItems: 'center',
        justifyContent: 'center',
    },
    restartExitTextStyles: {
        textAlign: 'center',
        color: '#fff',
        fontSize: dimensions.width * 0.06,
        alignSelf: 'center',
        fontFamily: prideFontPoppinsRegular,
        fontWeight: 700,
    }
});

export default PrideGameScreen;
