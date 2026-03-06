import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, TextInput, Modal, Alert, Switch } from 'react-native';
import { Gift, Compass, User, Plus, ChevronRight, Sparkles, X, Lock, Globe, Palette } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withDelay } from 'react-native-reanimated';
import { api } from '../../services/api';
import { colors } from '../../theme/colors';
import { themes } from '../../theme/themes';

const Particle = ({ delay }: { delay: number }) => {
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);
  const x = useSharedValue(Math.random() * 40 - 20);

  useEffect(() => {
    y.value = withDelay(delay, withTiming(-100, { duration: 2000 }));
    opacity.value = withDelay(delay, withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 1500 })));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { translateX: x.value }],
    opacity: opacity.value,
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold[400],
  }));

  return <Animated.View style={style} />;
};

export default function DashboardScreen({ navigation }: any) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('birthday');
  const [showParticles, setShowParticles] = useState(false);

  const fetch = () => api.getMyWishlists().then(setLists).finally(() => setLoading(false));
  
  useEffect(() => { 
    fetch(); 
  }, []);

  const handleCreate = async () => { 
    if (!newTitle) return; 
    try { 
      await api.createWishlist({ 
        title: newTitle, 
        is_private: isPrivate,
        theme: selectedTheme 
      }); 
      setNewTitle(''); 
      setIsPrivate(false);
      setShowParticles(true);
      setTimeout(() => {
        setShowParticles(false);
        setModal(false); 
        fetch();
      }, 2000);
    } catch(e) {
      Alert.alert('Ошибка', 'Не удалось создать');
    } 
  };

  if (loading) return <View style={styles.container}><ActivityIndicator color={colors.gold[400]} style={{marginTop: 100}} /></View>;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.titleSmall}>Мои свитки</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
            <User color={colors.gold[400]} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <TouchableOpacity style={styles.buttonGold} onPress={() => setModal(true)}>
            <Plus color={colors.emerald[950]} />
            <Text style={styles.buttonText}>НОВЫЙ СПИСОК</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            {lists.map((w: any) => (
              <TouchableOpacity key={w.id} style={styles.myWishlistRow} onPress={() => navigation.navigate('WishlistDetail', { slug: w.public_slug })}>
                <View style={styles.iconCircle}>
                  <Text style={{ fontSize: 24 }}>{themes[w.theme]?.emoji || '📜'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Text style={styles.myWishlistTitle}>{w.title}</Text>
                    {w.is_private ? <Lock size={12} color="rgba(52, 211, 153, 0.4)" /> : <Globe size={12} color="rgba(52, 211, 153, 0.4)" />}
                  </View>
                  <Text style={{color: 'rgba(52, 211, 153, 0.6)', fontSize: 12}}>{w.gifts?.length || 0} подарков</Text>
                </View>
                <ChevronRight color={colors.emerald[600]} size={24} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.navContainer}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Compass color={colors.emerald[300]} size={24} opacity={0.5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MyLists')}>
              <Gift color={colors.gold[400]} size={26} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <User color={colors.emerald[300]} size={24} opacity={0.5} />
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={modal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Создать мечту</Text>
                <TouchableOpacity onPress={() => setModal(false)}>
                  <X color="white" size={20} />
                </TouchableOpacity>
              </View>
              
              <TextInput 
                placeholder="Название свитка..." 
                placeholderTextColor="rgba(52, 211, 153, 0.4)" 
                style={styles.input} 
                value={newTitle} 
                onChangeText={setNewTitle}
              />

              <Text style={styles.sectionLabel}>ВЫБЕРИТЕ ТЕМУ</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themeScroll}>
                {Object.keys(themes).map((key) => (
                  <TouchableOpacity 
                    key={key} 
                    onPress={() => setSelectedTheme(key)}
                    style={[styles.themeBtn, selectedTheme === key && styles.themeBtnActive]}
                  >
                    <Text style={{fontSize: 20}}>{themes[key].emoji}</Text>
                    <Text style={[styles.themeBtnText, selectedTheme === key && styles.themeBtnTextActive]}>{themes[key].name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.switchRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {isPrivate ? <Lock size={18} color={colors.gold[400]} /> : <Globe size={18} color={colors.gold[400]} />}
                  <Text style={styles.switchLabel}>{isPrivate ? 'Приватный свиток' : 'Публичный свиток'}</Text>
                </View>
                <Switch 
                  value={isPrivate} 
                  onValueChange={setIsPrivate}
                  trackColor={{ false: colors.emerald[950], true: colors.gold[600] }}
                  thumbColor={isPrivate ? colors.gold[200] : colors.emerald[800]}
                />
              </View>

              <Text style={styles.hintText}>
                {isPrivate 
                  ? 'Виден только вам и вашим друзьям.' 
                  : 'Виден всем путникам в разделе «Исследовать».'}
              </Text>

              <TouchableOpacity style={styles.buttonGold} onPress={handleCreate} disabled={showParticles}>
                {showParticles ? (
                  <View style={{ height: 20, justifyContent: 'center' }}>
                    {[...Array(15)].map((_, i) => <Particle key={i} delay={i * 50} />)}
                    <Sparkles color={colors.emerald[950]} size={20} />
                  </View>
                ) : (
                  <Text style={styles.buttonText}>СОТВОРИТЬ</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  buttonGold: { backgroundColor: colors.gold[400], padding: 18, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 },
  buttonText: { color: colors.emerald[950], fontWeight: 'bold', letterSpacing: 1 },
  myWishlistRow: { backgroundColor: 'rgba(2, 44, 34, 0.6)', padding: 15, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.1)' },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(2, 44, 34, 0.8)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.emerald[800] },
  myWishlistTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  navContainer: { position: 'absolute', bottom: 30, left: 30, right: 30 },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 18, backgroundColor: 'rgba(2, 44, 34, 0.9)', borderRadius: 40, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 44, 34, 0.95)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: colors.emerald[900], padding: 30, borderRadius: 35, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: 18, color: 'white', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', fontSize: 16 },
  sectionLabel: { color: colors.gold[400], fontSize: 10, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  themeScroll: { marginBottom: 20 },
  themeBtn: { padding: 12, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: 'transparent', width: 100 },
  themeBtnActive: { borderColor: colors.gold[400], backgroundColor: 'rgba(251, 191, 36, 0.1)' },
  themeBtnText: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 5, textAlign: 'center' },
  themeBtnTextActive: { color: 'white', fontWeight: 'bold' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 15 },
  switchLabel: { color: 'white', fontWeight: '500' },
  hintText: { color: 'rgba(52, 211, 153, 0.5)', fontSize: 12, marginBottom: 25, paddingHorizontal: 5, lineHeight: 18 },
});