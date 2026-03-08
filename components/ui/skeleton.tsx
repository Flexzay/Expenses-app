import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../../constants/colors";

type SkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Skeleton({ width = "100%", height = 16, borderRadius = 8, style }: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = shimmer.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.35, 0.7, 0.35] });
  return (
    <Animated.View
      style={[{ width: width as any, height, borderRadius, backgroundColor: Colors.border, opacity }, style]}
    />
  );
}

// HOME SKELETON
export function HomeSkeleton() {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const op = (i = 0) =>
    shimmer.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3 + i * 0.05, 0.75, 0.3 + i * 0.05] });

  return (
    <View style={hs.wrap}>
      <View style={hs.greetRow}>
        <View style={hs.greetLeft}>
          <Animated.View style={[hs.chip, { opacity: op(0) }]} />
          <Animated.View style={[hs.greeting, { opacity: op(1) }]} />
          <Animated.View style={[hs.subGreeting, { opacity: op(2) }]} />
        </View>
        <Animated.View style={[hs.avatarCircle, { opacity: op(0) }]} />
      </View>

      <Animated.View style={[hs.budgetCard, { opacity: op(1) }]}>
        <View style={hs.budgetInner}>
          <Animated.View style={[hs.budgetSmall, { opacity: op(2) }]} />
          <Animated.View style={[hs.budgetBig, { opacity: op(3) }]} />
          <Animated.View style={[hs.budgetBar, { opacity: op(2) }]} />
          <View style={hs.budgetFooter}>
            <Animated.View style={[hs.budgetPill, { opacity: op(1) }]} />
            <Animated.View style={[hs.budgetPillSm, { opacity: op(1) }]} />
          </View>
        </View>
        <Animated.View style={[hs.budgetBadge, { opacity: op(2) }]} />
      </Animated.View>

      <View style={hs.statsRow}>
        {[0, 1, 2].map((i) => (
          <Animated.View key={i} style={[hs.statCard, { opacity: op(i) }]}>
            <Animated.View style={[hs.statIcon, { opacity: op(i + 1) }]} />
            <Animated.View style={[hs.statVal, { opacity: op(i) }]} />
            <Animated.View style={[hs.statLbl, { opacity: op(i) }]} />
          </Animated.View>
        ))}
      </View>

      <View style={hs.secHeader}>
        <Animated.View style={[hs.secTitle, { opacity: op(1) }]} />
        <Animated.View style={[hs.secLink, { opacity: op(1) }]} />
      </View>

      {[0, 1, 2, 3].map((i) => (
        <Animated.View key={i} style={[hs.expRow, { opacity: op(i % 3) }]}>
          <Animated.View style={[hs.expIcon, { opacity: op(i + 1) }]} />
          <View style={{ flex: 1, gap: 7 }}>
            <Animated.View style={[hs.expTitle, { width: `${55 + i * 8}%` as any, opacity: op(i) }]} />
            <Animated.View style={[hs.expCat, { opacity: op(i + 1) }]} />
          </View>
          <View style={{ alignItems: "flex-end", gap: 7 }}>
            <Animated.View style={[hs.expAmt, { opacity: op(i) }]} />
            <Animated.View style={[hs.expDate, { opacity: op(i + 1) }]} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const hs = StyleSheet.create({
  wrap: { padding: 20, paddingTop: 8 },
  greetRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 },
  greetLeft: { gap: 8 },
  chip: { width: 60, height: 10, borderRadius: 20, backgroundColor: Colors.border },
  greeting: { width: 180, height: 22, borderRadius: 8, backgroundColor: Colors.border },
  subGreeting: { width: 110, height: 13, borderRadius: 6, backgroundColor: Colors.border },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.border },
  budgetCard: {
    borderRadius: 24, backgroundColor: Colors.border, padding: 22, marginBottom: 16,
    flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", minHeight: 140,
  },
  budgetInner: { flex: 1, gap: 10 },
  budgetSmall: { width: 100, height: 12, borderRadius: 6, backgroundColor: "rgba(0,0,0,0.08)" },
  budgetBig: { width: 170, height: 32, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.1)" },
  budgetBar: { width: "90%", height: 8, borderRadius: 999, backgroundColor: "rgba(0,0,0,0.08)" },
  budgetFooter: { flexDirection: "row", justifyContent: "space-between" },
  budgetPill: { width: 70, height: 11, borderRadius: 6, backgroundColor: "rgba(0,0,0,0.08)" },
  budgetPillSm: { width: 110, height: 11, borderRadius: 6, backgroundColor: "rgba(0,0,0,0.08)" },
  budgetBadge: { width: 80, height: 56, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.08)", marginLeft: 12 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.border,
    padding: 14, alignItems: "center", gap: 6, minHeight: 90,
  },
  statIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.border },
  statVal: { width: "75%", height: 13, borderRadius: 6, backgroundColor: Colors.border },
  statLbl: { width: "55%", height: 11, borderRadius: 6, backgroundColor: Colors.border },
  secHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  secTitle: { width: 120, height: 16, borderRadius: 6, backgroundColor: Colors.border },
  secLink: { width: 58, height: 13, borderRadius: 6, backgroundColor: Colors.border },
  expRow: {
    flexDirection: "row", alignItems: "center", borderRadius: 16, padding: 14,
    marginBottom: 10, borderWidth: 1.5, borderColor: Colors.border, gap: 12,
  },
  expIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: Colors.border },
  expTitle: { height: 14, borderRadius: 6, backgroundColor: Colors.border },
  expCat: { width: "38%", height: 11, borderRadius: 6, backgroundColor: Colors.border },
  expAmt: { width: 72, height: 15, borderRadius: 6, backgroundColor: Colors.border },
  expDate: { width: 38, height: 11, borderRadius: 6, backgroundColor: Colors.border },
});

