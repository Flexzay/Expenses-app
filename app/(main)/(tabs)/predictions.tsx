import { Header } from "@/components/ui/Header";
import { Colors } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, StyleSheet, Text, View } from "react-native";


// — datos simulados —
const MONTHLY_DATA = [
  { month: "Oct", amount: 280000 },
  { month: "Nov", amount: 410000 },
  { month: "Dic", amount: 520000 },
  { month: "Ene", amount: 390000 },
  { month: "Feb", amount: 345000 },
  { month: "Mar", amount: 320000 },
];

const PREDICTION_NEXT = 480000;
const BUDGET = 500000;
const CURRENT_MONTH_SPENT = 320000;

const CATEGORY_PREDICTIONS = [
  { name: "Energía",         predicted: 95000,  last: 89000,  icon: "flash-outline",           up: true  },
  { name: "Gas",             predicted: 50000,  last: 45000,  icon: "flame-outline",           up: true  },
  { name: "Agua",            predicted: 30000,  last: 32000,  icon: "water-outline",           up: false },
  { name: "Entretenimiento", predicted: 22000,  last: 17900,  icon: "game-controller-outline", up: true  },
];

const MAX_AMOUNT = Math.max(...MONTHLY_DATA.map((d) => d.amount), PREDICTION_NEXT);
const BAR_HEIGHT = 140;

