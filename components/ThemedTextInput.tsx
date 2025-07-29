import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

interface ThemedTextInputProps extends TextInputProps {
  variant?: 'default' | 'search' | 'password';
}

export function ThemedTextInput({ 
  style, 
  placeholderTextColor = '#999',
  variant = 'default',
  ...props 
}: ThemedTextInputProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'search':
        return styles.search;
      case 'password':
        return styles.password;
      default:
        return styles.default;
    }
  };

  return (
    <TextInput
      style={[
        styles.base,
        getVariantStyle(),
        style
      ]}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  default: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  search: {
    flex: 1,
    marginLeft: 8,
  },
  password: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
