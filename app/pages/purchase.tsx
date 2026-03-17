import { Input } from '@/components/ui/input';
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
import { useCart } from '@/lib/cartContext';

export default function PurchaseForm() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const { cart, tempCart, addToCart, clearCart, getTotalItems } = useCart();

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

  const [showCart, setShowCart] = React.useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = React.useState(false);

  const [isPageDisabled, setIsPageDisabled] = React.useState(false);

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
    const initializePage = async () => {
      const cartType = await validateCartType();

      if (cartType !== 2) {
        // Cart is empty or has purchase items, load products normally
        setIsPageDisabled(false);
        loadActiveProductList();
      } else {
        // Cart has sales items (type 2), disable page and show alert
        setIsPageDisabled(true);

        Alert.alert(
          'Cart Validation',
          'Cart already has sales items. Do you want to clear it?',
          [
            {
              text: 'No',
              onPress: () => {
                // Redirect to previous page or home
                router.back();
              },
              style: 'cancel'
            },
            {
              text: 'Yes',
              onPress: () => {
                // Clear cart and enable page
                clearCart();
                setIsPageDisabled(false);
                loadActiveProductList();
              }
            }
          ],
          { cancelable: false }
        );
      }
    };

    initializePage();
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

  const validateCartType = async () => {
    try {
      if (tempCart.length === 0) {
        return 0;
      }

      const cartType = tempCart[0].type;

      // If cart is empty or null, return 0
      if (cartType === null || cartType === undefined || cartType === 0) {
        return 0;
      }

      return cartType;
    } catch (error) {
      console.error('Error validating cart type:', error);
      return 0;
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
        SeqNo: cart.length + 1, // ✅ Using cart from context
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
        type: 1, // Purchase
        seqNo: cart.length + 1,
        productName: selectedProduct,
        CategoryName: selectedCategory,
        GrossQty: parseFloat(gross),
        BaleQty: parseFloat(bale) || 0,
        WastageQty: parseFloat(wastage) || 0,
        NetQty: netKg,
        UnitPrice: parseFloat(price),
        NetValue: totalValue
      };

      // ✅ WITH THIS LINE:
      addToCart(transactionDetail, tempCartDetails);
      //console.log("temcart",cart)

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

  return (
    <>
      <Stack.Screen
        options={getScreenOptions(colorScheme ?? 'light', {
          pageTitle: 'Purchase',
          hideBackButton: false,
          showThemeToggle: false
        })}
      />
      <View
        className="flex-1 bg-background"
        style={{ marginTop: 110 }}
        pointerEvents={isPageDisabled ? 'none' : 'auto'}
      >
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
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 1000,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
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