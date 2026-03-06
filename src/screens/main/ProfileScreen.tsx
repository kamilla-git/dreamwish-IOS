import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, TextInput, Image, Alert, Modal } from 'react-native';
import { Gift, Compass, User, ArrowLeft, LogOut, Search, Check, X, Bell, Globe, Camera, Edit2, CheckCircle2 } from 'lucide-react-native';
import { api } from '../../services/api';
import { colors } from '../../theme/colors';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [friendsWishlists, setFriendsWishlists] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Edit Profile State
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', nickname: '', avatar_url: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => { 
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, f, r, w] = await Promise.all([
        api.getMe(),
        api.getFriends(),
        api.getFriendRequests(),
        api.getFriendsWishlists()
      ]);
      setUser(p);
      setEditForm({ 
        username: p.username || '', 
        nickname: p.nickname || '', 
        avatar_url: p.avatar_url || '' 
      });
      setFriends(f);
      setRequests(r);
      setFriendsWishlists(w);
    } catch (err) {
      navigation.replace('Login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      await api.updateProfile(editForm);
      await loadData();
      setEditModal(false);
      Alert.alert('Успех', 'Профиль обновлен');
    } catch (e: any) {
      Alert.alert('Ошибка', e.message || 'Не удалось обновить профиль');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => { 
    api.setToken(null); 
    navigation.replace('Landing'); 
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await api.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (err) { 
      Alert.alert('Ошибка', 'Ошибка поиска'); 
    } finally { 
      setIsSearching(false); 
    }
  };

  const sendFriendRequest = async (id: number) => {
    try {
      await api.sendFriendRequest(id);
      Alert.alert('Успех', 'Запрос отправлен');
      setSearchResults([]);
      setSearchQuery('');
    } catch (e: any) { 
      Alert.alert('Ошибка', e.message || 'Ошибка отправки'); 
    }
  };

  const respondToRequest = async (requestId: number, accept: boolean) => {
    try {
      if (accept) await api.acceptFriendRequest(requestId);
      else await api.rejectFriendRequest(requestId);
      Alert.alert('Успех', accept ? 'Запрос принят' : 'Запрос отклонен');
      loadData();
    } catch (e) { 
      Alert.alert('Ошибка', 'Ошибка ответа'); 
    }
  };

  if (loading) return <View style={styles.container}><ActivityIndicator color={colors.gold[400]} style={{marginTop: 100}} /></View>;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color={colors.gold[400]} size={24} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Профиль</Text>
          <TouchableOpacity onPress={handleLogout}>
            <LogOut color={colors.gold[400]} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* User Info */}
          <View style={styles.profileCard}>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => setEditModal(true)}>
              <View style={styles.avatarLarge}>
                {user.avatar_url ? (
                  <Image source={{ uri: user.avatar_url }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.avatarTextLarge}>{user.username?.[0].toUpperCase()}</Text>
                )}
              </View>
              <View style={styles.editIconBadge}>
                <Camera color="white" size={14} />
              </View>
            </TouchableOpacity>
            
            <View style={{ alignItems: 'center', marginTop: 15 }}>
              <Text style={styles.profileName}>{user.nickname || user.username}</Text>
              <Text style={styles.profileEmail}>@{user.username}</Text>
              <TouchableOpacity style={styles.editProfileBtn} onPress={() => setEditModal(true)}>
                <Edit2 size={12} color={colors.gold[400]} />
                <Text style={styles.editProfileText}>ИЗМЕНИТЬ ПРОФИЛЬ</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{friends.length}</Text>
                <Text style={styles.statLabel}>Спутников</Text>
              </View>
              <View style={styles.statDivider} />
              <TouchableOpacity style={styles.statBox} onPress={() => navigation.navigate('Explore')}>
                <Globe color={colors.emerald[50]} size={20} />
                <Text style={styles.statLabel}>Мир</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Friends */}
          <View style={styles.sectionCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 }}>
              <Search color={colors.gold[400]} size={16} />
              <Text style={styles.sectionTitle}>ПОИСК ПОПУТЧИКОВ</Text>
            </View>
            <View style={styles.searchRow}>
              <TextInput 
                placeholder="Имя или @username..." 
                placeholderTextColor="rgba(255,255,255,0.4)" 
                style={styles.searchInput} 
                value={searchQuery} 
                onChangeText={setSearchQuery} 
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} disabled={isSearching}>
                {isSearching ? <ActivityIndicator color={colors.emerald[950]} size="small" /> : <Text style={styles.searchBtnText}>Найти</Text>}
              </TouchableOpacity>
            </View>

            {searchResults.length > 0 && (
              <View style={styles.resultsContainer}>
                {searchResults.map((u) => (
                  <View key={u.id} style={styles.resultRow}>
                    <View style={styles.friendInfo}>
                      <View style={styles.avatarSmall}>
                        {u.avatar_url ? (
                          <Image source={{ uri: u.avatar_url }} style={styles.avatarImg} />
                        ) : (
                          <Text style={styles.avatarTextSmall}>{u.username[0].toUpperCase()}</Text>
                        )}
                      </View>
                      <View>
                        <Text style={styles.friendName}>{u.nickname || u.username}</Text>
                        <Text style={styles.friendUser}>@{u.username}</Text>
                      </View>
                    </View>
                    {u.is_friend ? (
                      <View style={styles.isFriendBadge}>
                        <CheckCircle2 color={colors.emerald[400]} size={16} />
                      </View>
                    ) : (
                      <TouchableOpacity style={styles.addBtn} onPress={() => sendFriendRequest(u.id)}>
                        <Text style={styles.addBtnText}>ДОБАВИТЬ</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Friend Requests */}
          {requests.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 }}>
                <Bell color={colors.gold[300]} size={16} />
                <Text style={styles.sectionTitle}>ЗАПРОСЫ В БРАТСТВО</Text>
              </View>
              {requests.map((req) => (
                <View key={req.id} style={styles.resultRow}>
                  <View style={styles.friendInfo}>
                    <View style={styles.avatarSmall}>
                      {req.user.avatar_url ? (
                        <Image source={{ uri: req.user.avatar_url }} style={styles.avatarImg} />
                      ) : (
                        <Text style={styles.avatarTextSmall}>{req.user.username[0].toUpperCase()}</Text>
                      )}
                    </View>
                    <Text style={styles.friendName}>@{req.user.username}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={styles.acceptBtn} onPress={() => respondToRequest(req.id, true)}>
                      <Check color={colors.emerald[950]} size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectBtn} onPress={() => respondToRequest(req.id, false)}>
                      <X color={colors.emerald[400]} size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Friends List Section */}
          {friends.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 }}>
                <User color={colors.gold[400]} size={16} />
                <Text style={styles.sectionTitle}>ВАШЕ БРАТСТВО</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }}>
                {friends.map((f) => (
                  <TouchableOpacity 
                    key={f.id} 
                    style={{ alignItems: 'center', width: 70 }}
                    onPress={() => Alert.alert(f.nickname || f.username, `@${f.username}`)}
                  >
                    <View style={styles.avatarSmall}>
                      {f.avatar_url ? (
                        <Image source={{ uri: f.avatar_url }} style={styles.avatarImg} />
                      ) : (
                        <Text style={styles.avatarTextSmall}>{f.username[0].toUpperCase()}</Text>
                      )}
                    </View>
                    <Text style={[styles.friendName, { fontSize: 10, marginTop: 5 }]} numberOfLines={1}>
                      {f.nickname || f.username}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Friends Wishlists */}
          <Text style={styles.sectionTitleLarge}>СВИТКИ БРАТСТВА</Text>
          {friendsWishlists.length > 0 ? (
            friendsWishlists.map((w: any) => (
              <TouchableOpacity key={w.id} style={styles.wishlistCard} onPress={() => navigation.navigate('WishlistDetail', { slug: w.public_slug })}>
                <View style={styles.wishlistHeader}>
                  <View style={styles.emojiBox}><Text style={{fontSize:20}}>📜</Text></View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.collectedLabel}>СОБРАНО</Text>
                    <Text style={styles.collectedPercent}>{Math.round(w.completion_percentage)}%</Text>
                  </View>
                </View>
                <Text style={styles.wishlistTitle} numberOfLines={1}>{w.owner_username}: {w.title}</Text>
                <Text style={styles.wishlistDesc} numberOfLines={2}>{w.description || 'Дневник скрывает тайны...'}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Лес пока хранит молчание...</Text>
            </View>
          )}

        </ScrollView>

        {/* EDIT PROFILE MODAL */}
        <Modal visible={editModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Изменить профиль</Text>
                <TouchableOpacity onPress={() => setEditModal(false)}>
                  <X color="white" size={20} />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <Text style={styles.inputLabel}>АВАТАР (URL ССЫЛКА)</Text>
                <TextInput 
                  style={styles.input} 
                  value={editForm.avatar_url} 
                  onChangeText={(v) => setEditForm({...editForm, avatar_url: v})}
                  placeholder="https://..."
                  placeholderTextColor="rgba(255,255,255,0.2)"
                />

                <Text style={styles.inputLabel}>ИМЯ В ЛЕСУ (NICKNAME)</Text>
                <TextInput 
                  style={styles.input} 
                  value={editForm.nickname} 
                  onChangeText={(v) => setEditForm({...editForm, nickname: v})}
                  placeholder="Как вас называть?"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                />

                <Text style={styles.inputLabel}>МЕТКА ДУХА (@USERNAME)</Text>
                <TextInput 
                  style={styles.input} 
                  value={editForm.username} 
                  onChangeText={(v) => setEditForm({...editForm, username: v.toLowerCase()})}
                  autoCapitalize="none"
                />

                <TouchableOpacity 
                  style={styles.saveBtn} 
                  onPress={handleUpdateProfile}
                  disabled={updating}
                >
                  {updating ? <ActivityIndicator color={colors.emerald[950]} /> : <Text style={styles.saveBtnText}>СОХРАНИТЬ ИЗМЕНЕНИЯ</Text>}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View style={styles.navContainer}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Compass color={colors.emerald[300]} size={24} opacity={0.5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MyLists')}>
              <Gift color={colors.emerald[300]} size={24} opacity={0.5} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <User color={colors.gold[400]} size={26} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.emerald[950] },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  navTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  
  profileCard: { backgroundColor: 'rgba(2, 44, 34, 0.6)', borderRadius: 35, padding: 30, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)' },
  avatarContainer: { position: 'relative' },
  avatarLarge: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(251, 191, 36, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(251, 191, 36, 0.3)', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  avatarTextLarge: { fontSize: 45, color: colors.gold[400], fontWeight: 'bold' },
  editIconBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: colors.gold[500], width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#022c22' },
  
  profileName: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  profileEmail: { color: 'rgba(52, 211, 153, 0.6)', fontSize: 14, marginTop: 4 },
  editProfileBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 15, backgroundColor: 'rgba(251, 191, 36, 0.05)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.1)' },
  editProfileText: { color: colors.gold[400], fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },

  statsContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(52, 211, 153, 0.1)', paddingTop: 25, width: '100%', justifyContent: 'center', marginTop: 25 },
  statBox: { alignItems: 'center', width: 90 },
  statNum: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: colors.emerald[500], fontSize: 10, fontWeight: 'bold', marginTop: 5, letterSpacing: 1 },
  statDivider: { width: 1, height: 35, backgroundColor: 'rgba(52, 211, 153, 0.1)', marginHorizontal: 15 },

  sectionCard: { backgroundColor: 'rgba(2, 44, 34, 0.4)', borderRadius: 25, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.1)' },
  sectionTitle: { color: colors.gold[400], fontSize: 11, fontWeight: 'bold', letterSpacing: 1.5 },
  searchRow: { flexDirection: 'row', gap: 10 },
  searchInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: 15, color: 'white', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', fontSize: 14 },
  searchBtn: { backgroundColor: colors.gold[400], borderRadius: 15, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' },
  searchBtnText: { color: colors.emerald[950], fontWeight: 'bold', fontSize: 12 },
  
  resultsContainer: { marginTop: 15, gap: 10 },
  resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  friendInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(251, 191, 36, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)', overflow: 'hidden' },
  avatarTextSmall: { color: colors.gold[400], fontWeight: 'bold', fontSize: 16 },
  friendName: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  friendUser: { color: 'rgba(52, 211, 153, 0.5)', fontSize: 12 },
  addBtn: { backgroundColor: colors.emerald[800], paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: colors.gold[200], fontSize: 10, fontWeight: 'bold' },
  isFriendBadge: { padding: 8 },
  
  acceptBtn: { backgroundColor: colors.gold[500], padding: 10, borderRadius: 20 },
  rejectBtn: { backgroundColor: colors.emerald[950], padding: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.emerald[800] },

  sectionTitleLarge: { color: colors.gold[200], fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10, letterSpacing: 1 },
  wishlistCard: { backgroundColor: 'rgba(2, 44, 34, 0.4)', borderRadius: 25, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.1)' },
  wishlistHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  emojiBox: { backgroundColor: 'rgba(2, 44, 34, 0.8)', width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.emerald[800] },
  collectedLabel: { color: colors.emerald[500], fontSize: 8, fontWeight: 'bold', letterSpacing: 1 },
  collectedPercent: { color: colors.gold[400], fontSize: 18, fontWeight: 'bold' },
  wishlistTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  wishlistDesc: { color: 'rgba(52, 211, 153, 0.7)', fontSize: 13, lineHeight: 20 },

  emptyBox: { padding: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.emerald[800], borderRadius: 25, borderStyle: 'dashed' },
  emptyText: { color: colors.emerald[500], fontStyle: 'italic', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 44, 34, 0.98)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: colors.emerald[900], padding: 30, borderRadius: 35, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  inputLabel: { color: colors.gold[400], fontSize: 10, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: 18, color: 'white', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', fontSize: 16 },
  saveBtn: { backgroundColor: colors.gold[400], padding: 20, borderRadius: 18, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: colors.emerald[950], fontWeight: 'bold', letterSpacing: 1 },

  navContainer: { position: 'absolute', bottom: 30, left: 30, right: 30 },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 18, backgroundColor: 'rgba(2, 44, 34, 0.9)', borderRadius: 40, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.2)' },
});