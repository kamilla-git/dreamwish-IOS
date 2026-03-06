import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { Compass, Sparkles } from 'lucide-react-native';
import { colors } from '../../theme/colors';

export default function LandingScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1513885535751-8b9238bd3021?w=800' }} style={StyleSheet.absoluteFill} blurRadius={5} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(2, 44, 34, 0.85)' }]} />
      
      <SafeAreaView style={styles.content}>
        <Text style={styles.emojiLarge}>🌿</Text>
        <Text style={styles.heroTitle}>DreamWish</Text>
        <Text style={styles.heroSubtitle}>Дневник заветных желаний</Text>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.buttonGold} onPress={() => navigation.navigate('Explore')}>
            <Compass color={colors.emerald[950]} size={20} />
            <Text style={styles.buttonText}>ИССЛЕДОВАТЬ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonEmerald} onPress={() => navigation.navigate('Demo')}>
            <Sparkles color={colors.gold[400]} size={20} />
            <Text style={styles.buttonTextLight}>ДЕМО-РЕЖИМ</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonGhost} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonTextLight}>ВОЙТИ В ПОРТАЛ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.emerald[950] },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emojiLarge: { fontSize: 80, marginBottom: 20 },
  heroTitle: { color: colors.gold[400], fontSize: 42, fontWeight: 'bold' },
  heroSubtitle: { color: colors.emerald[400], textAlign: 'center', fontSize: 16, marginTop: 10, opacity: 0.8 },
  buttonGroup: { width: '100%', gap: 12, marginTop: 40 },
  buttonGold: { backgroundColor: colors.gold[400], padding: 18, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  buttonEmerald: { backgroundColor: colors.emerald[900], padding: 18, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)' },
  buttonGhost: { padding: 15, alignItems: 'center' },
  buttonText: { color: colors.emerald[950], fontWeight: 'bold', letterSpacing: 1 },
  buttonTextLight: { color: colors.gold[400], fontWeight: 'bold', letterSpacing: 1 },
});
