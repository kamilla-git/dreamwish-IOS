import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { api } from '../../services/api';
import { colors } from '../../theme/colors';

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.email || !form.username || !form.password) return Alert.alert('Ошибка', 'Заполните все поля');
    setLoading(true);
    try {
      await api.register(form);
      Alert.alert('Успех', 'Аккаунт создан! Войдите в систему.');
      navigation.navigate('Login');
    } catch (e: any) { 
      Alert.alert('Ошибка', e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.gold[400]} size={24}/>
        </TouchableOpacity>
        <Text style={styles.emojiLarge}>📜</Text>
        <Text style={styles.title}>Регистрация</Text>
        
        <View style={styles.form}>
          <TextInput 
            placeholder="Имя духа (Никнейм)" 
            placeholderTextColor="rgba(255,255,255,0.4)" 
            style={styles.input} 
            onChangeText={(v) => setForm({...form, username: v})}
          />
          <TextInput 
            placeholder="Email" 
            placeholderTextColor="rgba(255,255,255,0.4)" 
            style={styles.input} 
            autoCapitalize="none"
            onChangeText={(v) => setForm({...form, email: v})}
          />
          <TextInput 
            placeholder="Пароль" 
            placeholderTextColor="rgba(255,255,255,0.4)" 
            style={styles.input} 
            secureTextEntry 
            onChangeText={(v) => setForm({...form, password: v})}
          />
          <TouchableOpacity style={styles.buttonGold} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.emerald[950]} /> : <Text style={styles.buttonText}>СОЗДАТЬ МАГИЮ</Text>}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.emerald[950] },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  backBtn: { position: 'absolute', top: 60, left: 30 },
  emojiLarge: { fontSize: 80, marginBottom: 20 },
  title: { color: colors.gold[400], fontSize: 32, fontWeight: 'bold', marginBottom: 30 },
  form: { width: '100%' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: 18, color: 'white', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  buttonGold: { backgroundColor: colors.gold[400], padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: colors.emerald[950], fontWeight: 'bold', fontSize: 16 }
});
