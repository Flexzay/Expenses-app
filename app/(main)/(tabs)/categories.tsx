import { useCategories } from "@/hooks/useCategories";
import { useCreateCategory } from "@/hooks/useCreateCategory";
import { Category } from "@/services/categories";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../../components/ui/Button";
import { CategoryCard } from "../../../components/ui/CategoryCard";
import { Header } from "../../../components/ui/Header";
import { Colors } from "../../../constants/colors";

export default function CategoriesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // ¡Mira qué simple! Ya solo traemos la data directa del backend
  const { data: categories, isLoading, isError } = useCategories();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const handleOpenModal = () => {
    setNameInput("");
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setNameInput("");
  };

  const handleCreate = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    createCategory(
      { name: trimmed, type: "expense" },
      { onSuccess: handleClose },
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Categorías"
        subtitle="Gestiona tus categorías"
        showBack={true}
      />

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Ionicons name="cloud-offline-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.errorText}>Error al cargar categorías</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>
              {categories?.length ?? 0} {(categories?.length ?? 0) === 1 ? "categoría" : "categorías"}
            </Text>

            {categories?.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="pricetags-outline" size={44} color={Colors.border} />
                <Text style={styles.emptyTitle}>Sin categorías</Text>
                <Text style={styles.emptySubtitle}>Pulsa + para agregar tu primera categoría</Text>
              </View>
            ) : (
              categories?.map((item: Category) => (
                <View key={item.id} style={{ marginBottom: 10 }}>
                  <CategoryCard
                    name={item.name}
                    icon="pricetag-outline"
                    onDelete={() => {}}
                  />
                </View>
              ))
            )}

            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </View>

      {/* FAB */}
      {!isLoading && !isError && (
        <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={handleOpenModal}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={handleClose}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={handleClose} />
          <View style={styles.modalCard}>
            <View style={styles.handleBar} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva categoría</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <Ionicons name="close" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Crea una categoría personalizada para clasificar tus gastos.
            </Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Gimnasio, Software..."
                placeholderTextColor={Colors.textMuted}
                value={nameInput}
                onChangeText={setNameInput}
                editable={!isPending}
                onSubmitEditing={handleCreate}
              />
            </View>

            <View style={styles.modalActions}>
              <View style={styles.cancelBtn}>
                <Button label="Cancelar" variant="ghost" onPress={handleClose} />
              </View>
              <View style={styles.saveBtn}>
                <Button
                  label={isPending ? "Creando..." : "Crear"}
                  onPress={handleCreate}
                  disabled={isPending || !nameInput.trim()}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ... mantén los mismos estilos (styles) del último código que te envié.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 20, paddingTop: 16 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  errorText: { fontSize: 15, color: Colors.textMuted },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  emptyWrap: { flex: 1, alignItems: "center", gap: 10, paddingTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  emptySubtitle: { fontSize: 14, color: Colors.textMuted, textAlign: "center" },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 12,
    gap: 16,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    marginTop: -8,
  },
  
  // Estilos de las sugerencias
  suggestionsScroll: {
    marginTop: 8,
    marginBottom: 4,
  },
  suggestionsContainer: {
    gap: 8,
    paddingRight: 20,
  },
  suggestionChip: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  suggestionChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.text,
  },
  suggestionTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  field: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: Colors.text },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 4 },
  cancelBtn: { flex: 1 },
  saveBtn: { flex: 2 },
});