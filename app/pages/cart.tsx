import { Text } from '@/components/ui/text';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { getScreenOptions } from '@/components/shared/headerOption';
import { TransactionDetails } from '@/app/Types/user.types';
import React from 'react';

export default function CartTab() {
  const { colorScheme } = useColorScheme();
  // You can use a global state management solution like Context API, Redux, or Zustand
  // to share cart data across screens
  const [cart, setCart] = React.useState<TransactionDetails[]>([]);

  const handleRemoveProduct = (serialNo: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.SerialNo !== serialNo));
  };

  return (
    <>
      <Stack.Screen 
        options={getScreenOptions(colorScheme ?? 'light', { showProfileButton: true })} 
      />
      <View className="flex-1 bg-background" style={{ marginTop: 60 }}>
        <View style={styles.container}>
          {/* Header */}
          <View className="flex-row justify-between items-center px-4 pt-12 pb-4 bg-card border-b border-border">
            <Text className="text-foreground text-2xl font-bold">Cart</Text>
          </View>

          {cart.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text className="text-muted-foreground text-lg">Your cart is empty</Text>
            </View>
          ) : (
            <FlatList
              data={cart}
              keyExtractor={(item) => item.SerialNo.toString()}
              contentContainerStyle={styles.cartList}
              renderItem={({ item }) => (
                <View className="bg-card rounded-xl p-4 mb-3 border border-border mx-4">
                  <View style={styles.cartItemHeader}>
                    <Text className="text-foreground font-bold text-base">{item.ProductId}</Text>
                    <Text className="text-muted-foreground text-sm">{item.CategoryCode}</Text>
                  </View>
                  <View style={styles.cartItemRow}>
                    <Text className="text-muted-foreground text-sm">Net: {item.NetQty.toFixed(2)} Kg</Text>
                    <Text className="text-muted-foreground text-sm">
                      Rs.{item.NetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => handleRemoveProduct(item.SerialNo)}
                    className="self-end bg-destructive/10 rounded-md py-1 px-3 mt-2"
                  >
                    <Text className="text-destructive font-semibold text-sm">Remove</Text>
                  </Pressable>
                </View>
              )}
            />
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
});