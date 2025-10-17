import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserBranch } from '../Types/User.types'; 

const STORAGE_KEYS = {
  USER_BRANCHES: '@user_branches',
  SELECTED_BRANCH: '@selected_branch',
  COMPANY_NAME: '@company_name',
};

export class UserStorage {
  // Save all user branches data
  static async saveUserBranches(branches: UserBranch[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_BRANCHES, JSON.stringify(branches));
      
      // Save company name from first branch
      if (branches.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.COMPANY_NAME, branches[0].companyName);
      }
    } catch (error) {
      console.error('Error saving user branches:', error);
      throw error;
    }
  }

  // Get all user branches
  static async getUserBranches(): Promise<UserBranch[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_BRANCHES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user branches:', error);
      return [];
    }
  }

  // Save selected branch
  static async saveSelectedBranch(branch: UserBranch): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_BRANCH, JSON.stringify(branch));
    } catch (error) {
      console.error('Error saving selected branch:', error);
      throw error;
    }
  }

  // Get selected branch
  static async getSelectedBranch(): Promise<UserBranch | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_BRANCH);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting selected branch:', error);
      return null;
    }
  }

  // Get company name
  static async getCompanyName(): Promise<string> {
    try {
      const name = await AsyncStorage.getItem(STORAGE_KEYS.COMPANY_NAME);
      return name || 'Company';
    } catch (error) {
      console.error('Error getting company name:', error);
      return 'Company';
    }
  }

  // Clear all user data
  static async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_BRANCHES,
        STORAGE_KEYS.SELECTED_BRANCH,
        STORAGE_KEYS.COMPANY_NAME,
      ]);
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  }
}