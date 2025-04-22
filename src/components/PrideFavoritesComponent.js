import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import lionArticlesData from '../components/lionArticlesData';
import lionDailyFactsData from '../components/lionDailyFactsData';

const prideFontPoppinsRegular = 'Poppins-Regular';

const PrideFavoritesComponent = ({ favorites, savedPrideFacts, setSelectedWindow, setFavorites, setSavedPrideFacts, setSelectedArticle }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const styles = createPrideQuestFavoritesStyles(dimensions);

    useEffect(() => {
        console.log('favorites', favorites);
    }, [favorites]);

    const removeFavoriteArticle = async (articleId) => {
        try {
            const newFavorites = favorites.filter(id => id !== articleId);
            setFavorites(newFavorites);
            await AsyncStorage.setItem('favoriteArticles', JSON.stringify(newFavorites));
        } catch (error) {
            console.error('Error removing favorite article:', error);
        }
    };

    const removeSavedPrideFact = async (factId) => {
        try {
            const newSavedFacts = savedPrideFacts.filter(id => id !== factId);
            setSavedPrideFacts(newSavedFacts);
            await AsyncStorage.setItem('savedPrideFacts', JSON.stringify(newSavedFacts));
        } catch (error) {
            console.error('Error removing saved pride fact:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, width: dimensions.width }}>
            <View style={styles.prideFlexRowViewStyles}>
                <TouchableOpacity onPress={() => {
                    // setSelectedWindow('');
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
                <Text
                    style={{
                        textAlign: 'left',
                        color: 'white',
                        fontSize: dimensions.width * 0.075,
                        fontFamily: prideFontPoppinsRegular,
                        fontWeight: 600,
                        marginRight: dimensions.width * 0.15,
                    }}>
                    Favorites
                </Text>

                <TouchableOpacity disabled={true} style={{ opacity: 0 }} onPress={() => { /* Optional global favorite toggle */ }}>

                </TouchableOpacity>
            </View>

            {savedPrideFacts.length === 0 && favorites.length === 0 && (
                <Text
                    style={{
                        textAlign: 'center',
                        color: 'white',
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.3,
                        fontSize: dimensions.width * 0.05,
                        fontFamily: prideFontPoppinsRegular,
                        fontWeight: 600,
                        paddingHorizontal: dimensions.width * 0.05,
                    }}>
                    You have no saved articles or daily facts yet.
                </Text>
            )}

            <ScrollView
                contentContainerStyle={{
                    paddingBottom: dimensions.height * 0.2,
                }}
                showsVerticalScrollIndicator={false}>

                {savedPrideFacts.length > 0 && (
                    savedPrideFacts.map((factId) => {
                        const foundFact = lionDailyFactsData.find((dFact) => dFact.id === factId);
                        return (
                            <View key={factId} style={{
                                width: dimensions.width * 0.93,
                                alignSelf: 'center',
                                paddingHorizontal: dimensions.width * 0.04,
                                paddingVertical: dimensions.height * 0.02,
                                marginTop: dimensions.height * 0.01,
                                backgroundColor: '#BF9539',
                                borderRadius: dimensions.width * 0.05,
                            }}>
                                <View style={[styles.prideFlexRowViewStyles, { width: '100%' }]}>
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            color: 'white',
                                            fontSize: dimensions.width * 0.045,
                                            fontFamily: prideFontPoppinsRegular,
                                            fontWeight: 500,
                                        }}>
                                        Fact of the Day
                                    </Text>
                                    <TouchableOpacity onPress={() => removeSavedPrideFact(factId)}>
                                        <Image
                                            source={require('../assets/icons/fullHeartInCirclePrideIcon.png')}
                                            style={{
                                                width: dimensions.height * 0.06,
                                                height: dimensions.height * 0.06,
                                            }}
                                            resizeMode='contain'
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        color: 'white',
                                        fontSize: dimensions.width * 0.04,
                                        fontFamily: prideFontPoppinsRegular,
                                        fontWeight: 400,
                                        marginTop: dimensions.height * 0.01,
                                    }}>
                                    {foundFact ? foundFact.fact : 'No fact found'}
                                </Text>
                            </View>
                        );
                    })
                )}

                {favorites.length > 0 && (
                    favorites.map((articleId) => {
                        const foundArticle = lionArticlesData.find((article) => article.id === articleId);
                        return (
                            <TouchableOpacity key={foundArticle.id}
                                onPress={() => {
                                    setSelectedArticle(foundArticle);
                                    setSelectedWindow('ArticleDetails');
                                }}
                                style={{
                                    width: dimensions.width * 0.93,
                                    alignSelf: 'center',
                                    paddingHorizontal: dimensions.width * 0.04,
                                    paddingVertical: dimensions.height * 0.02,
                                    backgroundColor: '#BF9539',
                                    borderRadius: dimensions.width * 0.05,
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
                                                fontSize: dimensions.width * 0.04,
                                                fontFamily: prideFontPoppinsRegular,
                                                fontWeight: 500,
                                                textTransform: 'uppercase',
                                            }}>
                                            {foundArticle?.title}
                                        </Text>
                                    </View>

                                    <TouchableOpacity onPress={() => removeFavoriteArticle(foundArticle.id)}>
                                        <Image
                                            source={require('../assets/icons/fullHeartInCirclePrideIcon.png')}
                                            style={{
                                                width: dimensions.height * 0.06,
                                                height: dimensions.height * 0.06,
                                            }}
                                            resizeMode='contain'
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text
                                    style={{
                                        textAlign: 'left',
                                        color: 'white',
                                        fontSize: dimensions.width * 0.04,
                                        fontFamily: prideFontPoppinsRegular,
                                        fontWeight: 500,
                                        marginTop: dimensions.height * 0.02,
                                    }}>
                                    {foundArticle.description}
                                </Text>
                                <View style={{ position: 'relative' }}>
                                    <Image
                                        source={require('../assets/images/modalLionImage.png')}
                                        style={{
                                            width: dimensions.width * 0.9,
                                            height: dimensions.height * 0.25,
                                            marginTop: dimensions.height * 0.05,
                                            alignSelf: 'center',
                                        }}
                                        resizeMode='contain'
                                    />
                                    <Image
                                        source={foundArticle.messageImage}
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
                            </TouchableOpacity>
                        )
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const createPrideQuestFavoritesStyles = (dimensions) => StyleSheet.create({
    prideFlexRowViewStyles: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: dimensions.width * 0.93,
    }
});

export default PrideFavoritesComponent;
