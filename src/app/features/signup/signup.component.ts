import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from '../../firebase.service';
import { CloudinaryUploadService } from '../../cloudinary-upload.service';

@Component({
  selector: 'app-signUp',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent {
  formGroup: FormGroup;
  errorMessage: string = '';
  hide: boolean = true;
  imagePreview: string | ArrayBuffer | null = null;
  file: File | null = null;
  loading: boolean = false

  constructor(
    private fb: FormBuilder,
    private myroute: Router,
    private _snackBar: MatSnackBar,
    private firebaseService: FirebaseService,
    private cloudinaryService: CloudinaryUploadService
  ) {
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

  togglePassword(): void {
    this.hide = !this.hide;
  }

  async submitForm(): Promise<void> {
    if (this.formGroup.valid && this.file) {
      this.loading = true;
      const userData = { ...this.formGroup.value.firstStep, ...this.formGroup.value.secondStep };
      try {
        let resp: any = await this.firebaseService.addUserToFirestore(userData);
        let msg: any = 'Signed up successfully!'
        if (resp && resp.doc_id) {
          const imageData = await this.cloudinaryService.uploadImage(this.file);
          this.firebaseService.saveImage({ ...imageData, ...resp });
          this.signIn();
        } else {
          msg = resp
        }
        this.openSnackBar(msg);
      } catch (error: any) {
        this.openSnackBar('Try again later');
      }
    } else {
      this.openSnackBar('Please provide all details.');
    }
    this.loading = false;
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.file = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  signIn(): void {
    this.resetForm();
    this.myroute.navigate(['/signin']);
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, 'X', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['snackbar-style'],
    });
  }

  resetForm(): void {
    this.formGroup.reset();
    this.file = null;
    this.imagePreview = null;
    this.hide = true;
    this.loading = false;
  }
}