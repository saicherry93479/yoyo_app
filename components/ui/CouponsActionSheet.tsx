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
import { X, Tag, Calendar } from 'lucide-react-native';
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
  isUsed: boolean;
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
    if (coupon.isUsed || coupon.status !== 'active') return false;

    const isValidForHotel = coupon.mappings.hotels.length === 0 || 
      coupon.mappings.hotels.some(hotel => hotel.id === hotelId);
    
    const meetsMinAmount = !orderAmount || orderAmount >= coupon.minOrderAmount;
    
    return isValidForHotel && meetsMinAmount;
  };

  const renderCoupon = (coupon: Coupon) => {
    const isValid = isValidForBooking(coupon);
    const isValidating = validatingCoupon === coupon.code;

    return (
      <TouchableOpacity
        key={coupon.id}
        onPress={() => isValid && !isValidating ? validateCoupon(coupon.code) : null}
        className={`mb-3 rounded-xl border ${
          coupon.isUsed 
            ? 'border-gray-200 bg-gray-50' 
            : isValid 
            ? 'border-black bg-white' 
            : 'border-gray-200 bg-gray-50'
        }`}
        disabled={!isValid || isValidating}
        activeOpacity={0.7}
      >
        <View className="p-5">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                coupon.isUsed ? 'bg-gray-200' : 'bg-black'
              }`}>
                <Tag size={18} color={coupon.isUsed ? '#9CA3AF' : 'white'} />
              </View>
              <View>
                <Text 
                  className={`text-lg font-bold ${coupon.isUsed ? 'text-gray-500' : 'text-black'}`}
                  style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                >
                  {coupon.code}
                </Text>
                <Text 
                  className={`text-sm font-medium ${
                    coupon.isUsed ? 'text-gray-400' : 'text-green-600'
                  }`}
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  {getDiscountText(coupon)}
                </Text>
              </View>
            </View>

            {coupon.isUsed ? (
              <View className="bg-gray-100 px-3 py-1 rounded-full">
                <Text 
                  className="text-xs font-semibold text-gray-500"
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  USED
                </Text>
              </View>
            ) : isValidating ? (
              <LoadingSpinner size="small" color="#000000" />
            ) : isValid ? (
              <View className="bg-black px-4 py-2 rounded-full">
                <Text 
                  className="text-xs font-semibold text-white"
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  APPLY
                </Text>
              </View>
            ) : (
              <View className="bg-gray-200 px-3 py-1 rounded-full">
                <Text 
                  className="text-xs font-semibold text-gray-500"
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  INVALID
                </Text>
              </View>
            )}
          </View>
          
          <Text 
            className={`text-sm mb-3 leading-5 ${coupon.isUsed ? 'text-gray-400' : 'text-gray-600'}`}
            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
          >
            {coupon.description}
          </Text>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Calendar size={14} color={coupon.isUsed ? '#9CA3AF' : '#6B7280'} />
              <Text 
                className={`text-xs ml-2 ${coupon.isUsed ? 'text-gray-400' : 'text-gray-500'}`}
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
              >
                Valid till {formatDate(coupon.validTo)}
              </Text>
            </View>
            
            {coupon.minOrderAmount > 0 && (
              <Text 
                className={`text-xs ${coupon.isUsed ? 'text-gray-400' : 'text-gray-500'}`}
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
              >
                Min ₹{coupon.minOrderAmount}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const availableCoupons = coupons.filter(coupon => !coupon.isUsed && isValidForBooking(coupon));
  const otherCoupons = coupons.filter(coupon => coupon.isUsed || !isValidForBooking(coupon));

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
      <View className="flex-col items-stretch rounded-t-3xl bg-white h-screen">
        {/* Handle */}
        <View className="flex h-6 w-full items-center justify-center pt-2">
          <View className="h-1 w-12 rounded-full bg-gray-300" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-5">
          <Text 
            className="text-2xl font-bold text-black" 
            style={{ fontFamily: 'PlusJakartaSans-Bold' }}
          >
            Coupons
          </Text>
          <TouchableOpacity onPress={handleClose} className="p-2 -mr-2">
            <X size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Manual Coupon Input */}
        <View className="px-6 pb-6">
          <View className="flex-row items-center bg-gray-50 rounded-xl p-1">
            <TextInput
              className="flex-1 h-12 px-4 text-base"
              placeholder="Enter coupon code"
              placeholderTextColor="#9CA3AF"
              value={manualCouponCode}
              onChangeText={setManualCouponCode}
              autoCapitalize="characters"
              style={{ fontFamily: 'PlusJakartaSans-Regular' }}
            />
            <TouchableOpacity
              onPress={() => manualCouponCode.trim() && validateCoupon(manualCouponCode.trim())}
              className={`px-6 py-3 rounded-lg mx-1 ${
                manualCouponCode.trim() ? 'bg-black' : 'bg-gray-300'
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

        {/* Coupons List */}
        <View className="flex-1">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <LoadingSpinner size="large" color="#000000" />
              <Text 
                className="text-gray-500 mt-4 text-base" 
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
              >
                Loading coupons...
              </Text>
            </View>
          ) : coupons.length > 0 ? (
            <ScrollView 
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
            >
              {availableCoupons.length > 0 && (
                <View className="mb-6">
                  <Text 
                    className="text-base font-semibold text-black mb-4" 
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    Available ({availableCoupons.length})
                  </Text>
                  {availableCoupons.map(renderCoupon)}
                </View>
              )}

              {otherCoupons.length > 0 && (
                <View className="mb-6">
                  <Text 
                    className="text-base font-semibold text-black mb-4" 
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    Other Coupons ({otherCoupons.length})
                  </Text>
                  {otherCoupons.map(renderCoupon)}
                </View>
              )}
              
              <View className="h-8" />
            </ScrollView>
          ) : (
            <View className="flex-1 items-center justify-center px-6">
              <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                <Tag size={32} color="#9CA3AF" />
              </View>
              <Text 
                className="text-xl font-semibold text-black mb-2" 
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
              >
                No coupons available
              </Text>
              <Text 
                className="text-base text-gray-500 text-center leading-6" 
                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
              >
                Check back later for new offers and discounts
              </Text>
            </View>
          )}
        </View>
      </View>
    </ActionSheet>
  );
}