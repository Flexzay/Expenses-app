import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import colors from '@/constants/colors';

export const ProfileScreen = () => {

  const user = {
    name: 'ricardo Rivera',
    email: 'ejemplo@email.com',
    phone: '+57 300 123 4567',
    avatar: 'https://ui-avatars.com/api/?name=ricardo+Rivera&background=007AFF&color=fff&bold=true&size=128',
    joinedDate: '28 Febrero 2026',
  };

  return (
    <View style={styles.container}>
      <Header showBackButton={true} /> 
      <ScrollView style={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={colors.gray[500]} />
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.gray[500]} />
            <Text style={styles.infoLabel}>Registrado</Text>
            <Text style={styles.infoValue}>{user.joinedDate}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white[100],
  },
  scrollContent: {
    flex: 1,
  },
  profileCard: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.white[100],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary[500],
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
  },
  infoSection: {
    padding: 20,
    backgroundColor: colors.white[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: colors.gray[900],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.gray[700],
    marginLeft: 12,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: colors.gray[900],
    fontWeight: '600',
  },
});
