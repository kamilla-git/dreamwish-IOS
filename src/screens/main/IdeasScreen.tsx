import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft, Gift, Search, Compass, User, Lightbulb } from 'lucide-react-native';
import { colors } from '../../theme/colors';

const CATEGORIES = [
  { id: 'tech', name: 'Гаджеты' },
  { id: 'home', name: 'Дом и уют' },
  { id: 'hobby', name: 'Хобби' },
  { id: 'travel', name: 'Путешествия' },
  { id: 'creative', name: 'Творчество' }
];

const IDEAS = [
  { category: 'tech', title: 'Яндекс Станция Миди', price: '14 990 ₽', desc: 'Умная колонка с Zigbee и Zigbee хабом.' },
  { category: 'tech', title: 'Наушники Sony WH-1000XM5', price: '32 000 ₽', desc: 'Лучшее шумоподавление для работы.' },
  { category: 'home', title: 'Плед крупной вязки', price: '4 500 ₽', desc: 'Уютный подарок для зимних вечеров.' },
  { category: 'home', title: 'Набор свечей с ароматом кожи', price: '2 800 ₽', desc: 'Стильный акцент в интерьере.' },
  { category: 'hobby', title: 'Набор для рисования по номерам', price: '1 200 ₽', desc: 'Медитативное занятие на выходные.' },
  { category: 'travel', title: 'Чемодан для ручной клади Xiaomi', price: '6 500 ₽', desc: 'Надежный спутник в поездках.' },
  { category: 'creative', title: 'Фотоаппарат Fujifilm Instax', price: '9 800 ₽', desc: 'Моментальные снимки для памяти.' }
];

export default function IdeasScreen({ navigation }: any) {
  const [selectedCat, setSelectedCat] = useState('tech');
  const filtered = IDEAS.filter(i => i.category === selectedCat);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color={colors.gold[400]} size={24} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Идеи</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={styles.badge}>
            <Lightbulb color={colors.gold[400]} size={16} />
            <Text style={styles.badgeText}>GIFT IDEAS 2026</Text>
          </View>
          <Text style={styles.titleLarge}>Что подарить?</Text>
        </View>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => setSelectedCat(cat.id)}
                style={[styles.catBtn, selectedCat === cat.id && styles.catBtnActive]}
              >
                <Text style={[styles.catBtnText, selectedCat === cat.id && styles.catBtnTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100 }}>
          {filtered.map((idea, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}><Gift color={colors.gold[400]} size={24} /></View>
                <Text style={styles.priceText}>{idea.price}</Text>
              </View>
              <Text style={styles.cardTitle}>{idea.title}</Text>
              <Text style={styles.cardDesc}>{idea.desc}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MyLists')}>
                <Text style={styles.addText}>ДОБАВИТЬ В СПИСОК →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.emerald[950] },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  navTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(251, 191, 36, 0.1)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 10 },
  badgeText: { color: colors.gold[400], fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  titleLarge: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  catScroll: { paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  catBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.emerald[800], backgroundColor: colors.emerald[900] },
  catBtnActive: { backgroundColor: 'rgba(251, 191, 36, 0.1)', borderColor: colors.gold[400] },
  catBtnText: { color: colors.emerald[400], fontWeight: 'bold' },
  catBtnTextActive: { color: 'white' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  card: { backgroundColor: 'rgba(2, 44, 34, 0.4)', borderRadius: 20, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.1)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  iconBox: { backgroundColor: 'rgba(2, 44, 34, 0.8)', padding: 10, borderRadius: 15 },
  priceText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cardTitle: { color: colors.gold[200], fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  cardDesc: { color: 'rgba(52, 211, 153, 0.7)', fontSize: 14, marginBottom: 15 },
  addText: { color: colors.gold[400], fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
});