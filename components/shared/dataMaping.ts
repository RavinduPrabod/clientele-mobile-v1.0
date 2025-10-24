import { TransactionDetails, TransactionsSavingDto } from "@/app/Types/user.types";
import { UserStorage } from "@/lib/userStorage";

// Mapper function - place this before the component or in a separate file
const mapCartToTransactionDto = async (
  cart: TransactionDetails[],
  transactionType: number
): Promise<TransactionsSavingDto> => {
  
  const selectedBranch = await UserStorage.getSelectedBranch();
  const companyId = selectedBranch?.companyId || 0;
  const userId = selectedBranch?.userId || 'Unknown';
  
  const currentDate = new Date().toISOString();

  const transactionDto: TransactionsSavingDto = {
    TransactionDetails: cart,
    CompanyId: companyId,
    CusSupName: '',
    ContactNo: '',
    TransactionType: transactionType,
    TxnDate: currentDate,
    IsPrint: 0,
    CreatedBy: userId,
    CreatedWorkStation: 'Mobile',
  };

  
  return transactionDto;
};

export default mapCartToTransactionDto;