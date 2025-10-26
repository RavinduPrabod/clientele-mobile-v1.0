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
import { Stack, useRouter } from 'expo-router';
import { UserStorage } from '../../lib/userStorage';
import { UserBranch, BranchData } from '../Types/user.types';
import AuthService from '../services/AuthService';
import { getScreenOptions } from '@/components/shared/headerOption';
import { useColorScheme } from 'nativewind';

export default function SwitchCompany() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = React.useState<number>(0);
  const [branches, setBranches] = React.useState<BranchData[]>([]);
  const [companyName, setCompanyName] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const [rawBranchData, setRawBranchData] = React.useState<UserBranch[]>([]);
  let UserCode: string
  const { colorScheme } = useColorScheme();

  // Transform API data to display format
  const transformBranchData = (apiData: UserBranch[]): BranchData[] => {
    return apiData.map((branch) => ({
      companyId: branch.companyId,
      name: branch.locationName,
      location: branch.address.replace(/\n/g, ', '),
      isActive: branch.userStatus === 1,
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

          UserCode = selectedBranchData.userId + "$" + selectedBranchData.companyId;
          const response = AuthService.getTokenString(UserCode);

          if ((await response).data != null) {
            // Navigate to dashboard
            router.push("/pages/Dashboard/Dashbord");
          }
        }
      } catch (error) {
        console.error('Error saving selected branch:', error);
      }
    }
  }

  // Show loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="text-muted-foreground mt-4 text-base">Loading branches...</Text>
      </View>
    );
  }

  // Show empty state if no branches
  if (branches.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-6">
        <Text className="text-muted-foreground text-lg text-center">No branches found</Text>
        <Button
          className="mt-4 bg-primary"
          onPress={() => router.push('/pages/sign-in-form')}
        >
          <Text className="text-primary-foreground">Back to Login</Text>
        </Button>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={getScreenOptions(colorScheme ?? 'light')} />
      <View className="flex-1 bg-background" style={{ marginTop: 100 }}>
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
                <Text className="text-foreground text-3xl font-bold text-center mb-2">{companyName}</Text>
                <Text className="text-muted-foreground text-base text-center">
                  Select Your Branch
                </Text>
              </View>

              {/* Branch Tiles Grid */}
              <View style={styles.branchGrid}>
                {branches.map((branch) => (
                  <Pressable
                    key={branch.companyId}
                    className={`
                      bg-card border-2 rounded-xl p-4 shadow-sm
                      ${selectedBranch === branch.companyId ? 'border-primary bg-primary/5' : 'border-border'}
                      ${!branch.isActive ? 'opacity-60' : ''}
                    `}
                    onPress={() => branch.isActive && handleBranchSelect(branch.companyId)}
                    disabled={!branch.isActive}
                  >
                    <View style={styles.branchTileContent}>
                      {/* Branch Icon/Initial */}
                      <View className={`
                        w-12 h-12 rounded-full items-center justify-center mr-4
                        ${selectedBranch === branch.companyId ? 'bg-primary' : 'bg-muted'}
                      `}>
                        <Text className={`
                          text-xl font-bold
                          ${selectedBranch === branch.companyId ? 'text-primary-foreground' : 'text-muted-foreground'}
                        `}>
                          {branch.name.charAt(0)}
                        </Text>
                      </View>

                      {/* Branch Details */}
                      <View style={styles.branchDetails}>
                        <Text className={`
                          text-lg font-semibold mb-1
                          ${selectedBranch === branch.companyId ? 'text-primary' : 'text-foreground'}
                          ${!branch.isActive ? 'text-muted-foreground' : ''}
                        `}>
                          {branch.name}
                        </Text>
                        <Text
                          className={`
                            text-sm
                            ${selectedBranch === branch.companyId ? 'text-primary' : 'text-muted-foreground'}
                            ${!branch.isActive ? 'text-muted-foreground/50' : ''}
                          `}
                          numberOfLines={2}
                        >
                          {branch.location}
                        </Text>
                      </View>

                      {/* Selection Indicator */}
                      {selectedBranch === branch.companyId && (
                        <View className="w-7 h-7 rounded-full bg-primary items-center justify-center ml-2">
                          <Text className="text-primary-foreground text-base font-bold">✓</Text>
                        </View>
                      )}

                      {/* Inactive Badge */}
                      {!branch.isActive && (
                        <View className="absolute -top-2 -right-2 bg-destructive px-2 py-1 rounded-xl">
                          <Text className="text-destructive-foreground text-xs font-semibold">Inactive</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Continue Button */}
              <Button
                className={`w-full bg-primary mb-4 ${!selectedBranch ? 'opacity-50' : ''}`}
                onPress={handleContinue}
                disabled={!selectedBranch}
              >
                <Text className="text-primary-foreground font-medium">
                  Continue
                </Text>
              </Button>

              {/* Additional Info */}
              <Text className="text-muted-foreground text-sm text-center">
                {branches.filter(b => b.isActive).length} active branch(es) available
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30
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
  branchGrid: {
    gap: 16,
    marginBottom: 32,
  },
  branchTileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  branchDetails: {
    flex: 1,
  },
});