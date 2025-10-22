export class Auth {
  GetLoggedUser = "/Auth/GetLoggedUser";
  ValidateUser = "/Auth/ValidateUser";
  getTokenString = "/Auth/GenerateTokenAsync";
}

export class Dashboard {
  GetStockSummaryByProcessData = '/PurchaseToSales/GetStockSummaryByProcessData';
}

export class Transactions{
  GetActiveProductList = '/PurchaseToSales/GetActiveProductList';
  GetProductCategoryByProductCode = '/PurchaseToSales/GetProductCategoryByProductCode';
  InsertTransactionDetails = '/PurchaseToSales/InsertTransactionDetails';
}