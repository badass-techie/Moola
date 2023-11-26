import {UserResponse} from "./user.response";

export interface TransferRequest {
  from: UserResponse;
  to: UserResponse;
  amount: number;
}
