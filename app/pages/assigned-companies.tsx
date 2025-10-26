// app/pages/assigned-companies.tsx
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ScrollView, StyleSheet, View, Pressable, Alert, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { getScreenOptions } from '@/components/shared/headerOption';

// Type definitions
type Company = {
  id: string;
  companyName: string;
  location: string;
  registrationDate: string;
  status: 'active' | 'inactive';
};

type User = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  userType: 'admin' | 'guest';
};

type UserCompanyAssignment = {
  userId: string;
  companyIds: string[];
};

// Mock data - replace with your API call
const mockCompanies: Company[] = [
  {
    id: 'C001',
    companyName: 'Tech Solutions Ltd',
    location: 'Colombo',
    registrationDate: '2024-01-15',
    status: 'active',
  },
  {
    id: 'C002',
    companyName: 'Digital Marketing Pro',
    location: 'Kandy',
    registrationDate: '2024-02-20',
    status: 'active',
  },
  {
    id: 'C003',
    companyName: 'Finance Hub',
    location: 'Galle',
    registrationDate: '2024-03-10',
    status: 'active',
  },
  {
    id: 'C004',
    companyName: 'Retail World',
    location: 'Negombo',
    registrationDate: '2024-04-05',
    status: 'active',
  },
  {
    id: 'C005',
    companyName: 'Healthcare Plus',
    location: 'Colombo',
    registrationDate: '2024-05-12',
    status: 'active',
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    userId: 'USR001',
    userName: 'John Doe',
    email: 'john.doe@example.com',
    userType: 'guest',
  },
  {
    id: '2',
    userId: 'USR002',
    userName: 'Jane Smith',
    email: 'jane.smith@example.com',
    userType: 'guest',
  },
  {
    id: '3',
    userId: 'USR003',
    userName: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    userType: 'guest',
  },
  {
    id: '4',
    userId: 'USR004',
    userName: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    userType: 'guest',
  },
];

// Mock initial assignments
const mockAssignments: UserCompanyAssignment[] = [
  { userId: 'USR001', companyIds: ['C001', 'C002'] },
  { userId: 'USR002', companyIds: ['C003'] },
  { userId: 'USR003', companyIds: [] },
  { userId: 'USR004', companyIds: ['C001', 'C003', 'C005'] },
];

