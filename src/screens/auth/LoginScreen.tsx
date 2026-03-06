import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { api } from '../../services/api';
import { colors } from '../../theme/colors';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Ошибка', 'Заполните поля');
    setLoading(true);
    try {
      const res = await api.login({ username: email, password });
      api.setToken(res.access_token);
      navigation.replace('MyLists');
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
        <Text style={styles.emojiLarge}>🔑</Text>
        <Text style={styles.title}>Вход</Text>
        
        <View style={styles.form}>
          <TextInput 
            placeholder="Email" 
            placeholderTextColor="rgba(255,255,255,0.4)" 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
          />
          <TextInput 
            placeholder="Пароль" 
            placeholderTextColor="rgba(255,255,255,0.4)" 
            style={styles.input} 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.buttonGold} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.emerald[950]} /> : <Text style={styles.buttonText}>ВОЙТИ</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Нет аккаунта? Создать</Text>
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
  buttonText: { color: colors.emerald[950], fontWeight: 'bold', fontSize: 16 },
  linkText: { color: colors.emerald[400], textAlign: 'center', marginTop: 20, fontWeight: 'bold', textDecorationLine: 'underline' }
});
