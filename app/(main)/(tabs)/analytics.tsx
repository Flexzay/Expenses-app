import { useAnalytics } from "@/hooks/useAnalytics";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { BarChart } from "react-native-gifted-charts"; 
import { Header } from "../../../components/ui/Header";
import { Colors } from "../../../constants/colors";

const { width } = Dimensions.get("window");

function formatCompact(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
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

  const { calculus, statistics, projection, daily_series } = data;

  // Calculamos el valor máximo del mes para darle un "techo" cómodo a la gráfica
  const maxSpendInMonth = Math.max(...daily_series.map(d => d.spent_today));
  const chartMaxValue = maxSpendInMonth > 0 ? maxSpendInMonth * 1.2 : 1000; // 20% de espacio extra arriba

  // Configuramos las barras sin emojis
  const chartData = daily_series.map((point) => {
    // Si el gasto de hoy es 50% mayor al promedio, pintamos la barra de otro color
    const isHighSpend = point.spent_today > statistics.daily_mean * 1.5; 
    
    return {
      value: point.spent_today,
      label: `${point.day}`,
      frontColor: isHighSpend ? Colors.danger : Colors.primary, 
    };
  });

  const isAccelerating = calculus.acceleration > 0;
  const isVolatile = statistics.volatility_status === "Alta volatilidad";

  // Obtenemos el total acumulado
  const currentTotal = daily_series.length > 0 ? daily_series[daily_series.length - 1].cumulative : 0;

  return (
    <View style={styles.container}>
      <Header title="Salud Financiera" subtitle="Tendencias de este mes" showBack={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* 1. GRÁFICA DE BARRAS (MÁS ALTA Y LIMPIA) */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeaderTop}>
            <View>
              <Text style={styles.cardSubtitle}>Gasto Acumulado</Text>
              <Text style={styles.heroNumber}>{formatCompact(currentTotal)}</Text>
            </View>
            <View style={styles.iconBadge}>
              <Ionicons name="bar-chart" size={20} color={Colors.primary} />
            </View>
          </View>

          {chartData.length > 0 ? (
            <View style={styles.chartWrapper}>
              <BarChart
                data={chartData}
                height={250}      // <-- Aumentamos la altura de 160 a 250
                maxValue={chartMaxValue} // <-- Evita que las barras altas se corten
                barWidth={22}     
                spacing={16}      
                initialSpacing={10}
                roundedTop        
                roundedBottom     
                hideRules
                xAxisThickness={0}
                yAxisThickness={0}
                hideYAxisText     
                xAxisLabelTextStyle={{ color: Colors.textMuted, fontSize: 11, fontWeight: '600' }}
                isAnimated
                renderTooltip={(item: any) => {
                  return (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipText}>Día {item.label}: {formatCompact(item.value)}</Text>
                    </View>
                  );
                }}
              />
            </View>
          ) : (
            <View style={styles.emptyChartContainer}>
              <Ionicons name="wallet-outline" size={32} color={Colors.border} />
              <Text style={styles.emptyChart}>Aún no hay suficientes datos</Text>
            </View>
          )}
        </View>

        {/* 2. RESUMEN DE RITMO */}
        <Text style={styles.sectionTitle}>Ritmo de Gasto</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="speedometer" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.gridLabel}>Gasto Diario</Text>
            <Text style={styles.gridValue} adjustsFontSizeToFit numberOfLines={1}>
              {formatCompact(calculus.current_velocity)}
            </Text>
            <Text style={styles.gridSub}>Promedio actual</Text>
          </View>

          <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: isAccelerating ? '#fee2e2' : '#dcfce7' }]}>
              <Ionicons 
                name={isAccelerating ? "trending-up" : "trending-down"} 
                size={22} 
                color={isAccelerating ? Colors.danger : Colors.accent} 
              />
            </View>
            <Text style={styles.gridLabel}>Estado</Text>
            <Text 
              style={[styles.gridValue, { color: isAccelerating ? Colors.danger : Colors.accent }]}
              adjustsFontSizeToFit 
              numberOfLines={1}
            >
              {isAccelerating ? "Gastando más" : "Ahorrando"}
            </Text>
            <Text style={styles.gridSub} numberOfLines={1}>{isAccelerating ? "Tu ritmo subió" : "Buen camino"}</Text>
          </View>
        </View>

        {/* 3. PREDICCIÓN */}
        <Text style={styles.sectionTitle}>Estimación a fin de mes</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: isVolatile ? '#fef9c3' : Colors.background }]}>
              <Ionicons name="pulse" size={22} color={isVolatile ? '#ca8a04' : Colors.primary} />
            </View>
            <Text style={styles.gridLabel}>Variabilidad</Text>
            <Text style={styles.gridValue} adjustsFontSizeToFit numberOfLines={1}>
              {isVolatile ? "Inestable" : "Estable"}
            </Text>
            <Text style={styles.gridSub}>Consistencia</Text>
          </View>

          <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: projection.will_exceed_budget ? '#fee2e2' : '#dcfce7' }]}>
              <Ionicons name="flag" size={22} color={projection.will_exceed_budget ? Colors.danger : Colors.accent} />
            </View>
            <Text style={styles.gridLabel}>Proyección</Text>
            <Text 
              style={[styles.gridValue, { color: projection.will_exceed_budget ? Colors.danger : Colors.text }]}
              adjustsFontSizeToFit 
              numberOfLines={1}
            >
              {formatCompact(projection.end_of_month_estimate)}
            </Text>
            <Text style={styles.gridSub} numberOfLines={1}>
              {projection.will_exceed_budget ? "Te pasarás" : "En presupuesto"}
            </Text>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 16, paddingTop: 12 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { color: Colors.primary, fontWeight: "600", marginTop: 10 },
  errorText: { color: Colors.textMuted, fontSize: 15, marginTop: 10 },
  
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: 28,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardSubtitle: { fontSize: 14, color: Colors.textMuted, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  heroNumber: { fontSize: 36, fontWeight: '900', color: Colors.text, letterSpacing: -1 },
  iconBadge: {
    backgroundColor: `${Colors.primary}15`,
    padding: 8,
    borderRadius: 12,
  },
  
  chartWrapper: { 
    alignItems: 'center', 
    justifyContent: 'center',
    marginLeft: -10, 
    marginTop: 10, // Un poco de espacio arriba para que el tooltip respire
  },
  emptyChartContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40, gap: 12 },
  emptyChart: { color: Colors.textMuted, fontSize: 14, fontWeight: '500' },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 16,
    paddingLeft: 4,
    letterSpacing: -0.5,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  gridItem: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  gridLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  gridValue: { fontSize: 20, fontWeight: "800", color: Colors.text, marginBottom: 4 },
  gridSub: { fontSize: 12, color: Colors.textMuted },
  
  tooltip: {
      backgroundColor: Colors.text, 
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 10, 
      marginBottom: 12, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
  },
  tooltipText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '800'
  }
});