import { SafeAreaView} from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type HeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onMenuPress?: () => void;
};

export function Header({ 
  title, 
  subtitle, 
  showBack = false, 
  onMenuPress 
}: HeaderProps) {
  return (
    <>
      <SafeAreaView edges={['top']} style={styles.headerContainer}>
        <View style={styles.content}>
          <TouchableOpacity 
            onPress={showBack ? () => router.back() : onMenuPress}
            style={styles.leftIcon}
          >
            <Ionicons 
              name={showBack ? "arrow-back" : "menu-outline"} 
              size={24} 
              color={Colors.text} 
            />
          </TouchableOpacity>

          <View style={styles.centerContent}>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
            {subtitle ? <Text numberOfLines={1} style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          <View style={styles.rightSpacer} />
        </View>
      </SafeAreaView>
      
      <View style={styles.spacing} />  
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  content: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  leftIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  rightSpacer: {
    width: 48,
    height: 48,
  },
  spacing: {  // ← AUTOMÁTICO
    height: 16,
  },
});
