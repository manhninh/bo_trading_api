import UserTransactionsRepository from "@src/repository/UserTransactionsRepository";
import { validate } from "class-validator";

export const getTransactionsHistory = async (input: any): Promise<Number> => {
  try {
    const validation = await validate(input);
    if (validation.length !== 0) {
      throw new Error(Object.values(validation[0].constraints)[0]);
    }
    const model = new UserTransactionsRepository();
    const rows = model.transactiontHistory(input);
    return rows;
  } catch (err) {
    throw err;
  }
};
