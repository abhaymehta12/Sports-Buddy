import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from './firebase.service';
import { signOut } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { AddEventComponent } from "./features/add-event/addevent.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'sports-buddy';
  userData: any;

  constructor(private myroute: Router, private firebaseService: FirebaseService, private auth: Auth, private dialog: MatDialog) { }

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
    this.firebaseService.clearUserData();
    this.myroute.navigate(['/signin']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddEventComponent, {
      data: {
        event: 'Football Match',
        sport: 'Football',
        category: 'Outdoor',
        sport_place: 'Stadium',
        location: 'New York',
        landmark: '',
        images: []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed with result:', result);
    });
  }
}
