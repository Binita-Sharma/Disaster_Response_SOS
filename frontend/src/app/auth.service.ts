import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // TO ROUTE USER AFTER LOGIN

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  constructor(private router: Router) {}

  login(username: string, password: string) {
    // Demo login (replace with real API check)
    if (username === 'admin' && password === '1234') {
      this.isLoggedIn = true;
      this.router.navigateByUrl('home/tabs/tab1', { replaceUrl: true });
    } else {
      alert('Invalid credentials');
    }
  }






  
  logout() {
    this.isLoggedIn = false;
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  checkLogin(): boolean {
    return this.isLoggedIn;
  }
} 