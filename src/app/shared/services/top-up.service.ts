import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {TopUpRequest} from "../models/topup.request";
import {UserResponse} from "../models/user.response";

@Injectable({
  providedIn: 'root'
})
export class TopUpService {
  constructor(private firestore: AngularFirestore) {}

  async topUp(topUpRequest: TopUpRequest) {
    const userRef = this.firestore.collection('users').doc(topUpRequest.user.email);
    const user = await userRef.get().toPromise();
    console.log(user);
    if (user!.exists) {
      const balance = Number((user!.data() as UserResponse).balance) + Number(topUpRequest.amount);
      await userRef.update({ balance });
      return balance;
    } else {
      throw new Error('User not found');
    }
  }
}
