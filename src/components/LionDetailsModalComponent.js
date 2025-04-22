import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
    Text,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const prideFontPoppinsRegular = 'Poppins-Regular';

const LionDetailsModalComponent = ({ selectedAnimal }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [learnedPlaces, setLearnedPlaces] = useState([]);
    const styles = createPrideQuestHomeStyles(dimensions);

    useEffect(() => {
        const loadLearnedPlaces = async () => {
            try {
                const stored = await AsyncStorage.getItem('learnedPlaces');
                if (stored !== null) {
                    setLearnedPlaces(JSON.parse(stored));
                }
            } catch (error) {
                console.error('Error loading learnedPlaces:', error);
            }
        };
        loadLearnedPlaces();
    }, []);

    // Function to toggle lion as learned
    const toggleLearned = async () => {
        if (!selectedAnimal) return;
        let updatedPlaces;
        if (learnedPlaces.includes(selectedAnimal.id)) {
            // remove id if already in learnedPlaces
            updatedPlaces = learnedPlaces.filter(id => id !== selectedAnimal.id);
        } else {
            // add id if not present
            updatedPlaces = [...learnedPlaces, selectedAnimal.id];
        }
        setLearnedPlaces(updatedPlaces);
        try {
            await AsyncStorage.setItem('learnedPlaces', JSON.stringify(updatedPlaces));
        } catch (error) {
            console.error('Error saving learnedPlaces:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text
                style={{
                    textAlign: 'left',
                    color: 'white',
                    fontSize: dimensions.width * 0.08,
                    fontFamily: prideFontPoppinsRegular,
                    fontWeight: 600,
                    marginLeft: dimensions.width * 0.03,
                    marginTop: dimensions.height * 0.02,
                }}>
                {selectedAnimal?.title}
            </Text>

            <Image
                source={selectedAnimal?.image}
                style={{
                    width: dimensions.width,
                    height: dimensions.height * 0.27,
                    marginTop: dimensions.height * 0.01,
                }}
                resizeMode='stretch'
            />

            <Text style={styles.modalPrideTitleText}>🌍 Habitat</Text>
            <Text style={[styles.prideText, { marginTop: dimensions.height * 0.01 }]}>
                {selectedAnimal?.title}
            </Text>

            <Text style={styles.modalPrideTitleText}>🐾 Behavior</Text>
            {selectedAnimal?.behaviors.map((behavior, index) => (
                <Text key={index} style={styles.prideText}>
                    {behavior?.behavior}
                </Text>
            ))}

            <Text style={styles.modalPrideTitleText}>👑 Pride Structure</Text>
            {selectedAnimal?.prideStracture.map((pride, index) => (
                <Text key={index} style={styles.prideText}>
                    {pride.pride}
                </Text>
            ))}

            <Text style={styles.modalPrideTitleText}>⚠️ Status</Text>
            <Text style={[styles.prideText, { marginTop: dimensions.height * 0.01 }]}>
                {selectedAnimal?.status}
            </Text>

            <View style={{ position: 'relative' }}>
                <Image
                    source={require('../assets/images/modalLionImage.png')}
                    style={{
                        width: dimensions.width,
                        height: dimensions.height * 0.25,
                        marginTop: dimensions.height * 0.05,
                        alignSelf: 'center',
                        position: 'relative',
                    }}
                    resizeMode='contain'
                />

                <Image
                    source={selectedAnimal?.messageImage}
                    style={{
                        width: dimensions.width * 0.55,
                        height: dimensions.height * 0.2,
                        position: 'absolute',
                        top: dimensions.height * 0.02,
                        left: dimensions.width * 0.4,
                        zIndex: 1,
                    }}
                    resizeMode='contain'
                />
            </View>

            <TouchableOpacity
                onPress={toggleLearned}
                style={{
                    width: dimensions.width * 0.93,
                    height: dimensions.height * 0.07,
                    backgroundColor: learnedPlaces.includes(selectedAnimal?.id) ? 'rgba(255, 200, 31, 0.25)' : '#FFC81F',
                    borderRadius: dimensions.width * 0.041,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: dimensions.height * 0.041,
                    alignSelf: 'center',
                }}>
                <Text
                    style={{
                        textAlign: 'left',
                        color: learnedPlaces.includes(selectedAnimal?.id) ? '#FFC000' : 'white',
                        fontSize: dimensions.width * 0.05,
                        fontFamily: prideFontPoppinsRegular,
                        fontWeight: 700,
                    }}>
                    {learnedPlaces.includes(selectedAnimal?.id)
                        ? 'Marked as learned'
                        : '✅ Mark as learned'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const createPrideQuestHomeStyles = (dimensions) => StyleSheet.create({
    modalPrideTitleText: {
        textAlign: 'left',
        color: 'white',
        fontSize: dimensions.width * 0.04,
        fontFamily: prideFontPoppinsRegular,
        fontWeight: 300,
        marginLeft: dimensions.width * 0.03,
        marginTop: dimensions.height * 0.02,
    },
    prideText: {
        textAlign: 'left',
        color: 'white',
        fontSize: dimensions.width * 0.046,
        fontFamily: prideFontPoppinsRegular,
        fontWeight: 600,
        marginLeft: dimensions.width * 0.03,
        marginTop: dimensions.height * 0.005,
    }
});

export default LionDetailsModalComponent;
