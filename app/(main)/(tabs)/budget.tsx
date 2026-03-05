import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../../components/ui/Header";
import { Button } from "../../../components/ui/Button";
import { Colors } from "../../../constants/colors";

type BudgetCategory = {
  id: string;
  name: string;
  icon: string;
  budget: number;
  spent: number;
};

const INITIAL_BUDGETS: BudgetCategory[] = [
  { id: "1", name: "Gas",             icon: "flame-outline",           budget: 60000,  spent: 45000 },
  { id: "2", name: "Agua",            icon: "water-outline",           budget: 40000,  spent: 32000 },
  { id: "3", name: "Energía",         icon: "flash-outline",           budget: 100000, spent: 89000 },
  { id: "4", name: "Entretenimiento", icon: "game-controller-outline", budget: 30000,  spent: 17900 },
];

function formatAmount(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n}`;
}

export default function BudgetScreen() {
  const [budgets, setBudgets] = useState<BudgetCategory[]>(INITIAL_BUDGETS);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<BudgetCategory | null>(null);
  const [budgetInput, setBudgetInput] = useState("");

  const totalBudget = budgets.reduce((s, b) => s + b.budget, 0);
  const totalSpent  = budgets.reduce((s, b) => s + b.spent,  0);
  const totalPct    = Math.round((totalSpent / totalBudget) * 100);

  const overallColor =
    totalPct >= 90 ? Colors.danger :
    totalPct >= 70 ? "#F59E0B" :
    Colors.accent;

  const openEdit = (item: BudgetCategory) => {
    setEditing(item);
    setBudgetInput(item.budget.toString());
    setModalVisible(true);
  };

  const handleSave = () => {
    const parsed = parseFloat(budgetInput);
    if (!editing || isNaN(parsed) || parsed <= 0) return;
    setBudgets((prev) =>
      prev.map((b) => b.id === editing.id ? { ...b, budget: parsed } : b)
    );
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Presupuesto"
        subtitle="Control por categoría"
        onMenuPress={() => {}}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Card resumen general */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>Presupuesto total</Text>
              <Text style={styles.summaryAmount}>{formatAmount(totalBudget)}</Text>
            </View>
            <View style={styles.summaryRight}>
              <Text style={styles.summarySubLabel}>Gastado</Text>
              <Text style={styles.summarySpent}>{formatAmount(totalSpent)}</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(totalPct, 100)}%`,
                  backgroundColor: overallColor,
                },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressPct}>{totalPct}% usado</Text>
            <Text style={styles.progressRemaining}>
              Disponible: {formatAmount(totalBudget - totalSpent)}
            </Text>
          </View>
        </View>

        {/* Categorías */}
        <Text style={styles.sectionTitle}>Por categoría</Text>

        {budgets.map((item) => {
          const pct = Math.round((item.spent / item.budget) * 100);
          const remaining = item.budget - item.spent;
          const isOver = item.spent > item.budget;
          const barColor =
            pct >= 100 ? Colors.danger :
            pct >= 80  ? "#F59E0B" :
            Colors.accent;

          return (
            <View key={item.id} style={styles.catCard}>
              <View style={styles.catHeader}>
                <View style={styles.catIconWrap}>
                  <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
                </View>

                <View style={styles.catInfo}>
                  <Text style={styles.catName}>{item.name}</Text>
                  <Text style={styles.catSub}>
                    {formatAmount(item.spent)} de {formatAmount(item.budget)}
                  </Text>
                </View>

                <View style={styles.catRight}>
                  {isOver ? (
                    <View style={styles.overBadge}>
                      <Text style={styles.overBadgeText}>Excedido</Text>
                    </View>
                  ) : (
                    <Text style={styles.catRemaining}>
                      {formatAmount(remaining)} restante
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => openEdit(item)}
                  >
                    <Ionicons name="pencil-outline" size={15} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Barra */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>

              <View style={styles.barLabels}>
                <Text style={[styles.barPct, { color: barColor }]}>
                  {pct}%
                </Text>
                {isOver && (
                  <Text style={styles.overText}>
                    +{formatAmount(item.spent - item.budget)} sobre el límite
                  </Text>
                )}
              </View>
            </View>
          );
        })}

        {/* Tip */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={18} color="#92400E" />
          <Text style={styles.tipText}>
            Toca el ícono del lápiz en cada categoría para ajustar su presupuesto mensual.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal editar presupuesto */}
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
                Presupuesto — {editing?.name}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Actualmente gastado:{" "}
              <Text style={{ fontWeight: "700", color: Colors.text }}>
                {editing ? formatAmount(editing.spent) : ""}
              </Text>
            </Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nuevo presupuesto mensual</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={budgetInput}
                onChangeText={setBudgetInput}
                autoFocus
              />
            </View>

            <View style={styles.modalActions}>
              <Button
                label="Cancelar"
                variant="ghost"
                onPress={() => setModalVisible(false)}
              />
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

  // Summary card
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  summaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  summaryRight: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 10,
    alignItems: "flex-end",
  },
  summarySubLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 2,
  },
  summarySpent: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressPct: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },
  progressRemaining: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
  },

  // Sección
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },

  // Category card
  catCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  catHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  catIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  catSub: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  catRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  catRemaining: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  overBadge: {
    backgroundColor: "#FEE2E2",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  overBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.danger,
  },
  editBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  // Barra
  barTrack: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 6,
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  barLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barPct: {
    fontSize: 12,
    fontWeight: "700",
  },
  overText: {
    fontSize: 11,
    color: Colors.danger,
    fontWeight: "600",
  },

  // Tip
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#92400E",
    lineHeight: 18,
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
  modalSub: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: -8,
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
    paddingVertical: 13,
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
});