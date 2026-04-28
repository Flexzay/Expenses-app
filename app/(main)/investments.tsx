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
  ActivityIndicator
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Header } from "../../components/ui/Header";
import { Colors } from "../../constants/colors";

const { width } = Dimensions.get("window");

function formatCompact(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${Math.round(n)}`;
}

export default function InvestmentsScreen() {
  // 1. Traemos los datos reales del Backend
  const { data: wealth, isLoading } = useWealthSummary();

  // 2. Estados del simulador
  const [contribution, setContribution] = useState("0"); 
  const [annualRate, setAnnualRate] = useState("12"); // 12% Anual por defecto
  const [years, setYears] = useState("5");

  const [lineDataInversion, setLineDataInversion] = useState<{value: number, label: string}[]>([]);
  const [lineDataAhorro, setLineDataAhorro] = useState<{value: number, label: string}[]>([]);
  
  const [totalInvertido, setTotalInvertido] = useState(0);
  const [totalAhorrado, setTotalAhorrado] = useState(0);

  // Sincronizar el aporte inicial con el dinero real que le sobra al usuario
  useEffect(() => {
    if (wealth && wealth.free_cash_flow > 0 && contribution === "0") {
      setContribution(wealth.free_cash_flow.toString());
    }
  }, [wealth]);

  // 3. Matemática Financiera: Recalcular gráfica cuando cambian los inputs
  useEffect(() => {
    const p = parseFloat(contribution) || 0; // Aporte mensual
    const r = (parseFloat(annualRate) || 0) / 100 / 12; // Tasa mensual
    const nYears = parseInt(years) || 0;
    
    let arrInversion = [];
    let arrAhorro = [];

    for (let i = 0; i <= nYears; i++) {
      const meses = i * 12;
      const ahorroLinea = p * meses;
      const inversion = r === 0 ? ahorroLinea : p * ((Math.pow(1 + r, meses) - 1) / r) * (1 + r);

      arrAhorro.push({ value: Math.round(ahorroLinea), label: `A${i}` });
      arrInversion.push({ value: Math.round(inversion), label: `A${i}` });

      if (i === nYears) {
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

  const gananciaNeta = totalInvertido - totalAhorrado;

  return (
    <View style={styles.container}>
      <Header title="Inversiones" subtitle="Proyector de Riqueza" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Contexto del usuario */}
        <View style={styles.contextCard}>
          <Ionicons name="wallet-outline" size={24} color={Colors.primary} />
          <Text style={styles.contextText}>
            Tu flujo de caja libre es <Text style={{fontWeight: '700'}}>{formatCOP(wealth?.free_cash_flow || 0)}</Text>. 
            Usa el simulador para ver cómo crecería este dinero si lo inviertes.
          </Text>
        </View>

        {/* Gráfica */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Proyección a {years} años</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={lineDataInversion}
              data2={lineDataAhorro}
              width={width - 80}
              height={200}
              color1={Colors.primary}
              color2={Colors.textMuted}
              thickness1={3}
              thickness2={2}
              startFillColor1={Colors.primary}
              endFillColor1={`${Colors.primary}10`}
              startOpacity={0.4}
              endOpacity={0.05}
              yAxisLabelTexts={Array.from({ length: 5 }).map((_, i) => formatCompact((totalInvertido / 4) * i))}
              yAxisTextStyle={{ color: Colors.textMuted, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: Colors.textMuted, fontSize: 10 }}
              dataPointsRadius1={4}
              dataPointsRadius2={0}
              hideRules
              yAxisColor="transparent"
              xAxisColor={Colors.border}
              areaChart
              isAnimated
            />
          </View>
        </View>

        {/* Resultados */}
        <View style={styles.resultsGrid}>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Ahorro Estático</Text>
            <Text style={styles.resultValue}>{formatCompact(totalAhorrado)}</Text>
          </View>
          <View style={[styles.resultCard, { borderColor: Colors.primary, backgroundColor: `${Colors.primary}08` }]}>
            <Text style={[styles.resultLabel, { color: Colors.primary }]}>Valor Invertido</Text>
            <Text style={[styles.resultValue, { color: Colors.primary }]}>{formatCompact(totalInvertido)}</Text>
          </View>
        </View>

        <View style={styles.profitBadge}>
          <Ionicons name="trending-up" size={18} color="#FFFFFF" />
          <Text style={styles.profitText}>
            Generarías {formatCOP(gananciaNeta)} en rendimientos
          </Text>
        </View>

        {/* Controles */}
        <Text style={styles.sectionTitle}>Variables</Text>
        <View style={styles.controlsCard}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Aporte Mensual (COP)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={contribution} onChangeText={setContribution} />
          </View>
          <View style={styles.rowFields}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Tasa EA (%)</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={annualRate} onChangeText={setAnnualRate} />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Plazo (Años)</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={years} onChangeText={setYears} />
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
  contextCard: { flexDirection: "row", backgroundColor: `${Colors.primary}15`, padding: 16, borderRadius: 16, marginBottom: 20, gap: 12, alignItems: "center" },
  contextText: { flex: 1, fontSize: 13, color: Colors.text, lineHeight: 20 },
  chartCard: { backgroundColor: Colors.card, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  chartTitle: { fontSize: 16, fontWeight: "800", color: Colors.text, marginBottom: 16 },
  chartContainer: { marginLeft: -10 },
  resultsGrid: { flexDirection: "row", gap: 12, marginBottom: 12 },
  resultCard: { flex: 1, backgroundColor: Colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  resultLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  resultValue: { fontSize: 20, fontWeight: "800", color: Colors.text },
  profitBadge: { flexDirection: "row", backgroundColor: Colors.accent, padding: 14, borderRadius: 14, justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 24 },
  profitText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: Colors.textMuted, textTransform: "uppercase", marginBottom: 12 },
  controlsCard: { backgroundColor: Colors.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border, gap: 16 },
  rowFields: { flexDirection: "row", gap: 12 },
  field: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: Colors.text },
  input: { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, fontSize: 16, fontWeight: "600", color: Colors.text }
});