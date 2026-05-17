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
          <Text style={styles.loadingText}>Procesando matemáticas avanzadas...</Text>
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

  const { calculus, statistics, projection, insights, probability, daily_series } = data;

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
      <Header title="Salud Financiera" subtitle="Inteligencia de Datos" showBack={false} />

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
                renderTooltip={(item: any) => (
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>Día {item.label}: {formatCompact(item.value)}</Text>
                  </View>
                )}
              />
            </View>
          ) : (
            <View style={styles.emptyChartContainer}>
              <Ionicons name="wallet-outline" size={32} color={Colors.border} />
              <Text style={styles.emptyChart}>Aún no hay suficientes datos</Text>
            </View>
          )}
        </View>

        {/* 2. RITMO DE GASTO (Cálculo Diferencial) */}
        <Text style={styles.sectionTitle}>Cálculo Diferencial</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="speedometer" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.gridLabel}>Velocidad</Text>
            <Text style={styles.gridValue} adjustsFontSizeToFit numberOfLines={1}>
              {formatCompact(calculus.current_velocity)}/día
            </Text>
            <Text style={styles.gridSub}>Derivada 1ra (Tendencia)</Text>
          </View>

          <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: isAccelerating ? '#fee2e2' : '#dcfce7' }]}>
              <Ionicons 
                name={isAccelerating ? "trending-up" : "trending-down"} 
                size={22} 
                color={isAccelerating ? Colors.danger : Colors.accent} 
              />
            </View>
            <Text style={styles.gridLabel}>Aceleración</Text>
            <Text 
              style={[styles.gridValue, { color: isAccelerating ? Colors.danger : Colors.accent }]}
              adjustsFontSizeToFit 
              numberOfLines={1}
            >
              {isAccelerating ? "Acelerando" : "Frenando"}
            </Text>
            <Text style={styles.gridSub} numberOfLines={1}>
              {isAccelerating ? "Derivada 2da Positiva" : "Buen control de gasto"}
            </Text>
          </View>
        </View>

        {/* 3. ESTADÍSTICA DESCRIPTIVA AVANZADA */}
        <Text style={styles.sectionTitle}>Estadística Descriptiva</Text>
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Valor Típico (Mediana)</Text>
            <Text style={styles.statValue}>{formatCompact(statistics.median)}</Text>
          </View>
          <View style={styles.statDivider} />
          
          <View style={styles.statRow}>
            <View>
              <Text style={styles.statLabel}>Categoría frecuente (Moda)</Text>
              <Text style={[styles.statLabel, {fontSize: 11}]}>{statistics.mode_count} transacciones</Text>
            </View>
            <Text style={styles.statValue}>{statistics.mode_category}</Text>
          </View>
          <View style={styles.statDivider} />
          
          <View style={styles.statRow}>
            <View>
              <Text style={styles.statLabel}>Valor Esperado E[X]</Text>
              <Text style={[styles.statLabel, {fontSize: 11}]}>Predicción para mañana</Text>
            </View>
            <Text style={[styles.statValue, {color: Colors.primary}]}>{formatCompact(statistics.expected_value)}</Text>
          </View>
          <View style={styles.statDivider} />

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Percentil 90 (Límite sano)</Text>
            <Text style={styles.statValue}>{formatCompact(statistics.percentile_90)}</Text>
          </View>
          <View style={styles.statDivider} />
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Coef. de Variación</Text>
            <Text style={[styles.statValue, { color: isVolatile ? Colors.danger : Colors.accent }]}>
              {statistics.coefficient_of_variation.toFixed(1)}%
            </Text>
          </View>
          {isVolatile && (
            <Text style={styles.alertText}>Tus gastos son muy irregulares (Volatilidad alta). Intenta apegarte más a tu presupuesto.</Text>
          )}
        </View>

        {/* 4. PREDICCIÓN PROBABILÍSTICA (Distribución Normal) */}
        <Text style={styles.sectionTitle}>Distribución Normal</Text>
        <View style={styles.projectionCard}>
          <View style={styles.projectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="analytics-outline" size={24} color={Colors.primary} />
              <Text style={styles.projectionTitle}>Proyección Fin de Mes</Text>
            </View>
            <View style={[styles.volatilityBadge, { backgroundColor: isVolatile ? '#fef9c3' : '#dcfce7' }]}>
              <Ionicons 
                name={isVolatile ? "warning" : "checkmark-circle"} 
                size={14} 
                color={isVolatile ? '#ca8a04' : Colors.accent} 
              />
              <Text style={[styles.volatilityText, { color: isVolatile ? '#ca8a04' : Colors.accent }]}>
                {isVolatile ? 'Alta Desviación' : 'Baja Desviación'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.projectionMainNumber}>
            {formatCompact(projection.end_of_month_estimate)}
          </Text>
          <Text style={styles.projectionSub}>
            Con un {projection.confidence_level} de certeza (Margen de Error: ±{formatCompact(projection.margin_of_error)}), cerrarás en el siguiente rango:
          </Text>

          <View style={styles.rangeContainer}>
            <View style={styles.rangeBox}>
              <Text style={styles.rangeLabel}>Escenario Ideal</Text>
              <Text style={styles.rangeValueOptimistic}>{formatCompact(projection.optimistic_estimate)}</Text>
            </View>
            <View style={styles.rangeDivider} />
            <View style={styles.rangeBox}>
              <Text style={styles.rangeLabel}>Peor Escenario</Text>
              <Text style={styles.rangeValuePessimistic}>{formatCompact(projection.pessimistic_estimate)}</Text>
            </View>
          </View>
        </View>

        {/* 5. INTELIGENCIA FINANCIERA (Poisson, Binomial & Bayes) */}
        <Text style={styles.sectionTitle}>Teoría de la Probabilidad</Text>
        
        <View style={styles.grid}>
           <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="leaf" size={22} color={Colors.accent} />
            </View>
            <Text style={styles.gridLabel}>Dist. Poisson</Text>
            <Text style={styles.gridValue} adjustsFontSizeToFit numberOfLines={1}>
              {probability.zero_spend_prob.toFixed(1)}%
            </Text>
            <Text style={styles.gridSub}>Probabilidad de NO gastar nada hoy</Text>
          </View>

          <View style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: '#e0e7ff' }]}>
              <Ionicons name="dice" size={22} color="#4f46e5" />
            </View>
            <Text style={styles.gridLabel}>Dist. Binomial</Text>
            <Text style={[styles.gridValue, { color: "#4f46e5" }]} adjustsFontSizeToFit numberOfLines={1}>
              {probability.binomial_success_prob.toFixed(1)}%
            </Text>
            <Text style={styles.gridSub}>De lograr meta {probability.binomial_k_target} de {probability.binomial_n_days} días restantes</Text>
          </View>
        </View>

        <View style={[styles.insightCard, insights.is_weekend_today && styles.insightCardActive, {marginTop: -16}]}>
          <View style={styles.insightHeader}>
            <View style={[styles.insightIconWrapper, {backgroundColor: '#fee2e2'}]}>
              <Ionicons name="git-network-outline" size={24} color={Colors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.insightTitle}>Teorema de Bayes</Text>
              <Text style={[styles.insightSub, {color: Colors.danger}]}>Riesgo Condicional</Text>
            </View>
          </View>

          <Text style={styles.insightText}>
            Basado en tu historial, dado que es <Text style={{fontWeight: '800'}}>fin de semana</Text>, la probabilidad matemática de exceder tu límite de gastos hoy es del:
          </Text>
          
          <View style={styles.riskContainer}>
            <Text style={[
              styles.riskPercentage, 
              { color: insights.weekend_overspend_risk > 50 ? Colors.danger : Colors.accent }
            ]}>
              {insights.weekend_overspend_risk}%
            </Text>
          </View>
          {insights.is_weekend_today && (
             <Text style={[styles.insightText, {color: Colors.danger, fontWeight: '700', marginTop: 8}]}>
               ¡Hoy es fin de semana, cuida tu bolsillo!
             </Text>
          )}
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
    backgroundColor: Colors.card, borderRadius: 28, paddingVertical: 24, paddingHorizontal: 20, marginBottom: 28, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 16 }, android: { elevation: 3 } }),
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
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8 }, android: { elevation: 2 } }),
  },
  iconCircle: { width: 42, height: 42, borderRadius: 12, backgroundColor: `${Colors.primary}10`, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  gridLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 4, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  gridValue: { fontSize: 20, fontWeight: "800", color: Colors.text, marginBottom: 4 },
  gridSub: { fontSize: 11, color: Colors.textMuted },

  statsCard: {
    backgroundColor: Colors.card, borderRadius: 24, padding: 20, marginBottom: 28, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 12 }, android: { elevation: 2 } }),
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  statLabel: { fontSize: 14, color: Colors.textMuted, fontWeight: '500' },
  statValue: { fontSize: 16, fontWeight: '800', color: Colors.text },
  statDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  alertText: { marginTop: 12, fontSize: 12, color: Colors.danger, backgroundColor: '#fee2e2', padding: 10, borderRadius: 8, fontWeight: '600' },

  projectionCard: {
    backgroundColor: Colors.card, borderRadius: 24, padding: 24, marginBottom: 28, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 12 }, android: { elevation: 2 } }),
  },
  projectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  projectionTitle: { fontSize: 14, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase' },
  volatilityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  volatilityText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  projectionMainNumber: { fontSize: 42, fontWeight: '900', color: Colors.text, letterSpacing: -1.5, marginBottom: 8 },
  projectionSub: { fontSize: 13, color: Colors.textMuted, lineHeight: 20, marginBottom: 24 },
  
  rangeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, borderRadius: 16, padding: 16 },
  rangeBox: { flex: 1, alignItems: 'center' },
  rangeLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase' },
  rangeValueOptimistic: { fontSize: 18, fontWeight: '800', color: Colors.accent },
  rangeValuePessimistic: { fontSize: 18, fontWeight: '800', color: Colors.danger },
  rangeDivider: { width: 1, height: 30, backgroundColor: Colors.border, marginHorizontal: 12 },

  insightCard: { backgroundColor: Colors.card, borderRadius: 24, padding: 24, marginBottom: 28, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 12 }, android: { elevation: 2 } }) },
  insightCardActive: { borderColor: `${Colors.danger}50`, backgroundColor: '#fffcfc' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  insightIconWrapper: { padding: 10, borderRadius: 14 },
  insightTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  insightSub: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  insightText: { fontSize: 14, color: Colors.textMuted, lineHeight: 22 },
  riskContainer: { marginVertical: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: Colors.background, borderRadius: 12, alignSelf: 'flex-start' },
  riskPercentage: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },

  tooltip: { backgroundColor: Colors.text, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 },
  tooltipText: { color: '#ffffff', fontSize: 13, fontWeight: '800' }
});