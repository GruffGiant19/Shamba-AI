import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width: W, height: H } = Dimensions.get("window");
const PRIMARY = "#1B4332";
const PRIMARY_LIGHT = "#2D6A4F";
const PRIMARY_TINT = "#E8F5E9";
const ACCENT = "#F59E0B";
const BACKGROUND = "#f2f2eb";
const SURFACE = "#FFFFFF";

const SLIDES = [
  {
    id: "1",
    title: "Smart Farm Management",
    body: "Track planting, watering, and harvesting activities with ease. Grow smarter, not harder.",
    illustration: "planting",
  },
  {
    id: "2",
    title: "AI-Powered Insights",
    body: "Get intelligent recommendations for optimal planting times, watering schedules, and crop care.",
    illustration: "ai",
  },
  {
    id: "3",
    title: "Complete Farm Tracking",
    body: "Monitor all your farming activities from seed to harvest. Maximize your yield potential.",
    illustration: "harvest",
  },
];

// ── Illustrations ────────────────────────────────────────
function PlantingIllustration() {
  return (
    <View style={il.wrapper}>
      <View style={il.phone}>
        <View style={il.phoneScreen}>
          <View style={il.farmCard}>
            <Text style={il.cardTitle}>Today's Activities</Text>
            <View style={il.activityRow}>
              <Ionicons name="leaf-outline" size={16} color={PRIMARY} />
              <Text style={il.activityText}>Planting - 2 beds</Text>
            </View>
            <View style={il.activityRow}>
              <Ionicons name="water-outline" size={16} color="#3B82F6" />
              <Text style={il.activityText}>Watering - Zone A</Text>
            </View>
            <View style={il.activityRow}>
              <Ionicons name="flask-outline" size={16} color={ACCENT} />
              <Text style={il.activityText}>Fertilizing - Tomatoes</Text>
            </View>
          </View>
          {/* Mock farm stats */}
          <View style={il.statsContainer}>
            <View style={il.statItem}>
              <Text style={il.statNumber}>12</Text>
              <Text style={il.statLabel}>Active Crops</Text>
            </View>
            <View style={il.statItem}>
              <Text style={il.statNumber}>85%</Text>
              <Text style={il.statLabel}>Health Rate</Text>
            </View>
            <View style={il.statItem}>
              <Text style={il.statNumber}>3</Text>
              <Text style={il.statLabel}>Days to Harvest</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={il.badge}>
        <Ionicons name="leaf" size={20} color="#FFFFFF" />
      </View>
    </View>
  );
}

function AiIllustration() {
  return (
    <View style={il.wrapper}>
      <View style={il.phone}>
        <View style={il.phoneScreen}>
          <View style={il.aiCard}>
            <Text style={il.aiTitle}>🌱 AI Recommendation</Text>
            <Text style={il.aiBody}>
              Based on weather patterns and soil moisture,{"\n"}optimal watering
              time: 6:00 AM today
            </Text>
          </View>
          <Text style={il.arrow}>↓</Text>
          <View style={il.parsedCard}>
            <Text style={il.parsedLabel}>Action Plan</Text>
            <Text style={il.parsedRow}>
              Time <Text style={il.parsedVal}>6:00 AM</Text>
            </Text>
            <Text style={il.parsedRow}>
              Duration <Text style={il.parsedVal}>15 mins</Text>
            </Text>
            <Text style={il.parsedRow}>
              Zones <Text style={il.parsedVal}>A, B, C</Text>
            </Text>
          </View>
        </View>
      </View>
      <View style={[il.badge, { backgroundColor: PRIMARY_TINT }]}>
        <Text style={[il.badgeText, { color: PRIMARY, fontSize: 12 }]}>AI</Text>
      </View>
    </View>
  );
}

function HarvestIllustration() {
  const crops = [
    { label: "Tomatoes", bg: "#FEF3C7", text: "#92400E", pct: 40 },
    { label: "Peppers", bg: "#FEE2E2", text: "#991B1B", pct: 35 },
    { label: "Lettuce", bg: "#E8F5E9", text: PRIMARY, pct: 25 },
  ];
  return (
    <View style={il.wrapper}>
      <View style={il.phone}>
        <View style={il.phoneScreen}>
          <Text style={il.netHeading}>Harvest Ready</Text>
          {crops.map((crop) => (
            <View key={crop.label} style={il.netRow}>
              <View style={[il.netBadge, { backgroundColor: crop.bg }]}>
                <Text style={[il.netBadgeText, { color: crop.text }]}>
                  {crop.label}
                </Text>
              </View>
              <View style={il.netBarBg}>
                <View
                  style={[
                    il.netBarFill,
                    { backgroundColor: crop.text, width: crop.pct },
                  ]}
                />
              </View>
              <Text style={[il.netPct, { color: crop.text }]}>{crop.pct}%</Text>
            </View>
          ))}
          <View style={il.checkRow}>
            <View style={[il.check, { backgroundColor: PRIMARY_TINT }]}>
              <Ionicons name="checkmark" size={12} color={PRIMARY} />
            </View>
            <Text style={il.checkText}>All crops tracked</Text>
          </View>
        </View>
      </View>
      <View style={il.badge}>
        <Ionicons name="basket-outline" size={20} color="#FFFFFF" />
      </View>
    </View>
  );
}

