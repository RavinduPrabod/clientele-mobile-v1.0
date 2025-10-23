import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, View, FlatList, Image, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { TransactionDetails, TransactionsSavingDto, ComboDTO } from '@/app/Types/user.types';
import TransactionService from '@/app/services/TransactionService';
import { ToastAndroid } from 'react-native';
import { NativeSelectScrollView, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TriggerRef } from '@rn-primitives/select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { getScreenOptions } from '@/components/shared/headerOption';

export default function PurchaseForm() {
  const router = useRouter();
  // Form state
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);
  const [selectedProductCode, setSelectedProductCode] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedCategoryCode, setSelectedCategoryCode] = React.useState<string | null>(null);
  const [gross, setGross] = React.useState('');
  const [bale, setBale] = React.useState('');
  const [wastage, setWastage] = React.useState('');
  const [price, setPrice] = React.useState('');

  // dataset bind
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);

  // Cart state
  const [cart, setCart] = React.useState<any[]>([]);
  const [showCart, setShowCart] = React.useState(false);
  const [selectedCartItem, setSelectedCartItem] = React.useState<any | null>(null);

  const [isCategoryLoading, setIsCategoryLoading] = React.useState(false);

  // Calculated values
  const netKg = React.useMemo(() => {
    const grossVal = parseFloat(gross) || 0;
    const baleVal = parseFloat(bale) || 0;
    const wastageVal = parseFloat(wastage) || 0;
    return grossVal - baleVal - wastageVal;
  }, [gross, bale, wastage]);

  const totalValue = React.useMemo(() => {
    const priceVal = parseFloat(price) || 0;
    return netKg * priceVal;
  }, [netKg, price]);

  const scrollRef = React.useRef<ScrollView>(null);
  const productTriggerRef = React.useRef<TriggerRef>(null);
  const categoryTriggerRef = React.useRef<TriggerRef>(null);
  const insets = useSafeAreaInsets();

  const { colorScheme } = useColorScheme();

  // Simplified content insets
  const contentInsets = {
    top: 20,
    bottom: 20,
    left: 12,
    right: 12,
  };

  // Load products on mount
  React.useEffect(() => {
    loadActiveProductList();
  }, []);

  React.useEffect(() => {
    if (cart.length === 0 && showCart) {
      setShowCart(false);
    }
  }, [cart]);

  const loadActiveProductList = async () => {
    try {
      const response = await TransactionService.getActiveProductList();
      console.log('✅ Product API Response:', response);

      if (response?.statusCode === 200 && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.warn('⚠️ No valid product list found');
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Error loading product list:', error);
    }
  };

  const handleProductSelect = async (productCode: string) => {
    try {
      const product = products.find(p => p.dataValueField === productCode);
      if (!product) return;

      setSelectedProductCode(productCode);
      setSelectedProduct(product.dataTextField);

      // Disable category dropdown while loading
      setIsCategoryLoading(true);
      setSelectedCategory(null);
      setSelectedCategoryCode(null);

      const response = await TransactionService.getProductCategoryByProductCode(productCode);
      console.log('✅ Category API Response:', response);

      if (response?.statusCode === 200 && Array.isArray(response.data)) {
        setCategories(response.data);
        setIsCategoryLoading(false);

        // Auto-open category dropdown on mobile
        setTimeout(() => {
          categoryTriggerRef.current?.open();
        }, 300);
      } else {
        console.warn('⚠️ No valid Category list found');
        setCategories([]);
        setIsCategoryLoading(false);
      }

    } catch (error) {
      console.error('❌ Error loading Category list:', error);
      setIsCategoryLoading(false);
    }
  };

  const handleCategorySelect = (categoryCode: string) => {
    const category = categories.find(c => c.dataValueField === categoryCode);
    if (category) {
      setSelectedCategoryCode(categoryCode);
      setSelectedCategory(category.dataTextField);
    }
  };

  function handleAddProduct() {
    // Validate form
    if (!selectedProduct || !selectedCategory || !gross || !price) {
      alert('Please fill all required fields');
      return;
    }

    // Handle product addition
    const productData = {
      id: Date.now(), // unique id
      product: selectedProduct,
      category: selectedCategory,
      gross: parseFloat(gross),
      bale: parseFloat(bale) || 0,
      wastage: parseFloat(wastage) || 0,
      price: parseFloat(price),
      netKg,
      totalValue,
    };

    setCart(prev => [...prev, productData]);

    ToastAndroid.show('Product added to cart!', ToastAndroid.SHORT);

    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }

    // Reset form
    setSelectedProduct(null);
    setSelectedProductCode(null);
    setSelectedCategory(null);
    setSelectedCategoryCode(null);
    setGross('');
    setBale('');
    setWastage('');
    setPrice('');
  }

  const handleRemoveProduct = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  function handlePlaceOrder() {
    console.log('Placing order:', cart);
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    console.log('Placing order:', cart);
    alert('Order placed successfully!');
    setCart([]);
    setShowCart(false);
  }

  return (
    <>
      <Stack.Screen options={getScreenOptions(colorScheme ?? 'light', { showProfileButton: true })} />
      <View className="flex-1 bg-background" style={{ marginTop: 60 }}>
        <View style={styles.container}>
          {/* Header */}
          <View className="flex-row justify-between items-center px-4 pt-12 pb-4 bg-card border-b border-border">
            <Text className="text-foreground text-2xl font-bold">Purchase</Text>
            {/* Cart Icon with Badge */}
            <Pressable onPress={() => {
              if (cart.length === 0) {
                alert('Your cart is empty. Please add at least one product.');
                return;
              }
              setShowCart(!showCart);
            }}
              style={styles.cartButton}>
              <Text style={styles.cartIcon}><Image source={require('assets/images/add-to-cart.png')} /></Text>
              {cart.length > 0 && (
                <View className="absolute top-2 -right-2 bg-destructive rounded-full px-1.5 py-0.5">
                  <Text className="text-destructive-foreground text-xs font-bold">{cart.length}</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Cart Dropdown */}
          {showCart && (
            <View className="bg-card p-3 border-b border-border">
              <Text className="text-foreground text-lg font-bold mb-3 text-center">🛒 Cart Summary</Text>
              <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    className="bg-muted rounded-xl p-3 mb-2.5 border border-border"
                    onPress={() => setSelectedCartItem(item)}
                  >
                    <View style={styles.cartItemHeader}>
                      <Text className="text-foreground font-bold text-base">{item.product}</Text>
                      <Text className="text-sm">{item.category}</Text>
                    </View>
                    <View style={styles.cartItemRow}>
                      <Text className="text-xs">Net: {item.netKg.toFixed(2)} Kg</Text>
                      <Text className="text-xs">Rs.{item.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                      {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </View>
                    <Pressable 
                      onPress={() => handleRemoveProduct(item.id)} 
                      className="self-end bg-destructive/10 rounded-md py-1 px-2 mt-1.5"
                    >
                      <Text className="text-destructive font-semibold text-xs">Remove</Text>
                    </Pressable>
                  </Pressable>
                )}
              />

              <Pressable 
                className="bg-primary rounded-lg p-2.5 items-center mt-2"
                onPress={handlePlaceOrder}
              >
                <Text className="text-primary-foreground font-bold">Place Order</Text>
              </Pressable>
            </View>
          )}

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
          >
            {/* Form Card */}
            <View className="bg-card rounded-2xl p-5 mb-4 border border-border shadow-sm">

              {/* Product Select */}
              <View style={styles.inputGroup}>
                <Text className="text-sm mb-2 font-medium">Products</Text>
                <Select
                  value={selectedProductCode ? { value: selectedProductCode, label: selectedProduct || '' } : undefined}
                  onValueChange={(option) => {
                    if (option?.value) {
                      handleProductSelect(option.value);
                    }
                  }}
                >
                  <SelectTrigger ref={productTriggerRef}>
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent insets={contentInsets}>
                    <NativeSelectScrollView
                      showsVerticalScrollIndicator={true}
                      scrollEnabled={true}
                      bounces={true}
                      style={{ maxHeight: 300 }}
                      contentContainerStyle={{ paddingVertical: 4 }}
                    >
                      <SelectGroup>
                        <SelectLabel>Products</SelectLabel>
                        {products.length > 1 ? (
                          products.slice(1).map((product) => (
                            <SelectItem
                              key={product.dataValueField}
                              label={product.dataTextField}
                              value={product.dataValueField}
                            >
                              {product.dataTextField}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="no-data" label="No products available" value="no-data" disabled>
                            No products available
                          </SelectItem>
                        )}
                      </SelectGroup>
                    </NativeSelectScrollView>
                  </SelectContent>
                </Select>
              </View>

              {/* Category Select */}
              <View style={styles.inputGroup}>
                <Text className="text-sm mb-2 font-medium">Categories</Text>
                <Select
                  value={selectedCategoryCode ? { value: selectedCategoryCode, label: selectedCategory || '' } : undefined}
                  onValueChange={(option) => {
                    if (option?.value) {
                      handleCategorySelect(option.value);
                    }
                  }}
                  disabled={isCategoryLoading || categories.length === 0}
                >
                  <SelectTrigger ref={categoryTriggerRef}>
                    <SelectValue
                      placeholder={
                        isCategoryLoading
                          ? "Loading categories..."
                          : categories.length === 0
                            ? "Select a product first"
                            : "Select Category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent insets={contentInsets}>
                    <NativeSelectScrollView
                      showsVerticalScrollIndicator={true}
                      scrollEnabled={true}
                      bounces={true}
                      style={{ maxHeight: 300 }}
                      contentContainerStyle={{ paddingVertical: 4 }}
                    >
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categories.length > 1 ? (
                          categories.slice(1).map((category) => (
                            <SelectItem
                              key={category.dataValueField}
                              label={category.dataTextField}
                              value={category.dataValueField}
                            >
                              {category.dataTextField}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="no-data" label="No categories available" value="no-data" disabled>
                            No categories available
                          </SelectItem>
                        )}
                      </SelectGroup>
                    </NativeSelectScrollView>
                  </SelectContent>
                </Select>
              </View>

              {/* Gross Input */}
              <View style={styles.inputGroup}>
                <Text className="text-sm mb-2 font-medium">Gross</Text>
                <View style={styles.inputWithUnit}>
                  <Input
                    className="flex-1"
                    placeholder="Enter Gross"
                    keyboardType="decimal-pad"
                    value={gross}
                    onChangeText={setGross}
                  />
                  <Text className="text-sm font-medium">Kg</Text>
                </View>
              </View>

              {/* Bale Input */}
              <View style={styles.inputGroup}>
                <Text className="text-sm mb-2 font-medium">Bale</Text>
                <View style={styles.inputWithUnit}>
                  <Input
                    className="flex-1"
                    placeholder="Enter Bale"
                    keyboardType="decimal-pad"
                    value={bale}
                    onChangeText={setBale}
                  />
                  <Text className="text-sm font-medium">Kg</Text>
                </View>
              </View>

              {/* Wastage Input */}
              <View style={styles.inputGroup}>
                <Text className="text-sm mb-2 font-medium">Wastage</Text>
                <View style={styles.inputWithUnit}>
                  <Input
                    className="flex-1"
                    placeholder="Enter Wastage"
                    keyboardType="decimal-pad"
                    value={wastage}
                    onChangeText={setWastage}
                  />
                  <Text className="text-sm font-medium">Kg</Text>
                </View>
              </View>

              {/* Price Input */}
              <View style={styles.inputGroup}>
                <Text className="text-sm mb-2 font-medium">Price</Text>
                <View style={styles.inputWithUnit}>
                  <Input
                    className="flex-1"
                    placeholder="Enter Price"
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={setPrice}
                  />
                  <Text className="text-sm font-medium">Rs.</Text>
                </View>
              </View>

            </View>

            {/* Summary Section */}
            <View className="bg-card rounded-2xl p-5 mb-4 border border-border shadow-sm">
              <View style={styles.summaryRow}>
                <Text className="text-foreground text-base font-semibold">Net Kg.</Text>
                <Text className="text-foreground text-3xl font-bold">
                  {netKg.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text className="text-foreground text-base font-semibold">Value</Text>
                <Text className="text-foreground text-3xl font-bold">
                  {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            </View>

            {/* Add Product Button */}
            <Pressable 
              className="bg-primary rounded-full p-4 items-center shadow-md"
              onPress={handleAddProduct}
            >
              <Text className="text-primary-foreground text-lg font-bold">Add Product</Text>
            </Pressable>

          </ScrollView>

          {/* Selected Cart Item Details Modal */}
          {selectedCartItem && (
            <View style={styles.overlay}>
              <View className="w-11/12 bg-card rounded-xl p-5 border border-border shadow-lg">
                <Text className="text-foreground text-xl font-bold mb-3 text-center">Product Details</Text>
                <View style={styles.detailRow}>
                  <Text className="font-semibold">Product:</Text>
                  <Text className="text-foreground">{selectedCartItem.product}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text className="font-semibold">Category:</Text>
                  <Text className="text-foreground">{selectedCartItem.category}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text className="font-semibold">Gross:</Text>
                  <Text className="text-foreground">{selectedCartItem.gross} Kg</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text className="font-semibold">Bale:</Text>
                  <Text className="text-foreground">{selectedCartItem.bale} Kg</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text className="font-semibold">Wastage:</Text>
                  <Text className="text-foreground">{selectedCartItem.wastage} Kg</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text className="font-semibold">Net Kg:</Text>
                  <Text className="text-foreground">{selectedCartItem.netKg.toFixed(2)} Kg</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text className="font-semibold">Price:</Text>
                  <Text className="text-foreground">Rs.{selectedCartItem.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text className="font-semibold">Total Value:</Text>
                  <Text className="text-foreground font-bold">
                    Rs.{selectedCartItem.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
    position: 'relative',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartButton: { 
    position: 'relative', 
    marginRight: 12, 
    paddingLeft: 150 
  },
  cartIcon: { 
    fontSize: 60 
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});