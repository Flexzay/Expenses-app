import { Header } from "@/components/ui/Header";
import { Colors } from "@/constants/colors";
import { useMonthlyPredictions } from "@/hooks/usePredictions";
import { useMonthlyLimit } from "@/hooks/useMonthlyLimit";
import { formatCOP } from "@/utils/currency";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BAR_HEIGHT = 140;

const NEXT_MONTH_LABELS: Record<string, string> = {
  Jan: "Febrero",  Feb: "Marzo",    Mar: "Abril",
  Apr: "Mayo",     May: "Junio",    Jun: "Julio",
  Jul: "Agosto",   Aug: "Septiembre", Sep: "Octubre",
  Oct: "Noviembre", Nov: "Diciembre", Dec: "Enero",
};
const NEXT_MONTH_SHORT: Record<string, string> = {
  Jan: "Feb", Feb: "Mar", Mar: "Abr",
  Apr: "May", May: "Jun", Jun: "Jul",
  Jul: "Ago", Aug: "Sep", Sep: "Oct",
  Oct: "Nov", Nov: "Dic", Dec: "Ene",
};
const MONTH_ES: Record<string, string> = {
  Jan: "Ene", Feb: "Feb", Mar: "Mar", Apr: "Abr",
  May: "May", Jun: "Jun", Jul: "Jul", Aug: "Ago",
  Sep: "Sep", Oct: "Oct", Nov: "Nov", Dec: "Dic",
};

