import { View, Text, Alert, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useCVContext } from '@/context/CVContext'
import { PersonalInfo } from '@/types/cv.types'
import { InputField } from '@/components/InputField'
import { NavigationButton } from '@/components/NavigationButton'

export default function PersonalInfoScreen() {

    const router = useRouter()
    const { cvData, updatePersonalInfo } = useCVContext();
    const [formData, setFormData] = useState<PersonalInfo>(cvData.personalInfo);

    useEffect(() => {
        setFormData(cvData.personalInfo);
    }, [cvData.personalInfo]);

    const handleSave = () => {
        if (!formData.fullName || !formData.email) {
            Alert.alert("Error", "Por favor, complete los campos obligatorios.");
            return;
        }
        updatePersonalInfo(formData);
        Alert.alert("Éxito", "Información personal guardada.", [
            { text: "OK", onPress: () => router.back() }
        ]);

    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <InputField
                    label="Nombre Completo *"
                    placeholder="David Gmail"
                    value={formData.fullName}
                    onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                />
                <InputField
                    label="Email *"
                    placeholder="david@gmail.com"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    autoCapitalize='none'
                />
                <InputField
                    label="Teléfono"
                    placeholder="+593 91 234 5678"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                />
                <InputField
                    label="Ubicación"
                    placeholder="Quito, Ecuador"
                    value={formData.location}
                    onChangeText={(text) => setFormData({ ...formData, location: text })}
                />
                <InputField
                    label="Resumen Profesional"
                    placeholder="Describe brevemente tu perfil profesional..."
                    value={formData.summary}
                    onChangeText={(text) => setFormData({ ...formData, summary: text })}
                    multiline
                    numberOfLines={4}
                    style={{ height: 100, textAlignVertical: 'top' }}
                />
                <NavigationButton
                    title="Guardar Información"
                    onPress={handleSave}
                    />
                <NavigationButton
                    title="Cancelar"
                    variant="secondary"
                    onPress={() => router.back()}
                />

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    }
})