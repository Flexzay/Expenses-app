import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  FlatList,
  Modal,
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

type Collaborator = {
  id: string;
  name: string;
  amount: number;
};

const INITIAL: Collaborator[] = [
  { id: "1", name: "María López", amount: 150000 },
  { id: "2", name: "Carlos Ruiz", amount: 80000 },
];

export default function CollaboratorsScreen() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [amountInput, setAmountInput] = useState("");

  const total = collaborators.reduce((sum, c) => sum + c.amount, 0);

  const openAdd = () => {
    setEditingId(null);
    setNameInput("");
    setAmountInput("");
    setModalVisible(true);
  };

  const openEdit = (item: Collaborator) => {
    setEditingId(item.id);
    setNameInput(item.name);
    setAmountInput(item.amount.toString());
    setModalVisible(true);
  };

  const handleSave = () => {
    const trimmedName = nameInput.trim();
    const parsedAmount = parseFloat(amountInput);
    if (!trimmedName || isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (editingId) {
      setCollaborators((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, name: trimmedName, amount: parsedAmount }
            : c,
        ),
      );
    } else {
      setCollaborators((prev) => [
        ...prev,
        { id: Date.now().toString(), name: trimmedName, amount: parsedAmount },
      ]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <View style={styles.container}>
      <Header
        title="Colaboradores"
        subtitle="Gestiona los aportes"
        showBack={true}
      />

      <View style={styles.content}>
        {/* Total card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total aportado</Text>
          <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
          <Text style={styles.totalSub}>
            {collaborators.length} colaboradores
          </Text>
        </View>

        {/* Header lista */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionLabel}>Colaboradores</Text>
          <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Lista */}
        <FlatList
          data={collaborators}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <CollaboratorCard
              name={item.name}
              amount={item.amount}
              onEdit={() => openEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="people-outline"
                size={48}
                color={Colors.textMuted}
              />
              <Text style={styles.empty}>No hay colaboradores aún.</Text>
            </View>
          }
        />
      </View>

      {/* Modal agregar / editar */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? "Editar colaborador" : "Nuevo colaborador"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del colaborador"
                placeholderTextColor={Colors.textMuted}
                value={nameInput}
                onChangeText={setNameInput}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Valor a aportar</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={amountInput}
                onChangeText={setAmountInput}
              />
            </View>

            <View style={styles.modalActions}>
              <Button
                label="Cancelar"
                variant="ghost"
                onPress={() => setModalVisible(false)}
              />
              <Button
                label={editingId ? "Guardar" : "Agregar"}
                onPress={handleSave}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 16,
  },

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
  totalSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
  },

  // Lista
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 48,
    gap: 12,
  },
  empty: {
    color: Colors.textMuted,
    fontSize: 15,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
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
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
});
