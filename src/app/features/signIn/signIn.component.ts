import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAuth } from '@angular/fire/auth';

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

  constructor(private fb: FormBuilder, private myroute: Router, private auth: Auth) {
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

    // Use sign-in popup to authenticate with Google
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('User signed in: ', user);
      })
      .catch((error) => {
        console.error('Error signing in with Google: ', error);
      });
  }

  submitForm() {
    if (this.fg.valid) {
      console.log(this.fg.value);
      this.myroute.navigate(['/admin']);
    } else {
      console.log("Form is invalid");
    }
  }

  signUp() {
    this.myroute.navigate(['/signup']);
  }


  get username() {
    return this.fg.get('username');
  }

  get password() {
    return this.fg.get('password');
  }
}