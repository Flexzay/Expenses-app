import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/constants/colors';

const Header = ({ showBackButton = true }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.primary[900]} 
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 60 + (Platform.OS === 'ios' ? insets.top : 0),
          backgroundColor: colors.primary[900],
          paddingTop: Platform.OS === 'ios' ? insets.top : 12,
          paddingHorizontal: 16,
          paddingBottom: 8,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        {showBackButton && (
          <TouchableOpacity
            onPress={handleGoBack}
            activeOpacity={0.7}
            style={{
              marginRight: 12,
              padding: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: colors.white[100],
                lineHeight: 24,
              }}
            >
              ‹
            </Text>
          </TouchableOpacity>
        )}
        
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            color: colors.white[100],
            letterSpacing: 0.5,
          }}
        >
          Expenses
        </Text>
      </View>
    </>
  );
};

export default Header;
