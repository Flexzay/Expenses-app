import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import colors from '@/constants/colors';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'default' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isPrimary = variant === 'primary';
  const buttonSize = size === 'large' ? 60 : 56;

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: isPrimary ? colors.primary[500] : colors.gray[100],
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          alignItems: 'center',
          minHeight: buttonSize,
          width: '100%',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          borderWidth: isPrimary ? 0 : 1,
          borderColor: colors.gray[300],
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.white[100] : colors.gray[700]} />
      ) : (
        <Text
          style={[
            {
              fontSize: 18,
              fontWeight: '600',
              color: isPrimary ? colors.white[100] : colors.gray[700],
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
