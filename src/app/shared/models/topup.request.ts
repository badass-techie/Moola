import {UserResponse} from "./user.response";

export interface TopUpRequest {
  user: UserResponse;
  amount: number;
}
