// app/index.tsx - Agregando Context

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";

export default function HomeScreen() {
    const router = useRouter();
    const { cvData } = useCVContext();

    console.log("CV Data cargado:", cvData); // Para debugging

    const isPersonalInfoComplete =
        cvData.personalInfo.fullName && cvData.personalInfo.email;
    const hasExperience = cvData.experiences.length > 0;
    const hasEducation = cvData.education.length > 0;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Crea tu CV Profesional</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Información Personal</Text>
                    <Text style={styles.status}>
                        {isPersonalInfoComplete ? "✓ Completado" : "Pendiente"}
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("/personal-info")}
                    >
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Experiencia</Text>
                    <Text style={styles.status}>
                        {hasExperience
                            ? `✓ ${cvData.experiences.length} agregada(s)`
                            : "Pendiente"}
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("/experience")}
                    >
                        <Text style={styles.buttonText}>Agregar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Educación</Text>
                    <Text style={styles.status}>
                        {hasEducation
                            ? `✓ ${cvData.education.length} agregada(s)`
                            : "Pendiente"}
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("/education")}
                    >
                        <Text style={styles.buttonText}>Agregar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.previewSection}>
                    <TouchableOpacity
                        style={[styles.button, styles.previewButton]}
                        onPress={() => router.push("/preview")}
                    >
                        <Text style={styles.buttonText}>Ver Vista Previa del CV</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    content: {
        paddingBottom: 20, // Para garantizar que el contenido al final sea visible sin problemas
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 20,
        color: "#30319bff", // Morado principal
        textAlign: "center",
    },
    section: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3, // Sombra para Android
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#30319bff", // Morado principal
        marginBottom: 8,
    },
    status: {
        fontSize: 15,
        color: "#27ae60", // Verde para "Completado"
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#30319bff", // Morado principal
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "600",
    },
    previewSection: {
        alignItems: "center",
    },
    previewButton: {
        backgroundColor: "#2ecc71",
        marginVertical: 50,

    },
});
