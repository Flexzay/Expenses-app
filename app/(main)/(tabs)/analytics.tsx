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

  // Desestructuramos `insights` para el Teorema de Bayes
  const { calculus, statistics, projection, insights, daily_series } = data;

  const maxSpendInMonth = daily_series.length > 0 ? Math.max(...daily_series.map(d => d.spent_today)) : 0;
  const chartMaxValue = maxSpendInMonth > 0 ? maxSpendInMonth * 1.2 : 1000; 

  const chartData = daily_series.map((point) => {
    const isHighSpend = point.spent_today > statistics.daily_mean * 1.5; 
    
    return {
      value: point.spent_today,
      label: `${point.day}`,
      frontColor: isHighSpend ? Colors.danger : Colors.primary, 
    };
  });

  const isAccelerating = calculus.acceleration > 0;
  const isVolatile = statistics.volatility_status === "Alta volatilidad";
  const currentTotal = daily_series.length > 0 ? daily_series[daily_series.length - 1].cumulative : 0;

  return (
    <View style={styles.container}>
      <Header title="Salud Financiera" subtitle="Tendencias de este mes" showBack={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* 1. GRÁFICA DE BARRAS */}
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
                height={250}      
                maxValue={chartMaxValue} 
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

        {/* 3. PREDICCIÓN PROBABILÍSTICA */}
        <Text style={styles.sectionTitle}>Predicción Probabilística</Text>
        <View style={styles.projectionCard}>
          
          <View style={styles.projectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="analytics-outline" size={24} color={Colors.primary} />
              <Text style={styles.projectionTitle}>Gasto Final Estimado</Text>
            </View>
            
            <View style={[styles.volatilityBadge, { backgroundColor: isVolatile ? '#fef9c3' : '#dcfce7' }]}>
              <Ionicons 
                name={isVolatile ? "warning" : "checkmark-circle"} 
                size={14} 
                color={isVolatile ? '#ca8a04' : Colors.accent} 
              />
              <Text style={[styles.volatilityText, { color: isVolatile ? '#ca8a04' : Colors.accent }]}>
                {isVolatile ? 'Inestable' : 'Estable'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.projectionMainNumber}>
            {formatCompact(projection.end_of_month_estimate)}
          </Text>
          <Text style={styles.projectionSub}>
            Con un {projection.confidence_level} de certeza, cerrarás el mes en este rango:
          </Text>

          <View style={styles.rangeContainer}>
            <View style={styles.rangeBox}>
              <Text style={styles.rangeLabel}>Mejor Escenario</Text>
              <Text style={styles.rangeValueOptimistic}>
                {formatCompact(projection.optimistic_estimate)}
              </Text>
            </View>
            
            <View style={styles.rangeDivider} />
            
            <View style={styles.rangeBox}>
              <Text style={styles.rangeLabel}>Peor Escenario</Text>
              <Text style={styles.rangeValuePessimistic}>
                {formatCompact(projection.pessimistic_estimate)}
              </Text>
            </View>
          </View>
        </View>

        {/* 4. INTELIGENCIA FINANCIERA (TEOREMA DE BAYES) */}
        <Text style={styles.sectionTitle}>Inteligencia Financiera</Text>
        <View style={[styles.insightCard, insights.is_weekend_today && styles.insightCardActive]}>
          <View style={styles.insightHeader}>
            <View style={styles.insightIconWrapper}>
              <Ionicons name="hardware-chip" size={24} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.insightTitle}>Patrón de Conducta Detectado</Text>
              <Text style={styles.insightSub}>Análisis Bayesiano</Text>
            </View>
          </View>

          <Text style={styles.insightText}>
            Basado en tu historial matemático, cuando es <Text style={{fontWeight: '800'}}>fin de semana</Text>, tienes un
          </Text>
          
          <View style={styles.riskContainer}>
            <Text style={[
              styles.riskPercentage, 
              { color: insights.weekend_overspend_risk > 50 ? Colors.danger : Colors.accent }
            ]}>
              {insights.weekend_overspend_risk}% de probabilidad
            </Text>
          </View>

          <Text style={styles.insightTextBottom}>
            de exceder tu límite diario de gastos. 
            {insights.is_weekend_today ? " ¡Cuidado, hoy es fin de semana!" : " Mantén la guardia alta cuando llegue el sábado."}
          </Text>
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
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 16 },
      android: { elevation: 3 },
    }),
  },
  cardHeaderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  cardSubtitle: { fontSize: 14, color: Colors.textMuted, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  heroNumber: { fontSize: 36, fontWeight: '900', color: Colors.text, letterSpacing: -1 },
  iconBadge: { backgroundColor: `${Colors.primary}15`, padding: 8, borderRadius: 12 },
  
  chartWrapper: { alignItems: 'center', justifyContent: 'center', marginLeft: -10, marginTop: 10 },
  emptyChartContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40, gap: 12 },
  emptyChart: { color: Colors.textMuted, fontSize: 14, fontWeight: '500' },

  sectionTitle: { fontSize: 17, fontWeight: "800", color: Colors.text, marginBottom: 16, paddingLeft: 4, letterSpacing: -0.5 },
  grid: { flexDirection: "row", gap: 12, marginBottom: 28 },
  gridItem: {
    flex: 1, backgroundColor: Colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  iconCircle: { width: 42, height: 42, borderRadius: 12, backgroundColor: `${Colors.primary}10`, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  gridLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  gridValue: { fontSize: 20, fontWeight: "800", color: Colors.text, marginBottom: 4 },
  gridSub: { fontSize: 12, color: Colors.textMuted },
  
  projectionCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 12 },
      android: { elevation: 2 },
    }),
  },
  projectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  projectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase' },
  
  volatilityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  volatilityText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  
  projectionMainNumber: { fontSize: 42, fontWeight: '900', color: Colors.text, letterSpacing: -1.5, marginBottom: 8 },
  projectionSub: { fontSize: 13, color: Colors.textMuted, lineHeight: 20, marginBottom: 24 },
  
  rangeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, borderRadius: 16, padding: 16 },
  rangeBox: { flex: 1, alignItems: 'center' },
  rangeLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase' },
  rangeValueOptimistic: { fontSize: 18, fontWeight: '800', color: Colors.accent },
  rangeValuePessimistic: { fontSize: 18, fontWeight: '800', color: Colors.danger },
  rangeDivider: { width: 1, height: 30, backgroundColor: Colors.border, marginHorizontal: 12 },

  // --- ESTILOS DE LA TARJETA DE BAYES ---
  insightCard: {
    backgroundColor: Colors.card, borderRadius: 24, padding: 24, marginBottom: 28, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 12 }, android: { elevation: 2 } }),
  },
  insightCardActive: { borderColor: `${Colors.danger}50`, backgroundColor: '#fffcfc' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  insightIconWrapper: { backgroundColor: `${Colors.primary}15`, padding: 10, borderRadius: 14 },
  insightTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  insightSub: { fontSize: 12, color: Colors.primary, fontWeight: '700', textTransform: 'uppercase' },
  insightText: { fontSize: 14, color: Colors.textMuted, lineHeight: 22 },
  insightTextBottom: { fontSize: 14, color: Colors.textMuted, lineHeight: 22, marginTop: 4 },
  riskContainer: { marginVertical: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: Colors.background, borderRadius: 12, alignSelf: 'flex-start' },
  riskPercentage: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },

  tooltip: { backgroundColor: Colors.text, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 },
  tooltipText: { color: '#ffffff', fontSize: 13, fontWeight: '800' }
});