function formatAmount(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}k`;
  return `$${Math.round(n)}`;
}

export default function PredictionsScreen() {
  const { data: predictions, isLoading, isError } = useMonthlyPredictions();
  const { monthlyLimit: BUDGET } = useMonthlyLimit();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Predicción" subtitle="Análisis de tus gastos" showBack />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (isError || !predictions) {
    return (
      <View style={styles.container}>
        <Header title="Predicción" subtitle="Análisis de tus gastos" showBack />
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.errorText}>No se pudieron cargar las predicciones</Text>
        </View>
      </View>
    );
  }

  const {
    history,
    current_month: cm,
    prediction: PREDICTION_NEXT,
    trend_pct,
    average,
  } = predictions;

  const currentMonthShort = MONTH_ES[cm.month] ?? cm.month;
  const nextMonthLabel    = NEXT_MONTH_LABELS[cm.month] ?? "Próximo mes";
  const nextMonthShort    = NEXT_MONTH_SHORT[cm.month] ?? "Sig";
  const nextMonthYear     = cm.month === "Dec" ? cm.year + 1 : cm.year;

  const willExceedBudget = BUDGET > 0 && PREDICTION_NEXT > BUDGET;
  const predictedPercent = BUDGET > 0 ? Math.round((PREDICTION_NEXT / BUDGET) * 100) : 0;
  const trendIsUp        = trend_pct > 0;
  const trendIsNeutral   = trend_pct === 0;

  const progressPct = cm.days_in_month > 0
    ? Math.round((cm.days_elapsed / cm.days_in_month) * 100)
    : 0;

  const allAmounts = [
    ...history.map((h) => h.amount),
    cm.projected_amount,
    PREDICTION_NEXT,
  ];
  const MAX_AMOUNT = Math.max(...allAmounts, 1);

  return (
    <View style={styles.container}>
      <Header title="Predicción" subtitle="Análisis de tus gastos" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Alerta presupuesto ── */}
        {willExceedBudget && (
          <View style={styles.alertCard}>
            <Ionicons name="warning-outline" size={20} color="#92400E" />
            <Text style={styles.alertText}>
              Se estima que superarás tu presupuesto el próximo mes en{" "}
              <Text style={{ fontWeight: "700" }}>
                {formatCOP(PREDICTION_NEXT - BUDGET)}
              </Text>
            </Text>
          </View>
        )}

        {/* ── Card mes actual ── */}
        <View style={styles.currentCard}>
          <View style={styles.currentHeader}>
            <View style={styles.currentLeft}>
              <Text style={styles.currentLabel}>
                {currentMonthShort} {cm.year} — día {cm.days_elapsed} de {cm.days_in_month}
              </Text>
              <Text style={styles.currentAmount}>{formatCOP(cm.spent_so_far)}</Text>
              <Text style={styles.currentSub}>gastados hasta hoy</Text>
            </View>
            <View style={styles.projectedBox}>
              <Text style={styles.projectedLabel}>Proyección</Text>
              <Text style={styles.projectedAmount}>{formatCOP(cm.projected_amount)}</Text>
              <Text style={styles.projectedSub}>al cierre del mes</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressBlock}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Avance del mes</Text>
                <Text style={styles.progressValue}>{progressPct}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
              </View>
            </View>

            <View style={styles.progressBlock}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Ritmo de gasto</Text>
                <Text style={styles.progressValue}>{formatCOP(cm.daily_rate)}/día</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(progressPct, 100)}%`,
                    backgroundColor: progressPct > 85
                      ? "#FCA5A5"
                      : "rgba(255,255,255,0.55)",
                  },
                ]} />
              </View>
            </View>
          </View>
        </View>

        {/* ── Card predicción próximo mes ── */}
        <View style={styles.predictionCard}>
          <View style={styles.predictionTop}>
            <View>
              <Text style={styles.predictionLabel}>
                Predicción — {nextMonthLabel} {nextMonthYear}
              </Text>
              <Text style={styles.predictionAmount}>
                {formatCOP(PREDICTION_NEXT)}
              </Text>
            </View>
            {BUDGET > 0 && (
              <View style={[
                styles.predictionBadge,
                { backgroundColor: willExceedBudget ? Colors.danger : Colors.accent },
              ]}>
                <Ionicons
                  name={willExceedBudget ? "trending-up" : "checkmark-circle"}
                  size={13}
                  color="#FFFFFF"
                />
                <Text style={styles.predictionBadgeText}>
                  {predictedPercent}% presupuesto
                </Text>
              </View>
            )}
          </View>

          <View style={styles.compareRow}>
            <View style={styles.compareItem}>
              <Text style={styles.compareLabel}>Promedio</Text>
              <Text style={styles.compareValue}>{formatCOP(average)}</Text>
            </View>
            <View style={styles.compareDivider} />
            <View style={styles.compareItem}>
              <Text style={styles.compareLabel}>Tendencia</Text>
              <Text style={[
                styles.compareValue,
                {
                  color: trendIsNeutral
                    ? Colors.textMuted
                    : trendIsUp
                    ? Colors.danger
                    : Colors.accent,
                },
              ]}>
                {trendIsNeutral ? "—" : `${trendIsUp ? "+" : ""}${trend_pct}%`}
              </Text>
            </View>
            <View style={styles.compareDivider} />
            <View style={styles.compareItem}>
              <Text style={styles.compareLabel}>Proyectado hoy</Text>
              <Text style={styles.compareValue}>{formatCOP(cm.projected_amount)}</Text>
            </View>
          </View>
        </View>

        {/* ── Stats en lista ── */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={styles.statIconWrap}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
            </View>
            <View style={styles.statTexts}>
              <Text style={styles.statLabel}>Ritmo diario</Text>
              <Text style={styles.statValue}>{formatCOP(cm.daily_rate)}</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconWrap}>
              <Ionicons name="stats-chart-outline" size={18} color={Colors.primary} />
            </View>
            <View style={styles.statTexts}>
              <Text style={styles.statLabel}>Promedio mensual</Text>
              <Text style={styles.statValue}>{formatCOP(average)}</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconWrap}>
              <Ionicons
                name={
                  trendIsUp
                    ? "trending-up-outline"
                    : trendIsNeutral
                    ? "remove-outline"
                    : "trending-down-outline"
                }
                size={18}
                color={
                  trendIsUp
                    ? Colors.danger
                    : trendIsNeutral
                    ? Colors.textMuted
                    : Colors.accent
                }
              />
            </View>
            <View style={styles.statTexts}>
              <Text style={styles.statLabel}>Vs mes anterior</Text>
              <Text style={[
                styles.statValue,
                {
                  color: trendIsUp
                    ? Colors.danger
                    : trendIsNeutral
                    ? Colors.textMuted
                    : Colors.accent,
                },
              ]}>
                {trendIsNeutral ? "Sin datos" : `${trendIsUp ? "+" : ""}${trend_pct}%`}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Gráfica ── */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Historial + mes actual + predicción</Text>
          <View style={styles.chart}>

            {history.map((item) => {
              const height  = (item.amount / MAX_AMOUNT) * BAR_HEIGHT;
              const isEmpty = item.amount === 0;
              return (
                <View key={`${item.month}-${item.year}`} style={styles.barWrapper}>
                  {!isEmpty && (
                    <Text style={styles.barAmount}>{formatAmount(item.amount)}</Text>
                  )}
                  <View style={styles.barTrack}>
                    {isEmpty
                      ? <View style={[styles.bar, styles.barEmpty]} />
                      : <View style={[styles.bar, { height, backgroundColor: Colors.border }]} />
                    }
                  </View>
                  <Text style={styles.barMonth}>
                    {MONTH_ES[item.month] ?? item.month}
                  </Text>
                </View>
              );
            })}

            {/* Mes actual: sólido + proyección translúcida */}
            <View style={styles.barWrapper}>
              <Text style={[styles.barAmount, { color: Colors.primary }]}>
                {formatAmount(cm.spent_so_far)}
              </Text>
              <View style={styles.barTrack}>
                <View style={[
                  styles.bar,
                  styles.barCurrentProjected,
                  { height: (cm.projected_amount / MAX_AMOUNT) * BAR_HEIGHT },
                ]} />
                <View style={[
                  styles.barCurrentSpent,
                  { height: (cm.spent_so_far / MAX_AMOUNT) * BAR_HEIGHT },
                ]} />
              </View>
              <Text style={[styles.barMonth, { color: Colors.primary, fontWeight: "700" }]}>
                {currentMonthShort}
              </Text>
            </View>

            {/* Predicción */}
            <View style={styles.barWrapper}>
              <Text style={[
                styles.barAmount,
                { color: willExceedBudget ? Colors.danger : Colors.accent },
              ]}>
                {formatAmount(PREDICTION_NEXT)}
              </Text>
              <View style={styles.barTrack}>
                <View style={[
                  styles.bar,
                  styles.barPredicted,
                  {
                    height: Math.max((PREDICTION_NEXT / MAX_AMOUNT) * BAR_HEIGHT, 6),
                    borderColor: willExceedBudget ? Colors.danger : Colors.accent,
                  },
                ]} />
              </View>
              <Text style={[
                styles.barMonth,
                {
                  color: willExceedBudget ? Colors.danger : Colors.accent,
                  fontWeight: "700",
                },
              ]}>
                {nextMonthShort}*
              </Text>
            </View>
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.border }]} />
              <Text style={styles.legendText}>Anteriores</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>Mes actual</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotDashed,
                { borderColor: willExceedBudget ? Colors.danger : Colors.accent }
              ]} />
              <Text style={styles.legendText}>Predicción</Text>
            </View>
          </View>

          <Text style={styles.chartNote}>
            * Estimado por ritmo diario y tendencia histórica
          </Text>
        </View>

        {/* ── Explicación ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.infoTitle}>¿Cómo se calcula?</Text>
          </View>
          <Text style={styles.infoText}>
            Llevas{" "}
            <Text style={styles.infoHighlight}>{formatCOP(cm.spent_so_far)}</Text>
            {" "}gastados en {cm.days_elapsed} días → ritmo de{" "}
            <Text style={styles.infoHighlight}>{formatCOP(cm.daily_rate)}/día</Text>.
            {" "}Al proyectarlo a los {cm.days_in_month} días del mes obtenemos{" "}
            <Text style={styles.infoHighlight}>{formatCOP(cm.projected_amount)}</Text>.
            {"\n\n"}
            La predicción de {nextMonthLabel} usa el promedio de los últimos 3 meses
            completos (<Text style={styles.infoHighlight}>{formatCOP(average)}</Text>)
            {trendIsNeutral
              ? "."
              : ` ajustado por la tendencia de ${trendIsUp ? "+" : ""}${trend_pct}%.`}
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll:    { padding: 20, paddingTop: 12 },
  centered:  { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  errorText: { fontSize: 14, color: Colors.textMuted, textAlign: "center" },

  // Alerta
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  alertText: { flex: 1, fontSize: 13, color: "#92400E", lineHeight: 18 },

  // Card mes actual
  currentCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  currentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  currentLeft:   { flex: 1 },
  currentLabel:  { fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 4 },
  currentAmount: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  currentSub:    { fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 },
  projectedBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
    alignItems: "flex-end",
    minWidth: 110,
  },
  projectedLabel:  { fontSize: 11, color: "rgba(255,255,255,0.65)", marginBottom: 4 },
  projectedAmount: { fontSize: 17, fontWeight: "700", color: "#FFFFFF" },
  projectedSub:    { fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 },
  progressSection: { gap: 12 },
  progressBlock:   { gap: 5 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: { fontSize: 12, color: "rgba(255,255,255,0.65)" },
  progressValue: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },
  progressTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.55)",
  },

  // Card predicción
  predictionCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 12,
  },
  predictionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  predictionLabel:  { fontSize: 13, color: Colors.textMuted, marginBottom: 4 },
  predictionAmount: { fontSize: 28, fontWeight: "800", color: Colors.text },
  predictionBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  predictionBadgeText: { fontSize: 11, color: "#FFFFFF", fontWeight: "700" },
  compareRow: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
  },
  compareItem:    { flex: 1, alignItems: "center" },
  compareLabel:   { fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
  compareValue:   { fontSize: 13, fontWeight: "700", color: Colors.text },
  compareDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 2 },

  // Stats en lista
  statsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  statTexts: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statDivider: { height: 1, backgroundColor: Colors.border },
  statLabel:   { fontSize: 13, color: Colors.textMuted },
  statValue:   { fontSize: 14, fontWeight: "700", color: Colors.text },

  // Chart
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  chartTitle: { fontSize: 14, fontWeight: "700", color: Colors.text, marginBottom: 20 },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: BAR_HEIGHT + 48,
  },
  barWrapper:  { flex: 1, alignItems: "center", justifyContent: "flex-end", gap: 4 },
  barAmount:   { fontSize: 9, color: Colors.textMuted, textAlign: "center" },
  barTrack:    { width: "60%", height: BAR_HEIGHT, justifyContent: "flex-end" },
  bar:         { width: "100%", borderRadius: 6 },
  barEmpty:    { height: 4, backgroundColor: Colors.border, opacity: 0.4 },
  barCurrentProjected: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.primary,
    opacity: 0.2,
    borderRadius: 6,
  },
  barCurrentSpent: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  barPredicted: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 6,
  },
  barMonth: { fontSize: 10, color: Colors.textMuted, fontWeight: "600" },

  // Leyenda
  legend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
    justifyContent: "center",
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendDotDashed: {
    width: 10, height: 10, borderRadius: 3,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  legendText: { fontSize: 11, color: Colors.textMuted },
  chartNote:  {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 8,
    textAlign: "center",
  },

  // Info
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 10,
  },
  infoRow:       { flexDirection: "row", alignItems: "center", gap: 8 },
  infoTitle:     { fontSize: 14, fontWeight: "700", color: Colors.text },
  infoText:      { fontSize: 13, color: Colors.textMuted, lineHeight: 20 },
  infoHighlight: { fontWeight: "700", color: Colors.primary },
});