import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {SignupRequest} from "../models/signup.request";
import {LoginRequest} from "../models/login.request";
import {UserResponse} from "../models/user.response";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import { Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  async signup(signupRequest: SignupRequest) {
    const result = await this.afAuth.createUserWithEmailAndPassword(signupRequest.email!, signupRequest.password!);
    return await this.firestore.collection('users').doc(result.user!.email as string).set({
      username: signupRequest.username,
      email: signupRequest.email,
      phoneNumber: signupRequest.phoneNumber,
      balance: 0
    });
  }

  async login(loginRequest: LoginRequest) {
    return await this.afAuth.signInWithEmailAndPassword(loginRequest.email!, loginRequest.password!);
  }

  getLoggedInUser(): Observable<UserResponse | null> {
    return this.afAuth.authState.pipe(
      first(),
      switchMap(user => {
        if (user) {
          return this.firestore.collection('users').doc(user.email as string).snapshotChanges().pipe(
            map(doc => {
              if (doc.payload.exists) {
                return doc.payload.data() as UserResponse;
              } else {
                return null;
              }
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  async logout() {
    await this.afAuth.signOut();
    await this.router.navigate(['/login']);
  }
}
