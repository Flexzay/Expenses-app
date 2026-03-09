import { useExpenses } from "@/hooks/useExpenses";
import { Expense } from "@/services/expenses";
import { formatCOP } from "@/utils/currency";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../components/ui/Header";
import { Colors } from "../../constants/colors";
import { useDeleteExpense } from "@/hooks/useDeleteExpenses";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hoy";
  if (date.toDateString() === yesterday.toDateString()) return "Ayer";
  return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export default function ExpensesScreen() {
  const { data: expenses, isLoading, isError } = useExpenses();
  const { mutate: deleteExpense } = useDeleteExpense();

  const handleDelete = (expense: Expense) => {
    Alert.alert(
      "Eliminar gasto",
      `¿Eliminar "${expense.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteExpense(expense.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Gastos" subtitle="Todos tus gastos" showBack={true} />

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Ionicons name="cloud-offline-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.errorText}>Error al cargar gastos</Text>
          </View>
        ) : expenses?.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="receipt-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>Sin gastos</Text>
            <Text style={styles.emptySubtitle}>Pulsa + para registrar tu primer gasto</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>
              {expenses?.length} {expenses?.length === 1 ? "gasto" : "gastos"}
            </Text>

            {expenses?.map((item: Expense) => (
              <TouchableOpacity
                key={item.id}
                style={styles.expenseRow}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/(main)/expense-detail",
                    params: { id: item.id },
                  } as any)
                }
              >
                <View style={styles.expenseIcon}>
                  <Ionicons name="pricetag-outline" size={20} color={Colors.primary} />
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseTitle}>{item.title}</Text>
                  <Text style={styles.expenseCategory}>
                    {item.category?.name ?? "Sin categoría"}
                  </Text>
                </View>
                <View style={styles.expenseRight}>
                  <Text style={styles.expenseAmount}>-{formatCOP(item.amount)}</Text>
                  <Text style={styles.expenseDate}>{formatDate(item.expense_date)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </View>

      {/* FAB */}
      {!isLoading && !isError && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => router.push("/(main)/add-expense" as any)}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 20, paddingTop: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  errorText: { fontSize: 15, color: Colors.textMuted },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: Colors.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  emptySubtitle: { fontSize: 14, color: Colors.textMuted, textAlign: "center" },
  expenseRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, gap: 12 },
  expenseIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center" },
  expenseInfo: { flex: 1 },
  expenseTitle: { fontSize: 14, fontWeight: "600", color: Colors.text, marginBottom: 2 },
  expenseCategory: { fontSize: 12, color: Colors.textMuted },
  expenseRight: { alignItems: "flex-end" },
  expenseAmount: { fontSize: 15, fontWeight: "700", color: Colors.danger, marginBottom: 2 },
  expenseDate: { fontSize: 11, color: Colors.textMuted },
  deleteBtn: { padding: 4 },
  fab: {
    position: "absolute", bottom: 20, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center", alignItems: "center",
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
});