import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from './firebase.service';
import { signOut } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { AddEventComponent } from "./features/add-event/addevent.component";
import { EditProfileComponent } from "./features/edit-profile/editprofile.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'sports-buddy';
  userData: any;

  constructor(private myroute: Router, private firebaseService: FirebaseService, private auth: Auth, private _snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.firebaseService.userData$.subscribe(data => {
      this.userData = data;
    });
  }

  async logOut() {
    if (this.userData.email) {
      await signOut(this.auth)
    }
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    this.firebaseService.clearAllData();
    this.myroute.navigate(['/signin']);
  }

  openProfileDialog(): void {
    this.dialog.open(EditProfileComponent, { disableClose: true, data: this.userData });
  }

  openEventDialog(): void {
    const dialogRef = this.dialog.open(AddEventComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        result.user = this.userData.name;
        result.user_id = this.userData.id;
        let resp = await this.firebaseService.saveEvent(result);
        this.openSnackBar(resp);
      }
    });
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, 'X', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['snackbar-style'],
    });
  }
}
