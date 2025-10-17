import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { 
  Image, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  View, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { UserStorage } from '../Utils/userStorage';
import { UserBranch, BranchData } from '../Types/User.types';

export default function SwitchCompany() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = React.useState<number | null>(null);
  const [branches, setBranches] = React.useState<BranchData[]>([]);
  const [companyName, setCompanyName] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const [rawBranchData, setRawBranchData] = React.useState<UserBranch[]>([]);

  // Transform API data to display format
  const transformBranchData = (apiData: UserBranch[]): BranchData[] => {
    return apiData.map((branch) => ({
      id: branch.companyId,
      name: branch.locationName,
      location: branch.address.replace(/\n/g, ', '),
      isActive: branch.userStatus === 1,
      companyId: branch.companyId,
      address: branch.address,
    }));
  };

  // Load branches from AsyncStorage
  React.useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      
      // Get data from AsyncStorage
      const storedBranches = await UserStorage.getUserBranches();
      const storedCompanyName = await UserStorage.getCompanyName();

      if (storedBranches.length > 0) {
        setRawBranchData(storedBranches);
        const transformedBranches = transformBranchData(storedBranches);
        setBranches(transformedBranches);
        setCompanyName(storedCompanyName);
      } else {
        // No data found - redirect to login
        console.warn('No branch data found. Redirecting to login...');
        // router.push('/login'); // Uncomment if you want auto-redirect
      }
    } catch (error) {
      console.error('Error loading branches:', error);
    } finally {
      setLoading(false);
    }
  };

  function handleBranchSelect(branchId: number) {
    setSelectedBranch(branchId);
  }

  async function handleContinue() {
    if (selectedBranch) {
      try {
        // Find the selected branch in raw data
        const selectedBranchData = rawBranchData.find(
          b => b.companyId === selectedBranch
        );

        if (selectedBranchData) {
          // Save selected branch to AsyncStorage
          await UserStorage.saveSelectedBranch(selectedBranchData);
          
          console.log('Selected branch saved:', selectedBranchData);
          
          // Navigate to dashboard
          router.push("/pages/Dashboard/Dashbord");
        }
      } catch (error) {
        console.error('Error saving selected branch:', error);
      }
    }
  }

  // Show loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading branches...</Text>
      </View>
    );
  }

  // Show empty state if no branches
  if (branches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No branches found</Text>
        <Button 
          className="mt-4 bg-green-600"
          onPress={() => router.push('/pages/sign-in-form')}
        >
          <Text className="text-white">Back to Login</Text>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('assets/images/LogoWord.png')} 
            style={styles.logo} 
          />
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.companyText}>{companyName}</Text>
            <Text style={styles.subtitle}>
              Select Your Branch
            </Text>
          </View>

          {/* Branch Tiles Grid */}
          <View style={styles.branchGrid}>
            {branches.map((branch) => (
              <Pressable
                key={branch.id}
                style={[
                  styles.branchTile,
                  selectedBranch === branch.id && styles.branchTileSelected,
                  !branch.isActive && styles.branchTileDisabled
                ]}
                onPress={() => branch.isActive && handleBranchSelect(branch.id)}
                disabled={!branch.isActive}
              >
                <View style={styles.branchTileContent}>
                  {/* Branch Icon/Initial */}
                  <View style={[
                    styles.branchIcon,
                    selectedBranch === branch.id && styles.branchIconSelected
                  ]}>
                    <Text style={[
                      styles.branchIconText,
                      selectedBranch === branch.id && styles.branchIconTextSelected
                    ]}>
                      {branch.name.charAt(0)}
                    </Text>
                  </View>

                  {/* Branch Details */}
                  <View style={styles.branchDetails}>
                    <Text style={[
                      styles.branchName,
                      selectedBranch === branch.id && styles.branchNameSelected,
                      !branch.isActive && styles.branchNameDisabled
                    ]}>
                      {branch.name}
                    </Text>
                    <Text 
                      style={[
                        styles.branchLocation,
                        !branch.isActive && styles.branchLocationDisabled
                      ]}
                      numberOfLines={2}
                    >
                      {branch.location}
                    </Text>
                  </View>

                  {/* Selection Indicator */}
                  {selectedBranch === branch.id && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}

                  {/* Inactive Badge */}
                  {!branch.isActive && (
                    <View style={styles.inactiveBadge}>
                      <Text style={styles.inactiveBadgeText}>Inactive</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Continue Button */}
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            onPress={handleContinue}
            disabled={!selectedBranch}
            style={[styles.continueButton, !selectedBranch && styles.continueButtonDisabled]}
          >
            <Text className="text-white font-medium">
              Continue
            </Text>
          </Button>

          {/* Additional Info */}
          <Text style={styles.infoText}>
            {branches.filter(b => b.isActive).length} active branch(es) available
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#f8f9fa',
  },
  logo: {
    width: 280,
    height: 80,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  companyText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fcba03',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  branchGrid: {
    gap: 16,
    marginBottom: 32,
  },
  branchTile: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  branchTileSelected: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  branchTileDisabled: {
    backgroundColor: '#f9fafb',
    opacity: 0.6,
  },
  branchTileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  branchIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  branchIconSelected: {
    backgroundColor: '#16a34a',
  },
  branchIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  branchIconTextSelected: {
    color: '#ffffff',
  },
  branchDetails: {
    flex: 1,
  },
  branchName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  branchNameSelected: {
    color: '#16a34a',
  },
  branchNameDisabled: {
    color: '#9ca3af',
  },
  branchLocation: {
    fontSize: 14,
    color: '#6b7280',
  },
  branchLocationDisabled: {
    color: '#d1d5db',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inactiveBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inactiveBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  continueButton: {
    marginBottom: 16,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
  },
});