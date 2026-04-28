import { useAnalytics } from "@/hooks/useAnalytics";
import { formatCOP } from "@/utils/currency";
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

// Formateador compacto para el eje Y de la gráfica (Ej: $1.5M)
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
        <Header title="Análisis Pro" subtitle="Modelos matemáticos" showBack={false} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Calculando modelos...</Text>
        </View>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.container}>
        <Header title="Análisis Pro" subtitle="Modelos matemáticos" showBack={false} />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.errorText}>Error al cargar los análisis</Text>
        </View>
      </View>
    );
  }

  const { calculus, statistics, projection, daily_series, budget } = data;

  // Preparar datos para la gráfica lineal E(t)
  const chartData = daily_series.map((point) => ({
    value: point.cumulative,
    label: `${point.day}`,
    // Resaltar los días donde el gasto fue muy alto
    dataPointText: point.spent_today > statistics.daily_mean * 2 ? "⚠️" : "",
  }));

  const isAccelerating = calculus.acceleration > 0;
  const isVolatile = statistics.volatility_status === "Alta volatilidad";

  return (
    <View style={styles.container}>
      <Header title="Análisis Pro" subtitle="Cálculo & Estadística" showBack={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* 1. GRÁFICA DE FUNCIÓN DE GASTO E(t) */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="analytics-outline" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Función de Gasto Acumulado $E(t)$</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Evolución del gasto durante el mes. La pendiente representa tu velocidad de consumo.
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
                endFillColor={`${Colors.primary}10`} // Transparencia
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
                dataPointsRadius={3}
                hideRules
                yAxisColor="transparent"
                xAxisColor={Colors.border}
                areaChart
                isAnimated
              />
            </View>
          ) : (
            <Text style={styles.emptyChart}>No hay datos suficientes para graficar.</Text>
          )}
        </View>

        {/* 2. CÁLCULO DIFERENCIAL (Velocidad y Aceleración) */}
        <Text style={styles.sectionTitle}>Cálculo Diferencial</Text>
        <View style={styles.grid}>
          {/* Velocidad */}
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="speedometer-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.gridLabel}>Velocidad $E'(t)$</Text>
            <Text style={styles.gridValue}>{formatCompact(calculus.current_velocity)}/día</Text>
            <Text style={styles.gridSub}>Pendiente de regresión</Text>
          </View>

          {/* Aceleración */}
          <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: isAccelerating ? '#fee2e2' : '#dcfce7' }]}>
              <Ionicons 
                name={isAccelerating ? "trending-up-outline" : "trending-down-outline"} 
                size={22} 
                color={isAccelerating ? Colors.danger : Colors.accent} 
              />
            </View>
            <Text style={styles.gridLabel}>Aceleración $E''(t)$</Text>
            <Text style={[styles.gridValue, { color: isAccelerating ? Colors.danger : Colors.accent }]}>
              {calculus.acceleration_status}
            </Text>
            <Text style={styles.gridSub}>Derivada de la velocidad</Text>
          </View>
        </View>

        {/* 3. ESTADÍSTICA (Volatilidad y Proyección) */}
        <Text style={styles.sectionTitle}>Estadística Avanzada</Text>
        <View style={styles.grid}>
          {/* Volatilidad (Desviación Estándar) */}
          <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: isVolatile ? '#fee2e2' : Colors.background }]}>
              <Ionicons name="pulse-outline" size={22} color={isVolatile ? Colors.danger : Colors.primary} />
            </View>
            <Text style={styles.gridLabel}>Desviación Estándar $\sigma$</Text>
            <Text style={styles.gridValue}>{formatCompact(statistics.standard_deviation)}</Text>
            <Text style={styles.gridSub}>{statistics.volatility_status}</Text>
          </View>

          {/* Predicción Lineal */}
          <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: projection.will_exceed_budget ? '#fee2e2' : Colors.background }]}>
              <Ionicons name="calendar-outline" size={22} color={projection.will_exceed_budget ? Colors.danger : Colors.primary} />
            </View>
            <Text style={styles.gridLabel}>Proyección Fin de Mes</Text>
            <Text style={[styles.gridValue, { color: projection.will_exceed_budget ? Colors.danger : Colors.text }]}>
              {formatCompact(projection.end_of_month_estimate)}
            </Text>
            <Text style={styles.gridSub}>Regresión Mínimos Cuadrados</Text>
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
  loadingText: { color: Colors.primary, fontWeight: "600" },
  errorText: { color: Colors.textMuted, fontSize: 15 },
  
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: Colors.text },
  cardSubtitle: { fontSize: 13, color: Colors.textMuted, marginBottom: 20, lineHeight: 18 },
  chartContainer: { marginLeft: -10 }, // Ajuste para alinear con el padding de GiftedCharts
  emptyChart: { textAlign: "center", color: Colors.textMuted, marginVertical: 20 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  gridItem: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  gridLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  gridValue: { fontSize: 18, fontWeight: "800", color: Colors.text, marginBottom: 4 },
  gridSub: { fontSize: 11, color: Colors.textMuted },
});