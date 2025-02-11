import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './signIn.component.html',
  styleUrls: ['./signIn.component.scss']
})
export class SignInComponent {
  fg: FormGroup;
  errorUMessage: string = 'Username is required';
  errorPMessage: string = 'Password is required';
  hide: boolean = true;

  constructor(private fb: FormBuilder, private myroute: Router) {
    this.fg = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  togglePassword() {
    this.hide = !this.hide;
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