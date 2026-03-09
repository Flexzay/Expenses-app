import { useCollaborators } from "@/hooks/useCollaborators";
import { useCreateCollaborator } from "@/hooks/useCreateCollaborator";
import { useDeleteCollaborator } from "@/hooks/useDeleteCollaborator";
import { useUpdateCollaborator } from "@/hooks/useUpdateCollaborator";
import { Collaborator } from "@/services/collaborators";
import { formatCOP } from "@/utils/currency";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { CollaboratorCard } from "../../components/ui/CollaboratorCard";
import { Header } from "../../components/ui/Header";
import { Colors } from "../../constants/colors";

export default function CollaboratorsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Collaborator | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");

  const { data: collaborators, isLoading, isError } = useCollaborators();
  const { mutate: createCollaborator, isPending: isCreating } =
    useCreateCollaborator();
  const { mutate: updateCollaborator, isPending: isUpdating } =
    useUpdateCollaborator();
  const { mutate: deleteCollaborator } = useDeleteCollaborator();

  const isPending = isCreating || isUpdating;
  const total = collaborators?.reduce((sum, c) => sum + c.amount, 0) ?? 0;

  const openAdd = () => {
    setEditingItem(null);
    setNameInput("");
    setAmountInput("");
    setDisplayAmount("");
    setModalVisible(true);
  };

  const openEdit = (item: Collaborator) => {
    setEditingItem(item);
    setNameInput(item.name);
    const raw = Math.round(item.amount).toString();
    setAmountInput(raw);
    setDisplayAmount(formatCOP(item.amount));
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setEditingItem(null);
    setNameInput("");
    setAmountInput("");
    setDisplayAmount("");
  };

  const handleAmountChange = (text: string) => {
    const raw = text.replace(/[^0-9]/g, "");
    setAmountInput(raw);
    setDisplayAmount(raw ? formatCOP(parseFloat(raw)) : "");
  };

  const handleSave = () => {
    const trimmedName = nameInput.trim();
    const parsed = parseFloat(amountInput);
    if (!trimmedName || isNaN(parsed) || parsed <= 0) return;

    if (editingItem) {
      updateCollaborator(
        { id: editingItem.id, payload: { name: trimmedName, amount: parsed } },
        { onSuccess: handleClose },
      );
    } else {
      createCollaborator(
        { name: trimmedName, amount: parsed },
        { onSuccess: handleClose },
      );
    }
  };

  const handleDelete = (item: Collaborator) => {
    Alert.alert("Eliminar colaborador", `¿Eliminar a "${item.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteCollaborator(item.id),
      },
    ]);
  };

  const isValid =
    nameInput.trim().length > 0 &&
    amountInput.length > 0 &&
    parseFloat(amountInput) > 0;

  return (
    <View style={styles.container}>
      <Header
        title="Colaboradores"
        subtitle="Gestiona los aportes"
        showBack={true}
      />

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Ionicons
              name="cloud-offline-outline"
              size={40}
              color={Colors.textMuted}
            />
            <Text style={styles.errorText}>Error al cargar colaboradores</Text>
          </View>
        ) : (
          <>
            {/* Total card */}
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total aportado</Text>
              <Text style={styles.totalAmount}>{formatCOP(total)}</Text>
              <Text style={styles.totalSub}>
                {collaborators?.length ?? 0} colaboradores
              </Text>
            </View>

            {/* Header lista */}
            <View style={styles.listHeader}>
              <Text style={styles.sectionLabel}>Colaboradores</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={openAdd}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={collaborators}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <CollaboratorCard
                  name={item.name}
                  amount={item.amount}
                  onEdit={() => openEdit(item)}
                  onDelete={() => handleDelete(item)}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="people-outline"
                    size={48}
                    color={Colors.border}
                  />
                  <Text style={styles.emptyTitle}>Sin colaboradores</Text>
                  <Text style={styles.emptySubtitle}>
                    Agrega personas que contribuyen al presupuesto
                  </Text>
                </View>
              }
            />
          </>
        )}
      </View>

      {/* Modal agregar / editar */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleClose}
          />

          <View style={styles.modalCard}>
            {/* Handle */}
            <View style={styles.handleBar} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? "Editar colaborador" : "Nuevo colaborador"}
              </Text>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <Ionicons name="close" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {editingItem
                ? "Actualiza los datos del colaborador."
                : "Agrega una persona que contribuye al presupuesto compartido."}
            </Text>

            {/* Nombre */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del colaborador"
                placeholderTextColor={Colors.textMuted}
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus={!editingItem}
                editable={!isPending}
              />
            </View>

            {/* Monto */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Valor a aportar</Text>
              <View
                style={[
                  styles.inputWrapper,
                  isPending && styles.inputWrapperDisabled,
                ]}
              >
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  value={displayAmount}
                  onChangeText={handleAmountChange}
                  editable={!isPending}
                />
              </View>
            </View>

            {/* Botones */}
            <View style={styles.modalActions}>
              <View style={styles.cancelBtn}>
                <Button
                  label="Cancelar"
                  variant="ghost"
                  onPress={handleClose}
                />
              </View>
              <View style={styles.saveBtn}>
                <Button
                  label={
                    isPending
                      ? "Guardando..."
                      : editingItem
                        ? "Guardar"
                        : "Agregar"
                  }
                  onPress={handleSave}
                  disabled={!isValid || isPending}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

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

  // Total
  totalCard: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  totalSub: { fontSize: 13, color: "rgba(255,255,255,0.65)" },

  // Lista
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionLabel: { fontSize: 15, fontWeight: "700", color: Colors.text },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  list: { paddingBottom: 40 },
  emptyContainer: { alignItems: "center", marginTop: 40, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  emptySubtitle: { fontSize: 14, color: Colors.textMuted, textAlign: "center" },

  // Modal
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

  field: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: Colors.text },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  inputWrapperDisabled: { opacity: 0.5 },
  amountInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    marginBottom: Platform.OS === "ios" ? 8 : 0,
  },
  cancelBtn: { flex: 1 },
  saveBtn: { flex: 2 },
});
