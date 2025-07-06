import { registerSheet } from 'react-native-actions-sheet';
import { CustomActionSheet } from '@/components/ui/ActionSheet';
import { AmenitiesActionSheet } from '@/components/ui/AmenitiesActionSheet';
import { ReviewsActionSheet } from '@/components/ui/ReviewsActionSheet';
import { RoomUpgradeActionSheet } from '@/components/ui/RoomUpgradeActionSheet';
import { SearchActionSheet } from '@/components/ui/SearchActionSheet';
import { ContactHotelActionSheet } from '@/components/ui/ContactHotelActionSheet';
import { ModifyBookingActionSheet } from '@/components/ui/ModifyBookingActionSheet';

registerSheet('profile-options', CustomActionSheet);
registerSheet('amenities', AmenitiesActionSheet);
registerSheet('reviews', ReviewsActionSheet);
registerSheet('upgraderoom', RoomUpgradeActionSheet);
registerSheet('search', SearchActionSheet);
registerSheet('contact-hotel', ContactHotelActionSheet);
registerSheet('modify-booking', ModifyBookingActionSheet);

// Export the sheet IDs for type safety
export const SHEET_IDS = {
  PROFILE_OPTIONS: 'profile-options',
  AMENITIES: 'amenities',
  REVIEWS:'reviews',
  UPGRADEROOM:'upgraderoom',
  SEARCH : 'search',
  CONTACT_HOTEL: 'contact-hotel',
  MODIFY_BOOKING: 'modify-booking'
} as const;

export type SheetId = typeof SHEET_IDS[keyof typeof SHEET_IDS];