import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {TopUpService} from "../../shared/services/top-up.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../shared/services/auth.service";
import {UserResponse} from "../../shared/models/user.response";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.scss']
})
export class TopUpComponent {
  user: UserResponse | null = null;
  topUpForm = this.fb.group({
    amount: [1, Validators.min(1)]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private topUpService: TopUpService,
    private snackBar: MatSnackBar,
    private bottomSheetRef: MatBottomSheetRef<TopUpComponent>
  ) { }

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe(user => {
      this.user = user;
    });
  }

  onSubmit(): void {
    if (this.topUpForm.valid && !!this.user) {
      this.topUpService.topUp({user: this.user, amount: this.topUpForm.value.amount as number})
        .then(() => {
          this.snackBar.open(`Top up successful. New balance: ${this.user!.balance}`, 'Dismiss', {duration: 3000});
          this.topUpForm.reset();
          this.bottomSheetRef.dismiss();
        })
        .catch((error) => {
          console.log(error);
          this.snackBar.open(`${error.message}`, 'Dismiss', {duration: 3000});
        });
    }
  }
}
