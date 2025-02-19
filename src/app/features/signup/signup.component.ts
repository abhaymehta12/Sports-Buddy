import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from '../../firebase.service';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-signUp',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignUpComponent {
  formGroup: FormGroup;
  errorMessage: string = 'Please provide all details.';
  hide: boolean = true;
  imagePreview: string | ArrayBuffer | null = null;
  file: File | null = null;

  constructor(private fb: FormBuilder, private myroute: Router, private _snackBar: MatSnackBar, private firebaseService: FirebaseService, private storage: Storage) {
    this.formGroup = this.fb.group({
      firstStep: this.fb.group({
        name: ['', Validators.required],
        contact: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
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

  async submitForm() {
    if (this.formGroup.valid && this.file) {
      const userData = {...this.formGroup.value.firstStep, ...this.formGroup.value.secondStep};
      const storageRef = ref(this.storage, `images/${this.file.name}`);
      await uploadBytes(storageRef, this.file);
      const downloadURL = await getDownloadURL(storageRef);
      console.log(downloadURL)
      // this.firebaseService.addUserToFirestore(userData).then(() => {
      //   this.openSnackBar('Signed up successfully!')
      // }).catch((error) => {
      //   this.openSnackBar('Error signing up: ' + error.message);
      // });
      //this.signIn()
    } else {
      this.openSnackBar('Please provide all details.')
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.file = file
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