import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    SafeAreaView,
    Text,
    StyleSheet,
    TextInput,
    Alert, 
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const prideFontPoppinsRegular = 'Poppins-Regular';

const PrideDetailsModalComponent = ({ selectedPride, setPrideDetailsModalVisible, setSelectedPride }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [learnedPlaces, setLearnedPlaces] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // Local state for inline editing (default values come from selectedPride)
    const [editName, setEditName] = useState(selectedPride?.name);
    const [editType, setEditType] = useState(selectedPride?.type);
    const [editNotes, setEditNotes] = useState(selectedPride?.notes);
    const [editDate, setEditDate] = useState(selectedPride?.dateOfBirth);
    const [editLocation, setEditLocation] = useState(selectedPride?.location);

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

    const deletePride = async () => {
        try {
            const storedMyPrides = await AsyncStorage.getItem('myPrides');
            let myPrides = storedMyPrides ? JSON.parse(storedMyPrides) : [];
            myPrides = myPrides.filter(item => item.id !== selectedPride.id);
            await AsyncStorage.setItem('myPrides', JSON.stringify(myPrides));
            setPrideDetailsModalVisible(false);
        } catch (error) {
            console.error('Error deleting pride:', error);
        }
    };

    const saveEditedPride = async () => {
        // Validate required fields
        if (!editName.trim() || !editType.trim() || !editDate.trim() || editDate.length !== 10) {
            Alert.alert(
                "Error",
                "Name, Type, and Date cannot be empty. Date must be in the format YYYY.MM.DD (10 characters)."
            );
            return;
        }

        try {
            // Create a new updated object from the inline editing states
            const updatedPride = {
                ...selectedPride,
                name: editName,
                type: editType,
                notes: editNotes,
                dateOfBirth: editDate,
                location: editLocation,
            };

            // Retrieve the existing list and update it
            const storedMyPrides = await AsyncStorage.getItem('myPrides');
            let myPrides = storedMyPrides ? JSON.parse(storedMyPrides) : [];
            myPrides = myPrides.map(item => (item.id === selectedPride.id ? updatedPride : item));
            await AsyncStorage.setItem('myPrides', JSON.stringify(myPrides));

            // Update the selectedPride state so the modal reflects the changes
            setSelectedPride(updatedPride);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving edited pride:', error);
        }
    };

    const getDaysInMonth = (year, month) => {
        month = parseInt(month, 10);
        year = parseInt(year, 10);
        if (isNaN(year) || isNaN(month)) return 31;
        if (month === 2) {
            return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
        } else if ([4, 6, 9, 11].includes(month)) {
            return 30;
        }
        return 31;
    };

    const handleEditDateInputChange = (text) => {
        const cleanedDate = text.replace(/[^\d]/g, '');
        let formattedDate = '';

        let yearDatePart = cleanedDate.slice(0, 4);
        const currentYear = new Date().getFullYear();
        if (yearDatePart.length === 4 && parseInt(yearDatePart, 10) > currentYear) {
            yearDatePart = currentYear.toString();
        }
        let monthDatePart = cleanedDate.slice(4, 6);
        let dayDatePart = cleanedDate.slice(6, 8);

        if (cleanedDate.length <= 4) {
            formattedDate = yearDatePart;
        } else if (cleanedDate.length <= 6) {
            if (monthDatePart.length === 2) {
                let monthNum = parseInt(monthDatePart, 10);
                if (monthNum > 12) {
                    monthNum = 12;
                }
                monthDatePart = monthNum.toString().padStart(2, '0');
            }
            formattedDate = `${yearDatePart}.${monthDatePart}`;
        } else {
            if (monthDatePart.length === 2) {
                let monthNum = parseInt(monthDatePart, 10);
                if (monthNum > 12) {
                    monthNum = 12;
                }
                monthDatePart = monthNum.toString().padStart(2, '0');
            }
            if (dayDatePart.length === 2) {
                let dayNum = parseInt(dayDatePart, 10);
                const maxDay = getDaysInMonth(yearDatePart, monthDatePart);
                if (dayNum > maxDay) {
                    dayNum = maxDay;
                }
                dayDatePart = dayNum.toString().padStart(2, '0');
            }
            formattedDate = `${yearDatePart}.${monthDatePart}.${dayDatePart}`;
        }
        setEditDate(formattedDate);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: dimensions.height * 0.2,
                }}>
                {isEditing ? (
                    <>
                        <TextInput
                            maxLength={30}
                            value={editName}
                            onChangeText={setEditName}
                            style={{
                                textAlign: 'left',
                                color: 'white',
                                fontSize: dimensions.width * 0.08,
                                fontFamily: prideFontPoppinsRegular,
                                fontWeight: '600',
                                marginLeft: dimensions.width * 0.03,
                                marginTop: dimensions.height * 0.02,
                            }}
                        />
                        <Image
                            source={{ uri: selectedPride?.image }}
                            style={{
                                width: dimensions.width,
                                height: dimensions.height * 0.27,
                                marginTop: dimensions.height * 0.01,
                            }}
                            resizeMode='stretch'
                        />
                        <Text style={styles.modalPrideTitleText}>Type</Text>
                        <TextInput
                            maxLength={12}
                            value={editType}
                            onChangeText={setEditType}
                            style={[styles.prideText, { marginTop: dimensions.height * 0.01 }]}
                        />
                        <Text style={styles.modalPrideTitleText}>Notes</Text>
                        <TextInput
                            maxLength={30}
                            value={editNotes}
                            onChangeText={setEditNotes}
                            style={[styles.prideText, { marginTop: dimensions.height * 0.01 }]}
                        />
                        <Text style={styles.modalPrideTitleText}>Date</Text>
                        <TextInput
                            maxLength={10}
                            value={editDate}
                            onChangeText={handleEditDateInputChange}
                            style={[styles.prideText, { marginTop: dimensions.height * 0.01 }]}
                        />
                        <Text style={styles.modalPrideTitleText}>Location</Text>
                        <TextInput
                            maxLength={30}
                            value={editLocation}
                            onChangeText={setEditLocation}
                            style={[styles.prideText, { marginTop: dimensions.height * 0.01 }]}
                        />
                        <TouchableOpacity
                            onPress={saveEditedPride}
                            style={{
                                width: dimensions.width * 0.93,
                                height: dimensions.height * 0.07,
                                backgroundColor: 'rgba(0, 111, 253, 1)',
                                borderRadius: dimensions.width * 0.041,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: dimensions.height * 0.041,
                                alignSelf: 'center',
                            }}>
                            <Text
                                style={{
                                    textAlign: 'left',
                                    color: 'white',
                                    fontSize: dimensions.width * 0.05,
                                    fontFamily: prideFontPoppinsRegular,
                                    fontWeight: 700,
                                }}>
                                Save
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
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
                            {selectedPride?.name}
                        </Text>
                        <Image
                            source={{ uri: selectedPride?.image }}
                            style={{
                                width: dimensions.width,
                                height: dimensions.height * 0.27,
                                marginTop: dimensions.height * 0.01,
                            }}
                            resizeMode='stretch'
                        />
                        <Text style={styles.modalPrideTitleText}>Type</Text>
                        <Text style={[styles.prideText, { marginTop: dimensions.height * 0.01 }]}>
                            {selectedPride?.type}
                        </Text>
                        <Text style={styles.modalPrideTitleText}>Notes</Text>
                        <Text style={[styles.prideText, { marginTop: dimensions.height * 0.01 }]}>
                            {selectedPride?.notes}
                        </Text>
                        <Text style={styles.modalPrideTitleText}>Date</Text>
                        <Text style={[styles.prideText, { marginTop: dimensions.height * 0.01 }]}>
                            {selectedPride?.dateOfBirth}
                        </Text>
                        <Text style={styles.modalPrideTitleText}>Location</Text>
                        <Text style={[styles.prideText, { marginTop: dimensions.height * 0.01 }]}>
                            {selectedPride?.location}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setIsEditing(true)}
                            style={{
                                width: dimensions.width * 0.93,
                                height: dimensions.height * 0.07,
                                backgroundColor: 'rgba(0, 111, 253, 1)',
                                borderRadius: dimensions.width * 0.041,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: dimensions.height * 0.041,
                                alignSelf: 'center',
                            }}>
                            <Text
                                style={{
                                    textAlign: 'left',
                                    color: 'white',
                                    fontSize: dimensions.width * 0.05,
                                    fontFamily: prideFontPoppinsRegular,
                                    fontWeight: 700,
                                }}>
                                Edit
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={deletePride}
                            style={{
                                width: dimensions.width * 0.93,
                                height: dimensions.height * 0.07,
                                backgroundColor: 'rgba(255, 44, 32, 1)',
                                borderRadius: dimensions.width * 0.041,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: dimensions.height * 0.01,
                                alignSelf: 'center',
                            }}>
                            <Text
                                style={{
                                    textAlign: 'left',
                                    color: 'white',
                                    fontSize: dimensions.width * 0.05,
                                    fontFamily: prideFontPoppinsRegular,
                                    fontWeight: 700,
                                }}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const createPrideQuestHomeStyles = (dimensions) =>
    StyleSheet.create({
        modalPrideTitleText: {
            textAlign: 'left',
            color: 'white',
            fontSize: dimensions.width * 0.04,
            fontFamily: prideFontPoppinsRegular,
            fontWeight: '300',
            marginLeft: dimensions.width * 0.03,
            marginTop: dimensions.height * 0.02,
        },
        prideText: {
            textAlign: 'left',
            color: 'white',
            fontSize: dimensions.width * 0.046,
            fontFamily: prideFontPoppinsRegular,
            fontWeight: '600',
            marginLeft: dimensions.width * 0.03,
            marginTop: dimensions.height * 0.005,
        }
    });

export default PrideDetailsModalComponent;
