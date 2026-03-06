import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, TextInput, Modal, FlatList, Image, Alert, ScrollView } from 'react-native';
import { ArrowLeft, Plus, X, Trash2, Globe, Lock, Sparkles } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSequence } from 'react-native-reanimated';
import { api } from '../../services/api';
import SocketService from '../../services/socket';
import GiftCardComponent from '../../components/GiftCard';
import { colors } from '../../theme/colors';
import { themes } from '../../theme/themes';

const Particle = ({ delay }: { delay: number }) => {
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);
  const x = useSharedValue(Math.random() * 60 - 30);

  useEffect(() => {
    y.value = withDelay(delay, withTiming(-120, { duration: 2500 }));
    opacity.value = withDelay(delay, withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 2000 })));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { translateX: x.value }],
    opacity: opacity.value,
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.gold[400],
  }));

  return <Animated.View style={style} />;
};

export default function WishlistDetailScreen({ route, navigation }: any) {
  const { slug } = route.params;
  const [wishlist, setWishlist] = useState<any>(null);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<any>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const fetch = useCallback(() => api.getPublicWishlist(slug).then(setWishlist).finally(()=>setLoading(false)), [slug]);
  
  useEffect(() => { 
    fetch(); 
    return SocketService.connect(slug, fetch); 
  }, [fetch, slug]);

  const handleStartScrape = async () => {
    if (!scrapeUrl) return;
    setIsScraping(true);
    try {
      const data = await api.scrapeUrl(scrapeUrl);
      setPreview(data);
    } catch(e) { 
      Alert.alert('Загрузка...', 'Маркетплейс защищен капчей. Пожалуйста, введите данные вручную.');
      setPreview({ title: '', price: 0, url: scrapeUrl, image_url: '' });
    } finally { 
      setIsScraping(false); 
    }
  };

  const handleManualAdd = () => {
    setPreview({ title: '', price: 0, url: '', image_url: '' });
  };

  const handleFinalAdd = async () => {
    if (!preview.title) return Alert.alert('Ошибка', 'Введите название');
    try {
      if (preview.id) {
        await api.updateGift(preview.id, preview);
      } else {
        await api.addGift(wishlist.id, preview);
      }
      setShowParticles(true);
      setTimeout(() => {
        setShowParticles(false);
        setPreview(null); 
        setScrapeUrl(''); 
        fetch();
      }, 1500);
    } catch(e) { 
      Alert.alert('Ошибка', 'Не удалось сохранить'); 
    }
  };

  const handleDeleteGift = async (giftId: number) => {
    Alert.alert('Удалить', 'Точно удалить подарок?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Да', style: 'destructive', onPress: async () => {
        try {
          await api.deleteGift(giftId);
          fetch();
        } catch(e: any) {
          Alert.alert('Ошибка', e.message);
        }
      }}
    ]);
  };

  const handleDeleteWishlist = async () => {
    Alert.alert('Удалить', 'Точно удалить весь свиток?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Да', style: 'destructive', onPress: async () => {
        try {
          await api.deleteWishlist(wishlist.id);
          navigation.goBack();
        } catch(e: any) {
          Alert.alert('Ошибка', e.message || 'Не удалось удалить');
        }
      }}
    ]);
  };

  if (loading) return <View style={styles.container}><ActivityIndicator color={colors.gold[400]} style={{marginTop: 100}} /></View>;

  const isOwner = !!wishlist?.is_owner; 
  const theme = themes[wishlist.theme] || themes.birthday;

  return (
    <View style={[styles.container, { backgroundColor: theme.gradient[0] }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color={colors.gold[400]} size={24} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={styles.navTitle} numberOfLines={1}>{wishlist.title}</Text>
              {wishlist.is_private ? <Lock size={12} color="rgba(255,255,255,0.4)" /> : <Globe size={12} color="rgba(255,255,255,0.4)" />}
            </View>
          </View>
          {isOwner ? (
            <TouchableOpacity onPress={handleDeleteWishlist}>
              <Trash2 color={colors.gold[400]} size={20} />
            </TouchableOpacity>
          ) : <View style={{ width: 24 }} />}
        </View>

        <FlatList
          data={wishlist.gifts}
          keyExtractor={(i) => i.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View>
              <View style={[styles.heroSection, { backgroundColor: 'rgba(2, 44, 34, 0.6)', borderColor: 'rgba(251, 191, 36, 0.2)' }]}>
                <Text style={{fontSize: 40, marginBottom: 10}}>{theme.emoji}</Text>
                <Text style={styles.wishlistHeaderTitle}>{wishlist.title}</Text>
                <Text style={styles.wishlistOwner}>свиток от @{wishlist.owner_username}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>ВСЕГО</Text>
                    <Text style={styles.statValue}>{wishlist.total_value || 0} ₽</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>СОБРАНО</Text>
                    <Text style={[styles.statValue, { color: colors.gold[400] }]}>{wishlist.total_collected || 0} ₽</Text>
                  </View>
                </View>
              </View>

              {isOwner && (
                <View style={styles.actionCard}>
                  <View style={styles.scrapeBox}>
                    <TextInput 
                      placeholder="Ссылка Ozon/Wildberries..." 
                      placeholderTextColor="rgba(255,255,255,0.3)" 
                      style={styles.scrapeInput} 
                      value={scrapeUrl} 
                      onChangeText={setScrapeUrl}
                      onSubmitEditing={handleStartScrape}
                    />
                    <TouchableOpacity style={styles.scrapeBtnSmall} onPress={handleStartScrape} disabled={isScraping}>
                      {isScraping ? <ActivityIndicator color={colors.emerald[950]} size="small"/> : <Plus color={colors.emerald[950]} size={20}/>}
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.manualBtn} onPress={handleManualAdd}>
                    <Plus color={colors.gold[400]} size={14} />
                    <Text style={styles.manualBtnText}>ДОБАВИТЬ ВРУЧНУЮ</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          }
          renderItem={({item}) => (
            <View>
              <GiftCardComponent 
                gift={item} 
                isOwner={isOwner} 
                onReserve={() => api.reserveGift(item.id).then(fetch).catch(e => Alert.alert('Ошибка', e.message))}
                onContribute={(amt: number) => api.contribute(item.id, amt).then(fetch).catch(e => Alert.alert('Ошибка', e.message))}
              />
              {isOwner && (
                <View style={styles.ownerActions}>
                  <TouchableOpacity onPress={() => setPreview(item)} style={styles.editBtn}>
                    <Text style={styles.editBtnText}>РЕДАКТИРОВАТЬ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteGift(item.id)} style={styles.deleteBtn}>
                    <Trash2 color={colors.emerald[950]} size={16} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>В этом свитке пока пусто...</Text>
            </View>
          }
        />

        {/* ПРЕДПРОСМОТР / РЕДАКТИРОВАНИЕ */}
        <Modal visible={!!preview} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{preview?.id ? 'Правка желания' : 'Новое желание'}</Text>
                <TouchableOpacity onPress={() => setPreview(null)}>
                  <X color="white" size={20} />
                </TouchableOpacity>
              </View>
              
              {preview && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <Image 
                      source={{ uri: preview.image_url || 'https://images.unsplash.com/photo-1513885535751-8b9238bd3021?w=400' }} 
                      style={styles.previewImg} 
                    />
                    <Text style={styles.inputLabel}>НАЗВАНИЕ</Text>
                    <TextInput 
                      style={styles.input} 
                      value={preview.title} 
                      onChangeText={(v) => setPreview({...preview, title: v})}
                      placeholder="Что это за вещь?"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                    />
                    
                    <Text style={styles.inputLabel}>ЦЕНА (₽)</Text>
                    <TextInput 
                      style={styles.input} 
                      value={String(preview.price || '')} 
                      keyboardType="numeric" 
                      onChangeText={(v) => setPreview({...preview, price: v})}
                      placeholder="0"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                    />

                    <Text style={styles.inputLabel}>КАРТИНКА (URL)</Text>
                    <TextInput 
                      style={styles.input} 
                      value={preview.image_url} 
                      onChangeText={(v) => setPreview({...preview, image_url: v})}
                      placeholder="https://..."
                      placeholderTextColor="rgba(255,255,255,0.2)"
                    />

                    <Text style={styles.inputLabel}>ССЫЛКА НА МАГАЗИН</Text>
                    <TextInput 
                      style={styles.input} 
                      value={preview.url} 
                      onChangeText={(v) => setPreview({...preview, url: v})}
                      placeholder="https://..."
                      placeholderTextColor="rgba(255,255,255,0.2)"
                    />
                  </View>
                  
                  <TouchableOpacity style={styles.saveBtn} onPress={handleFinalAdd} disabled={showParticles}>
                    {showParticles ? (
                      <View style={{ height: 20, justifyContent: 'center' }}>
                        {[...Array(15)].map((_, i) => <Particle key={i} delay={i * 50} />)}
                        <Sparkles color={colors.emerald[950]} size={20} />
                      </View>
                    ) : (
                      <Text style={styles.saveBtnText}>СОХРАНИТЬ В СВИТОК</Text>
                    )}
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.emerald[950] },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  navTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 120 },
  
  heroSection: { padding: 30, borderRadius: 35, alignItems: 'center', marginVertical: 10, borderWidth: 1 },
  wishlistHeaderTitle: { color: colors.gold[400], fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  wishlistOwner: { color: colors.emerald[300], fontSize: 12, marginTop: 6, marginBottom: 25, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', gap: 12, width: '100%' },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.1)' },
  statLabel: { color: colors.emerald[500], fontSize: 9, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 6 },
  statValue: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  actionCard: { backgroundColor: 'rgba(2, 44, 34, 0.4)', borderRadius: 25, padding: 15, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.1)' },
  scrapeBox: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: 12 },
  scrapeInput: { flex: 1, color: 'white', paddingHorizontal: 18, height: 55, fontSize: 14 },
  scrapeBtnSmall: { backgroundColor: colors.gold[400], width: 55, height: 55, alignItems: 'center', justifyContent: 'center' },
  manualBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(251, 191, 36, 0.05)', padding: 14, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.15)' },
  manualBtnText: { color: colors.gold[400], fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },

  ownerActions: { flexDirection: 'row', gap: 10, marginTop: -15, marginBottom: 25, paddingHorizontal: 10 },
  editBtn: { flex: 1, backgroundColor: colors.emerald[900], padding: 12, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: colors.emerald[800] },
  editBtnText: { color: colors.gold[400], fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  deleteBtn: { backgroundColor: colors.gold[500], padding: 12, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },

  emptyBox: { padding: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.emerald[800], borderRadius: 30, borderStyle: 'dashed', marginTop: 20 },
  emptyText: { color: colors.emerald[500], fontStyle: 'italic', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 44, 34, 0.98)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: colors.emerald[900], padding: 30, borderRadius: 35, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  previewImg: { width: 140, height: 140, borderRadius: 25, marginBottom: 20, borderWidth: 2, borderColor: 'rgba(251, 191, 36, 0.3)' },
  inputLabel: { color: colors.gold[400], fontSize: 10, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1, width: '100%' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: 15, color: 'white', marginBottom: 15, width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', fontSize: 15 },
  saveBtn: { backgroundColor: colors.gold[400], padding: 20, borderRadius: 18, alignItems: 'center', width: '100%', marginTop: 10 },
  saveBtnText: { color: colors.emerald[950], fontWeight: 'bold', letterSpacing: 1.5 },
});