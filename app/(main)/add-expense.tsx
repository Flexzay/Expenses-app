import { useCategories } from "@/hooks/useCategories";
import { useCreateExpense } from "@/hooks/useCreateExpense";
import { formatCOP } from "@/utils/currency";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { Header } from "../../components/ui/Header";
import { Colors } from "../../constants/colors";

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<"Hoy" | "Ayer" | "Otro">("Hoy");

  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { mutate: createExpense, isPending } = useCreateExpense();

  const DATE_OPTIONS: ("Hoy" | "Ayer" | "Otro")[] = ["Hoy", "Ayer", "Otro"];

  const handleAmountChange = (text: string) => {
    const raw = text.replace(/[^0-9]/g, "");
    setAmount(raw);
    setDisplayAmount(raw ? formatCOP(parseFloat(raw)) : "");
  };

  const getExpenseDate = (): string => {
    const today = new Date();
    if (selectedDate === "Hoy") return today.toISOString().split("T")[0];
    if (selectedDate === "Ayer") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return yesterday.toISOString().split("T")[0];
    }
    return today.toISOString().split("T")[0];
  };

  const handleSave = () => {
    if (!amount || !selectedCategory || !title.trim()) return;
    createExpense(
      {
        category_id: selectedCategory,
        title: title.trim(),
        amount: parseFloat(amount),
        description: description.trim() || undefined,
        expense_date: getExpenseDate(),
      },
      { onSuccess: () => router.back() },
    );
  };

  const isValid = amount.length > 0 && selectedCategory !== null && title.trim().length > 0;

  return (
    <>
      <Header title="Nuevo gasto" showBack={true} />
      
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            bounces={false}
            nestedScrollEnabled={true}
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
                selectTextOnFocus={true}
              />
            </View>
            <Text style={styles.amountLabel}>Ingresa el monto del gasto</Text>

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
            ) : categories?.length === 0 ? (
              <TouchableOpacity
                style={styles.emptyCategoryBtn}
                onPress={() => router.push("/(main)/(tabs)/categories" as any)}
              >
                <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
                <Text style={styles.emptyCategoryText}>
                  No tienes categorías. Crea una primero.
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.categoriesGrid}>
                {categories?.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryItem,
                        isSelected && styles.categoryItemSelected,
                      ]}
                      onPress={() => setSelectedCategory(cat.id)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.categoryIcon,
                          isSelected && styles.categoryIconSelected,
                        ]}
                      >
                        <Ionicons
                          name="pricetag-outline"
                          size={22}
                          color={isSelected ? "#FFFFFF" : Colors.primary}
                        />
                      </View>
                      <Text
                        style={[
                          styles.categoryName,
                          isSelected && styles.categoryNameSelected,
                        ]}
                      >
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

            {/* Fecha */}
            <Text style={styles.sectionTitle}>Fecha</Text>
            <View style={styles.dateRow}>
              {DATE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.dateChip,
                    selectedDate === opt && styles.dateChipSelected,
                  ]}
                  onPress={() => setSelectedDate(opt)}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      selectedDate === opt && styles.dateChipTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 32 }} />

            <Button
              label={isPending ? "Guardando..." : "Guardar gasto"}
              onPress={handleSave}
              disabled={!isValid || isPending}
            />

            <View style={{ height: 40 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 100, 
  },
  amountSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
    minWidth: 200,
    textAlign: "center",
    flexShrink: 1,
  },
  amountLabel: {
    textAlign: "center",
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 28,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 14,
  },
  optional: { fontSize: 13, fontWeight: "400", color: Colors.textMuted },
  titleInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.card,
  },
  loadingCategories: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCategoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: "dashed",
    backgroundColor: Colors.card,
  },
  emptyCategoryText: { fontSize: 14, color: Colors.primary, fontWeight: "600" },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryItem: {
    alignItems: "center",
    gap: 6,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    minWidth: 72,
  },
  categoryItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "12",
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIconSelected: { backgroundColor: Colors.primary },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    textAlign: "center",
  },
  categoryNameSelected: { color: Colors.primary },
  descInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.card,
    textAlignVertical: "top",
  },
  dateRow: { flexDirection: "row", gap: 10 },
  dateChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  dateChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  dateChipText: { fontSize: 14, fontWeight: "600", color: Colors.textMuted },
  dateChipTextSelected: { color: "#FFFFFF" },
});
