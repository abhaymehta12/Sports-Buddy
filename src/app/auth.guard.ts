import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private firebaseService: FirebaseService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const token = localStorage.getItem('id');

    if (!token) {
      this.router.navigate(['/signin']);
      return false;
    }

    try {
      await this.firebaseService.getUserInfo(token);
    } catch (error) {
      this.router.navigate(['/signin']);
      return false;
    }
    const role = localStorage.getItem('role');

    if (role === 'admin') {
      if (state.url === '/admin') {
        return true;
      } else {
        this.router.navigate(['/admin']);
        return false;
      }
    } else {
      if (state.url === '/user') {
        return true;
      } else {
        this.router.navigate(['/user']);
        return false;
      }
    }
  }
}
