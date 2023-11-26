import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UserResponse} from "../models/user.response";
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  getUsers(): Observable<UserResponse[]> {
    return this.firestore.collection('users').get().pipe(
      map(users => users.docs.map(doc => doc.data() as UserResponse))
    );
  }
}
