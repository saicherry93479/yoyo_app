import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, LogOut, User, Mail, Phone, LocationEdit as Edit } from 'lucide-react-native';
import { SheetManager } from 'react-native-actions-sheet'; // ✅ Import SheetManager instead of ActionSheet
import { SHEET_IDS } from '@/app/sheets';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const showProfileOptions = () => {
    SheetManager.show(SHEET_IDS.PROFILE_OPTIONS, { // ✅ Use SheetManager.show instead of ActionSheet.show
      payload: {
        title: 'Profile Options',
        options: [
          {
            title: 'Edit Profile',
            onPress: () => console.log('Edit Profile'),
            icon: <Edit size={20} color="#007AFF" />,
          },
          {
            title: 'Settings',
            onPress: () => console.log('Settings'),
            icon: <Settings size={20} color="#007AFF" />,
          },
          {
            title: 'Logout',
            onPress: handleLogout,
            destructive: true,
            icon: <LogOut size={20} color="#FF3B30" />,
          },
        ],
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Profile
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={40} color="#007AFF" />
            </View>
          </View>
          
          <ThemedText type="subtitle" style={styles.userName}>
            {user?.name}
          </ThemedText>
          
          <Button
            title="More Options"
            variant="outline"
            onPress={showProfileOptions}
            style={styles.moreButton}
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Mail size={20} color="#8E8E93" />
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Email</ThemedText>
              <ThemedText style={styles.infoValue}>{user?.email}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Phone size={20} color="#8E8E93" />
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Phone</ThemedText>
              <ThemedText style={styles.infoValue}>{user?.phone}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Button
            title="Edit Profile"
            variant="secondary"
            onPress={() => console.log('Edit Profile')}
            style={styles.actionButton}
          />
          
          <Button
            title="Settings"
            variant="secondary"
            onPress={() => console.log('Settings')}
            style={styles.actionButton}
          />
          
          <Button
            title="Logout"
            variant="outline"
            onPress={handleLogout}
            style={[styles.actionButton, styles.logoutButton]}
          />
        </View>
      </ScrollView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    marginBottom: 16,
    textAlign: 'center',
  },
  moreButton: {
    paddingHorizontal: 24,
  },
  infoSection: {
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  infoIcon: {
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionsSection: {
    paddingBottom: 100,
  },
  actionButton: {
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 20,
  },
});