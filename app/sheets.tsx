import { registerSheet } from 'react-native-actions-sheet';
import { CustomActionSheet } from '@/components/ui/ActionSheet';
import { AmenitiesActionSheet } from '@/components/ui/AmenitiesActionSheet';
import { ReviewsActionSheet } from '@/components/ui/ReviewsActionSheet';
import { RoomUpgradeActionSheet } from '@/components/ui/RoomUpgradeActionSheet';
import { SearchActionSheet } from '@/components/ui/SearchActionSheet';

registerSheet('profile-options', CustomActionSheet);
registerSheet('amenities', AmenitiesActionSheet);
registerSheet('reviews', ReviewsActionSheet);
registerSheet('upgraderoom', RoomUpgradeActionSheet);
registerSheet('search', SearchActionSheet);

// Export the sheet IDs for type safety
export const SHEET_IDS = {
  PROFILE_OPTIONS: 'profile-options',
  AMENITIES: 'amenities',
  REVIEWS:'reviews',
  UPGRADEROOM:'upgraderoom',
  SEARCH : 'search'
} as const;

export type SheetId = typeof SHEET_IDS[keyof typeof SHEET_IDS];