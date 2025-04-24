import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Share,
    StyleSheet,
    Animated,
} from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';

const fontInterRegular = 'Inter-Regular';

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
];

const CatchFishComponent = ({ setSelectedAquariumPage }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const styles = createChroniclesFactsStyles(dimensions);
    const [fishCaught, setFishCaught] = useState(0);
    
    // Компонент для анімованої рибки
    const AnimatedFish = ({ fish, onPress }) => {
        // Задаємо рандомний розмір рибки (30–70)
        const fishSize = useRef(30 + Math.random() * 40).current;
        // Замінюємо контейнерну висоту на ту, що використовується для блоку з рибками
        const containerHeight = dimensions.height * 0.442;
        // Рандомна вертикальна позиція (зберігаємо значення через useRef, щоб не змінювалось при повторних рендерах)
        const randomTop = useRef(Math.random() * (containerHeight - fishSize)).current;
        // Початкова позиція по горизонталі (тобто, поза лівою стороною)
        const translateX = useRef(new Animated.Value(-fishSize)).current;
        // Додаємо рандомну затримку та тривалість анімації
        const randomDelay = useRef(Math.random() * 5000).current;
        const randomDuration = useRef(8000 + Math.random() * 4000).current;

        useEffect(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(randomDelay), // затримка перед запуском анімації
                    Animated.timing(translateX, {
                        toValue: dimensions.width, // переміщуємо до правої сторони
                        duration: randomDuration,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }, [dimensions.width]);

        return (
            <TouchableOpacity
                onPress={() => onPress(fish)}
                activeOpacity={0.8}
                style={{ position: 'absolute', top: randomTop }}>
                <Animated.Image
                    source={fish.aquariumFishesImage}
                    style={{
                        width: fishSize,
                        height: fishSize,
                        transform: [{ translateX }]
                    }}
                    resizeMode='contain'
                />
            </TouchableOpacity>
        );
    };

    const handleFishPress = (selectedFish) => {
        setFishCaught(prev => prev + 1);
        console.log('Натиснута рибка:', selectedFish);
    };

    return (
        <SafeAreaView style={{ flex: 1, position: 'relative', height: dimensions.height }}>
            <View style={{
                width: dimensions.width * 0.898,
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignSelf: 'center',
                flexDirection: 'row',
            }}>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedAquariumPage('Aquarium');
                    }}
                    style={{
                        width: dimensions.width * 0.22,
                        height: dimensions.height * 0.1,
                        backgroundColor: '#fff',
                        borderRadius: dimensions.width * 0.04,
                        marginTop: dimensions.height * 0.015,
                        alignSelf: 'flex-start',
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

                <View
                    style={{
                        width: dimensions.width * 0.55,
                        marginLeft: dimensions.width * 0.05,
                        height: dimensions.height * 0.1,
                        backgroundColor: '#fff',
                        borderRadius: dimensions.width * 0.04,
                        marginTop: dimensions.height * 0.015,
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}>
                    <Text
                        style={{
                            textAlign: 'left',
                            color: 'black',
                            fontSize: dimensions.width * 0.04,
                            fontFamily: fontInterRegular,
                            fontWeight: '800',
                        }}>
                        Fish caught:
                    </Text>
                    <Text
                        style={{
                            textAlign: 'left',
                            color: '#486095',
                            fontSize: dimensions.width * 0.089,
                            fontFamily: fontInterRegular,
                            fontWeight: '800',
                            marginLeft: dimensions.width * 0.02,
                        }}>
                        {fishCaught}
                    </Text>
                </View>
            </View>

            {/* Блок, по якому пливуть рибки */}
            <View style={{
                backgroundColor: 'white',
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
                width: dimensions.width,
                zIndex: 1000,
                height: dimensions.height * 0.442,
            }}>
                {aquariumFishes.map(fish => (
                    <AnimatedFish key={fish.id} fish={fish} onPress={handleFishPress} />
                ))}
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
        zIndex: 9999999,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: dimensions.width * 0.06,
        alignSelf: 'center',
        fontFamily: fontInterRegular,
        fontWeight: '700',
    },
});

export default CatchFishComponent;
