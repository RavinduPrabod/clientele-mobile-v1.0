import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, View, FlatList, Image, Alert, ToastAndroid, LayoutChangeEvent } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { TempCart, TransactionDetails, TransactionsSavingDto } from '@/app/Types/user.types';
import TransactionService from '@/app/services/TransactionService';
import { NativeSelectScrollView, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TriggerRef } from '@rn-primitives/select';
import { useColorScheme } from 'nativewind';
import { getScreenOptions } from '@/components/shared/headerOption';
import { UserStorage } from '@/lib/userStorage';
import mapCartToTransactionDto from '@/components/shared/dataMaping';
import { AlertDescription } from '@/components/ui/alert';

export default function PurchaseForm() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  // Form state
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);
  const [selectedProductCode, setSelectedProductCode] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedCategoryCode, setSelectedCategoryCode] = React.useState<string | null>(null);
  const [gross, setGross] = React.useState('');
  const [bale, setBale] = React.useState('');
  const [wastage, setWastage] = React.useState('');
  const [price, setPrice] = React.useState('');

  // Dataset bind
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);

  // Cart state - Fixed: Use TransactionDetails type
  const [cart, setCart] = React.useState<TransactionDetails[]>([]);
  const [tempCart, setTempCart] = React.useState<TempCart[]>([]);
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
  const [selectWidth, setSelectWidth] = React.useState(0);

  const contentInsets = {
    top: 20,
    bottom: 20,
    left: 12,
    right: 12,
  };

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
      if (response?.statusCode === 200 && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading product list:', error);
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

  async function handleAddProduct() {
    if (!selectedProduct || !selectedCategory || !gross || !price) {
      Alert.alert('Alert', 'Please fill all required fields');
      return;
    }

    try {
      const selectedBranch = await UserStorage.getSelectedBranch();
      const companyId = selectedBranch?.companyId || 0;
      const userId = selectedBranch?.userId || 'Unknown';
      const currentDate = new Date().toISOString();
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      // Create TransactionDetails object
      const transactionDetail: TransactionDetails = {
        CompanyId: companyId,
        DocNo: 0,
        SerialNo: 0,
        TxnDate: currentDate,
        TxnYear: currentYear,
        TxnMonth: currentMonth,
        SeqNo: cart.length + 1,
        ProductId: selectedProductCode || '',
        CategoryCode: selectedCategoryCode || '',
        GrossQty: parseFloat(gross),
        BaleQty: parseFloat(bale) || 0,
        WastageQty: parseFloat(wastage) || 0,
        NetQty: netKg,
        UnitPrice: parseFloat(price),
        NetValue: totalValue,
        StockInOut: 0,
        ReturnSerialNo: 0,
        ReturnQty: 0,
        IsPrint: 0,
        CreatedBy: userId,
        CreatedDateTime: currentDate,
        CreatedWorkStation: 'Mobile'
      };

      const tempCartDetails: TempCart = {
        seqNo: cart.length + 1,
        productName: selectedProduct,
        CategoryName: selectedCategory,
        GrossQty: parseFloat(gross),
        BaleQty: parseFloat(bale) || 0,
        WastageQty: parseFloat(wastage) || 0,
        NetQty: netKg,
        UnitPrice: parseFloat(price),
        NetValue: totalValue
      }

      setTempCart(prev => [...prev, tempCartDetails]);
      setCart(prev => [...prev, transactionDetail]);
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
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product to cart');
    }
  }

  const handleRemoveProduct = (serialNo: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.SerialNo !== serialNo));
  };

  async function handlePlaceOrder() {
    if (cart.length === 0) {
      Alert.alert('Error', 'Your cart is empty!');
      return;
    }

    try {
      // Map cart to transaction DTO
      const transactionDto = await mapCartToTransactionDto(
        cart,
        2 // Sales
      );
      const response = await TransactionService.insertTransactionDetails(transactionDto);

      if (response.statusCode === 200) {
        ToastAndroid.show('Order placed successfully!', ToastAndroid.SHORT);
        setCart([]);
        setShowCart(false);
      } else {
        Alert.alert('Error', 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  }

  return (
    <>
      <Stack.Screen
        options={getScreenOptions(colorScheme ?? 'light', {
          pageTitle: 'Sales',
          hideBackButton: false,
          showThemeToggle: false
        })}
      />
      <View className="flex-1 bg-background" style={{ marginTop: 110 }}>
        <View style={styles.container}>
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
                <Text className="text-muted-foreground text-sm mb-2 font-medium">Product</Text>
                <View
                  onLayout={(event: LayoutChangeEvent) => {
                    const { width } = event.nativeEvent.layout;
                    setSelectWidth(width);
                  }}
                >
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
                        <SelectGroup style={{ width: selectWidth || '100%' }}>
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
              </View>

              {/* Category Select */}
              <View style={styles.inputGroup}>
                <Text className="text-muted-foreground text-sm mb-2 font-medium">Category</Text>
                <View
                  onLayout={(event: LayoutChangeEvent) => {
                    const { width } = event.nativeEvent.layout;
                    setSelectWidth(width);
                  }}
                >
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
                        <SelectGroup style={{ width: selectWidth || '100%' }}>
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
              </View>

              {/* Input fields */}
              <View style={styles.inputGroup}>
                <Text className="text-muted-foreground text-sm mb-2 font-medium">Gross</Text>
                <View style={styles.inputWithUnit}>
                  <Input
                    className="flex-1"
                    placeholder="Enter Gross"
                    keyboardType="decimal-pad"
                    value={gross}
                    onChangeText={setGross}
                  />
                  <Text className="text-muted-foreground text-sm font-medium">Kg</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text className="text-muted-foreground text-sm mb-2 font-medium">Bale</Text>
                <View style={styles.inputWithUnit}>
                  <Input
                    className="flex-1"
                    placeholder="Enter Bale"
                    keyboardType="decimal-pad"
                    value={bale}
                    onChangeText={setBale}
                  />
                  <Text className="text-muted-foreground text-sm font-medium">Kg</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text className="text-muted-foreground text-sm mb-2 font-medium">Wastage</Text>
                <View style={styles.inputWithUnit}>
                  <Input
                    className="flex-1"
                    placeholder="Enter Wastage"
                    keyboardType="decimal-pad"
                    value={wastage}
                    onChangeText={setWastage}
                  />
                  <Text className="text-muted-foreground text-sm font-medium">Kg</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text className="text-muted-foreground text-sm mb-2 font-medium">Price</Text>
                <View style={styles.inputWithUnit}>
                  <Input
                    className="flex-1"
                    placeholder="Enter Price"
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={setPrice}
                  />
                  <Text className="text-muted-foreground text-sm font-medium">Rs.</Text>
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
    paddingLeft: 350
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