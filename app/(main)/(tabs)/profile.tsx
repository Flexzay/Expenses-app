import { ProfileSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useUpdateAmount } from "@/hooks/useAmount";
import { useProfile } from "@/hooks/useAuth";
import { formatCOP } from "@/utils/currency";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
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
  const [amountInput, setAmountInput] = useState(""); // valor raw (solo números)
  const [displayValue, setDisplayValue] = useState(""); // valor formateado para mostrar

  const { data, isLoading, isError } = useProfile();
  const { mutate: updateAmount, isPending: isSaving } = useUpdateAmount();
  const { logout } = useAuth();

  const myAmount = data?.monthly_amount ?? null;

  const handleAmountChange = (text: string) => {
    const raw = text.replace(/[^0-9]/g, ""); // solo dígitos
    setAmountInput(raw);
    setDisplayValue(raw ? formatCOP(parseFloat(raw)) : "");
  };

  const handleOpenModal = () => {
    if (myAmount) {
      setAmountInput(myAmount.toString());
      setDisplayValue(formatCOP(myAmount));
    } else {
      setAmountInput("");
      setDisplayValue("");
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setAmountInput("");
    setDisplayValue("");
  };

  const handleSave = () => {
    const parsed = parseFloat(amountInput);
    if (!isNaN(parsed) && parsed > 0) {
      updateAmount(
        { monthly_amount: parsed },
        {
          onSuccess: () => {
            setModalVisible(false);
            setAmountInput("");
            setDisplayValue("");
          },
        },
      );
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
                      {formatCOP(myAmount)}
                    </Text>
                  ) : (
                    <Text style={styles.aportEmpty}>Sin definir</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.aportEditBtn}
                onPress={handleOpenModal}
              >
                <Ionicons
                  name={myAmount ? "pencil-outline" : "add"}
                  size={18}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Información */}
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

            {/* Equipo */}
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
            <Button label="Cerrar sesión" variant="ghost" onPress={logout} />
            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>

      {/* Modal aporte */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCloseModal}
          />

          <View style={styles.modalCard}>
            {/* Handle bar */}
            <View style={styles.handleBar} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {myAmount ? "Editar mi aporte" : "Definir mi aporte"}
              </Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={handleCloseModal}
              >
                <Ionicons name="close" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Define cuánto aportarás al presupuesto compartido este mes.
            </Text>

            {/* Input */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Valor a aportar</Text>
              <View
                style={[
                  styles.inputWrapper,
                  isSaving && styles.inputWrapperDisabled,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  value={displayValue}
                  onChangeText={handleAmountChange}
                  autoFocus
                  editable={!isSaving}
                />
              </View>
            </View>

            {/* Botones */}
            <View style={styles.modalActions}>
              <View style={styles.cancelBtn}>
                <Button
                  label="Cancelar"
                  variant="ghost"
                  onPress={handleCloseModal}
                />
              </View>
              <View style={styles.saveBtn}>
                <Button
                  label={isSaving ? "Guardando..." : "Guardar"}
                  onPress={handleSave}
                  disabled={
                    isSaving || !amountInput || parseFloat(amountInput) <= 0
                  }
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
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

  // Avatar
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

  // Secciones
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },

  // Aporte
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

  // Info
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

  // Colaboradores
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

  // Modal
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 12,
    gap: 16,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    marginTop: -8,
  },
  field: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: Colors.text },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  inputWrapperDisabled: { opacity: 0.5 },
  inputPrefix: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textMuted,
    marginRight: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 4 },
  cancelBtn: { flex: 1 },
  saveBtn: { flex: 2 },
});
