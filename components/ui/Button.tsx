import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  testID?: string;
  accessibilityLabel?: string;
} & PressableProps;

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  testID,
  accessibilityLabel,
  ...rest
}) => {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
