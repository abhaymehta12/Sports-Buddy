import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-addevent',
    templateUrl: './addevent.component.html',
    styleUrls: ['./addevent.component.scss']
})
export class AddEventComponent {
    eventForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<AddEventComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {

        this.eventForm = this.fb.group({
            sport: [this.data ? this.data.sport : '', Validators.required],
            category: [this.data ? this.data.category : '', Validators.required],
            sport_place: [this.data ? this.data.sport_place : '', Validators.required],
            location: [this.data ? this.data.location : '', Validators.required]
        });
    }

    onSubmit(): void {
        this.dialogRef.close(this.eventForm.value);
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    deleteEvent(): void {
        let obj = {
            del_id: this.data.id
        }
        this.dialogRef.close(obj);
    }
}           