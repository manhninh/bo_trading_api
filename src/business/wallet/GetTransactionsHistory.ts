import UserTransactionsRepository from "@src/repository/UserTransactionsRepository";

export const getTransactionsHistory = async (input: any): Promise<Number> => {
  try {
    const model = new UserTransactionsRepository();
    const rows = model.transactiontHistory(input);
    return rows;
  } catch (err) {
    throw err;
  }
};
