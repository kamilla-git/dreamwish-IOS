import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import { Gift, Compass, User } from 'lucide-react-native';
import { api } from '../../services/api';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function ExploreScreen({ navigation }: any) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    api.getPublicWishlists().then(setLists).finally(() => setLoading(false)); 
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.titleSmall}>Исследовать</Text>
          <TouchableOpacity onPress={() => navigation.navigate(api.getToken() ? 'Profile' : 'Login')} style={styles.profileButton}>
            <User color={colors.gold[400]} size={24} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.gold[400]} style={{ marginTop: 50 }} />
        ) : (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.listContainer}>
            {lists.map((w: any) => (
              <TouchableOpacity key={w.id} style={styles.exploreCard} onPress={() => navigation.navigate('WishlistDetail', { slug: w.public_slug })}>
                <Text style={{ fontSize: 30 }}>🎁</Text>
                <Text style={styles.wishlistTitle}>{w.title}</Text>
                <Text style={styles.wishlistSubtitle}>@{w.owner_username}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.navContainer}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Compass color={colors.gold[400]} size={26} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate(api.getToken() ? 'MyLists' : 'Login')}>
              <Gift color={colors.emerald[300]} size={24} opacity={0.5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate(api.getToken() ? 'Profile' : 'Login')}>
              <User color={colors.emerald[300]} size={24} opacity={0.5} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.emerald[950] },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  titleSmall: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  profileButton: { width: 45, height: 45, backgroundColor: 'rgba(251, 191, 36, 0.1)', borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  listContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, paddingBottom: 100 },
  exploreCard: { width: (width - 55) / 2, backgroundColor: colors.emerald[900], padding: 20, borderRadius: 25, marginBottom: 15 },
  wishlistTitle: { color: 'white', fontWeight: 'bold', fontSize: 14, marginTop: 10 },
  wishlistSubtitle: { color: 'rgba(52, 211, 153, 0.6)', fontSize: 10 },
  navContainer: { position: 'absolute', bottom: 30, left: 30, right: 30 },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 18, backgroundColor: 'rgba(2, 44, 34, 0.9)', borderRadius: 40, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)' },
});
