import { useCategories } from "@/hooks/useCategories";
import { formatCOP } from "@/utils/currency";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { Header } from "../../components/ui/Header";
import { Colors } from "../../constants/colors";
import { useExpense } from "@/hooks/useExpensesId";
import { useUpdateExpense } from "@/hooks/useUpdateExpenses";

export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: expense, isLoading, isError } = useExpense(Number(id));
  const { mutate: updateExpense, isPending } = useUpdateExpense(Number(id));
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [expenseDate, setExpenseDate] = useState("");

  // Pre-llenar cuando cargue el gasto
  useEffect(() => {
    if (expense) {
      const raw = Math.round(expense.amount).toString();
      setAmount(raw);
      setDisplayAmount(formatCOP(expense.amount));
      setTitle(expense.title);
      setDescription(expense.description ?? "");
      setSelectedCategory(expense.category_id);
      setExpenseDate(expense.expense_date);
    }
  }, [expense]);

  const handleAmountChange = (text: string) => {
    const raw = text.replace(/[^0-9]/g, "");
    setAmount(raw);
    setDisplayAmount(raw ? formatCOP(parseFloat(raw)) : "");
  };

  const handleSave = () => {
    if (!amount || !selectedCategory || !title.trim()) return;
    updateExpense(
      {
        category_id: selectedCategory,
        title: title.trim(),
        amount: parseFloat(amount),
        description: description.trim() || undefined,
        expense_date: expenseDate,
      },
      { onSuccess: () => router.back() }
    );
  };

  const isValid = amount.length > 0 && selectedCategory !== null && title.trim().length > 0;

  return (
    <View style={styles.container}>
      <Header title="Editar gasto" showBack={true} />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : isError || !expense ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.errorText}>No se pudo cargar el gasto</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Monto */}
          <View style={styles.amountSection}>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={Colors.border}
              keyboardType="numeric"
              value={displayAmount}
              onChangeText={handleAmountChange}
              autoFocus
            />
          </View>
          <Text style={styles.amountLabel}>Edita el monto del gasto</Text>

          <View style={styles.divider} />

          {/* Título */}
          <Text style={styles.sectionTitle}>Título</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Ej: Recarga gas, Mercado..."
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.divider} />

          {/* Categoría */}
          <Text style={styles.sectionTitle}>Categoría</Text>
          {loadingCategories ? (
            <View style={styles.loadingCategories}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : (
            <View style={styles.categoriesGrid}>
              {categories?.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryIcon, isSelected && styles.categoryIconSelected]}>
                      <Ionicons
                        name="pricetag-outline"
                        size={22}
                        color={isSelected ? "#FFFFFF" : Colors.primary}
                      />
                    </View>
                    <Text style={[styles.categoryName, isSelected && styles.categoryNameSelected]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={styles.divider} />

          {/* Descripción */}
          <Text style={styles.sectionTitle}>
            Descripción <Text style={styles.optional}>(opcional)</Text>
          </Text>
          <TextInput
            style={styles.descInput}
            placeholder="¿Algún detalle adicional?"
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={2}
          />

          <View style={styles.divider} />

          {/* Fecha actual */}
          <Text style={styles.sectionTitle}>Fecha</Text>
          <View style={styles.dateDisplay}>
            <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
            <Text style={styles.dateText}>
              {new Date(expenseDate).toLocaleDateString("es-CO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          <View style={{ height: 32 }} />

          <View style={styles.actions}>
            <View style={styles.cancelBtn}>
              <Button label="Cancelar" variant="ghost" onPress={() => router.back()} />
            </View>
            <View style={styles.saveBtn}>
              <Button
                label={isPending ? "Guardando..." : "Guardar cambios"}
                onPress={handleSave}
                disabled={!isValid || isPending}
              />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingTop: 8 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  errorText: { fontSize: 15, color: Colors.textMuted },

  amountSection: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 24, marginBottom: 8 },
  amountInput: { fontSize: 64, fontWeight: "800", color: Colors.primary, minWidth: 80, textAlign: "center" },
  amountLabel: { textAlign: "center", fontSize: 13, color: Colors.textMuted, marginBottom: 28 },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 20 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: Colors.text, marginBottom: 14 },
  optional: { fontSize: 13, fontWeight: "400", color: Colors.textMuted },

  titleInput: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Colors.text, backgroundColor: Colors.card },

  loadingCategories: { height: 80, justifyContent: "center", alignItems: "center" },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryItem: { alignItems: "center", gap: 6, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.card, minWidth: 72 },
  categoryItemSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + "12" },
  categoryIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center" },
  categoryIconSelected: { backgroundColor: Colors.primary },
  categoryName: { fontSize: 12, fontWeight: "600", color: Colors.textMuted, textAlign: "center" },
  categoryNameSelected: { color: Colors.primary },

  descInput: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Colors.text, backgroundColor: Colors.card, textAlignVertical: "top" },

  dateDisplay: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: Colors.card, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 14 },
  dateText: { fontSize: 15, fontWeight: "600", color: Colors.text, textTransform: "capitalize", flex: 1 },

  actions: { flexDirection: "row", gap: 12 },
  cancelBtn: { flex: 1 },
  saveBtn: { flex: 2 },
});