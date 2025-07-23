
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { X, Tag, Percent, Calendar } from 'lucide-react-native';
import { apiService } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive';
  mappings: {
    cities: Array<{ id: string; name: string; state: string }>;
    hotels: Array<{ id: string; name: string; city: string }>;
    roomTypes: Array<{ id: string; name: string }>;
  };
}

interface CouponValidationResponse {
  coupon: {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
  };
  discountAmount: number;
  finalAmount: number;
}

interface CouponsActionSheetProps {
  sheetId: string;
  payload?: {
    hotelId: string;
    roomTypeId: string;
    orderAmount: number;
    onCouponApplied: (validationData: CouponValidationResponse) => void;
  };
}

export function CouponsActionSheet({ sheetId, payload }: CouponsActionSheetProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState<string | null>(null);
  const [manualCouponCode, setManualCouponCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const { hotelId, roomTypeId, orderAmount, onCouponApplied } = payload || {};

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/coupons/user/all');
      
      if (response.success) {
        setCoupons(response.data.coupons || []);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      Alert.alert('Error', 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async (couponCode: string) => {
    if (!hotelId || !roomTypeId || !orderAmount) {
      Alert.alert('Error', 'Missing booking information');
      return;
    }

    try {
      setValidatingCoupon(couponCode);
      
      const response = await apiService.post('/coupons/validate', {
        code: couponCode,
        hotelId,
        roomTypeId,
        orderAmount
      });

      if (response.success) {
        onCouponApplied?.(response.data);
        handleClose();
        Alert.alert('Success', `Coupon applied! You saved ₹${response.data.discountAmount}`);
      } else {
        Alert.alert('Invalid Coupon', response.error || 'This coupon cannot be applied to your booking');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      Alert.alert('Error', 'Failed to validate coupon');
    } finally {
      setValidatingCoupon(null);
    }
  };

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `₹${coupon.discountValue} OFF`;
    }
  };

  const isValidForBooking = (coupon: Coupon) => {
    // Check if coupon is applicable to the hotel
    const isValidForHotel = coupon.mappings.hotels.length === 0 || 
      coupon.mappings.hotels.some(hotel => hotel.id === hotelId);
    
    // Check if order meets minimum amount
    const meetsMinAmount = !orderAmount || orderAmount >= coupon.minOrderAmount;
    
    return isValidForHotel && meetsMinAmount && coupon.status === 'active';
  };

  const renderCoupon = (coupon: Coupon) => {
    const isValid = isValidForBooking(coupon);
    const isValidating = validatingCoupon === coupon.code;

    return (
      <TouchableOpacity
        key={coupon.id}
        onPress={() => isValid && !isValidating ? validateCoupon(coupon.code) : null}
        className={`p-4 rounded-2xl border mb-3 ${
          isValid ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
        }`}
        disabled={!isValid || isValidating}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <View className="bg-red-100 p-2 rounded-lg mr-3">
                <Tag size={16} color="#DC2626" />
              </View>
              <View>
                <Text 
                  className="text-lg font-bold text-gray-900" 
                  style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                >
                  {coupon.code}
                </Text>
                <Text 
                  className="text-sm text-red-600" 
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  {getDiscountText(coupon)}
                </Text>
              </View>
            </View>
            
            <Text 
              className="text-sm text-gray-600 mb-2" 
              style={{ fontFamily: 'PlusJakartaSans-Regular' }}
            >
              {coupon.description}
            </Text>
            
            {coupon.minOrderAmount > 0 && (
              <Text 
                className="text-xs text-gray-500" 
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
              >
                Min order: ₹{coupon.minOrderAmount}
              </Text>
            )}
            
            <View className="flex-row items-center mt-2">
              <Calendar size={12} color="#6B7280" />
              <Text 
                className="text-xs text-gray-500 ml-1" 
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
              >
                Valid till {formatDate(coupon.validTo)}
              </Text>
            </View>
          </View>
          
          <View className="ml-4">
            {isValidating ? (
              <LoadingSpinner size="small" color="#DC2626" />
            ) : (
              <TouchableOpacity
                onPress={() => isValid ? validateCoupon(coupon.code) : null}
                className={`px-4 py-2 rounded-lg ${
                  isValid ? 'bg-[#171717]' : 'bg-gray-300'
                }`}
                disabled={!isValid}
              >
                <Text 
                  className={`text-sm font-semibold ${
                    isValid ? 'text-white' : 'text-gray-500'
                  }`}
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  {isValid ? 'Apply' : 'Invalid'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ActionSheet 
      id={sheetId}
      containerStyle={{
        paddingHorizontal: 0,
        paddingBottom: 0,
      }}
      gestureEnabled={true}
      closable={true}
      closeOnTouchBackdrop={true}
    >
      <View className="flex-col items-stretch rounded-t-2xl bg-white h-screen" >
        {/* Handle */}
        <View className="flex h-5 w-full items-center justify-center pt-3">
          <View className="h-1.5 w-10 rounded-full bg-gray-200" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text 
            className="text-2xl text-gray-900" 
            style={{ fontFamily: 'PlusJakartaSans-Bold' }}
          >
            Apply Coupon
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Manual Coupon Input */}
        <View className="px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center gap-3">
            <TextInput
              className="flex-1 h-12 px-4 border border-gray-300 rounded-lg"
              placeholder="Enter coupon code"
              value={manualCouponCode}
              onChangeText={setManualCouponCode}
              autoCapitalize="characters"
              style={{ fontFamily: 'PlusJakartaSans-Regular' }}
            />
            <TouchableOpacity
              onPress={() => manualCouponCode.trim() && validateCoupon(manualCouponCode.trim())}
              className={`px-6 py-3 rounded-lg ${
                manualCouponCode.trim() ? 'bg-[#171717]' : 'bg-gray-300'
              }`}
              disabled={!manualCouponCode.trim() || validatingCoupon === manualCouponCode.trim()}
            >
              {validatingCoupon === manualCouponCode.trim() ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                <Text 
                  className={`text-sm font-semibold ${
                    manualCouponCode.trim() ? 'text-white' : 'text-gray-500'
                  }`}
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  Apply
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Available Coupons */}
        <View className="flex-1">
          <View className="px-6 py-4">
            <Text 
              className="text-lg font-semibold text-gray-900" 
              style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
            >
              Available Coupons
            </Text>
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center py-8">
              <LoadingSpinner size="large" color="#DC2626" />
              <Text 
                className="text-gray-500 mt-2" 
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
              >
                Loading coupons...
              </Text>
            </View>
          ) : (
            <ScrollView 
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
            >
              {coupons.length > 0 ? (
                coupons.map(renderCoupon)
              ) : (
                <View className="items-center justify-center py-8">
                  <Tag size={48} color="#9CA3AF" />
                  <Text 
                    className="text-lg text-gray-500 mt-4" 
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    No Coupons Available
                  </Text>
                  <Text 
                    className="text-sm text-gray-400 mt-2 text-center" 
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                  >
                    Check back later for new offers
                  </Text>
                </View>
              )}
              
              {/* Bottom spacing */}
              <View className="h-6" />
            </ScrollView>
          )}
        </View>
      </View>
    </ActionSheet>
  );
}
