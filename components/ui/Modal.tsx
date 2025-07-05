import React from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { ThemedText } from '@/components/ThemedText';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
}

const { height: screenHeight } = Dimensions.get('window');

export function Modal({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  animationType = 'slide',
}: ModalProps) {
  const getModalHeight = () => {
    switch (size) {
      case 'small':
        return screenHeight * 0.3;
      case 'medium':
        return screenHeight * 0.6;
      case 'large':
        return screenHeight * 0.8;
      case 'fullscreen':
        return screenHeight;
      default:
        return screenHeight * 0.6;
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={[
          styles.modal,
          size === 'fullscreen' ? styles.fullscreenModal : { height: getModalHeight() }
        ]}>
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && (
                <ThemedText type="subtitle" style={styles.title}>
                  {title}
                </ThemedText>
              )}
              
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="#8E8E93" />
                </TouchableOpacity>
              )}
            </View>
          )}
          
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding
  },
  fullscreenModal: {
    borderRadius: 0,
    paddingTop: 44, // Status bar height
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});