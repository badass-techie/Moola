import { Component } from '@angular/core';
import {UserResponse} from "../../shared/models/user.response";
import {TransactionResponse} from "../../shared/models/transaction.response";
import {AuthService} from "../../shared/services/auth.service";
import {TransferService} from "../../shared/services/transfer.service";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {TopUpComponent} from "../top-up/top-up.component";
import {TransferComponent} from "../transfer/transfer.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  user: UserResponse | null = null;
  transactions: TransactionResponse[] = [];
  displayedColumns: string[] = ['from', 'to', 'amount'];

  constructor(
    public authService: AuthService,
    private transferService: TransferService,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe(user => {
      this.user = user;
      this.transferService.getTransactionHistory(user!).subscribe(transactions => {
        console.log(transactions);
        this.transactions = transactions || [];
      });
    });
  }

  openTopUp(): void {
    this.bottomSheet.open(TopUpComponent);
  }

  openTransfer(): void {
    this.bottomSheet.open(TransferComponent);
  }
}
