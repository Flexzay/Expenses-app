import { useCategories } from "@/hooks/useCategories";
import { Budget } from "@/services/budgets";
import { formatCOP } from "@/utils/currency";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Alert,
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
import { Header } from "../../../components/ui/Header";
import { Colors } from "../../../constants/colors";
import { useBudgets } from "@/hooks/useBudgets";
import { useCreateBudget } from "@/hooks/useCreateBudget";
import { useDeleteBudget } from "@/hooks/useDeleteBudget";
import { useUpdateBudget } from "@/hooks/useUpdateBudget";

const NOW = new Date();
const CURRENT_MONTH = NOW.getMonth() + 1;
const CURRENT_YEAR = NOW.getFullYear();

const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

type ModalMode = "add" | "edit";

export default function BudgetsScreen() {
  const { data: budgets, isLoading } = useBudgets(CURRENT_MONTH, CURRENT_YEAR);
  const { data: categories } = useCategories();
  const { mutate: createBudget, isPending: isCreating } = useCreateBudget();
  const { mutate: updateBudget, isPending: isUpdating } = useUpdateBudget();
  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");

  // Categorías que aún NO tienen presupuesto este mes
  const usedCategoryIds = new Set(budgets?.map((b) => b.category_id) ?? []);
  const availableCategories = categories?.filter((c) => !usedCategoryIds.has(c.id)) ?? [];

  const totalBudgeted = budgets?.reduce((acc, b) => acc + b.amount, 0) ?? 0;
  const totalSpent    = budgets?.reduce((acc, b) => acc + b.spent,  0) ?? 0;

  const handleAmountChange = (text: string) => {
    const raw = text.replace(/[^0-9]/g, "");
    setAmountInput(raw);
    setDisplayAmount(raw ? formatCOP(parseFloat(raw)) : "");
  };

  const openAdd = () => {
    setModalMode("add");
    setSelectedBudget(null);
    setSelectedCategory(null);
    setAmountInput("");
    setDisplayAmount("");
    setModalVisible(true);
  };

  const openEdit = (budget: Budget) => {
    setModalMode("edit");
    setSelectedBudget(budget);
    setSelectedCategory(budget.category_id);
    const raw = Math.round(budget.amount).toString();
    setAmountInput(raw);
    setDisplayAmount(formatCOP(budget.amount));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBudget(null);
    setSelectedCategory(null);
    setAmountInput("");
    setDisplayAmount("");
  };

  const handleSave = () => {
    const parsed = parseFloat(amountInput);
    if (isNaN(parsed) || parsed <= 0) return;

    if (modalMode === "add") {
      if (!selectedCategory) return;
      createBudget(
        {
          category_id: selectedCategory,
          amount: parsed,
          month: CURRENT_MONTH,
          year: CURRENT_YEAR,
        },
        { onSuccess: closeModal }
      );
    } else if (selectedBudget) {
      updateBudget(
        { id: selectedBudget.id, payload: { amount: parsed } },
        { onSuccess: closeModal }
      );
    }
  };

  const handleDelete = () => {
    if (!selectedBudget) return;
    Alert.alert(
      "Eliminar presupuesto",
      `¿Eliminar el presupuesto de ${selectedBudget.category?.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteBudget(selectedBudget.id, { onSuccess: closeModal }),
        },
      ]
    );
  };

  const isPending = isCreating || isUpdating || isDeleting;
  const isValid =
    amountInput.length > 0 &&
    parseFloat(amountInput) > 0 &&
    (modalMode === "edit" || selectedCategory !== null);

  return (
    <View style={styles.container}>
      <Header title="Presupuestos" subtitle={`${MONTH_NAMES[CURRENT_MONTH - 1]} ${CURRENT_YEAR}`} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Resumen total */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Presupuestado</Text>
            <Text style={styles.summaryAmount}>{formatCOP(totalBudgeted)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Gastado</Text>
            <Text style={[styles.summaryAmount, { color: Colors.danger }]}>
              {formatCOP(totalSpent)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Disponible</Text>
            <Text style={[styles.summaryAmount, { color: Colors.accent }]}>
              {formatCOP(Math.max(totalBudgeted - totalSpent, 0))}
            </Text>
          </View>
        </View>

        {/* Lista de presupuestos */}
        <Text style={styles.sectionTitle}>Por categoría</Text>

        {isLoading ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Cargando...</Text>
          </View>
        ) : budgets?.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="wallet-outline" size={42} color={Colors.border} />
            <Text style={styles.emptyText}>No hay presupuestos este mes</Text>
            <Text style={styles.emptyHint}>Toca + para agregar uno</Text>
          </View>
        ) : (
          budgets?.map((budget) => {
            const pct = budget.amount > 0
              ? Math.min(Math.round((budget.spent / budget.amount) * 100), 100)
              : 0;
            const barColor =
              pct >= 90 ? Colors.danger : pct >= 70 ? "#F59E0B" : Colors.accent;
            const remaining = Math.max(budget.amount - budget.spent, 0);

            return (
              <TouchableOpacity
                key={budget.id}
                style={styles.budgetCard}
                activeOpacity={0.75}
                onPress={() => openEdit(budget)}
              >
                {/* Header */}
                <View style={styles.budgetHeader}>
                  <View style={styles.categoryBadge}>
                    <Ionicons name="pricetag-outline" size={16} color={Colors.primary} />
                    <Text style={styles.categoryName}>{budget.category?.name}</Text>
                  </View>
                  <View style={styles.pctBadge}>
                    <Text style={[styles.pctText, { color: barColor }]}>{pct}%</Text>
                  </View>
                </View>

                {/* Barra progreso */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${pct}%`, backgroundColor: barColor },
                    ]}
                  />
                </View>

                {/* Montos */}
                <View style={styles.budgetAmounts}>
                  <Text style={styles.spentText}>
                    Gastado: <Text style={{ color: Colors.danger, fontWeight: "700" }}>{formatCOP(budget.spent)}</Text>
                  </Text>
                  <Text style={styles.remainingText}>
                    Restante: <Text style={{ color: Colors.accent, fontWeight: "700" }}>{formatCOP(remaining)}</Text>
                  </Text>
                </View>

                <Text style={styles.budgetTotal}>
                  Límite: {formatCOP(budget.amount)}
                </Text>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      {availableCategories.length > 0 && (
        <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={openAdd}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Modal agregar / editar */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeModal}
          />

          <View style={styles.modalCard}>
            <View style={styles.handleBar} />

            {/* Header modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalMode === "add" ? "Nuevo presupuesto" : "Editar presupuesto"}
              </Text>
              <View style={styles.modalHeaderRight}>
                {modalMode === "edit" && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={handleDelete}
                    disabled={isPending}
                  >
                    <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                  <Ionicons name="close" size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {/* Categoría (solo en modo add) */}
              {modalMode === "add" && (
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Categoría</Text>
                  {availableCategories.length === 0 ? (
                    <Text style={styles.fieldHint}>
                      Todas las categorías ya tienen presupuesto este mes.
                    </Text>
                  ) : (
                    <View style={styles.categoryGrid}>
                      {availableCategories.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <TouchableOpacity
                            key={cat.id}
                            style={[
                              styles.categoryChip,
                              isSelected && styles.categoryChipSelected,
                            ]}
                            onPress={() => setSelectedCategory(cat.id)}
                          >
                            <Text
                              style={[
                                styles.categoryChipText,
                                isSelected && styles.categoryChipTextSelected,
                              ]}
                            >
                              {cat.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}

              {/* En edición: muestra categoría fija */}
              {modalMode === "edit" && selectedBudget && (
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Categoría</Text>
                  <View style={styles.categoryFixed}>
                    <Ionicons name="pricetag-outline" size={16} color={Colors.primary} />
                    <Text style={styles.categoryFixedText}>
                      {selectedBudget.category?.name}
                    </Text>
                  </View>
                </View>
              )}

              {/* Monto */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Límite de gasto</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="numeric"
                    value={displayAmount}
                    onChangeText={handleAmountChange}
                    autoFocus={modalMode === "edit"}
                    editable={!isPending}
                  />
                </View>
              </View>

              {/* Info de gasto actual en edición */}
              {modalMode === "edit" && selectedBudget && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoBoxText}>
                    Ya gastaste{" "}
                    <Text style={{ color: Colors.danger, fontWeight: "700" }}>
                      {formatCOP(selectedBudget.spent)}
                    </Text>{" "}
                    de esta categoría este mes.
                  </Text>
                </View>
              )}

              <View style={{ height: 16 }} />

              {/* Acciones */}
              <View style={styles.modalActions}>
                <View style={styles.cancelBtn}>
                  <Button label="Cancelar" variant="ghost" onPress={closeModal} />
                </View>
                <View style={styles.saveBtn}>
                  <Button
                    label={isPending ? "Guardando..." : modalMode === "add" ? "Agregar" : "Guardar"}
                    onPress={handleSave}
                    disabled={!isValid || isPending}
                  />
                </View>
              </View>

              <View style={{ height: 24 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingTop: 12 },

  // Summary
  summaryCard: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  summaryCol: { flex: 1, alignItems: "center" },
  summaryLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 },
  summaryAmount: { fontSize: 15, fontWeight: "800", color: "#FFFFFF" },
  summaryDivider: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.2)" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },

  // Empty
  emptyWrap: { alignItems: "center", paddingVertical: 48, gap: 10 },
  emptyText: { fontSize: 15, color: Colors.textMuted, fontWeight: "600" },
  emptyHint: { fontSize: 13, color: Colors.textMuted },

  // Budget card
  budgetCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryName: { fontSize: 15, fontWeight: "700", color: Colors.text },
  pctBadge: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pctText: { fontSize: 13, fontWeight: "700" },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 999,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 999 },
  budgetAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  spentText: { fontSize: 13, color: Colors.textMuted },
  remainingText: { fontSize: 13, color: Colors.textMuted },
  budgetTotal: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },

  // FAB
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

  // Modal
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  modalCard: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 12,
    maxHeight: "85%",
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  modalHeaderRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  // Fields
  field: { marginBottom: 20 },
  fieldLabel: { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 10 },
  fieldHint: { fontSize: 13, color: Colors.textMuted },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  categoryChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  categoryChipText: { fontSize: 14, fontWeight: "600", color: Colors.textMuted },
  categoryChipTextSelected: { color: "#FFFFFF" },
  categoryFixed: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categoryFixedText: { fontSize: 15, fontWeight: "600", color: Colors.text },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 22, fontWeight: "700", color: Colors.text },
  infoBox: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  infoBoxText: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  modalActions: { flexDirection: "row", gap: 12 },
  cancelBtn: { flex: 1 },
  saveBtn: { flex: 2 },
});