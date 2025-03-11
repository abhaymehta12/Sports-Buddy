import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from '../../firebase.service';
import { CloudinaryUploadService } from '../../cloudinary-upload.service';

@Component({
    selector: 'app-editProfile',
    templateUrl: './editprofile.component.html',
    styleUrls: ['./editprofile.component.scss']
})
export class EditProfileComponent {
    detailForm: FormGroup;
    imagePreview: string | ArrayBuffer | null = this.data.imageData.url;
    file: File | null = null;
    loading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private firebaseService: FirebaseService,
        private cloudinaryService: CloudinaryUploadService,
        public dialogRef: MatDialogRef<EditProfileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.detailForm = this.fb.group({
            name: this.data.name ? this.data.name : '',
            contact: [this.data.contact ? this.data.contact : '', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
            address: this.data.address ? this.data.address : ''
        });
    }

    async submitForm(): Promise<void> {
        this.loading = true;
        let imageData
        let madeChanges = false
        if (this.file) {
            imageData = await this.cloudinaryService.uploadImage(this.file);
            this.data.imageData = imageData;
            madeChanges = true;
        }
        if (this.detailForm.value.name && this.data.name !== this.detailForm.value.name) {
            this.data.name = this.detailForm.value.name;
            madeChanges = true;
        }
        if (this.detailForm.value.contact && this.data.contact !== this.detailForm.value.contact) {
            this.data.contact = this.detailForm.value.contact;
            madeChanges = true;
        }
        if (this.detailForm.value.address && this.data.address !== this.detailForm.value.address) {
            this.data.address = this.detailForm.value.address;
            madeChanges = true;
        }
        if (madeChanges) {
            await this.firebaseService.updateUserInFirestore(this.data);
            this.openSnackBar('Details Updated');
            this.closeDialog()
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

    closeDialog(): void {
        this.dialogRef.close();
    }

    openSnackBar(message: string): void {
        this._snackBar.open(message, 'X', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['snackbar-style'],
        });
    }
}