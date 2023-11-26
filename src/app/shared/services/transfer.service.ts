import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {arrayUnion} from "@angular/fire/firestore";
import {TransactionResponse} from "../models/transaction.response";
import {TransferRequest} from "../models/transfer.request";
import {UserResponse} from "../models/user.response";
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  constructor(private firestore: AngularFirestore) {}

  async send(transferRequest: TransferRequest): Promise<TransactionResponse> {
    const fromRef = this.firestore.collection('users').doc(transferRequest.from.email);
    const toRef = this.firestore.collection('users').doc(transferRequest.to.email);

    const fromUser = await fromRef.get().toPromise();
    const toUser = await toRef.get().toPromise();

    if (fromUser!.exists && toUser!.exists) {
      const fromBalance = (fromUser!.data() as UserResponse).balance;
      const toBalance = (toUser!.data() as UserResponse).balance;

      if (fromBalance >= transferRequest.amount) {
        const transaction: TransactionResponse = {
          from: transferRequest.from,
          to: transferRequest.to,
          amount: transferRequest.amount
        };

        await fromRef.update({ balance: fromBalance - transferRequest.amount });
        await toRef.update({ balance: toBalance + transferRequest.amount });

        // Get references to the 'transactions' documents for the sender and receiver
        const fromTransactionsRef = this.firestore.collection('transactions').doc(transferRequest.from.email);
        const toTransactionsRef = this.firestore.collection('transactions').doc(transferRequest.to.email);

        // Add the transaction to the 'transactions' array for the sender and receiver
        await fromTransactionsRef.set({ transactions: arrayUnion(transaction) }, { merge: true });
        await toTransactionsRef.set({ transactions: arrayUnion(transaction) }, { merge: true });

        return transaction;
      } else {
        throw new Error('Insufficient balance');
      }
    } else {
      throw new Error('User not found');
    }
  }

  getTransactionHistory(user: UserResponse): Observable<TransactionResponse[]> {
    // Get a reference to the 'transactions' document for the user
    const transactionsRef = this.firestore.collection('transactions').doc(user.email);

    // Fetch the document and map the data to an Observable of TransactionResponse[]
    return this.firestore.collection('transactions').doc(user.email).get().pipe(
      map(doc => (doc.data() as {transactions: TransactionResponse[]}).transactions || [])
    );
  }
}
