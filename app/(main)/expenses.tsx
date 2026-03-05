import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../components/ui/Header";
import { Colors } from "../../constants/colors";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  icon: string;
  date: string;
  month: string;
};

const ALL_EXPENSES: Expense[] = [
  {
    id: "1",
    title: "Recarga gas",
    amount: 45000,
    category: "Gas",
    icon: "flame-outline",
    date: "4 mar",
    month: "Marzo",
  },
  {
    id: "2",
    title: "Netflix",
    amount: 17900,
    category: "Entretenimiento",
    icon: "game-controller-outline",
    date: "3 mar",
    month: "Marzo",
  },
  {
    id: "3",
    title: "Factura agua",
    amount: 32000,
    category: "Agua",
    icon: "water-outline",
    date: "2 mar",
    month: "Marzo",
  },
  {
    id: "4",
    title: "Energía eléctrica",
    amount: 89000,
    category: "Energía",
    icon: "flash-outline",
    date: "1 mar",
    month: "Marzo",
  },
  {
    id: "5",
    title: "Spotify",
    amount: 15900,
    category: "Entretenimiento",
    icon: "game-controller-outline",
    date: "28 feb",
    month: "Febrero",
  },
  {
    id: "6",
    title: "Agua febrero",
    amount: 30000,
    category: "Agua",
    icon: "water-outline",
    date: "25 feb",
    month: "Febrero",
  },
  {
    id: "7",
    title: "Gas febrero",
    amount: 42000,
    category: "Gas",
    icon: "flame-outline",
    date: "20 feb",
    month: "Febrero",
  },
  {
    id: "8",
    title: "Luz febrero",
    amount: 76000,
    category: "Energía",
    icon: "flash-outline",
    date: "18 feb",
    month: "Febrero",
  },
];

export default function ExpensesScreen() {
  const total = ALL_EXPENSES.reduce((sum, e) => sum + e.amount, 0);

  const grouped = ALL_EXPENSES.reduce<Record<string, Expense[]>>((acc, e) => {
    if (!acc[e.month]) acc[e.month] = [];
    acc[e.month].push(e);
    return acc;
  }, {});

  const sections = Object.entries(grouped);

  return (
    <View style={styles.container}>
      <Header title="Gastos" subtitle="Historial completo" showBack={true} />

      <View style={styles.content}>
        {/* Total general */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total gastado</Text>
          <Text style={styles.totalAmount}>-${total.toLocaleString()}</Text>
          <Text style={styles.totalSub}>
            {ALL_EXPENSES.length} gastos registrados
          </Text>
        </View>

        {/* Lista agrupada por mes */}
        <FlatList
          data={sections}
          keyExtractor={([month]) => month}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="receipt-outline"
                size={48}
                color={Colors.textMuted}
              />
              <Text style={styles.emptyText}>No hay gastos registrados.</Text>
            </View>
          }
          renderItem={({ item: [month, expenses] }) => (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionMonth}>{month}</Text>
                <Text style={styles.sectionTotal}>
                  -$
                  {expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}
                </Text>
              </View>

              {expenses.map((item) => (
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
            </View>
          )}
        />
      </View>

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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },

  // Total card
  totalCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionMonth: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionTotal: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.danger,
  },
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
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
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  expenseCategory: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  expenseRight: {
    alignItems: "flex-end",
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.danger,
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },

  // Empty
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 15,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
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
