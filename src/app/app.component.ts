import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEventComponent } from "./features/add-event/addevent.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'sports-buddy';

  constructor(private dialog: MatDialog) { }

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