export default function AssignedCompanies() {
  const { colorScheme } = useColorScheme();
  const [companies, setCompanies] = React.useState<Company[]>(mockCompanies);
  const [users, setUsers] = React.useState<User[]>(mockUsers);
  const [assignments, setAssignments] = React.useState<UserCompanyAssignment[]>(mockAssignments);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loadingCompanyId, setLoadingCompanyId] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // TODO: Replace with your API calls
      // const companiesResponse = await CompanyService.getRegisteredCompanies();
      // const usersResponse = await UserService.getGuestUsers();
      // const assignmentsResponse = await CompanyService.getUserAssignments();
      
      setCompanies(mockCompanies);
      setUsers(mockUsers);
      setAssignments(mockAssignments);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const getUserAssignments = (userId: string): string[] => {
    const assignment = assignments.find(a => a.userId === userId);
    return assignment?.companyIds || [];
  };

  const isCompanyAssigned = (userId: string, companyId: string): boolean => {
    const userCompanies = getUserAssignments(userId);
    return userCompanies.includes(companyId);
  };

  const handleToggleCompany = async (userId: string, companyId: string) => {
    const isCurrentlyAssigned = isCompanyAssigned(userId, companyId);
    setLoadingCompanyId(companyId);

    try {
      if (isCurrentlyAssigned) {
        // Unassign company - Real-time save
        // TODO: Replace with your API call
        // await CompanyService.unassignCompany(userId, companyId);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setAssignments(prevAssignments =>
          prevAssignments.map(assignment =>
            assignment.userId === userId
              ? {
                  ...assignment,
                  companyIds: assignment.companyIds.filter(id => id !== companyId),
                }
              : assignment
          )
        );
        
        // Success feedback can be subtle or removed for better UX
        // Alert.alert('Success', 'Company unassigned');
      } else {
        // Assign company - Real-time save
        // TODO: Replace with your API call
        // await CompanyService.assignCompany(userId, companyId);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setAssignments(prevAssignments => {
          const existingAssignment = prevAssignments.find(a => a.userId === userId);
          if (existingAssignment) {
            return prevAssignments.map(assignment =>
              assignment.userId === userId
                ? {
                    ...assignment,
                    companyIds: [...assignment.companyIds, companyId],
                  }
                : assignment
            );
          } else {
            return [...prevAssignments, { userId, companyIds: [companyId] }];
          }
        });
        
        // Success feedback can be subtle or removed for better UX
        // Alert.alert('Success', 'Company assigned');
      }
    } catch (error) {
      console.error('Error toggling company assignment:', error);
      Alert.alert('Error', 'Failed to update company assignment');
    } finally {
      setLoadingCompanyId(null);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAssignedCount = (userId: string): number => {
    return getUserAssignments(userId).length;
  };

  return (
    <>
      <Stack.Screen options={getScreenOptions(colorScheme ?? 'light')} />
      <View className="flex-1 bg-background" style={{ marginTop: 110 }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text className="text-foreground text-3xl font-bold mb-2">
              Company Assignments
            </Text>
            <Text className="text-muted-foreground text-sm mb-4">
              Assign companies to users
            </Text>

            {/* Search Bar */}
            <View className="bg-card border border-border rounded-xl p-3 flex-row items-center">
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                className="flex-1 text-foreground ml-2"
                placeholder="Search users..."
                placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <View style={styles.contentContainer}>
            {!selectedUser ? (
              // User List View
              <>
                <Text className="text-foreground text-lg font-bold mb-3">
                  Guest Users ({filteredUsers.length})
                </Text>

                {filteredUsers.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>👥</Text>
                    <Text className="text-muted-foreground text-base text-center mt-4">
                      No users found
                    </Text>
                  </View>
                ) : (
                  filteredUsers.map((user) => {
                    const assignedCount = getAssignedCount(user.userId);

                    return (
                      <Pressable
                        key={user.id}
                        style={({ pressed }) => [
                          styles.userCard,
                          pressed && styles.userCardPressed,
                        ]}
                        onPress={() => handleUserSelect(user)}
                      >
                        <View style={styles.userCardContent}>
                          <View className="w-14 h-14 rounded-full bg-muted justify-center items-center">
                            <Text style={styles.userIcon}>👤</Text>
                          </View>
                          <View style={styles.userInfo}>
                            <Text className="text-foreground text-base font-bold mb-0.5">
                              {user.userName}
                            </Text>
                            <Text className="text-muted-foreground text-xs mb-1">
                              {user.email}
                            </Text>
                            <Text className="text-muted-foreground text-xs">
                              User ID: {user.userId}
                            </Text>
                            <View style={styles.assignedBadge}>
                              <Text className="text-primary text-xs font-semibold">
                                📊 {assignedCount} {assignedCount === 1 ? 'company' : 'companies'} assigned
                              </Text>
                            </View>
                          </View>
                          <View style={styles.arrowContainer}>
                            <Text style={styles.arrowIcon}>›</Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })
                )}
              </>
            ) : (
              // Company Assignment View
              <>
                {/* Back Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed,
                  ]}
                  onPress={handleBackToUsers}
                >
                  <Text style={styles.backIcon}>‹</Text>
                  <Text className="text-primary text-sm font-semibold ml-2">
                    Back to Users
                  </Text>
                </Pressable>

                {/* Selected User Info */}
                <View className="bg-card border border-border rounded-2xl p-5 mb-4 shadow-sm">
                  <View style={styles.selectedUserHeader}>
                    <View className="w-16 h-16 rounded-full bg-muted justify-center items-center">
                      <Text style={styles.selectedUserIcon}>👤</Text>
                    </View>
                    <View style={styles.selectedUserInfo}>
                      <Text className="text-foreground text-xl font-bold mb-1">
                        {selectedUser.userName}
                      </Text>
                      <Text className="text-muted-foreground text-xs mb-0.5">
                        {selectedUser.email}
                      </Text>
                      <Text className="text-muted-foreground text-xs">
                        User ID: {selectedUser.userId}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Company List with Checkboxes */}
                <Text className="text-foreground text-lg font-bold mb-3">
                  Registered Companies ({companies.length})
                </Text>
                <Text className="text-muted-foreground text-xs mb-4">
                  Check or uncheck companies to assign. Changes are saved automatically.
                </Text>

                {companies.map((company) => {
                  const isAssigned = isCompanyAssigned(selectedUser.userId, company.id);
                  const isLoading = loadingCompanyId === company.id;

                  return (
                    <Pressable
                      key={company.id}
                      style={({ pressed }) => [
                        styles.companyCard,
                        isAssigned && styles.companyCardAssigned,
                        pressed && styles.companyCardPressed,
                      ]}
                      onPress={() => handleToggleCompany(selectedUser.userId, company.id)}
                      disabled={isLoading}
                    >
                      <View style={styles.companyCardContent}>
                        <View style={styles.companyCheckbox}>
                          {isLoading ? (
                            <View style={styles.checkboxLoading}>
                              <Text style={styles.loadingText}>⏳</Text>
                            </View>
                          ) : isAssigned ? (
                            <View style={styles.checkboxChecked}>
                              <Text style={styles.checkboxCheckmark}>✓</Text>
                            </View>
                          ) : (
                            <View style={styles.checkboxUnchecked} />
                          )}
                        </View>
                        <View style={styles.companyIcon}>
                          <Text style={styles.companyIconText}>🏢</Text>
                        </View>
                        <View style={styles.companyInfo}>
                          <Text className="text-foreground text-sm font-bold mb-1">
                            {company.companyName}
                          </Text>
                          <Text className="text-muted-foreground text-xs">
                            📍 {company.location}
                          </Text>
                          <Text className="text-muted-foreground text-xs">
                            📅 Registered: {company.registrationDate}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  searchIcon: {
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    opacity: 0.3,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  assignedBadge: {
    marginTop: 6,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: 28,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backIcon: {
    fontSize: 24,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  selectedUserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedUserIcon: {
    fontSize: 28,
  },
  selectedUserInfo: {
    flex: 1,
    marginLeft: 16,
  },
  companyCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  companyCardAssigned: {
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
    borderWidth: 2,
  },
  companyCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  companyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyCheckbox: {
    marginRight: 12,
  },
  checkboxChecked: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxUnchecked: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  checkboxLoading: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCheckmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 14,
  },
  companyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  companyIconText: {
    fontSize: 22,
  },
  companyInfo: {
    flex: 1,
  },
});