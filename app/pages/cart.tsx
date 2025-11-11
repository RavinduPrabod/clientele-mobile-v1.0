import { Text } from '@/components/ui/text';
import { View, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { getScreenOptions } from '@/components/shared/headerOption';
import React from 'react';
import { useCart } from '@/lib/cartContext';
import { UserStorage } from '@/lib/userStorage';

export default function CartTab() {
  const { colorScheme } = useColorScheme();
  const { tempCart, cart, removeFromCart, clearCart, getTotalValue, getTotalItems } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);

  React.useEffect(() => {
    loadTempCart();
  }, []);

  const loadTempCart = async () => {
    try {
      const savedCart = await UserStorage.getTempCart();
      console.log('Loaded cart:', savedCart);
    } catch (error) {
      console.error('Error loading product list:', error);
    }
  };

  const handleRemoveProduct = (seqNo: number) => {
    removeFromCart(seqNo);
  };

  const handlePlaceOrder = async () => {
    if (tempCart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Place order for ${getTotalItems()} item(s) totaling Rs.${getTotalValue().toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Place Order',
          onPress: async () => {
            setIsPlacingOrder(true);
            try {
              // TODO: Add your order placement API call here
              // Example:
              // const response = await placeOrder(cart, tempCart);
              
              // For now, just simulate the order
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Clear cart after successful order
              clearCart();
              await UserStorage.clearTempCart(); // Add this method to UserStorage
              
              Alert.alert(
                'Success',
                'Your order has been placed successfully!',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate to orders screen or home
                      // router.push('/orders');
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Error placing order:', error);
              Alert.alert('Error', 'Failed to place order. Please try again.');
            } finally {
              setIsPlacingOrder(false);
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={getScreenOptions(colorScheme ?? 'light', {
          pageTitle: 'Cart',
          hideBackButton: false,
          showThemeToggle: false
        })}
      />
      <View className="flex-1 bg-background" style={{ marginTop: 100 }}>
        <View style={styles.container}>
          {tempCart.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text className="text-muted-foreground text-lg">Your cart is empty</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={tempCart}
                keyExtractor={(item) => item.seqNo.toString()}
                contentContainerStyle={styles.cartList}
                renderItem={({ item }) => (
                  <View className="bg-card rounded-xl p-4 mb-3 border border-border mx-4">
                    <View style={styles.cartItemHeader}>
                      <Text className="text-foreground font-bold text-base">
                        {item.productName}
                      </Text>
                      <Text className="text-muted-foreground text-sm">
                        {item.CategoryName}
                      </Text>
                    </View>
                    <View style={styles.cartItemRow}>
                      <Text className="text-muted-foreground text-sm">
                        Net: {item.NetQty.toFixed(2)} Kg
                      </Text>
                      <Text className="text-muted-foreground text-sm">
                        Rs.{item.NetValue.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleRemoveProduct(item.seqNo)}
                      className="self-end bg-destructive/10 rounded-md py-1 px-3 mt-2"
                    >
                      <Text className="text-destructive font-semibold text-sm">
                        Remove
                      </Text>
                    </Pressable>
                  </View>
                )}
              />

              {/* Bottom Section with Total and Place Order Button */}
              <View className="bg-card border-t border-border p-4">
                {/* Total */}
                <View style={styles.cartItemRow}>
                  <View>
                    <Text className="text-muted-foreground text-sm">
                      {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                    </Text>
                    <Text className="text-foreground font-bold text-lg">Total:</Text>
                  </View>
                  <Text className="text-foreground font-bold text-xl">
                    Rs.{getTotalValue().toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </Text>
                </View>

                {/* Place Order Button */}
                <Pressable
                  onPress={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className={`rounded-lg py-3 mt-4 ${
                    isPlacingOrder ? 'bg-primary/50' : 'bg-primary'
                  }`}
                  style={styles.placeOrderButton}
                >
                  <Text className="text-primary-foreground font-bold text-center text-base">
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                  </Text>
                </Pressable>

                {/* Clear Cart Button (Optional) */}
                <Pressable
                  onPress={() => {
                    Alert.alert(
                      'Clear Cart',
                      'Are you sure you want to remove all items?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Clear',
                          style: 'destructive',
                          onPress: () => clearCart()
                        }
                      ]
                    );
                  }}
                  className="rounded-lg py-2 mt-2 border border-destructive"
                >
                  <Text className="text-destructive font-semibold text-center text-sm">
                    Clear Cart
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartList: {
    paddingVertical: 16,
    paddingBottom: 200, // Add padding to prevent overlap with bottom section
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  placeOrderButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});