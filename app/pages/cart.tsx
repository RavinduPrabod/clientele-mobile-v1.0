import { Text } from '@/components/ui/text';
import { View, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { getScreenOptions } from '@/components/shared/headerOption';
import React from 'react';
import { useCart } from '@/lib/cartContext';
import { UserStorage } from '@/lib/userStorage';
import mapCartToTransactionDto from '@/components/shared/dataMaping';
import TransactionService from '../services/TransactionService';

export default function CartTab() {
  const { colorScheme } = useColorScheme();
  const { tempCart, cart, removeFromCart, clearCart, getTotalValue, getTotalItems } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const [selectedCartItem, setSelectedCartItem] = React.useState<any | null>(null);

  React.useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      console.log('insert cart:', cart);
      console.log('temp cart', tempCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const handleRemoveProduct = (seqNo: number) => {
    removeFromCart(seqNo);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
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
              const transactionDto = await mapCartToTransactionDto(cart, tempCart[0].type);
              const response = await TransactionService.insertTransactionDetails(transactionDto);

              // Clear cart after successful order
              clearCart();
              await UserStorage.clearTempCart();

              if (response.statusCode === 200) {
                Alert.alert(
                  'Success',
                  'Your order has been placed successfully!',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        clearCart();
                      }
                    }
                  ]
                );
              }
              else {
                Alert.alert('Error', 'Failed to place order');
              }
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
          {cart.length === 0 ? (
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
                  <Pressable
                    onPress={() => setSelectedCartItem(item)}
                    className="bg-card rounded-xl p-4 mb-3 border border-border mx-4"
                  >
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
                  </Pressable>
                )}
              />

              {/* Selected Cart Item Details Modal */}
              {selectedCartItem && (
                <View style={styles.overlay}>
                  <View className="w-11/12 bg-card rounded-xl p-5 border border-border shadow-lg">
                    <Text className="text-foreground text-xl font-bold mb-3 text-center">Product Details</Text>
                    <View style={styles.detailRow}>
                      <Text className="text-muted-foreground font-semibold">Product:</Text>
                      <Text className="text-foreground">{selectedCartItem.productName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text className="text-muted-foreground font-semibold">Category:</Text>
                      <Text className="text-foreground">{selectedCartItem.CategoryName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text className="text-muted-foreground font-semibold">Gross:</Text>
                      <Text className="text-foreground">{selectedCartItem.GrossQty} Kg</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text className="text-muted-foreground font-semibold">Bale:</Text>
                      <Text className="text-foreground">{selectedCartItem.BaleQty} Kg</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text className="text-muted-foreground font-semibold">Wastage:</Text>
                      <Text className="text-foreground">{selectedCartItem.WastageQty} Kg</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text className="text-muted-foreground font-semibold">Net Kg:</Text>
                      <Text className="text-foreground">{selectedCartItem.NetQty.toFixed(2)} Kg</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text className="text-muted-foreground font-semibold">Price:</Text>
                      <Text className="text-foreground">Rs.{selectedCartItem.UnitPrice.toFixed(2)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text className="text-muted-foreground font-semibold">Total Value:</Text>
                      <Text className="text-foreground font-bold">
                        Rs.{selectedCartItem.NetValue.toFixed(2)}
                      </Text>
                    </View>

                    <Pressable
                      className="mt-4 bg-primary p-2.5 rounded-lg items-center"
                      onPress={() => setSelectedCartItem(null)}
                    >
                      <Text className="text-primary-foreground font-semibold">Close</Text>
                    </Pressable>
                  </View>
                </View>
              )}

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
                  className={`rounded-lg py-3 mt-4 ${isPlacingOrder ? 'bg-primary/50' : 'bg-primary'}`}
                  style={styles.placeOrderButton}
                >
                  <Text className="text-primary-foreground font-bold text-center text-base">
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                  </Text>
                </Pressable>

                {/* Clear Cart Button */}
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
    paddingBottom: 200,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});