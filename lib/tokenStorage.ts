// utils/storage/tokenStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TokenStorage = {
  async setTokens(accessToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async clearTokens(p0: string | null): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }
};