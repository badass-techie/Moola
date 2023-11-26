import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {LoginRequest} from "../models/login.request";
import {SignupRequest} from "../models/signup.request";

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should signup a user', async () => {
    const signupRequest: SignupRequest = {
      username: 'test',
      email: 'test@test.com',
      phoneNumber: '1234567890',
      password: 'password'
    };
    const user = await service.signup(signupRequest);
    expect(user).toBeTruthy();
  });

  it('should login a user', async () => {
    const loginRequest: LoginRequest = {
      email: 'test@test.com',
      password: 'password'
    };
    const user = await service.login(loginRequest);
    expect(user).toBeTruthy();
  });

  it('should logout a user', async () => {
    await service.logout();
    const user = await service.getLoggedInUser().toPromise();
    expect(user).toBeNull();
  });
});
