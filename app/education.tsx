import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";

export default function EducationScreen() {
    const router = useRouter();
    const { cvData, addEducation, deleteEducation } = useCVContext();

    const [formData, setFormData] = useState<Omit<Education, "id">>({
        institution: "",
        degree: "",
        field: "",
        graduationYear: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleAdd = () => {
        const newErrors: { [key: string]: string } = {};

        // Institución
        if (!formData.institution.trim()) {
            newErrors.institution = "La institución es obligatoria.";
        } else if (/\d/.test(formData.institution)) {
            newErrors.institution = "La institución no debe contener números.";
        }

        // Título/Grado
        if (!formData.degree.trim()) {
            newErrors.degree = "El título o grado es obligatorio.";
        } else if (/\d/.test(formData.degree)) {
            newErrors.degree = "El título no debe contener números.";
        }

        // Área de estudio
        if (formData.field.trim() && /\d/.test(formData.field)) {
            newErrors.field = "El área de estudio no debe contener números.";
        }

        // Año de graduación
        if (formData.graduationYear.trim()) {
            const yearRegex = /^\d{4}$/;
            if (!yearRegex.test(formData.graduationYear)) {
                newErrors.graduationYear = "Debe ser un año válido de 4 dígitos (ej: 2024).";
            }
        }

        // Si hay errores, mostrar
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Alert.alert("Error", "Corrige los campos marcados.");
            return;
        }

        // Si todo está bien
        const newEducation: Education = {
            id: Date.now().toString(),
            ...formData,
        };

        addEducation(newEducation);

        // Limpiar formulario
        setFormData({
            institution: "",
            degree: "",
            field: "",
            graduationYear: "",
        });
        setErrors({}); // limpiar errores
        Alert.alert("Éxito", "Educación agregada correctamente");
    };

    const handleDelete = (id: string) => {
        Alert.alert("Confirmar", "¿Estás seguro de eliminar esta educación?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: () => deleteEducation(id),
            },
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

                <InputField
                    label="🎓 Institución *"
                    placeholder="Nombre de la universidad/institución"
                    value={formData.institution}
                    onChangeText={(text) =>
                        setFormData({ ...formData, institution: text })
                    }
                    error={errors.institution}
                />

                <InputField
                    label="📜 Título/Grado *"
                    placeholder="Ej: Licenciatura, Maestría"
                    value={formData.degree}
                    onChangeText={(text) => setFormData({ ...formData, degree: text })}
                    error={errors.degree}
                />

                <InputField
                    label="🧑‍🎓 Área de Estudio"
                    placeholder="Ej: Ingeniería en Sistemas"
                    value={formData.field}
                    onChangeText={(text) => setFormData({ ...formData, field: text })}
                    error={errors.field}
                />

                <InputField
                    label="📅 Año de Graduación"
                    placeholder="Ej: 2023"
                    value={formData.graduationYear}
                    onChangeText={(text) =>
                        setFormData({ ...formData, graduationYear: text })
                    }
                    keyboardType="numeric"
                    error={errors.graduationYear}
                />

                <NavigationButton title="✅ Agregar Educación" onPress={handleAdd} />

                {cvData.education.length > 0 && (
                    <>
                        <Text style={styles.listTitle}>Educación Agregada</Text>
                        {cvData.education.map((edu) => (
                            <View key={edu.id} style={styles.card}>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{edu.degree}</Text>
                                    <Text style={styles.cardSubtitle}>{edu.field}</Text>
                                    <Text style={styles.cardInstitution}>{edu.institution}</Text>
                                    <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(edu.id)}
                                >
                                    <Text style={styles.deleteButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </>
                )}

                <NavigationButton
                    title="◀ Volver"
                    onPress={() => router.back()}
                    variant="secondary"
                    style={{ marginTop: 16 }}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#30319B", // Color personalizado
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#30319B", // Color personalizado
        marginTop: 24,
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#30319B", // Color personalizado
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#7f8c8d",
        marginBottom: 4,
    },
    cardInstitution: {
        fontSize: 14,
        color: "#95a5a6",
        marginBottom: 2,
    },
    cardDate: {
        fontSize: 12,
        color: "#95a5a6",
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#e74c3c",
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
