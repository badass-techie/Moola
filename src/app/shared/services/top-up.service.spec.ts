import { TestBed } from '@angular/core/testing';

import { TopUpService } from './top-up.service';
import {TopUpRequest} from "../models/topup.request";

describe('TopUpService', () => {
  let service: TopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should top up a user balance', async () => {
    const topUpRequest: TopUpRequest = {
      user: {
        username: 'test',
        email: 'test@test.com',
        phoneNumber: '1234567890',
        balance: 0
      },
      amount: 100
    };
    const balance = await service.topUp(topUpRequest);
    expect(balance).toBe(100);
  });
});
