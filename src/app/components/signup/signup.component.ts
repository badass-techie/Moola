import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SignupRequest} from "../../shared/models/signup.request";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
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
    this.authService.signup(this.signupForm.value as SignupRequest)
      .then(user => {
        this.snackBar.open('User created', 'OK', {duration: 3000});
        this.router.navigate(['/login']);
        console.log('User created', user);
      }).catch(error => {
        this.snackBar.open(`${error.message}`, 'Dismiss', {duration: 3000});
        console.error('Error creating user', error);
      });
  }
}
