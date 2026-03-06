import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Heart, CreditCard } from 'lucide-react-native';

export default function GiftCard({ gift, isOwner, onReserve, onContribute }: any) {
  const [contribAmount, setContribAmount] = useState('');

  // Владелец не видит резерв и прогресс (сюрприз)
  const isReserved = isOwner ? false : gift.is_reserved;
  const progress = isOwner ? 0 : gift.progress_percentage;

  return (
    <View style={styles.card}>
      <Image source={{ uri: gift.image_url || 'https://images.unsplash.com/photo-1513885535751-8b9238bd3021?w=400' }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{gift.title}</Text>
        <Text style={styles.price}>{gift.price.toLocaleString()} ₽</Text>

        {!isOwner && (
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        )}

        {isReserved && !isOwner ? (
          <View style={styles.reservedBadge}><Text style={styles.reservedText}>ИСПОЛНЕНО ✨</Text></View>
        ) : !isOwner ? (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.reserveBtn} onPress={onReserve}>
              <Heart color="#fbbf24" size={16} />
              <Text style={styles.reserveText}>РЕЗЕРВ</Text>
            </TouchableOpacity>
            
            <View style={styles.fundRow}>
              <TextInput 
                style={styles.fundInput} 
                keyboardType="numeric" 
                placeholder="Сумма"
                placeholderTextColor="#666"
                value={contribAmount}
                onChangeText={setContribAmount}
              />
              <TouchableOpacity style={styles.fundBtn} onPress={() => {
                if (contribAmount && Number(contribAmount) > 0) {
                  onContribute(Number(contribAmount));
                  setContribAmount('');
                }
              }}>
                <Text style={styles.fundText}>ВНЕСТИ</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#064e3b', borderRadius: 20, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#fbbf2433' },
  image: { width: '100%', height: 180, backgroundColor: '#111' },
  info: { padding: 15 },
  title: { color: 'white', fontSize: 16, fontWeight: 'bold', height: 44 },
  price: { color: '#fbbf24', fontSize: 18, fontWeight: '900', marginVertical: 8 },
  progressBg: { height: 6, backgroundColor: '#022c22', borderRadius: 3, marginVertical: 10 },
  progressFill: { height: '100%', backgroundColor: '#fbbf24', borderRadius: 3 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  reserveBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 5 },
  reserveText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  fundRow: { flex: 1.5, flexDirection: 'row', gap: 5 },
  fundInput: { flex: 1, backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, textAlign: 'center', fontSize: 14 },
  fundBtn: { backgroundColor: '#fbbf24', padding: 12, borderRadius: 10, justifyContent: 'center' },
  fundText: { color: '#022c22', fontWeight: 'bold', fontSize: 12 },
  reservedBadge: { backgroundColor: 'rgba(52, 211, 153, 0.2)', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  reservedText: { color: '#34d399', fontWeight: 'bold' }
});
