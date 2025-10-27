export class Auth {
  GetLoggedUser = "/Auth/GetLoggedUser";
  ValidateUser = "/Auth/ValidateUser";
  getTokenString = "/Auth/GenerateTokenAsync"; 
  ValidateAndCreateNewUser = "/Auth/ValidateAndCreateNewUser";
}

export class Dashboard {
  GetStockSummaryByProcessData = '/PurchaseToSales/GetStockSummaryByProcessData';
}

export class Transactions{
  GetActiveProductList = '/PurchaseToSales/GetActiveProductList';
  GetProductCategoryByProductCode = '/PurchaseToSales/GetProductCategoryByProductCode';
  InsertTransactionDetails = '/PurchaseToSales/InsertTransactionDetails';
}

export class DeviceRegistration{
  LoadDeviceList = "/UserMaintenance/LoadDeviceList"
}