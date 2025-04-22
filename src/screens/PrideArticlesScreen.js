import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
    ScrollView,
    Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import lionArticlesData from '../components/lionArticlesData';
import PrideArticleDetailsComponent from '../components/PrideArticleDetailsComponent';
import lionDailyFactsData from '../components/lionDailyFactsData';
import PrideFavoritesComponent from '../components/PrideFavoritesComponent';

const prideFontPoppinsRegular = 'Poppins-Regular';

const PrideArticlesScreen = ({prideNotificationsEnabled, setPrideNotificationsEnabled,}) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [selectedWindow, setSelectedWindow] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [savedPrideFacts, setSavedPrideFacts] = useState([]);

    const styles = createPrideQuestArticlesStyles(dimensions);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem('favoriteArticles');
                const favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];
                setFavorites(favoritesArray);
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };
        const loadSavedPrideFacts = async () => {
            try {
                const storedFacts = await AsyncStorage.getItem('savedPrideFacts');
                const factsArray = storedFacts ? JSON.parse(storedFacts) : [];
                setSavedPrideFacts(factsArray);
            } catch (error) {
                console.error('Error loading saved pride facts:', error);
            }
        };

        loadFavorites();
        loadSavedPrideFacts();
    }, []);

    const toggleFavoriteArticle = async (articleId) => {
        try {
            let newFavorites = [...favorites];
            if (newFavorites.includes(articleId)) {
                newFavorites = newFavorites.filter(id => id !== articleId);
            } else {
                newFavorites.unshift(articleId);
            }
            setFavorites(newFavorites);
            await AsyncStorage.setItem('favoriteArticles', JSON.stringify(newFavorites));
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };

    const toggleSavedPrideFacts = async (factId) => {
        try {
            let newFacts = [...savedPrideFacts];
            if (newFacts.includes(factId)) {
                newFacts = newFacts.filter(id => id !== factId);
            } else {
                newFacts.unshift(factId);
            }
            setSavedPrideFacts(newFacts);
            await AsyncStorage.setItem('savedPrideFacts', JSON.stringify(newFacts));
        } catch (error) {
            console.error('Error updating saved pride facts:', error);
        }
    };

    const toggleNotifications = async (value) => {
        try {
            setPrideNotificationsEnabled(value);
            await AsyncStorage.setItem('prideNotificationsEnabled', JSON.stringify(value));
        } catch (error) {
            console.error('Error updating notifications setting:', error);
        }
    };

    const currentDay = new Date().getDate();
    const dailyFact = lionDailyFactsData[currentDay % lionDailyFactsData.length];

    return (
        <View style={{ flex: 1, width: dimensions.width }}>
            {selectedWindow === '' ? (
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.prideFlexRowViewStyles}>
                        <Text
                            style={{
                                textAlign: 'left',
                                color: 'white',
                                fontSize: dimensions.width * 0.075,
                                fontFamily: prideFontPoppinsRegular,
                                fontWeight: 600,
                            }}>
                            Articles
                        </Text>
                        <TouchableOpacity onPress={() => {
                            setSelectedWindow('PrideFavorites');
                        }}>
                            <Image
                                source={require('../assets/icons/fullHeartInCirclePrideIcon.png')}
                                style={{
                                    width: dimensions.height * 0.07,
                                    height: dimensions.height * 0.07,
                                }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={{
                            paddingBottom: dimensions.height * 0.2,
                        }}
                        showsVerticalScrollIndicator={false}>

                        <Pressable style={{
                            width: dimensions.width * 0.93,
                            alignSelf: 'center',
                            paddingHorizontal: dimensions.width * 0.04,
                            paddingVertical: dimensions.height * 0.02,
                            marginTop: dimensions.height * 0.03,
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
                                    Fact of the day
                                </Text>
                                <TouchableOpacity
                                    onPress={() => toggleSavedPrideFacts(dailyFact.id)}>
                                    <Image
                                        source={
                                            savedPrideFacts.includes(dailyFact.id)
                                                ? require('../assets/icons/fullHeartInCirclePrideIcon.png')
                                                : require('../assets/icons/emptyHeartInCirclePrideIcon.png')
                                        }
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
                                {dailyFact.fact}
                            </Text>
                        </Pressable>

                        <View style={[styles.prideFlexRowViewStyles, { marginVertical: dimensions.height * 0.03 }]}>
                            <Text
                                style={{
                                    textAlign: 'left',
                                    color: 'white',
                                    fontSize: dimensions.width * 0.045,
                                    fontFamily: prideFontPoppinsRegular,
                                    fontWeight: 500,
                                }}>
                                Notifications
                            </Text>
                            <Switch
                                trackColor={{ false: 'rgb(95, 74, 29)', true: '#FFC81F' }}
                                thumbColor={'white'}
                                ios_backgroundColor="rgb(95, 74, 29)"
                                value={prideNotificationsEnabled}
                                onValueChange={(value) => toggleNotifications(value)} 
                            />
                        </View>

                        {/* Lion Articles List */}
                        {lionArticlesData.map((article) => (
                            <TouchableOpacity key={article.id}
                                onPress={() => {
                                    setSelectedArticle(article);
                                    setSelectedWindow('ArticleDetails');
                                }}
                                style={{
                                    width: dimensions.width * 0.93,
                                    alignSelf: 'center',
                                    paddingHorizontal: dimensions.width * 0.04,
                                    paddingVertical: dimensions.height * 0.02,
                                    backgroundColor: '#BF9539',
                                    borderRadius: dimensions.width * 0.05,
                                    marginBottom: dimensions.height * 0.01,
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
                                            {article.title}
                                        </Text>
                                    </View>

                                    <TouchableOpacity onPress={() => toggleFavoriteArticle(article.id)}>
                                        <Image
                                            source={
                                                favorites.includes(article.id)
                                                    ? require('../assets/icons/fullHeartInCirclePrideIcon.png')
                                                    : require('../assets/icons/emptyHeartInCirclePrideIcon.png')
                                            }
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
                                    {article.description}
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
                                        source={article.messageImage}
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
                        ))}
                    </ScrollView>
                </SafeAreaView>
            ) : selectedWindow === 'ArticleDetails' ? (
                <PrideArticleDetailsComponent setSelectedWindow={setSelectedWindow} selectedArticle={selectedArticle} />
            ) : (
                <>
                    <PrideFavoritesComponent 
                        favorites={favorites} 
                        savedPrideFacts={savedPrideFacts} 
                        setSelectedWindow={setSelectedWindow}
                        setFavorites={setFavorites} 
                        setSavedPrideFacts={setSavedPrideFacts} 
                        setSelectedArticle={setSelectedArticle}
                    />
                </>
            )}
        </View>
    );
};

const createPrideQuestArticlesStyles = (dimensions) => StyleSheet.create({
    prideFlexRowViewStyles: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: dimensions.width * 0.93,
    }
});

export default PrideArticlesScreen;
