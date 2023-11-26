import { Component } from '@angular/core';
import {UserResponse} from "../../shared/models/user.response";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../shared/services/user.service";
import {TransferService} from "../../shared/services/transfer.service";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent {
  user: UserResponse | null = null;
  users: UserResponse[] = [];
  emailsAndPhoneNumbers: string[] = [];
  transferForm = this.fb.group({
    to: ['', [Validators.required, Validators.pattern(this.emailsAndPhoneNumbers.join('|'))]],
    amount: [1, Validators.min(1)]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private transferService: TransferService,
    private snackBar: MatSnackBar,
    private bottomSheetRef: MatBottomSheetRef<TransferComponent>
  ) { }

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe(user => {
      this.user = user;
    });

    this.userService.getUsers().subscribe(users => {
      this.users = users.filter(user => user.email !== this.user?.email);  // remove the current user from the list of users
      this.emailsAndPhoneNumbers = this.users.map(user => user.email).concat(this.users.map(user => user.phoneNumber));
    });
  }

  onSubmit(): void {
    if (this.transferForm.valid) {
      const toUser = this.users.find(user => user.email === this.transferForm.value.to || user.phoneNumber === this.transferForm.value.to);
      if (toUser && this.user){
        this.transferService.send({from: this.user, to: toUser, amount: this.transferForm.value.amount as number})
          .then(() => {
            this.snackBar.open(`Transfer successful`, 'Dismiss', {duration: 3000});
            this.transferForm.reset();
            this.bottomSheetRef.dismiss();
          })
          .catch((error) => {
            console.log(error);
            this.snackBar.open(`${error.message}`, 'Dismiss', {duration: 3000});
          });
      } else {
        this.snackBar.open(`Recipient not found`, 'Dismiss', {duration: 3000});
      }
    }
  }
}
