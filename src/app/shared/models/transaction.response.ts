import {UserResponse} from "./user.response";

export interface TransactionResponse {
  from: UserResponse;
  to: UserResponse;
  amount: number;
}
