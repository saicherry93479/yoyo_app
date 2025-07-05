import { registerSheet } from 'react-native-actions-sheet';
import { CustomActionSheet } from '@/components/ui/ActionSheet';

registerSheet('profile-options', CustomActionSheet);

// Export the sheet IDs for type safety
export const SHEET_IDS = {
  PROFILE_OPTIONS: 'profile-options',
} as const;

export type SheetId = typeof SHEET_IDS[keyof typeof SHEET_IDS];