import React from 'react';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import ActionSheet, { ActionSheetRef, SheetManager } from 'react-native-actions-sheet';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ActionSheetOption {
  title: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface CustomActionSheetProps {
  payload?: {
    title?: string;
    message?: string;
    options: ActionSheetOption[];
    cancelText?: string;
  };
}

interface ActionSheetPropsWithPayload extends CustomActionSheetProps {
  sheetId: string;
  title?: string;
  message?: string;
  options: ActionSheetOption[];
  cancelText?: string;
}



// ... your interfaces remain the same ...

export function CustomActionSheet({
  payload,
  sheetId,
}: CustomActionSheetProps & { sheetId: string }) {
  const {
    title,
    message,
    options = [],
    cancelText = 'Cancel',
  } = payload || {};

  return (
    <ActionSheet id={sheetId} containerStyle={styles.container}>
      <View style={styles.content}>
        {(title || message) && (
          <View style={styles.header}>
            {title && <Text style={styles.title}>{title}</Text>}
            {message && <Text style={styles.message}>{message}</Text>}
          </View>
        )}
        
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                option.disabled && styles.optionDisabled,
                index === options.length - 1 && styles.lastOption,
              ]}
              onPress={() => {
                option.onPress();
                SheetManager.hide(sheetId); // Use SheetManager instead of ActionSheet
              }}
              disabled={option.disabled}
            >
              <View style={styles.optionContent}>
                {option.icon && (
                  <View style={styles.optionIcon}>
                    {option.icon}
                  </View>
                )}
                <Text style={[
                  styles.optionText,
                  option.destructive && styles.destructiveText,
                  option.disabled && styles.disabledText,
                ]}>
                  {option.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => SheetManager.hide(sheetId)} // Use SheetManager instead of ActionSheet
        >
          <Text style={styles.cancelText}>{cancelText}</Text>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 34,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    paddingVertical: 8,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    flex: 1,
  },
  destructiveText: {
    color: '#FF3B30',
  },
  disabledText: {
    color: '#8E8E93',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
});