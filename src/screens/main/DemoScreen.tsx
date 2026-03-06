import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert, FlatList } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import GiftCardComponent from '../../components/GiftCard';
import { colors } from '../../theme/colors';

export default function DemoScreen({ navigation }: any) {
  const demoWishlist = {
    title: "Волшебное Демо",
    owner_username: "ForestSpirit",
    gifts: [
      { id: 1, title: "Магический кристалл", price: 5000, image_url: "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=400", is_reserved: false, progress_percentage: 30 },
      { id: 2, title: "Светлячки в банке", price: 1200, image_url: "https://images.unsplash.com/photo-1513885535751-8b9238bd3021?w=400", is_reserved: true, progress_percentage: 100 }
    ]
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color={colors.gold[400]} size={24} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Демо-режим 🪄</Text>
          <View style={{ width: 24 }} />
        </View>
        <FlatList
          data={demoWishlist.gifts}
          keyExtractor={(i) => i.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View style={styles.heroSection}>
              <Text style={styles.wishlistHeaderTitle}>{demoWishlist.title}</Text>
              <Text style={styles.wishlistOwner}>от @{demoWishlist.owner_username}</Text>
            </View>
          }
          renderItem={({item}) => (
            <GiftCardComponent 
              gift={item} 
              isOwner={false} 
              onReserve={() => Alert.alert('Демо', 'Резерв работает!')} 
              onContribute={(amt: number) => Alert.alert('Демо', `Внесено ${amt}₽!`)} 
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.emerald[950] },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  navTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  heroSection: { padding: 30, backgroundColor: colors.emerald[900], borderRadius: 30, alignItems: 'center', marginVertical: 10 },
  wishlistHeaderTitle: { color: colors.gold[400], fontSize: 24, fontWeight: 'bold' },
  wishlistOwner: { color: colors.emerald[300], fontSize: 12 },
});
