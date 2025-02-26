import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FirebaseService } from '../../firebase.service';

@Component({
  selector: 'app-signIn',
  templateUrl: './signIn.component.html',
  styleUrls: ['./signIn.component.scss']
})
export class SignInComponent {
  fg: FormGroup;
  errorUMessage: string = 'Username is required';
  errorPMessage: string = 'Password is required';
  hide: boolean = true;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private myroute: Router, private _snackBar: MatSnackBar, private firebaseService: FirebaseService, private auth: Auth) {
    this.fg = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  togglePassword() {
    this.hide = !this.hide;
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(async (result) => {
        const user = result.user;
        let details = {
          name: user.displayName,
          imageData: { url: user.photoURL },
          contact: user.phoneNumber,
          email: user.email,
          provider_id: user.uid
        }
        await this.firebaseService.addGoolgeUser(details)
        this.signIn();
      })
      .catch((error) => {
        console.error('Error signing in with Google: ', error);
      });
  }

  async submitForm() {
    this.loading = true;
    let resp: string = await this.firebaseService.login(this.fg.value);
    if (resp) {
      this.openSnackBar(resp);
      this.loading = false;
      return;
    }
    this.signIn();
  }

  signUp() {
    this.myroute.navigate(['/signup']);
  }

  signIn() {
    this.myroute.navigate(['/admin']);
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, 'X', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['snackbar-style'],
    });
  }


  get username() {
    return this.fg.get('username');
  }

  get password() {
    return this.fg.get('password');
  }
}