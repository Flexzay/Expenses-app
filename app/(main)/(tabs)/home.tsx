import { HomeSkeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/useAuth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../../components/ui/Header";
import { Colors } from "../../../constants/colors";

const SUMMARY = {
  totalSpent: 320000,
  budget: 500000,
  remaining: 180000,
  percentUsed: 64,
};

const RECENT_EXPENSES = [
  {
    id: "1",
    title: "Recarga gas",
    amount: 45000,
    category: "Gas",
    icon: "flame-outline",
    date: "Hoy",
  },
  {
    id: "2",
    title: "Netflix",
    amount: 17900,
    category: "Entretenimiento",
    icon: "game-controller-outline",
    date: "Ayer",
  },
  {
    id: "3",
    title: "Factura agua",
    amount: 32000,
    category: "Agua",
    icon: "water-outline",
    date: "2 mar",
  },
  {
    id: "4",
    title: "Energía eléctrica",
    amount: 89000,
    category: "Energía",
    icon: "flash-outline",
    date: "1 mar",
  },
];

const QUICK_STATS = [
  { label: "Este mes", value: "4 gastos", icon: "receipt-outline" },
  { label: "Categorías", value: "4 activas", icon: "grid-outline" },
  { label: "Predicción", value: "$490.000", icon: "trending-up-outline" },
];

export default function HomeScreen() {
  const progressColor =
    SUMMARY.percentUsed >= 90
      ? Colors.danger
      : SUMMARY.percentUsed >= 70
        ? "#F59E0B"
        : Colors.accent;

  const { data, isLoading } = useProfile();

  return (
    <View style={styles.container}>
      <Header
        title="Expenses"
        subtitle="Resumen de tu actividad"
        onMenuPress={() => console.log("menu")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {isLoading ? (
          <HomeSkeleton />
        ) : (
          <>
            {/* Saludo */}
            <View style={styles.greeting}>
              <Text style={styles.greetingText}>
                Hola, {data?.name ?? "..."} 👋
              </Text>
              <Text style={styles.greetingMonth}>
                {new Date().toLocaleDateString("es-CO", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>

            {/* Card principal presupuesto */}
            <View style={styles.budgetCard}>
              <View style={styles.budgetRow}>
                <View>
                  <Text style={styles.budgetLabel}>Gastado este mes</Text>
                  <Text style={styles.budgetAmount}>
                    ${SUMMARY.totalSpent.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.remainingBadge}>
                  <Text style={styles.remainingLabel}>Disponible</Text>
                  <Text style={styles.remainingAmount}>
                    ${SUMMARY.remaining.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(SUMMARY.percentUsed, 100)}%`,
                      backgroundColor: progressColor,
                    },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressPct}>
                  {SUMMARY.percentUsed}% usado
                </Text>
                <Text style={styles.progressBudget}>
                  Presupuesto: ${SUMMARY.budget.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Quick stats */}
            <View style={styles.statsRow}>
              {QUICK_STATS.map((stat) => (
                <View key={stat.label} style={styles.statCard}>
                  <Ionicons
                    name={stat.icon as any}
                    size={20}
                    color={Colors.primary}
                  />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Últimos gastos */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Últimos gastos</Text>
              <TouchableOpacity
                onPress={() => router.push("/(main)/expenses" as any)}
              >
                <Text style={styles.sectionLink}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {RECENT_EXPENSES.map((item) => (
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
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseTitle}>{item.title}</Text>
                  <Text style={styles.expenseCategory}>{item.category}</Text>
                </View>
                <View style={styles.expenseRight}>
                  <Text style={styles.expenseAmount}>
                    -${item.amount.toLocaleString()}
                  </Text>
                  <Text style={styles.expenseDate}>{item.date}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={{ height: 100 }} />
          </>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push("/(main)/add-expense" as any)}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingTop: 8 },
  greeting: { marginBottom: 20 },
  greetingText: { fontSize: 22, fontWeight: "800", color: Colors.text },
  greetingMonth: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: "capitalize",
  },
  budgetCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  budgetLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 4,
  },
  budgetAmount: { fontSize: 30, fontWeight: "800", color: "#FFFFFF" },
  remainingBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 10,
    alignItems: "flex-end",
  },
  remainingLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 2,
  },
  remainingAmount: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 999 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between" },
  progressPct: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },
  progressBudget: { fontSize: 12, color: "rgba(255,255,255,0.65)" },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  statLabel: { fontSize: 11, color: Colors.textMuted, textAlign: "center" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  sectionLink: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  expenseIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  expenseInfo: { flex: 1 },
  expenseTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  expenseCategory: { fontSize: 12, color: Colors.textMuted },
  expenseRight: { alignItems: "flex-end" },
  expenseAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.danger,
    marginBottom: 2,
  },
  expenseDate: { fontSize: 11, color: Colors.textMuted },
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
});