const ILLUSTRATIONS = [
  PlantingIllustration,
  AiIllustration,
  HarvestIllustration,
];

// ── Slide ────────────────────────────────────────────────
function Slide({ item, index }: { item: (typeof SLIDES)[0]; index: number }) {
  const Illustration = ILLUSTRATIONS[index];
  return (
    <View style={[slide.root, { width: W }]}>
      <View style={slide.illustrationBox}>
        <Illustration />
      </View>
    </View>
  );
}

// ── Main ─────────────────────────────────────────────────
export default function OnboardingScreen() {
  const [active, setActive] = useState(0);
  const ref = useRef<FlatList>(null);

  const next = () => {
    if (active < SLIDES.length - 1) {
      ref.current?.scrollToIndex({ index: active + 1 });
      setActive(active + 1);
    } else {
      finish();
    }
  };

  const finish = async () => {
    await AsyncStorage.setItem("onboarding_done", "true");
    router.replace("/auth/splash");
  };

  const isLast = active === SLIDES.length - 1;

  return (
    <SafeAreaView style={ob.safe}>
      {/* Skip */}
      <TouchableOpacity style={ob.skip} onPress={finish}>
        <Text style={ob.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={ref}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        renderItem={({ item, index }) => <Slide item={item} index={index} />}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setActive(Math.round(e.nativeEvent.contentOffset.x / W))
        }
      />

      {/* Bottom */}
      <View style={ob.bottom}>
        <Text style={ob.title}>{SLIDES[active].title}</Text>
        <Text style={ob.body}>{SLIDES[active].body}</Text>

        {/* Dots */}
        <View style={ob.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[ob.dot, i === active && ob.dotActive]} />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity style={ob.btn} onPress={next} activeOpacity={0.85}>
          <Text style={ob.btnText}>{isLast ? "Get started" : "Next"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Illustration styles ───────────────────────────────────
const il = StyleSheet.create({
  wrapper: {
    width: W * 0.78,
    height: H * 0.42,
    alignItems: "center",
    justifyContent: "center",
  },
  phone: {
    width: 200,
    height: 320,
    backgroundColor: "#1A1A2E",
    borderRadius: 28,
    padding: 12,
    borderWidth: 3,
    borderColor: "#333",
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: BACKGROUND,
    borderRadius: 18,
    padding: 10,
    overflow: "hidden",
  },
  // Farm/Planting slide styles
  farmCard: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 6,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  activityText: {
    fontSize: 7.5,
    color: "rgba(255,255,255,0.8)",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 12,
    fontWeight: "800",
    color: PRIMARY,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 6,
    color: "#6B7280",
    textAlign: "center",
  },
  // AI slide styles
  aiCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
  },
  aiTitle: {
    fontSize: 8,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 3,
  },
  aiBody: { fontSize: 7, color: "#6B7280", lineHeight: 11 },
  arrow: { textAlign: "center", fontSize: 14, color: PRIMARY, marginBottom: 4 },
  parsedCard: {
    backgroundColor: PRIMARY_TINT,
    borderRadius: 10,
    padding: 8,
  },
  parsedLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 4,
  },
  parsedRow: { fontSize: 7.5, color: "#1A1A1A", marginBottom: 2 },
  parsedVal: { fontWeight: "700", color: PRIMARY },
  // Harvest slide styles
  netHeading: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  netRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 5,
  },
  netBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5 },
  netBadgeText: { fontSize: 7, fontWeight: "700" },
  netBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  netBarFill: { height: 6, borderRadius: 3, opacity: 0.7 },
  netPct: { fontSize: 7, fontWeight: "600", width: 24 },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { fontSize: 8, color: "#1A1A1A" },
  // Badge
  badge: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
});

// ── Slide styles ─────────────────────────────────────────
const slide = StyleSheet.create({
  root: {
    alignItems: "center",
    paddingTop: 16,
  },
  illustrationBox: {
    width: W * 0.78,
    height: H * 0.42,
    backgroundColor: SURFACE,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

// ── Onboarding styles ─────────────────────────────────────
const ob = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  skip: {
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  dotActive: {
    width: 24,
    backgroundColor: PRIMARY,
  },
  btn: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
