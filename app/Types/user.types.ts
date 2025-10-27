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
  name: string;
  location: string;
  isActive: boolean;
  companyId: number;
  address: string;
}

export interface StockSummaryData {
  companyId: number;

  productId: string; // max length 18
  uom: string;
  productDescription: string;

  categoryCode: string; // max length 5
  categoryDescription: string;

  storeCode: string; // max length 5
  seqNo: number;

  txnDate: string; // use string for Date to handle JSON serialization
  txnYear: number;
  txnMonth: number;

  openingGrossQty: number;
  openingQty: number;
  openingValue: number;

  purchaseGrossQty: number;
  purchaseQty: number;
  purchaseValue: number;

  purchaseGrossRtnQty: number;
  purchaseRtnQty: number;
  purchaseRtnValue: number;

  salesGrossQty: number;
  salesQty: number;
  salesValue: number;

  closingGrossQty: number;
  closingQty: number;
  closingValue: number;

  costPrice: number;

  toDateOpeningQty: number;
  toDateOpeningValue: number;
  toDatePurchaseQty: number;
  toDatePurchaseValue: number;

  netPurchaseQty: number;
  netPurchaseValue: number;
  netSalesQty: number;
  netSalesValue: number;

  netStockQty: number;
  netStockValue: number;
  netStockTransferQty: number;
  netStocktransferValue: number;

  netBalanceQty: number;
  netBalanceValue: number;

  profitPerkg: number;
  profitValue: number;

  // ------------ Average Prices -------------- //
  openingPrice: number;
  closingPrice: number;
  purchasePrice: number;
  purchaseRtnPrice: number;
  salesPrice: number;
  netPurchasePrice: number;
  netSalesPrice: number;
  netStockPrice: number;
  netStockTransferPrice: number;
  netBalancePrice: number;

  // ------------ Grand Totals --------------- //
  gtOpeningQty: number;
  gtOpeningValue: number;
  gtPurchaseQty: number;
  gtPurchaseValue: number;
  gtNetPurchaseQty: number;
  gtNetPurchaseValue: number;
  gtPurchaseRtnQty: number;
  gtPurchaseRtnValue: number;
  gtSalesQty: number;
  gtSalesValue: number;
  gtClosingQty: number;
  gtClosingValue: number;
  gtStockQty: number;
  gtStockValue: number;
  gtStockTransferQty: number;
  gtStockTransferValue: number;
  gtBalanceQty: number;
  gtBalanceValue: number;
  gtProfitPerKg: number;
  gtProfitValue: number;
  fromToGtBalanceAmount: number;

  // ---------- Stock Transfer ------------- //
  docNo: number;
  grossQty: number;
  netQty: number;
  netValue: number;
  stockInOut: number;
}

export interface TransactionDetails {
  CompanyId: number;
  DocNo: number;
  SerialNo: number;
  TxnDate: string; // DateTime in C# → ISO string in TS
  DocName?: string; // optional since string length constraints
  TxnYear: number;
  TxnMonth: number;
  CustSupName?: string;
  ContractNo?: string;
  StoreCode?: string;
  SeqNo: number;
  ProductId?: string;
  CategoryCode?: string;
  GrossQty: number;
  BaleQty: number;
  WastageQty: number;
  NetQty: number;
  UnitPrice: number;
  NetValue: number;
  StockInOut: number;
  ReturnSerialNo: number;
  ReturnQty: number;
  IsPrint: number;
  CreatedBy?: string;
  CreatedDateTime: string; // DateTime → string
  CreatedWorkStation?: string;
}

export interface TransactionsSavingDto {
  TransactionDetails: TransactionDetails[];
  CompanyId: number;
  CusSupName?: string;
  ContactNo?: string;
  TransactionType: number;
  TxnDate: string; // DateTime → ISO string
  IsPrint: number;
  CreatedBy?: string;
  CreatedWorkStation?: string;
}

export interface ComboDTO {
  DataTextField: string;
  DataValueField: string;
}

export interface LoginResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode: number;
}

export interface TempCart {
  seqNo: number;
  productName: string;
  CategoryName?: string;
  GrossQty: number;
  BaleQty: number;
  WastageQty: number;
  NetQty: number;
  UnitPrice: number;
  NetValue: number;
}

export interface RegisteredDevice {
  Id: number,
  UserId: string,
  Identifier: string,
  DeviceType: number,
  RequestDateTime: string,
  Status: number
}