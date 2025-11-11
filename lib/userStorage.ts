import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUsers, CompanyInfo, RegisteredDevice, StockSummaryData, TempCart, TransactionDetails, UserBranch } from '../app/Types/user.types';

const STORAGE_KEYS = {
  USER_BRANCHES: '@user_branches',
  SELECTED_BRANCH: '@selected_branch',
  COMPANY_NAME: '@company_name',
  TOKEN_STRING: '@token_string',
  STOCK_SUMMARY: "@Stock_Summary",
  REGISTERED_DEVICE: "@Registered_Device",
  COMPANY_INFO: "@CompanyInfo",
  APP_USERS: "@App_Users",
  USER_COMPANY: "@User_Company",
  TEMP_CART: "@Temp_Cart"
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

  //Saved Stock Summary
  static async saveStockSummary(stockSummary: StockSummaryData[]): Promise<void> {
    try {
      // Save company name from first branch
      if (stockSummary.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.STOCK_SUMMARY, JSON.stringify(stockSummary));
      }
    } catch (error) {
      console.error('Error saving stock summary:', error);
      throw error;
    }
  }

  // Get Stock Summary
  static async getStockSummary(): Promise<StockSummaryData[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STOCK_SUMMARY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting stock summary:', error);
      return [];
    }
  }

  static async saveRegisteredDevices(obj: RegisteredDevice[]): Promise<void> {
    try {
      // Save company name from first branch
      if (obj.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_DEVICE, JSON.stringify(obj));
      }
    } catch (error) {
      console.error('Error saving registered device:', error);
      throw error;
    }
  }

  static async getRegisteredDevices(): Promise<RegisteredDevice[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_DEVICE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting registered device:', error);
      return [];
    }
  }

  static async saveAllCompanies(obj: CompanyInfo[]): Promise<void> {
    try {
      // Save company name from first branch
      if (obj.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.COMPANY_INFO, JSON.stringify(obj));
      }
    } catch (error) {
      console.error('Error saving COMPANY_INFO:', error);
      throw error;
    }
  }

  static async getAllCompanies(): Promise<CompanyInfo[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPANY_INFO);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting COMPANY_INFO:', error);
      return [];
    }
  }

  static async saveAllAppUsers(obj: AppUsers[]): Promise<void> {
    try {
      // Save company name from first branch
      if (obj.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.APP_USERS, JSON.stringify(obj));
      }
    } catch (error) {
      console.error('Error saving App Users:', error);
      throw error;
    }
  }

  static async getAllAppUsers(): Promise<AppUsers[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_USERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting App Users:', error);
      return [];
    }
  }

  // static async save(obj: []): Promise<void> {
  //   try {
  //     // Save company name from first branch
  //     if (obj.length > 0) {
  //       await AsyncStorage.setItem(STORAGE_KEYS., JSON.stringify(obj));
  //     }
  //   } catch (error) {
  //     console.error('Error saving :', error);
  //     throw error;
  //   }
  // }

  // static async get(): Promise<[]> {
  //   try {
  //     const data = await AsyncStorage.getItem(STORAGE_KEYS.);
  //     return data ? JSON.parse(data) : [];
  //   } catch (error) {
  //     console.error('Error getting :', error);
  //     return [];
  //   }
  // }

  static async saveTempCart(obj: TempCart[]): Promise<void> {
    try {
      if (obj.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.TEMP_CART, JSON.stringify(obj));
      }
    } catch (error) {
      console.error('Error saving temp cart:', error);
      throw error;
    }
  }

  static async getTempCart(): Promise<TempCart[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TEMP_CART);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting temp cart:', error);
      return [];
    }
  }
  
  static async clearTempCart(): Promise<void> {
    try {
      await AsyncStorage.removeItem('tempCart');
      console.log('Temp cart cleared successfully');
    } catch (error) {
      console.error('Error clearing temp cart:', error);
      throw error;
    }
  }

}