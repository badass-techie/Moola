import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginRequest} from "../../shared/models/login.request";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.value as LoginRequest)
      .then(user => {
        this.router.navigateByUrl('');
        console.log('User logged in', user);
      }).catch(error => {
      this.snackBar.open(`${error.message}`, 'Dismiss', {duration: 3000});
      console.error('Error logging in', error);
    });
  }
}
