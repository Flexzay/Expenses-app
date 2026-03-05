import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
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

const CATEGORIES = [
  { id: "1", name: "Gas",             icon: "flame-outline"           },
  { id: "2", name: "Agua",            icon: "water-outline"           },
  { id: "3", name: "Energía",         icon: "flash-outline"           },
  { id: "4", name: "Entretenimiento", icon: "game-controller-outline" },
  { id: "5", name: "Otros",           icon: "pricetag-outline"        },
];

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("Hoy");

  const DATE_OPTIONS = ["Hoy", "Ayer", "Otro"];

  const handleSave = () => {
    if (!amount || !selectedCategory) return;
    // aquí irá la lógica para guardar
    console.log({ amount, description, selectedCategory, selectedDate });
    router.back();
  };

  const isValid = amount.length > 0 && selectedCategory !== null;

  return (
    <View style={styles.container}>
      <Header title="Nuevo gasto" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >

        {/* Monto */}
        <View style={styles.amountSection}>
          <Text style={styles.amountPrefix}>$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor={Colors.border}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>
        <Text style={styles.amountLabel}>Ingresa el monto del gasto</Text>

        <View style={styles.divider} />

        {/* Categoría */}
        <Text style={styles.sectionTitle}>Categoría</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => {
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
                    name={cat.icon as any}
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

        <View style={styles.divider} />

        {/* Descripción */}
        <Text style={styles.sectionTitle}>Descripción</Text>
        <TextInput
          style={styles.descInput}
          placeholder="¿En qué gastaste? (opcional)"
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

        {/* Botón guardar */}
        <Button
          label="Guardar gasto"
          onPress={handleSave}
          disabled={!isValid}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: 24,
    paddingTop: 8,
  },

  // Monto
  amountSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  amountPrefix: {
    fontSize: 40,
    fontWeight: "800",
    color: Colors.primary,
    marginRight: 4,
  },
  amountInput: {
    fontSize: 64,
    fontWeight: "800",
    color: Colors.primary,
    minWidth: 80,
    textAlign: "center",
  },
  amountLabel: {
    textAlign: "center",
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 28,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 14,
  },

  // Categorías
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
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
  categoryIconSelected: {
    backgroundColor: Colors.primary,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    textAlign: "center",
  },
  categoryNameSelected: {
    color: Colors.primary,
  },

  // Descripción
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

  // Fecha
  dateRow: {
    flexDirection: "row",
    gap: 10,
  },
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
  dateChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  dateChipTextSelected: {
    color: "#FFFFFF",
  },
});