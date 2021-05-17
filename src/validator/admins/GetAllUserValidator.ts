import {IsNotEmpty, IsString} from 'class-validator';

export class GetAllUserValidator {
  constructor() {
    this.hideAmountSmall = false;
    this.limit = 50;
  }
  textSearch: string;
  hideAmountSmall: boolean;
  page: number;
  limit: number;
}
