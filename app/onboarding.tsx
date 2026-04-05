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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";

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
    title: "Track Every Activity",
    body: "Log planting, watering, fertilizing, and more under 30 seconds. Never lose track of your farm work again",
    illustration: "tracking",
  },
  {
    id: "2",
    title: "See Where Your Money Goes",
    body: "Get visual reports on expenses, yields, and crop performance. Make data-driven decisions for better harvests.",
    illustration: "ai",
  },
  {
    id: "3",
    title: "AI-Powered Farming Advice",
    body: "Get smart recommendations tailored to your crops, weather, and soil conditions. It's like having an exoert in your pocket.",
    illustration: "harvest",
  },
];

// ── Illustrations ────────────────────────────────────────
function TrackingIllustration() {
  return (
    <LinearGradient
      colors={["#e8f8f0", "#d4f5e5", "#e8f8f0"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={StyleSheet.absoluteFillObject} // ← fills the parent completely
    >
      <Svg style={{ flex: 1 }} width="100%" height="100%">
        <Defs>
          <RadialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#5ecfb1" stopOpacity="0.55" />
            <Stop offset="60%" stopColor="#85ddc0" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#b2edd4" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="50%" cy="50%" rx="40%" ry="40%" fill="url(#glow1)" />
      </Svg>

      <Image
        source={require("../assets/icons/Phone.png")}
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          resizeMode: "contain",
          alignSelf: "center",
          top: "50%",
          transform: [{ translateY: -110 }], // half of height to truly center
        }}
      />
      <Image
        source={require("../assets/icons/tracking_badge.png")}
        style={{
          position: "absolute",
          width: 60,
          height: 60,
          resizeMode: "contain",
          right: "15%",
          top: "50%",
          transform: [{ translateY: -30 }],
        }}
      />
    </LinearGradient>
  );
}

function ReportIllustration() {
  return (
    <LinearGradient
      colors={["#fffef5", "#f9f0a8", "#fffef5"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={StyleSheet.absoluteFillObject}
    >
      <Svg style={{ flex: 1 }} width="100%" height="100%">
        <Defs>
          <RadialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#f5e97a" stopOpacity="0.65" />
            <Stop offset="55%" stopColor="#f7eda0" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#fdf9d0" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="50%" cy="50%" rx="40%" ry="40%" fill="url(#glow2)" />
      </Svg>

      <Image
        source={require("../assets/icons/Reports_phone.png")}
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          resizeMode: "contain",
          alignSelf: "center",
          top: "50%",
          transform: [{ translateY: -110 }], // half of height to truly center
        }}
      />
      <Image
        source={require("../assets/icons/Reports_badge.png")}
        style={{
          position: "absolute",
          width: 60,
          height: 60,
          resizeMode: "contain",
          right: "15%",
          top: "60%",
          transform: [{ translateY: -30 }],
        }}
      />
    </LinearGradient>
  );
}

function AiIllustration() {
  const crops = [
    { label: "Tomatoes", bg: "#FEF3C7", text: "#92400E", pct: 40 },
    { label: "Peppers", bg: "#FEE2E2", text: "#991B1B", pct: 35 },
    { label: "Lettuce", bg: "#E8F5E9", text: PRIMARY, pct: 25 },
  ];
  return (
    <LinearGradient
      colors={["#e8f8f0", "#d4f5e5", "#e8f8f0"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={StyleSheet.absoluteFillObject} // ← fills the parent completely
    >
      <Svg style={{ flex: 1 }} width="100%" height="100%">
        <Defs>
          <RadialGradient id="glow3" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#5ecfb1" stopOpacity="0.55" />
            <Stop offset="60%" stopColor="#85ddc0" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#b2edd4" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="50%" cy="50%" rx="40%" ry="40%" fill="url(#glow3)" />
      </Svg>

      <Image
        source={require("../assets/icons/AI_phone.png")}
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          resizeMode: "contain",
          alignSelf: "center",
          top: "50%",
          transform: [{ translateY: -110 }], // half of height to truly center
        }}
      />
      <Image
        source={require("../assets/icons/AI_badge.png")}
        style={{
          position: "absolute",
          width: 60,
          height: 60,
          resizeMode: "contain",
          right: "12%",
          top: "30%",
          transform: [{ translateY: -30 }],
        }}
      />
    </LinearGradient>
  );
}

const ILLUSTRATIONS = [
  TrackingIllustration,
  ReportIllustration,
  AiIllustration,
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
    <View style={ob.safe}>
      {/* Skip */}
      <TouchableOpacity style={ob.skip} onPress={finish}>
        <Text style={ob.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <View style={{ height: H * 0.55 }}>
        <FlatList
          ref={ref}
          data={SLIDES}
          keyExtractor={(s) => s.id}
          renderItem={({ item, index }) => <Slide item={item} index={index} />}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          style={{ height: H * 0.15 }}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) =>
            setActive(Math.round(e.nativeEvent.contentOffset.x / W))
          }
        />
      </View>

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
    </View>
  );
}

// ── Illustration styles ───────────────────────────────────
const il = StyleSheet.create({
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
  },
  illustrationBox: {
    width: "100%",
    backgroundColor: "aquamarine",
    height: "100%",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
    position: "absolute",
    top: 50,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    zIndex: 1000,
  },
  skipText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 64,
    paddingTop: 64,
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
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    letterSpacing: 0.3,
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
