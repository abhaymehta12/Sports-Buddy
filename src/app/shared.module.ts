import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatSelectModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    MatSliderModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatSelectModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    MatSliderModule,
    MatProgressSpinnerModule
  ]
})
export class SharedModule { }