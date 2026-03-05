import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../components/ui/Header";
import { Button } from "../../components/ui/Button";
import { Colors } from "../../constants/colors";

const ALL_EXPENSES = [
  { id: "1", title: "Recarga gas",       amount: 45000, category: "Gas",             icon: "flame-outline",           date: "4 mar",  month: "Marzo",   description: "Recarga mensual del cilindro de gas." },
  { id: "2", title: "Netflix",           amount: 17900, category: "Entretenimiento", icon: "game-controller-outline", date: "3 mar",  month: "Marzo",   description: "Suscripción mensual Netflix HD."      },
  { id: "3", title: "Factura agua",      amount: 32000, category: "Agua",            icon: "water-outline",           date: "2 mar",  month: "Marzo",   description: ""                                     },
  { id: "4", title: "Energía eléctrica", amount: 89000, category: "Energía",         icon: "flash-outline",           date: "1 mar",  month: "Marzo",   description: "Factura de energía mes de febrero."   },
  { id: "5", title: "Spotify",           amount: 15900, category: "Entretenimiento", icon: "game-controller-outline", date: "28 feb", month: "Febrero", description: "Suscripción mensual Spotify."         },
  { id: "6", title: "Agua febrero",      amount: 30000, category: "Agua",            icon: "water-outline",           date: "25 feb", month: "Febrero", description: ""                                     },
  { id: "7", title: "Gas febrero",       amount: 42000, category: "Gas",             icon: "flame-outline",           date: "20 feb", month: "Febrero", description: ""                                     },
  { id: "8", title: "Luz febrero",       amount: 76000, category: "Energía",         icon: "flash-outline",           date: "18 feb", month: "Febrero", description: ""                                     },
];

const CATEGORIES = [
  { id: "1", name: "Gas",             icon: "flame-outline"           },
  { id: "2", name: "Agua",            icon: "water-outline"           },
  { id: "3", name: "Energía",         icon: "flash-outline"           },
  { id: "4", name: "Entretenimiento", icon: "game-controller-outline" },
  { id: "5", name: "Otros",           icon: "pricetag-outline"        },
];

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const expense = ALL_EXPENSES.find((e) => e.id === id);

  const [editModal, setEditModal] = useState(false);
  const [titleInput, setTitleInput] = useState(expense?.title ?? "");
  const [amountInput, setAmountInput] = useState(expense?.amount.toString() ?? "");
  const [descInput, setDescInput] = useState(expense?.description ?? "");
  const [selectedCategory, setSelectedCategory] = useState(expense?.category ?? "");

  if (!expense) {
    return (
      <View style={styles.container}>
        <Header title="Detalle" showBack={true} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Gasto no encontrado.</Text>
        </View>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar gasto",
      "¿Estás seguro de que quieres eliminar este gasto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            // aquí irá la lógica de eliminar
            router.back();
          },
        },
      ]
    );
  };

  const handleSave = () => {
    // aquí irá la lógica de guardar edición
    setEditModal(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Detalle del gasto" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Card principal */}
        <View style={styles.mainCard}>
          <View style={styles.iconWrap}>
            <Ionicons name={expense.icon as any} size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.mainAmount}>-${expense.amount.toLocaleString()}</Text>
          <Text style={styles.mainTitle}>{expense.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{expense.category}</Text>
          </View>
        </View>

        {/* Info detalle */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>{expense.date}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="grid-outline" size={18} color={Colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Categoría</Text>
              <Text style={styles.infoValue}>{expense.category}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={18} color={Colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Descripción</Text>
              <Text style={styles.infoValue}>
                {expense.description || "Sin descripción"}
              </Text>
            </View>
          </View>
        </View>

        {/* Acciones */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.8}
            onPress={() => setEditModal(true)}
          >
            <Ionicons name="pencil-outline" size={20} color={Colors.primary} />
            <Text style={styles.editBtnText}>Editar gasto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.8}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
            <Text style={styles.deleteBtnText}>Eliminar gasto</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal editar */}
      <Modal
        visible={editModal}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar gasto</Text>
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Título</Text>
              <TextInput
                style={styles.input}
                value={titleInput}
                onChangeText={setTitleInput}
                placeholder="Nombre del gasto"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Monto</Text>
              <TextInput
                style={styles.input}
                value={amountInput}
                onChangeText={setAmountInput}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Categoría</Text>
              <View style={styles.catGrid}>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.catItem, isSelected && styles.catItemSelected]}
                      onPress={() => setSelectedCategory(cat.name)}
                    >
                      <Ionicons
                        name={cat.icon as any}
                        size={16}
                        color={isSelected ? "#FFFFFF" : Colors.primary}
                      />
                      <Text style={[styles.catItemText, isSelected && styles.catItemTextSelected]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Descripción</Text>
              <TextInput
                style={[styles.input, { height: 70, textAlignVertical: "top" }]}
                value={descInput}
                onChangeText={setDescInput}
                placeholder="Opcional"
                placeholderTextColor={Colors.textMuted}
                multiline
              />
            </View>

            <View style={styles.modalActions}>
              <Button label="Cancelar" variant="ghost" onPress={() => setEditModal(false)} />
              <Button label="Guardar" onPress={handleSave} />
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
  scroll: {
    padding: 20,
    paddingTop: 16,
  },

  // Main card
  mainCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  mainAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  categoryBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 4,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Info card
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  // Acciones
  actions: {
    gap: 12,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: 14,
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    paddingVertical: 14,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.danger,
  },

  // Not found
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    color: Colors.textMuted,
    fontSize: 16,
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
    gap: 14,
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
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  catItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  catItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  catItemTextSelected: {
    color: "#FFFFFF",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
});