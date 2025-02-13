import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignUpComponent {
  formGroup: FormGroup;
  errorMessage: string = 'Please provide all details.';
  hide: boolean = true;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private myroute: Router, private _snackBar: MatSnackBar) {
    this.formGroup = this.fb.group({
      firstStep: this.fb.group({
        name: ['', Validators.required],
        contact: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        address: ['', Validators.required],
      }),
      secondStep: this.fb.group({
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[!@#$%^&*(),.?":{}|<>]).+$')]],
      })
    });
  }

  togglePassword() {
    this.hide = !this.hide;
  }

  submitForm() {
    if (this.formGroup.valid && this.imagePreview) {
      console.log(this.formGroup.value);
      //this.signIn()
    } else {
      this.openSnackBar('Please provide all details.')
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      // Generate a preview for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Set image preview
      };
      reader.readAsDataURL(file);
    }
  }

  signIn() {
    this.myroute.navigate(['/signin']);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'X', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['snackbar-style'],
    });
  }
}