function formatAmount(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n}`;
}

export default function PredictionsScreen() {
  const willExceedBudget = PREDICTION_NEXT > BUDGET;
  const predictedPercent = Math.round((PREDICTION_NEXT / BUDGET) * 100);

  return (
    <View style={styles.container}>
      <Header
        title="Predicción"
        subtitle="Análisis de tus gastos"
        showBack={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Alerta si supera presupuesto */}
        {willExceedBudget && (
          <View style={styles.alertCard}>
            <Ionicons name="warning-outline" size={20} color="#92400E" />
            <Text style={styles.alertText}>
              Se estima que superarás tu presupuesto el próximo mes en{" "}
              <Text style={{ fontWeight: "700" }}>
                ${(PREDICTION_NEXT - BUDGET).toLocaleString()}
              </Text>
            </Text>
          </View>
        )}

        {/* Card predicción próximo mes */}
        <View style={styles.predictionCard}>
          <View style={styles.predictionTop}>
            <View>
              <Text style={styles.predictionLabel}>Predicción — Abril 2026</Text>
              <Text style={styles.predictionAmount}>
                {formatAmount(PREDICTION_NEXT)}
              </Text>
            </View>
            <View
              style={[
                styles.predictionBadge,
                { backgroundColor: willExceedBudget ? Colors.danger : Colors.accent },
              ]}
            >
              <Ionicons
                name={willExceedBudget ? "trending-up" : "checkmark-circle"}
                size={14}
                color="#FFFFFF"
              />
              <Text style={styles.predictionBadgeText}>
                {predictedPercent}% del presupuesto
              </Text>
            </View>
          </View>

          <View style={styles.predictionCompare}>
            <View style={styles.compareItem}>
              <Text style={styles.compareLabel}>Mes actual</Text>
              <Text style={styles.compareValue}>
                {formatAmount(CURRENT_MONTH_SPENT)}
              </Text>
            </View>
            <View style={styles.compareDivider} />
            <View style={styles.compareItem}>
              <Text style={styles.compareLabel}>Presupuesto</Text>
              <Text style={styles.compareValue}>{formatAmount(BUDGET)}</Text>
            </View>
            <View style={styles.compareDivider} />
            <View style={styles.compareItem}>
              <Text style={styles.compareLabel}>Variación</Text>
              <Text
                style={[
                  styles.compareValue,
                  {
                    color:
                      PREDICTION_NEXT > CURRENT_MONTH_SPENT
                        ? Colors.danger
                        : Colors.accent,
                  },
                ]}
              >
                {PREDICTION_NEXT > CURRENT_MONTH_SPENT ? "+" : ""}
                {formatAmount(PREDICTION_NEXT - CURRENT_MONTH_SPENT)}
              </Text>
            </View>
          </View>
        </View>

        {/* Gráfica de barras */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Últimos 6 meses + predicción</Text>
          <View style={styles.chart}>
            {MONTHLY_DATA.map((item, index) => {
              const height = (item.amount / MAX_AMOUNT) * BAR_HEIGHT;
              const isLast = index === MONTHLY_DATA.length - 1;
              return (
                <View key={item.month} style={styles.barWrapper}>
                  <Text style={styles.barAmount}>{formatAmount(item.amount)}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height,
                          backgroundColor: isLast ? Colors.primary : Colors.border,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barMonth}>{item.month}</Text>
                </View>
              );
            })}

            {/* Barra predicción */}
            <View key="pred" style={styles.barWrapper}>
              <Text style={[styles.barAmount, { color: willExceedBudget ? Colors.danger : Colors.accent }]}>
                {formatAmount(PREDICTION_NEXT)}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    styles.barPredicted,
                    {
                      height: (PREDICTION_NEXT / MAX_AMOUNT) * BAR_HEIGHT,
                      borderColor: willExceedBudget ? Colors.danger : Colors.accent,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barMonth, { color: willExceedBudget ? Colors.danger : Colors.accent }]}>
                Abr*
              </Text>
            </View>
          </View>

          <Text style={styles.chartNote}>* Valor estimado basado en historial</Text>
        </View>

        {/* Predicción por categoría */}
        <Text style={styles.sectionTitle}>Predicción por categoría</Text>

        {CATEGORY_PREDICTIONS.map((cat) => {
          const pct = Math.round((cat.predicted / PREDICTION_NEXT) * 100);
          return (
            <View key={cat.name} style={styles.catCard}>
              <View style={styles.catHeader}>
                <View style={styles.catIconWrap}>
                  <Ionicons name={cat.icon as any} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.catName}>{cat.name}</Text>
                <View style={styles.catRight}>
                  <Text style={styles.catAmount}>{formatAmount(cat.predicted)}</Text>
                  <View
                    style={[
                      styles.catTrend,
                      { backgroundColor: cat.up ? "#FEE2E2" : "#DCFCE7" },
                    ]}
                  >
                    <Ionicons
                      name={cat.up ? "arrow-up" : "arrow-down"}
                      size={11}
                      color={cat.up ? Colors.danger : Colors.accent}
                    />
                    <Text
                      style={[
                        styles.catTrendText,
                        { color: cat.up ? Colors.danger : Colors.accent },
                      ]}
                    >
                      {formatAmount(Math.abs(cat.predicted - cat.last))}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.catProgressTrack}>
                <View
                  style={[
                    styles.catProgressFill,
                    { width: `${pct}%` },
                  ]}
                />
              </View>
              <Text style={styles.catPct}>{pct}% del total estimado</Text>
            </View>
          );
        })}

        <View style={{ height: 32 }} />
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
    padding: 20,
    paddingTop: 12,
  },

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
  alertText: {
    flex: 1,
    fontSize: 13,
    color: "#92400E",
    lineHeight: 18,
  },

  // Prediction card
  predictionCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  predictionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  predictionLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 4,
  },
  predictionAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  predictionBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  predictionBadgeText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  predictionCompare: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
  },
  compareItem: {
    flex: 1,
    alignItems: "center",
  },
  compareLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  compareValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  compareDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 2,
  },

  // Chart
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 20,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: BAR_HEIGHT + 48,
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  barAmount: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: "center",
  },
  barTrack: {
    width: "60%",
    height: BAR_HEIGHT,
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 6,
  },
  barPredicted: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 6,
  },
  barMonth: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: "600",
  },
  chartNote: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 12,
    textAlign: "center",
  },

  // Sección categorías
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  catCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
  },
  catHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  catIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  catName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  catRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  catAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  catTrend: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  catTrendText: {
    fontSize: 10,
    fontWeight: "700",
  },
  catProgressTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 4,
  },
  catProgressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },
  catPct: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});