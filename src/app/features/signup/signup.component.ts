import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignUpComponent {
  fg: FormGroup;
  errorMessage: string = 'Please provide all details.';
  hide: boolean = true;

  constructor(private fb: FormBuilder, private myroute: Router) {
    this.fg = this.fb.group({
      'name': ['', Validators.required],
      'contact': ['', Validators.required],
      'address': ['', Validators.required],
      'image': ['', Validators.required],
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
      this.signIn()
    } else {
      console.log("Form is invalid");
    }
  }

  signIn() {
    this.myroute.navigate(['/signin']);
  }


  get username() {
    return this.fg.get('username');
  }

  get password() {
    return this.fg.get('password');
  }
}