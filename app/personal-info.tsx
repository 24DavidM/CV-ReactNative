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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    useEffect(() => {
        setFormData(cvData.personalInfo);
    }, [cvData.personalInfo]);

    const handleSave = () => {
        const newErrors: { [key: string]: string } = {};

        // Validar nombre completo (máximo 50 caracteres)
        if (!formData.fullName?.trim()) {
            newErrors.fullName = "El nombre completo es obligatorio.";
        } else if (formData.fullName.length > 50) {
            newErrors.fullName = "El nombre completo no debe exceder los 50 caracteres.";
        } else if (/\d/.test(formData.fullName)) {
            newErrors.fullName = "El nombre no debe contener números.";
        }

        // Validar email
        if (!formData.email?.trim()) {
            newErrors.email = "El email es obligatorio.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "El email no es válido.";
        }

        // Validar teléfono
        if (formData.phone?.trim()) {
            const phoneRegex = /^\+\d{3}\s\d{2}\s\d{3}\s\d{4}$/;
            if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = "El teléfono debe tener el formato: +593 91 234 5678.";
            }
        }

        // Validar ubicación (máximo 50 caracteres)
        if (formData.location?.trim()) {
            if (formData.location.length > 50) {
                newErrors.location = "La ubicación no debe exceder los 50 caracteres.";
            } else if (/\d/.test(formData.location)) {
                newErrors.location = "La ubicación no debe contener números.";
            }
        }

        // Validar resumen profesional (máximo 250 palabras)
        if (formData.summary?.trim()) {
            const wordCount = formData.summary.trim().split(/\s+/).length;
            if (wordCount > 250) {
                newErrors.summary = "El resumen profesional no debe exceder las 250 palabras.";
            } else if (/\d/.test(formData.summary)) {
                newErrors.summary = "El resumen no debe contener números.";
            }
        }

        // Si hay errores, mostrar alerta
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Alert.alert("Error", "Por favor, corrige los campos marcados.");
            return;
        }

        // Si no hay errores, guardar
        setErrors({});
        updatePersonalInfo(formData);
        Alert.alert("Éxito", "Información personal guardada.", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <InputField
                    label="👤 Nombre Completo *"
                    placeholder="David Gmail"
                    value={formData.fullName}
                    onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                    error={errors.fullName}
                />
                <InputField
                    label="📧 Email *"
                    placeholder="david@gmail.com"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    autoCapitalize='none'
                    error={errors.email}
                />
                <InputField
                    label="📱 Teléfono"
                    placeholder="+593 91 234 5678"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    error={errors.phone}
                />
                <InputField
                    label="📍 Ubicación"
                    placeholder="Quito, Ecuador"
                    value={formData.location}
                    onChangeText={(text) => setFormData({ ...formData, location: text })}
                    error={errors.location}
                />
                <InputField
                    label="📝 Resumen Profesional"
                    placeholder="Describe brevemente tu perfil profesional..."
                    value={formData.summary}
                    onChangeText={(text) => setFormData({ ...formData, summary: text })}
                    multiline
                    numberOfLines={4}
                    style={{ height: 100, textAlignVertical: 'top' }}
                    error={errors.summary}
                />
                <NavigationButton
                    title="💾 Guardar Información"
                    onPress={handleSave}
                    style={styles.primaryButton}
                />
                <NavigationButton
                    title="❌ Cancelar"
                    variant="secondary"
                    onPress={() => router.back()}
                    style={styles.secondaryButton}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    primaryButton: {
        backgroundColor: '#30319bff', // Morado moderno
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    secondaryButton: {
        backgroundColor: '#f1f1f1',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#30319bff',
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#30319bff', // Morado moderno
        marginBottom: 8,
    },
    errorText: {
        color: '#ff4d4d', // Rojo para errores
        fontSize: 12,
        marginTop: 4,
    },
});