// PROFILE SKELETON
export function ProfileSkeleton() {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 950, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 950, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const op = (i = 0) =>
    shimmer.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3 + i * 0.04, 0.75, 0.3 + i * 0.04] });

  return (
    <View style={ps.wrap}>
      <View style={ps.avatarSection}>
        <View style={ps.avatarRing}>
          <Animated.View style={[ps.avatarCircle, { opacity: op(0) }]} />
        </View>
        <Animated.View style={[ps.nameBar, { opacity: op(1) }]} />
        <Animated.View style={[ps.emailBar, { opacity: op(2) }]} />
      </View>

      <Animated.View style={[ps.labelBar, { width: 70, opacity: op(1) }]} />
      <Animated.View style={[ps.card, { opacity: op(2) }]}>
        <View style={ps.cardRow}>
          <Animated.View style={[ps.cardIcon, { opacity: op(3) }]} />
          <View style={{ flex: 1, gap: 8 }}>
            <Animated.View style={[ps.cardSub, { opacity: op(2) }]} />
            <Animated.View style={[ps.cardVal, { opacity: op(1) }]} />
          </View>
          <Animated.View style={[ps.cardBtn, { opacity: op(2) }]} />
        </View>
      </Animated.View>

      <Animated.View style={[ps.labelBar, { width: 90, opacity: op(1) }]} />
      <Animated.View style={[ps.card, { opacity: op(2) }]}>
        {[
          { lineW: "35%", valW: "55%" },
          { lineW: "25%", valW: "65%" },
          { lineW: "40%", valW: "45%" },
        ].map((row, i) => (
          <View key={i}>
            <View style={ps.infoRow}>
              <Animated.View style={[ps.infoIcon, { opacity: op(i + 1) }]} />
              <View style={{ flex: 1, gap: 6 }}>
                <Animated.View style={[ps.infoLbl, { width: row.lineW as any, opacity: op(i) }]} />
                <Animated.View style={[ps.infoVal, { width: row.valW as any, opacity: op(i + 1) }]} />
              </View>
            </View>
            {i < 2 && <Animated.View style={[ps.divider, { opacity: op(0) }]} />}
          </View>
        ))}
      </Animated.View>

      <Animated.View style={[ps.labelBar, { width: 55, opacity: op(1) }]} />
      <Animated.View style={[ps.card, { opacity: op(2) }]}>
        <View style={ps.infoRow}>
          <Animated.View style={[ps.infoIcon, { opacity: op(1) }]} />
          <Animated.View style={[{ flex: 1, height: 15, borderRadius: 6, backgroundColor: Colors.border } as any, { opacity: op(2) }]} />
          <Animated.View style={[ps.chevron, { opacity: op(1) }]} />
        </View>
      </Animated.View>

      <Animated.View style={[ps.logoutBar, { opacity: op(2) }]} />
    </View>
  );
}

const ps = StyleSheet.create({
  wrap: { padding: 20, paddingTop: 24 },
  avatarSection: { alignItems: "center", marginBottom: 28 },
  avatarRing: {
    width: 84, height: 84, borderRadius: 42,
    borderWidth: 2, borderColor: Colors.border,
    justifyContent: "center", alignItems: "center", marginBottom: 14,
  },
  avatarCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: Colors.border },
  nameBar: { width: 150, height: 20, borderRadius: 8, backgroundColor: Colors.border, marginBottom: 8 },
  emailBar: { width: 195, height: 13, borderRadius: 6, backgroundColor: Colors.border },
  labelBar: { height: 12, borderRadius: 6, backgroundColor: Colors.border, marginBottom: 10, marginTop: 4 },
  card: { borderRadius: 18, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 16, marginBottom: 20 },
  cardRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, gap: 12 },
  cardIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: Colors.border },
  cardSub: { width: "55%", height: 12, borderRadius: 6, backgroundColor: Colors.border },
  cardVal: { width: "35%", height: 20, borderRadius: 7, backgroundColor: Colors.border },
  cardBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.border },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 12 },
  infoIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.border },
  infoLbl: { height: 11, borderRadius: 5, backgroundColor: Colors.border },
  infoVal: { height: 14, borderRadius: 6, backgroundColor: Colors.border },
  divider: { height: 1, backgroundColor: Colors.border },
  chevron: { width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.border },
  logoutBar: { height: 48, borderRadius: 14, backgroundColor: Colors.border, marginTop: 8 },
});