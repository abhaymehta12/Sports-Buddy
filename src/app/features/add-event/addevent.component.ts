import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-addevent',
    templateUrl: './addevent.component.html',
    styleUrls: ['./addevent.component.scss']
})
export class AddEventComponent {
    eventForm: FormGroup

    constructor(
        public dialogRef: MatDialogRef<AddEventComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {

        this.eventForm = this.fb.group({
            event: [this.data.event || '', Validators.required],
            sport: [this.data.sport || '', Validators.required],
            category: [this.data.category || '', Validators.required],
            sport_place: [this.data.sport_place || '', Validators.required],
            location: [this.data.location || '', Validators.required],
            images: [this.data.images || []]
        });
    }

    // Handle form submission
    onSubmit(): void {
        if (this.eventForm.valid) {
            console.log('Form Submitted!', this.eventForm.value);
            this.dialogRef.close(this.eventForm.value);
        } else {
            console.log('Form is not valid');
        }
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}