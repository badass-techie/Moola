import {inject, NgModule} from '@angular/core';
import {CanActivateFn, Router, RouterModule, Routes} from '@angular/router';
import {AuthService} from "./shared/services/auth.service";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";
import { map, tap } from 'rxjs';

// guards
const isLoggedIn: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.getLoggedInUser().pipe(
    map(user => !!user),
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigateByUrl('/login');
      }
    })
  );
}

const isNotLoggedIn: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.getLoggedInUser().pipe(
    map(user => !user),
    tap(isNotLoggedIn => {
      if (!isNotLoggedIn) {
        router.navigateByUrl('');
      }
    })
  );
}

// routes
const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [isLoggedIn] },
  { path: 'login', component: LoginComponent, canActivate: [isNotLoggedIn] },
  { path: 'signup', component: SignupComponent, canActivate: [isNotLoggedIn] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
