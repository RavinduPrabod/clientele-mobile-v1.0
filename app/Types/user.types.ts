export interface UserBranch {
  userId: string;
  companyId: number;
  companyName: string;
  address: string;
  locationName: string;
  emailAddress: string;
  lastLoginDate: string;
  userStatus: number;
  processDate: string;
  tokenString: string | null;
}

export interface BranchData {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
  companyId: number;
  address: string;
}