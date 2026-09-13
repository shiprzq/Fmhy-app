import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Dimensions, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

// Floating particle component
function FloatingParticle({ delay, x, size, duration }: { delay: number; x: number; size: number; duration: number }) {
  const translateY = useSharedValue(height + 50);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-50, { duration, easing: Easing.linear }, () => {
            opacity.value = 0;
          })
        ),
        -1,
        false
      )
    );
    opacity.value = withDelay(delay, withTiming(0.3, { duration: 1000 }));
    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration: duration / 2, easing: Easing.linear }), -1, false)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: x,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

// Pulsing ring component
function PulsingRing({ delay, size }: { delay: number; size: number }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 2000, easing: Easing.out(Easing.ease) }),
          withTiming(0.8, { duration: 2000, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.15, { duration: 2000, easing: Easing.out(Easing.ease) }),
          withTiming(0.05, { duration: 2000, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (!fontsLoaded) {
    return null;
  }

  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: i * 800,
    x: Math.random() * width,
    size: 4 + Math.random() * 8,
    duration: 8000 + Math.random() * 6000,
  }));

  const openLink = () => {
    Linking.openURL('https://fmhy.net');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background gradient layers */}
      <View style={styles.bgLayer1} />
      <View style={styles.bgLayer2} />
      <View style={styles.bgLayer3} />

      {/* Floating particles */}
      {particles.map((p) => (
        <FloatingParticle key={p.id} delay={p.delay} x={p.x} size={p.size} duration={p.duration} />
      ))}

      {/* Pulsing rings behind logo */}
      <View style={styles.ringsContainer}>
        <PulsingRing delay={0} size={280} />
        <PulsingRing delay={700} size={360} />
        <PulsingRing delay={1400} size={440} />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo / Icon area */}
        <Animated.View entering={FadeInDown.duration(1000).springify()} style={styles.logoContainer}>
          <Animated.View style={[styles.glowCircle, glowStyle]} />
          <View style={styles.logoCircle}>
            <Ionicons name="people" size={64} color="#fff" />
          </View>
        </Animated.View>

        {/* App name */}
        <Animated.View entering={FadeIn.delay(300).duration(800)}>
          <Text style={styles.appName}>fmhy</Text>
        </Animated.View>

        {/* Main message */}
        <Animated.View entering={FadeInUp.delay(600).duration(800).springify()} style={styles.messageContainer}>
          <Text style={styles.mainMessage}>
            Join the FMHY community :)
          </Text>
          <Text style={styles.subMessage}>
            The largest collection of free stuff on the internet — curated by an amazing community of enthusiasts.
          </Text>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View entering={FadeInUp.delay(900).duration(800).springify()} style={styles.buttonContainer}>
          <TouchableOpacity style={styles.ctaButton} onPress={openLink} activeOpacity={0.85}>
            <View style={styles.buttonInner}>
              <Ionicons name="globe-outline" size={22} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Visit fmhy.net</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonArrow} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Secondary link text */}
        <Animated.View entering={FadeIn.delay(1200).duration(800)}>
          <TouchableOpacity onPress={openLink} activeOpacity={0.7}>
            <Text style={styles.linkText}>https://fmhy.net</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.View entering={FadeIn.delay(1500).duration(800)} style={styles.footer}>
          <Ionicons name="heart" size={14} color="#7c5cfc" />
          <Text style={styles.footerText}> Made with love by the community</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // Background layers for gradient effect
  bgLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0a0a1a',
  },
  bgLayer2: {
    position: 'absolute',
    top: -height * 0.3,
    left: -width * 0.3,
    width: width * 1.6,
    height: width * 1.6,
    borderRadius: width * 0.8,
    backgroundColor: 'rgba(99, 55, 255, 0.08)',
  },
  bgLayer3: {
    position: 'absolute',
    bottom: -height * 0.2,
    right: -width * 0.4,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(55, 180, 255, 0.06)',
  },
  // Particles
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(124, 92, 252, 0.5)',
  },
  // Rings
  ringsContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(124, 92, 252, 0.3)',
  },
  // Content
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    maxWidth: 500,
  },
  // Logo
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  glowCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(124, 92, 252, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#7c5cfc',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 40,
      },
      android: {
        elevation: 20,
      },
      default: {
        boxShadow: '0 0 60px rgba(124, 92, 252, 0.6)',
      },
    }),
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(124, 92, 252, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(124, 92, 252, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Text
  appName: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 4,
    marginBottom: 24,
    textTransform: 'lowercase',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainMessage: {
    fontSize: 26,
    fontWeight: '700',
    color: '#e8e0ff',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 36,
  },
  subMessage: {
    fontSize: 15,
    color: 'rgba(200, 190, 230, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 340,
  },
  // Button
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#7c5cfc',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
      default: {
        boxShadow: '0 8px 30px rgba(124, 92, 252, 0.3)',
      },
    }),
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c5cfc',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  buttonArrow: {
    marginLeft: 10,
  },
  // Link
  linkText: {
    fontSize: 14,
    color: 'rgba(124, 92, 252, 0.8)',
    textDecorationLine: 'underline',
    marginBottom: 40,
  },
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(200, 190, 230, 0.5)',
  },
});
