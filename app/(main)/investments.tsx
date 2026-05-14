import { useWealthSummary } from "@/hooks/useWealth";
import { formatCOP } from "@/utils/currency";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Platform
} from "react-native";
// IMPORTANTE: Volvemos a LineChart pero con un diseño Dual Area Premium
import { LineChart } from "react-native-gifted-charts";
import { Header } from "../../components/ui/Header";
import { Colors } from "../../constants/colors";

const { width } = Dimensions.get("window");

function formatCompact(n: number) {
  if (isNaN(n) || n === null || n === undefined) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`; 
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
}

export default function InvestmentsScreen() {
  const { data: wealth, isLoading } = useWealthSummary();

  const [contribution, setContribution] = useState("0"); 
  const [annualRate, setAnnualRate] = useState("12"); 
  const [years, setYears] = useState("5");

  const [lineDataInversion, setLineDataInversion] = useState<any[]>([]);
  const [lineDataAhorro, setLineDataAhorro] = useState<any[]>([]);
  
  const [totalInvertido, setTotalInvertido] = useState(0);
  const [totalAhorrado, setTotalAhorrado] = useState(0);

  useEffect(() => {
    if (wealth && wealth.free_cash_flow > 0 && contribution === "0") {
      setContribution(wealth.free_cash_flow.toString());
    }
  }, [wealth]);

  useEffect(() => {
    const p = isNaN(parseFloat(contribution)) ? 0 : parseFloat(contribution);
    const rate = isNaN(parseFloat(annualRate)) ? 0 : parseFloat(annualRate);
    const nYears = isNaN(parseInt(years)) ? 0 : parseInt(years);
    const r = rate / 100 / 12;
    
    let arrInversion = [];
    let arrAhorro = [];
    
    const safeYears = Math.min(Math.max(nYears, 1), 50); // Máximo 50 años

    for (let i = 0; i <= safeYears; i++) {
      const meses = i * 12;
      const ahorroLinea = p * meses;
      const inversion = r === 0 ? ahorroLinea : p * ((Math.pow(1 + r, meses) - 1) / r) * (1 + r);

      // Etiqueta del eje X (ej: 0A, 1A, 2A...)
      const labelText = `${i}A`;

      arrAhorro.push({ value: Math.round(ahorroLinea), label: labelText });
      arrInversion.push({ value: Math.round(inversion), label: labelText });

      if (i === safeYears) {
        setTotalAhorrado(Math.round(ahorroLinea));
        setTotalInvertido(Math.round(inversion));
      }
    }

    setLineDataAhorro(arrAhorro);
    setLineDataInversion(arrInversion);
  }, [contribution, annualRate, years]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Inversiones" showBack={true} />
        <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>
      </View>
    );
  }

  const gananciaNeta = isNaN(totalInvertido - totalAhorrado) ? 0 : (totalInvertido - totalAhorrado);
  
  // --- CÁLCULO ANTI-DESBORDAMIENTO ---
  // Ancho total disponible dentro de la tarjeta
  const chartAvailableWidth = width - 72; 
  // Dividimos el espacio disponible entre el número de puntos. 
  // Si son 5 años (6 puntos), se estiran. Si son 30 años, se comprimen solitos.
  const dynamicSpacing = chartAvailableWidth / Math.max(lineDataInversion.length - 1, 1);
  const chartMaxValue = totalInvertido > 0 ? totalInvertido * 1.15 : 1000;

  return (
    <View style={styles.container}>
      <Header title="Inversiones" subtitle="Proyector de Riqueza" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Leyenda Visual Educativa */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: '#94a3b8' }]} />
            <Text style={styles.legendText}>Tu Sueldo/Aportes</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>Inversión Total</Text>
          </View>
        </View>

        {/* GRÁFICA DE LÍNEAS DOBLES (ÁREA) */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Trayectoria a {years || "0"} años</Text>
          <Text style={styles.chartSubtitle}>Tu patrimonio total será {formatCompact(totalInvertido)}</Text>
          
          <View style={styles.chartContainer}>
            <LineChart
              areaChart
              curved
              data={lineDataInversion}
              data2={lineDataAhorro}
              width={chartAvailableWidth}
              height={220}
              spacing={dynamicSpacing}
              initialSpacing={0}
              endSpacing={0}
              maxValue={chartMaxValue}
              color1={Colors.primary}
              color2="#94a3b8" // Un gris azulado elegante para tu dinero
              thickness1={4}
              thickness2={3}
              startFillColor1={Colors.primary}
              startFillColor2="#94a3b8"
              startOpacity1={0.4}
              startOpacity2={0.3}
              endOpacity1={0.02}
              endOpacity2={0.02}
              hideYAxisText
              hideAxesAndRules
              xAxisLabelTextStyle={{ color: Colors.textMuted, fontSize: 10, marginTop: 4 }}
              dataPointsRadius1={0} // Ocultar los puntos hace que la curva se vea mucho más limpia
              dataPointsRadius2={0}
              isAnimated
              animationDuration={1200}
              pointerConfig={{
                pointerStripColor: Colors.primary,
                pointerStripWidth: 2,
                pointerColor: Colors.primary,
                radius: 6,
                pointerLabelComponent: (items: any) => {
                  return (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipTitle}>Año {items[0]?.label.replace('A','')}</Text>
                      <View style={styles.tooltipDivider} />
                      <Text style={styles.tooltipLabel}>Inversión Total</Text>
                      <Text style={[styles.tooltipValue, { color: Colors.primary }]}>{formatCompact(items[0]?.value)}</Text>
                      
                      <Text style={[styles.tooltipLabel, { marginTop: 4 }]}>Tu Sueldo Aportado</Text>
                      <Text style={[styles.tooltipValue, { color: '#cbd5e1' }]}>{formatCompact(items[1]?.value)}</Text>
                    </View>
                  );
                },
                pointerLabelWidth: 120,
                pointerLabelHeight: 90,
                shiftY: -50,
                shiftX: -60,
              }}
            />
          </View>
        </View>

        {/* Resultados */}
        <View style={styles.resultsGrid}>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Sueldo Guardado</Text>
            <Text style={styles.resultValue} adjustsFontSizeToFit numberOfLines={1}>{formatCompact(totalAhorrado)}</Text>
          </View>
          <View style={[styles.resultCard, { borderColor: Colors.primary, backgroundColor: `${Colors.primary}08` }]}>
            <Text style={[styles.resultLabel, { color: Colors.primary }]}>Valor Final</Text>
            <Text style={[styles.resultValue, { color: Colors.primary }]} adjustsFontSizeToFit numberOfLines={1}>{formatCompact(totalInvertido)}</Text>
          </View>
        </View>

        <View style={styles.profitBadge}>
          <Ionicons name="trending-up" size={20} color="#FFFFFF" />
          <Text style={styles.profitText}>
            +{formatCompact(gananciaNeta)} generados por intereses
          </Text>
        </View>

        {/* Controles */}
        <Text style={styles.sectionTitle}>Ajusta tu estrategia</Text>
        <View style={styles.controlsCard}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Aporte Mensual (Tu Sueldo en COP)</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric" 
              value={contribution} 
              onChangeText={setContribution} 
              placeholder="Ej: 500000"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <View style={styles.rowFields}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Tasa Anual (%)</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                value={annualRate} 
                onChangeText={setAnnualRate} 
                placeholder="Ej: 12"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Plazo (Años)</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="numeric" 
                value={years} 
                onChangeText={setYears} 
                placeholder="Ej: 5"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  legendContainer: { flexDirection: 'row', gap: 16, marginBottom: 16, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendLine: { width: 16, height: 4, borderRadius: 2 },
  legendText: { fontSize: 12, color: Colors.textMuted, fontWeight: '700' },

  chartCard: { 
    backgroundColor: Colors.card, 
    borderRadius: 24, 
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 16, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(0,0,0,0.03)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 12 },
      android: { elevation: 3 },
    }),
  },
  chartTitle: { fontSize: 20, fontWeight: "900", color: Colors.text, letterSpacing: -0.5, marginBottom: 2, paddingHorizontal: 4 },
  chartSubtitle: { fontSize: 14, color: Colors.primary, fontWeight: '700', marginBottom: 24, paddingHorizontal: 4 },
  chartContainer: { 
    marginLeft: -10, // Compensa el padding interno
  },
  
  resultsGrid: { flexDirection: "row", gap: 12, marginBottom: 16 },
  resultCard: { 
    flex: 1, 
    backgroundColor: Colors.card, 
    borderRadius: 20, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(0,0,0,0.03)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  resultLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 6, fontWeight: '700', textTransform: 'uppercase' },
  resultValue: { fontSize: 22, fontWeight: "800", color: Colors.text },
  
  profitBadge: { flexDirection: "row", backgroundColor: Colors.text, padding: 16, borderRadius: 16, justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 28 },
  profitText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  
  sectionTitle: { fontSize: 15, fontWeight: "800", color: Colors.text, marginBottom: 16, paddingLeft: 4, letterSpacing: -0.5 },
  controlsCard: { backgroundColor: Colors.card, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: Colors.border, gap: 16 },
  rowFields: { flexDirection: "row", gap: 12 },
  field: { gap: 8 },
  fieldLabel: { fontSize: 13, fontWeight: "700", color: Colors.textMuted },
  input: { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 16, fontSize: 16, fontWeight: "700", color: Colors.text },

  tooltip: {
    backgroundColor: '#1f2937', 
    padding: 12,
    borderRadius: 14, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    minWidth: 120,
  },
  tooltipTitle: { color: '#ffffff', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  tooltipDivider: { height: 1, backgroundColor: '#374151', marginVertical: 8 },
  tooltipLabel: { color: '#9ca3af', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  tooltipValue: { fontSize: 15, fontWeight: '900' }
});