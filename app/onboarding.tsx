import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/colors";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    icon: "wallet-outline",
    title: "Controla tus gastos",
    subtitle: "Registra cada gasto por categoría y ten siempre claro en qué se va tu dinero.",
    color: Colors.primary,
  },
  {
    id: "2",
    icon: "people-outline",
    title: "Gastos compartidos",
    subtitle: "Agrega colaboradores y divide los gastos del hogar o del equipo fácilmente.",
    color: "#8B5CF6",
  },
  {
    id: "3",
    icon: "trending-up-outline",
    title: "Predice el futuro",
    subtitle: "Analiza tu historial y descubre cuánto vas a gastar el próximo mes antes de que ocurra.",
    color: "#10B981",
  },
  {
    id: "4",
    icon: "shield-checkmark-outline",
    title: "Tu presupuesto, seguro",
    subtitle: "Define un presupuesto mensual y recibe alertas cuando estés a punto de superarlo.",
    color: "#F59E0B",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLast = currentIndex === SLIDES.length - 1;

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (isLast) {
        router.replace("/welcome");
      } else {
        const next = currentIndex + 1;
        flatListRef.current?.scrollToIndex({ index: next });
        setCurrentIndex(next);
      }
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex]);

  const handleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isLast) {
      router.replace("/welcome");
    } else {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next });
      setCurrentIndex(next);
    }
  };

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    router.replace("/welcome");
  };

  return (
    <View style={styles.container}>

      {/* Espacio fijo arriba — evita que el layout salte en el último slide */}
      <View style={styles.topBar}>
        {!isLast && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Saltar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconCircleOuter, { backgroundColor: item.color + "18" }]}>
              <View style={[styles.iconCircleInner, { backgroundColor: item.color + "30" }]}>
                <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={52} color="#FFFFFF" />
                </View>
              </View>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: index === currentIndex ? 24 : 8,
                backgroundColor:
                  index === currentIndex ? Colors.primary : Colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Botón siguiente / comenzar */}
      <TouchableOpacity
        style={[styles.nextBtn, { backgroundColor: SLIDES[currentIndex].color }]}
        activeOpacity={0.85}
        onPress={handleNext}
      >
        <Text style={styles.nextText}>{isLast ? "Comenzar" : "Siguiente"}</Text>
        <Ionicons
          name={isLast ? "checkmark" : "arrow-forward"}
          size={20}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      {/* Link login — espacio fijo abajo para que no salte */}
      <View style={styles.bottomBar}>
        {isLast && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.loginLinkText}>
              ¿Ya tienes cuenta?{" "}
              <Text style={{ color: Colors.primary, fontWeight: "700" }}>
                Inicia sesión
              </Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  // Barra superior fija
  topBar: {
    width: "100%",
    height: 100,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  skipText: {
    fontSize: 15,
    color: Colors.textMuted,
    fontWeight: "500",
  },

  // Slide
  slide: {
    width,
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  iconCircleOuter: {
    width: 260,
    height: 260,
    borderRadius: 130,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
  },
  iconCircleInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    lineHeight: 24,
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: "auto",
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 999,
  },

  // Botón
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width - 48,
    paddingVertical: 16,
    borderRadius: 999,
    gap: 8,
  },
  nextText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Barra inferior fija
  bottomBar: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});