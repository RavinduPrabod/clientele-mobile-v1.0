import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, View, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Mock data for dropdowns
const mockProducts = [
  { id: 1, name: 'Rice - Basmati', category: 'Grains' },
  { id: 2, name: 'Wheat Flour', category: 'Flour' },
  { id: 3, name: 'Sugar - White', category: 'Sweeteners' },
  { id: 4, name: 'Dal - Yellow', category: 'Pulses' },
];

const mockCategories = [
  { id: 1, name: 'Grains' },
  { id: 2, name: 'Flour' },
  { id: 3, name: 'Sweeteners' },
  { id: 4, name: 'Pulses' },
];

export default function SalesForm() {
  const router = useRouter();
  
  // Form state
  const [selectedProduct, setSelectedProduct] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [gross, setGross] = React.useState('');
  const [bale, setBale] = React.useState('');
  const [wastage, setWastage] = React.useState('');
  const [price, setPrice] = React.useState('');
  
  // Dropdown visibility
  const [showProductDropdown, setShowProductDropdown] = React.useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState(false);

  // Cart state
  const [cart, setCart] = React.useState<any[]>([]);
  const [showCart, setShowCart] = React.useState(false);

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

  function handleProductSelect(product: string) {
    setSelectedProduct(product);
    setShowProductDropdown(false);
  }

  function handleCategorySelect(category: string) {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  }

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

    // Reset form
    setSelectedProduct('');
    setSelectedCategory('');
    setGross('');
    setBale('');
    setWastage('');
    setPrice('');
  }

  function handleRemoveProduct(id: number) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function handlePlaceOrder() {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    console.log('Placing order:', cart);
    alert('Order placed successfully!');
    setCart([]);
    setShowCart(false);
  }

  function handleBack() {
    router.back();
  }

  function handleProfile() {
    router.push('/pages/profile');
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerIcon}></Text>
          <Text style={styles.headerTitle}>Sales</Text>
        </View>

        {/* Cart Icon with Badge */}
        <Pressable onPress={() => setShowCart(!showCart)} style={styles.cartButton}>
          <Text style={styles.cartIcon}><Image source={require('assets/images/add-to-cart.png')}/></Text>
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </Pressable>

        <Pressable onPress={handleProfile} style={styles.profileButton}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
          </View>
        </Pressable>
      </View>

      {/* Cart Dropdown */}
      {showCart && (
        <View style={styles.cartDropdown}>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Pressable onPress={() => alert(`Product: ${item.product}\nCategory: ${item.category}\nNetKg: ${item.netKg.toFixed(2)}\nValue: Rs.${item.totalValue.toFixed(2)}`)}>
                  <Text style={styles.cartItemText}>
                    {item.product} ({item.netKg.toFixed(2)}Kg) - Rs.{item.totalValue.toFixed(2)}
                  </Text>
                </Pressable>
                <Pressable onPress={() => handleRemoveProduct(item.id)}>
                  <Text style={styles.removeText}>❌</Text>
                </Pressable>
              </View>
            )}
          />
          <Pressable style={styles.placeOrderButton} onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderText}>Place Order</Text>
          </Pressable>
        </View>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Product Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product</Text>
            <Pressable 
              style={styles.dropdown}
              onPress={() => setShowProductDropdown(!showProductDropdown)}
            >
              <Text style={[styles.dropdownText, !selectedProduct && styles.placeholder]}>
                {selectedProduct || 'Select Product'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </Pressable>
            {showProductDropdown && (
              <View style={styles.dropdownMenu}>
                {mockProducts.map((product) => (
                  <Pressable
                    key={product.id}
                    style={styles.dropdownItem}
                    onPress={() => handleProductSelect(product.name)}
                  >
                    <Text style={styles.dropdownItemText}>{product.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Category Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <Pressable 
              style={styles.dropdown}
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <Text style={[styles.dropdownText, !selectedCategory && styles.placeholder]}>
                {selectedCategory || 'Select Category'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </Pressable>
            {showCategoryDropdown && (
              <View style={styles.dropdownMenu}>
                {mockCategories.map((category) => (
                  <Pressable
                    key={category.id}
                    style={styles.dropdownItem}
                    onPress={() => handleCategorySelect(category.name)}
                  >
                    <Text style={styles.dropdownItemText}>{category.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Gross Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gross</Text>
            <View style={styles.inputWithUnit}>
              <Input
                style={styles.input}
                placeholder="Enter Gross"
                keyboardType="decimal-pad"
                value={gross}
                onChangeText={setGross}
              />
              <Text style={styles.unit}>Kg</Text>
            </View>
          </View>

          {/* Bale Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bale</Text>
            <View style={styles.inputWithUnit}>
              <Input
                style={styles.input}
                placeholder="Enter Bale"
                keyboardType="decimal-pad"
                value={bale}
                onChangeText={setBale}
              />
              <Text style={styles.unit}>Kg</Text>
            </View>
          </View>

          {/* Wastage Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wastage</Text>
            <View style={styles.inputWithUnit}>
              <Input
                style={styles.input}
                placeholder="Enter Wastage"
                keyboardType="decimal-pad"
                value={wastage}
                onChangeText={setWastage}
              />
              <Text style={styles.unit}>Kg</Text>
            </View>
          </View>

          {/* Price Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price</Text>
            <View style={styles.inputWithUnit}>
              <Input
                style={styles.input}
                placeholder="Enter Price"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
              <Text style={styles.unit}>Rs.</Text>
            </View>
          </View>
        </View>

        {/* Summary Section - restored to original styles (unchanged) */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Net Kg.</Text>
            <Text style={styles.summaryValueBlue}>
              {netKg.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Value</Text>
            <Text style={styles.summaryValueGreen}>
              {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Add Product Button */}
        <Pressable style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#374151',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d97706',
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#ffffff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#374151',
  },
  placeholder: {
    color: '#9ca3af',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#6b7280',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  unit: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  summaryValueBlue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  summaryValueGreen: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  addButton: {
    backgroundColor: '#22c55e',
    borderRadius: 50,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  /* ---------- ADDED CART STYLES (do not modify original styles above) ---------- */
  cartButton: { position: 'relative', marginRight: 12, paddingLeft:200 },
  cartIcon: { fontSize: 60 },
  cartBadge: {
    position: 'absolute',
    top: 10,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 15,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cartBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  cartDropdown: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cartItemText: { fontSize: 14 },
  removeText: { color: 'red', fontSize: 16 },
  placeOrderButton: {
    backgroundColor: '#22c55e',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  placeOrderText: { color: '#fff', fontWeight: 'bold' },
});