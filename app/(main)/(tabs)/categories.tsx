import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CategoryCard } from "../../../components/ui/CategoryCard";
import { Header } from "../../../components/ui/Header";
import { Colors } from "../../../constants/colors";

type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Gas", icon: "flame-outline" },
  { id: "2", name: "Agua", icon: "water-outline" },
  { id: "3", name: "Energía", icon: "flash-outline" },
  { id: "4", name: "Entretenimiento", icon: "game-controller-outline" },
];

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newCategory: Category = {
      id: Date.now().toString(),
      name: trimmed,
      icon: "pricetag-outline",
    };
    setCategories((prev) => [...prev, newCategory]);
    setInput("");
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <View style={styles.container}>
      <Header
        title="Categorías"
        subtitle="Gestiona tus categorías"
        showBack={true}
      />

      <View style={styles.content}>
        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Nueva categoría..."
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleAdd}
          />
          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleAdd}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Lista */}
        <Text style={styles.sectionLabel}>{categories.length} categorías</Text>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <CategoryCard
              name={item.name}
              icon={item.icon}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay categorías aún.</Text>
          }
        />
      </View>
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
    padding: 20,
    paddingTop: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.card,
  },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 12,
    fontWeight: "500",
  },
  list: {
    paddingBottom: 24,
  },
  empty: {
    textAlign: "center",
    color: Colors.textMuted,
    marginTop: 40,
    fontSize: 15,
  },
});
