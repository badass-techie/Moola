import { TestBed } from '@angular/core/testing';

import { TransferService } from './transfer.service';
import {UserResponse} from "../models/user.response";

describe('TransferService', () => {
  let service: TransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get transaction history', async () => {
    const user: UserResponse = {
      username: 'test',
      email: 'test@test.com',
      phoneNumber: '1234567890',
      balance: 1000
    };
    const transactions = await service.getTransactionHistory(user).toPromise();
    expect(transactions).toBeTruthy();
  });
});
