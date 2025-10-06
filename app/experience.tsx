import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";

export default function ExperienceScreen() {
    const router = useRouter();
    const { cvData, addExperience, deleteExperience } = useCVContext();
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [formData, setFormData] = useState<Omit<Experience, "id">>({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleAdd = () => {
        const newErrors: { [key: string]: string } = {};

        // Validar empresa
        if (!formData.company.trim()) {
            newErrors.company = "La empresa es obligatoria.";
        } else if (/\d/.test(formData.company)) {
            newErrors.company = "La empresa no debe contener números.";
        }

        // Validar cargo
        if (!formData.position.trim()) {
            newErrors.position = "El cargo es obligatorio.";
        } else if (/\d/.test(formData.position)) {
            newErrors.position = "El cargo no debe contener números.";
        }

        // Validar fecha de inicio
        if (!formData.startDate.trim()) {
            newErrors.startDate = "La fecha de inicio es obligatoria.";
        } else {
            const start = new Date(formData.startDate);
            const today = new Date();
            start.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (start > today) {
                newErrors.startDate = "La fecha de inicio no puede ser en el futuro.";
            }
        }

        // Validar fecha de fin
        if (formData.endDate.trim()) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            if (end < start) {
                newErrors.endDate = "La fecha de fin no puede ser anterior a la de inicio.";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Alert.alert("Error", "Por favor corrige los campos marcados.");
            return;
        }

        const newExperience: Experience = {
            id: Date.now().toString(),
            ...formData,
        };

        addExperience(newExperience);

        setFormData({
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
        });
        setErrors({});

        Alert.alert("Éxito", "Experiencia agregada correctamente");
    };

    const handleDelete = (id: string) => {
        Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: () => deleteExperience(id),
            },
        ]);
    };

    // Manejador de fechas
    const handleDateChange = (
        event: any,
        selectedDate: Date | undefined,
        field: "startDate" | "endDate"
    ) => {
        if (selectedDate) {
            const isoString = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
            setFormData({ ...formData, [field]: isoString });
        }

        if (Platform.OS === "android") {
            if (field === "startDate") setShowStartPicker(false);
            else setShowEndPicker(false);
        }
    };

    // Formatear fecha para mostrar en español
    const formatDisplayDate = (isoDate: string) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        return date.toLocaleDateString("es-ES", { year: "numeric", month: "long" });
    };

    return (
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

            <InputField
                label="🏢 Empresa *"
                placeholder="Nombre de la empresa"
                value={formData.company}
                onChangeText={(text) => setFormData({ ...formData, company: text })}
                error={errors.company}
            />

            <InputField
                label="💼 Cargo *"
                placeholder="Tu posición"
                value={formData.position}
                onChangeText={(text) => setFormData({ ...formData, position: text })}
                error={errors.position}
            />

            {/* Fecha de inicio */}
            <Text style={styles.label}>📅 Fecha de Inicio *</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateInput}>
                <Text style={errors.startDate ? styles.errorText : undefined}>
                    {formData.startDate ? formatDisplayDate(formData.startDate) : "Selecciona la fecha de inicio"}
                </Text>
            </TouchableOpacity>
            {showStartPicker && (
                <DateTimePicker
                    value={formData.startDate ? new Date(formData.startDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => handleDateChange(event, date, "startDate")}
                />
            )}
            {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}

            {/* Fecha de fin */}
            <Text style={styles.label}>📆 Fecha de Fin</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateInput}>
                <Text>
                    {formData.endDate ? formatDisplayDate(formData.endDate) : "Selecciona la fecha de fin"}
                </Text>
            </TouchableOpacity>
            {showEndPicker && (
                <DateTimePicker
                    value={formData.endDate ? new Date(formData.endDate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => handleDateChange(event, date, "endDate")}
                />
            )}
            {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}

            <InputField
                label="📝 Descripción"
                placeholder="Describe tus responsabilidades y logros..."
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={4}
                style={{ height: 100, textAlignVertical: "top" }}
            />

            <View style={styles.buttonContainer}>
                <NavigationButton style={styles.button} title="Agregar Experiencia" onPress={handleAdd} />
                <NavigationButton
                    title="Volver"
                    onPress={() => router.back()}
                    variant="secondary"
                    style={{ marginLeft: 16, borderColor: "#30319bff", borderWidth: 2 }}
                />
            </View>

            {cvData.experiences.length > 0 && (
                <View style={styles.listTitle}>
                    <Text>Experiencias Agregadas</Text>
                    {cvData.experiences.map((exp) => (
                        <View key={exp.id} style={styles.card}>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{exp.position}</Text>
                                <Text style={styles.cardSubtitle}>{exp.company}</Text>
                                <Text style={styles.cardDate}>
                                    {formatDisplayDate(exp.startDate)} - {exp.endDate ? formatDisplayDate(exp.endDate) : "Actual"}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(exp.id)}>
                                <Text style={styles.deleteButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginTop: 8,
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
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: "#30319B", // Color personalizado
    },
    dateInput: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#30319B", // Color personalizado
        marginBottom: 12,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 20,
        alignItems: "center",
    },
    button: {
        backgroundColor: "#30319bff"
    }
});
