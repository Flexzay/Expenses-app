import { useAnalytics } from "@/hooks/useAnalytics";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Header } from "../../../components/ui/Header";
import { Colors } from "../../../constants/colors";

const { width } = Dimensions.get("window");

function formatCompact(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${Math.round(n)}`;
}

export default function AnalyticsScreen() {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Mis Análisis" subtitle="Analizando tus finanzas..." showBack={false} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Preparando tu resumen...</Text>
        </View>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.container}>
        <Header title="Mis Análisis" subtitle="Resumen de gastos" showBack={false} />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.errorText}>No pudimos cargar tus datos</Text>
        </View>
      </View>
    );
  }

  const { calculus, statistics, projection, daily_series, budget } = data;

  const chartData = daily_series.map((point) => ({
    value: point.cumulative,
    label: `${point.day}`,
    dataPointText: point.spent_today > statistics.daily_mean * 1.5 ? "🔥" : "",
  }));

  const isAccelerating = calculus.acceleration > 0;
  const isVolatile = statistics.volatility_status === "Alta volatilidad";

  return (
    <View style={styles.container}>
      <Header title="Salud Financiera" subtitle="Tendencias de este mes" showBack={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* 1. GRÁFICA DE GASTO ACUMULADO */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Tu Dinero en el Tiempo</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Mira cómo se acumulan tus gastos. Entre más plana sea la línea, mejor estás ahorrando.
          </Text>

          {chartData.length > 0 ? (
            <View style={styles.chartContainer}>
              <LineChart
                data={chartData}
                width={width - 80}
                height={180}
                color={Colors.primary}
                thickness={3}
                startFillColor={Colors.primary}
                endFillColor={`${Colors.primary}10`}
                startOpacity={0.4}
                endOpacity={0.05}
                initialSpacing={10}
                noOfSections={4}
                yAxisLabelTexts={Array.from({ length: 5 }).map((_, i) => 
                  formatCompact((budget.total / 4) * i)
                )}
                yAxisTextStyle={{ color: Colors.textMuted, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: Colors.textMuted, fontSize: 10 }}
                dataPointsColor={Colors.primary}
                pointerConfig={{
                    pointerLabelComponent: (items: any) => (
                        <View style={styles.tooltip}>
                            <Text style={styles.tooltipText}>{formatCompact(items[0].value)}</Text>
                        </View>
                    )
                }}
                hideRules
                yAxisColor="transparent"
                xAxisColor={Colors.border}
                areaChart
                isAnimated
              />
            </View>
          ) : (
            <Text style={styles.emptyChart}>Aún no hay suficientes gastos para mostrar la tendencia.</Text>
          )}
        </View>

        {/* 2. RESUMEN DE RITMO (Cálculo traducido) */}
        <Text style={styles.sectionTitle}>Ritmo de Gasto</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="speedometer-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.gridLabel}>Gasto Diario</Text>
            <Text style={styles.gridValue}>{formatCompact(calculus.current_velocity)}</Text>
            <Text style={styles.gridSub}>Promedio por día</Text>
          </View>

          <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: isAccelerating ? '#fee2e2' : '#dcfce7' }]}>
              <Ionicons 
                name={isAccelerating ? "alert-circle-outline" : "checkmark-circle-outline"} 
                size={22} 
                color={isAccelerating ? Colors.danger : Colors.accent} 
              />
            </View>
            <Text style={styles.gridLabel}>Estado</Text>
            <Text style={[styles.gridValue, { color: isAccelerating ? Colors.danger : Colors.accent }]}>
              {isAccelerating ? "Gastando más" : "Ahorrando"}
            </Text>
            <Text style={styles.gridSub}>{isAccelerating ? "Tu ritmo subió" : "Vas por buen camino"}</Text>
          </View>
        </View>

        {/* 3. PREDICCIÓN (Estadística traducida) */}
        <Text style={styles.sectionTitle}>¿Cómo terminarás el mes?</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: isVolatile ? '#fef9c3' : Colors.background }]}>
              <Ionicons name="git-commit-outline" size={22} color={isVolatile ? '#ca8a04' : Colors.primary} />
            </View>
            <Text style={styles.gridLabel}>Variabilidad</Text>
            <Text style={styles.gridValue}>{isVolatile ? "Inestable" : "Estable"}</Text>
            <Text style={styles.gridSub}>Consistencia de gastos</Text>
          </View>

          <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: projection.will_exceed_budget ? '#fee2e2' : '#dcfce7' }]}>
              <Ionicons name="calendar-outline" size={22} color={projection.will_exceed_budget ? Colors.danger : Colors.accent} />
            </View>
            <Text style={styles.gridLabel}>Estimado Final</Text>
            <Text style={[styles.gridValue, { color: projection.will_exceed_budget ? Colors.danger : Colors.text }]}>
              {formatCompact(projection.end_of_month_estimate)}
            </Text>
            <Text style={styles.gridSub}>{projection.will_exceed_budget ? "Te pasarás del límite" : "Dentro del presupuesto"}</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingTop: 10 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { color: Colors.primary, fontWeight: "600", marginTop: 10 },
  errorText: { color: Colors.textMuted, fontSize: 15, marginTop: 10 },
  
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "800", color: Colors.text },
  cardSubtitle: { fontSize: 13, color: Colors.textMuted, marginBottom: 20, lineHeight: 18 },
  chartContainer: { marginLeft: -10 },
  emptyChart: { textAlign: "center", color: Colors.textMuted, marginVertical: 30, fontStyle: 'italic' },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
    paddingLeft: 4
  },
  grid: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 24,
  },
  gridItem: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  gridLabel: { fontSize: 13, color: Colors.textMuted, marginBottom: 4 },
  gridValue: { fontSize: 17, fontWeight: "800", color: Colors.text, marginBottom: 2 },
  gridSub: { fontSize: 11, color: Colors.textMuted },
  tooltip: {
      backgroundColor: Colors.text,
      padding: 4,
      borderRadius: 4,
  },
  tooltipText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold'
  }
});