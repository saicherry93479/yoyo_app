import { registerSheet } from 'react-native-actions-sheet';
import { CustomActionSheet } from '@/components/ui/ActionSheet';
import { AmenitiesActionSheet } from '@/components/ui/AmenitiesActionSheet';

registerSheet('profile-options', CustomActionSheet);
registerSheet('amenities', AmenitiesActionSheet);

// Export the sheet IDs for type safety
export const SHEET_IDS = {
  PROFILE_OPTIONS: 'profile-options',
  AMENITIES: 'amenities',
} as const;

export type SheetId = typeof SHEET_IDS[keyof typeof SHEET_IDS];