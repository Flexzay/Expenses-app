import { useDeleteExpense } from "@/hooks/useDeleteExpenses";
import { useExpense } from "@/hooks/useExpensesId";
import { formatCOP } from "@/utils/currency";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
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

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: expense, isLoading, isError } = useExpense(Number(id));
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();

  const handleDelete = () => {
    Alert.alert("Eliminar gasto", `¿Eliminar "${expense?.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () =>
          deleteExpense(Number(id), { onSuccess: () => router.back() }),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Detalle del gasto" showBack={true} />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : isError || !expense ? (
        <View style={styles.centered}>
          <Ionicons
            name="cloud-offline-outline"
            size={40}
            color={Colors.textMuted}
          />
          <Text style={styles.errorText}>No se pudo cargar el gasto</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Hero amount */}
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <Ionicons name="pricetag-outline" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.heroAmount}>-{formatCOP(expense.amount)}</Text>
            <Text style={styles.heroTitle}>{expense.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {expense.category?.name ?? "Sin categoría"}
              </Text>
            </View>
          </View>

          {/* Detalles */}
          <Text style={styles.sectionLabel}>Información</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={18} color={Colors.primary} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Monto</Text>
                <Text style={styles.infoValue}>
                  {formatCOP(expense.amount)}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={Colors.primary}
              />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Fecha</Text>
                <Text style={styles.infoValue}>
                  {formatFullDate(expense.expense_date)}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="grid-outline" size={18} color={Colors.primary} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Categoría</Text>
                <Text style={styles.infoValue}>
                  {expense.category?.name ?? "—"}
                </Text>
              </View>
            </View>
            {expense.description && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={Colors.primary}
                  />
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Descripción</Text>
                    <Text style={styles.infoValue}>{expense.description}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Acciones */}
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/(main)/edit-expense",
                params: { id: expense.id },
              } as any)
            }
          >
            <Ionicons name="pencil-outline" size={18} color={Colors.primary} />
            <Text style={styles.editBtnText}>Editar gasto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.8}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            <Text style={styles.deleteBtnText}>
              {isDeleting ? "Eliminando..." : "Eliminar gasto"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingTop: 8 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  errorText: { fontSize: 15, color: Colors.textMuted },

  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  heroAmount: { fontSize: 36, fontWeight: "800", color: "#FFFFFF" },
  heroTitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  categoryBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 4,
  },
  categoryBadgeText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
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
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: "600", color: Colors.text },
  infoValueCapitalize: { textTransform: "capitalize" },
  divider: { height: 1, backgroundColor: Colors.border },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  editBtnText: { fontSize: 15, fontWeight: "600", color: Colors.primary },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.danger + "40",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  deleteBtnText: { fontSize: 15, fontWeight: "600", color: Colors.danger },
});
