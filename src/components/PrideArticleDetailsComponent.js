import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import lionArticlesData from '../components/lionArticlesData';

const prideFontPoppinsRegular = 'Poppins-Regular';

const PrideArticleDetailsComponent = ({ setSelectedWindow, selectedArticle }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const styles = createPrideQuestSettingsStyles(dimensions);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem('favoriteArticles');
                const favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];
                setIsFavorite(favoritesArray.includes(selectedArticle.id));
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };
        loadFavorites();
    }, [selectedArticle]);

    const toggleFavorite = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favoriteArticles');
            let favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];
            if (favoritesArray.includes(selectedArticle.id)) {
                favoritesArray = favoritesArray.filter(id => id !== selectedArticle.id);
                setIsFavorite(false);
            } else {
                favoritesArray.push(selectedArticle.id);
                setIsFavorite(true);
            }
            await AsyncStorage.setItem('favoriteArticles', JSON.stringify(favoritesArray));
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };

    const handleScroll = (event) => {
        const index = Math.floor(event.nativeEvent.contentOffset.x / dimensions.width);
        setCurrentImageIndex(index);
    };

    return (
        <View style={{ flex: 1, width: dimensions.width }}>
            <View style={[styles.prideFlexRowViewStyles, {
                position: 'absolute',
                top: dimensions.height * 0.07,
                zIndex: 50,
            }]}>
                <TouchableOpacity onPress={() => {
                    setSelectedWindow('');
                }}>
                    <Image
                        source={require('../assets/icons/backPrideIcon.png')}
                        style={{
                            width: dimensions.height * 0.07,
                            height: dimensions.height * 0.07,
                        }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFavorite}>
                    <Image
                        source={
                            isFavorite
                                ? require('../assets/icons/fullHeartInCirclePrideIcon.png')
                                : require('../assets/icons/emptyHeartInCirclePrideIcon.png')
                        }
                        style={{
                            width: dimensions.height * 0.07,
                            height: dimensions.height * 0.07,
                        }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>

            <View>
                <ScrollView
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{}}>
                    {selectedArticle.images.map((image) => (
                        <Image
                            key={image.id}
                            source={image.image}
                            style={{
                                width: dimensions.width,
                                height: dimensions.height * 0.3,
                                alignSelf: 'center',
                                borderRadius: dimensions.width * 0.05,
                            }}
                            resizeMode='stretch'
                        />
                    ))}
                </ScrollView>
            </View>

            <View style={[styles.prideFlexRowViewStyles, { width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: dimensions.height * 0.01 }]}>
                {selectedArticle.images.map((_, index) => (
                    <View
                        key={index}
                        style={{
                            width: dimensions.height * 0.02,
                            height: dimensions.height * 0.02,
                            backgroundColor: currentImageIndex === index ? '#FFC81F' : 'transparent',
                            borderRadius: dimensions.width * 0.5,
                            borderWidth: dimensions.width * 0.005,
                            borderColor: '#FFC81F',
                            marginHorizontal: dimensions.width * 0.02,
                        }}
                    />
                ))}
            </View>

            <View style={{
                width: dimensions.width * 0.93,
                alignSelf: 'center',
                paddingHorizontal: dimensions.width * 0.04,
                paddingVertical: dimensions.height * 0.02,
                backgroundColor: '#BF9539',
                borderRadius: dimensions.width * 0.05,
                marginBottom: dimensions.height * 0.01,
                marginTop: dimensions.height * 0.01,
            }}>
                <View style={[styles.prideFlexRowViewStyles, { width: '100%' }]}>
                    <View style={{
                        paddingHorizontal: dimensions.width * 0.02,
                        paddingVertical: dimensions.height * 0.01,
                        backgroundColor: '#FFC81F',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: dimensions.width * 0.5,
                    }}>
                        <Text
                            style={{
                                textAlign: 'left',
                                color: 'white',
                                fontSize: dimensions.width * 0.035,
                                fontFamily: prideFontPoppinsRegular,
                                fontWeight: '500',
                                textTransform: 'uppercase',
                            }}>
                            {selectedArticle.title}
                        </Text>
                    </View>
                </View>
                <Text
                    style={{
                        textAlign: 'left',
                        color: 'white',
                        fontSize: dimensions.width * 0.037,
                        fontFamily: prideFontPoppinsRegular,
                        fontWeight: '400',
                        marginTop: dimensions.height * 0.01,
                    }}>
                    {selectedArticle.description}
                </Text>
                <View style={{ position: 'relative' }}>
                    <Image
                        source={require('../assets/images/modalLionImage.png')}
                        style={{
                            width: dimensions.width * 0.9,
                            height: dimensions.height * 0.25,
                            marginTop: dimensions.height * 0.05,
                            alignSelf: 'center',
                            position: 'relative',
                        }}
                        resizeMode='contain'
                    />
                    <Image
                        source={selectedArticle.messageImage}
                        style={{
                            width: dimensions.width * 0.55,
                            height: dimensions.height * 0.2,
                            position: 'absolute',
                            top: dimensions.height * 0.01,
                            left: dimensions.width * 0.3,
                            zIndex: 1,
                        }}
                        resizeMode='contain'
                    />
                </View>
            </View>
        </View>
    );
};

const createPrideQuestSettingsStyles = (dimensions) => StyleSheet.create({
    prideFlexRowViewStyles: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: dimensions.width * 0.93,
    }
});

export default PrideArticleDetailsComponent;
