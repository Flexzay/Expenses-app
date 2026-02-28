import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import Header from '@/components/Header';
import colors from '@/constants/colors';

const categories = [
  { id: '1', name: 'Comida', icon: '🍔', color: colors.primary[500], amount: '1.2k' },
  { id: '2', name: 'Transporte', icon: '🚗', color: colors.green[500], amount: '800' },
  { id: '3', name: 'Entretenimiento', icon: '🎥', color: colors.yellow[500], amount: '450' },
  { id: '4', name: 'Salud', icon: '🏥', color: colors.blue[500], amount: '320' },
  { id: '5', name: 'Educación', icon: '📚', color: colors.red[500], amount: '280' },
  { id: '6', name: 'Luz', icon: '💡', color: colors.green[500], amount: '150' },
  { id: '7', name: 'Agua', icon: '💧', color: colors.blue[400], amount: '80' },
  { id: '8', name: 'Internet', icon: '🌐', color: colors.yellow[500], amount: '120' },
  { id: '9', name: 'Otros', icon: '⋯', color: colors.gray[500], amount: '100' },
];

export const CategoriasScreen = () => {
  const { width } = useWindowDimensions();
  const [categoryName, setCategoryName] = useState('');

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.white[100],
        padding: 20,
        borderRadius: 16,
        marginRight: 16,
        marginBottom: 16,
        alignItems: 'center',
        minWidth: (width - 48) / 2,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      }}
      activeOpacity={0.8}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: item.color + '20',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: item.color }}>
          {item.icon}
        </Text>
      </View>
      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.gray[900], marginBottom: 4 }}>
        {item.name}
      </Text>
      <Text style={{ fontSize: 14, color: colors.gray[500] }}>{item.amount}</Text>
    </TouchableOpacity>
  );

  const handleAddCategory = () => {
    // Por ahora no hace nada, luego agregas lógica
    setCategoryName('');
  };

  return (
    <>
      <Header />
      <View style={{ flex: 1, backgroundColor: colors.gray[50] }}>
        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.gray[900], marginBottom: 8 }}>
            Tus Categorías
          </Text>
          <Text style={{ fontSize: 16, color: colors.gray[500] }}>
            Selecciona dónde gastar
          </Text>
        </View>

        {/* Input para nueva categoría */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.white[100],
              borderRadius: 16,
              padding: 16,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: colors.gray[900],
                paddingVertical: 0,
              }}
              placeholder="Nombre de la categoría (ej: Luz, Agua...)"
              placeholderTextColor={colors.gray[500]}
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <TouchableOpacity
              onPress={handleAddCategory}
              style={{
                backgroundColor: colors.primary[500],
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 12,
                marginLeft: 12,
              }}
              activeOpacity={0.8}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                Agregar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};
