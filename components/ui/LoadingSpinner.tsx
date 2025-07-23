import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  size = 'large', 
  color = '#000000', 
  text,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const Container = fullScreen ? ThemedView : View;
  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;

  return (
    <Container style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <ThemedText style={styles.text}>{text}</ThemedText>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
});