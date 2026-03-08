import { ProfileSkeleton } from "@/components/ui/skeleton";
import { useLogout, useProfile } from "@/hooks/useAuth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
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
import { Button } from "../../../components/ui/Button";
import { Header } from "../../../components/ui/Header";
import { Colors } from "../../../constants/colors";

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [amountInput, setAmountInput] = useState("");

  const { data, isLoading, isError } = useProfile();
  const { mutate: logout } = useLogout();

  const myAmount = data?.monthly_amount ?? null;

  const handleSave = () => {
    const parsed = parseFloat(amountInput);
    if (!isNaN(parsed) && parsed > 0) {
      // TODO: PUT /api/profile/amount
      setModalVisible(false);
      setAmountInput("");
    }
  };

  const formattedDate = data?.created_at
    ? new Date(data.created_at).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <View style={styles.container}>
      <Header title="Perfil" subtitle="Gestiona tu cuenta" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {isLoading ? (
          <ProfileSkeleton />
        ) : isError || !data ? (
          <View style={styles.errorWrap}>
            <Ionicons
              name="cloud-offline-outline"
              size={40}
              color={Colors.textMuted}
            />
            <Text style={styles.errorText}>Error al cargar el perfil</Text>
          </View>
        ) : (
          <>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>
                  {data.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.name}>{data.name}</Text>
              <Text style={styles.email}>{data.email}</Text>
            </View>

            {/* Mi aporte */}
            <Text style={styles.sectionLabel}>Mi aporte</Text>
            <View style={styles.aportCard}>
              <View style={styles.aportLeft}>
                <View style={styles.aportIconWrap}>
                  <Ionicons
                    name="wallet-outline"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
                <View>
                  <Text style={styles.aportLabel}>Mi contribución mensual</Text>
                  {myAmount ? (
                    <Text style={styles.aportAmount}>
                      ${myAmount.toLocaleString()}
                    </Text>
                  ) : (
                    <Text style={styles.aportEmpty}>Sin definir</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.aportEditBtn}
                onPress={
                  myAmount
                    ? () => {
                        setAmountInput(myAmount.toString());
                        setModalVisible(true);
                      }
                    : () => setModalVisible(true)
                }
              >
                <Ionicons
                  name={myAmount ? "pencil-outline" : "add"}
                  size={18}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Info */}
            <Text style={styles.sectionLabel}>Información</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={Colors.primary}
                />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Nombre</Text>
                  <Text style={styles.infoValue}>{data.name}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={Colors.primary}
                />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{data.email}</Text>
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
                  <Text style={styles.infoLabel}>Miembro desde</Text>
                  <Text style={styles.infoValue}>{formattedDate}</Text>
                </View>
              </View>
            </View>

            {/* Colaboradores */}
            <Text style={styles.sectionLabel}>Equipo</Text>
            <TouchableOpacity
              style={styles.collaboratorBtn}
              activeOpacity={0.8}
              onPress={() => router.push("/(main)/collaborators")}
            >
              <Ionicons
                name="people-outline"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.collaboratorText}>Colaboradores</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>

            <View style={{ height: 24 }} />
            <Button
              label="Cerrar sesión"
              variant="ghost"
              onPress={() => logout()}
            />
            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>

      {/* Modal aporte */}
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
                {myAmount ? "Editar mi aporte" : "Definir mi aporte"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Define cuánto aportarás al presupuesto compartido este mes.
            </Text>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Valor a aportar</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={amountInput}
                onChangeText={setAmountInput}
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
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingTop: 24 },
  errorWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  errorText: { fontSize: 15, color: Colors.textMuted },
  avatarSection: { alignItems: "center", marginBottom: 28 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarLetter: { fontSize: 30, fontWeight: "700", color: "#FFFFFF" },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  email: { fontSize: 14, color: Colors.textMuted },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },
  aportCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 20,
  },
  aportLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  aportIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  aportLabel: { fontSize: 13, color: Colors.textMuted, marginBottom: 2 },
  aportAmount: { fontSize: 20, fontWeight: "800", color: Colors.primary },
  aportEmpty: { fontSize: 15, fontWeight: "600", color: Colors.textMuted },
  aportEditBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
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
  divider: { height: 1, backgroundColor: Colors.border },
  collaboratorBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  collaboratorText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
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
  modalTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    marginTop: -8,
  },
  field: { gap: 6 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: Colors.text },
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
  modalActions: { flexDirection: "row", gap: 12 },
});
