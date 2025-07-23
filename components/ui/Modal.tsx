import React from 'react';
import { Modal as RNModal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  animationType?: 'slide' | 'fade' | 'none';
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  animationType = 'slide',
}: ModalProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const overlayColor = useThemeColor({}, 'text');

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: `${overlayColor}80` }]}>
        <ThemedView style={styles.container}>
          {title && (
            <View style={styles.header}>
              <ThemedText type="h3">{title}</ThemedText>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <ThemedText>✕</ThemedText>
              </TouchableOpacity>
            </View>
          )}
          {children}
        </ThemedView>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 12,
    padding: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
});