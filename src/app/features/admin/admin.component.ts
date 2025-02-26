import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddEventComponent } from "../add-event/addevent.component";
import { FirebaseService } from '../../firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// Define the interface for your data structure
interface SportElement {
  'S. no': number;
  'sport': string;
  'category': string;
  'sport_place': string;
  'location': string;
  'user': string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  area: string = '';
  state: string = '';
  selected: object = ['Table Tennis'];
  eventData: any;
  editingData: any = null;

  dataSource: MatTableDataSource<SportElement> = new MatTableDataSource<SportElement>([]);

  constructor(
    private firebaseService: FirebaseService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  displayedColumns: string[] = ['S. no', 'sport', 'category', 'sport_place', 'location'];
  columnLabels: { [key: string]: string } = {
    'S. no': 'S. No',
    'sport': 'Sport',
    'category': 'Category',
    'sport_place': 'Sport Place',
    'location': 'Location'
  };

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  async ngOnInit() {
    this.firebaseService.eventData$.subscribe(data => {
      if (data) {
        this.eventData = data;
        this.updateDataSource();
      }
    });
    try {
      await this.firebaseService.getAllevents();
      this.dataSource = new MatTableDataSource<SportElement>(this.eventData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  updateDataSource() {
    this.dataSource = new MatTableDataSource<SportElement>(this.eventData);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  clickedRows(row: SportElement): void {
    this.editingData = row
    this.openDialog(row);
  }

  openDialog(param: object): void {
    const dialogRef = this.dialog.open(AddEventComponent, {
      disableClose: true,
      data: param
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && !result.del_id && (this.editingData.sport !== result.sport || this.editingData.location !== result.location || this.editingData.category !== result.category || this.editingData.sport_place !== result.sport_place)) {
        result.id = this.editingData.id
        const resp = await this.firebaseService.updateEvent(result);
        this.openSnackBar(resp);
      } else if (result && result.del_id) {
        const resp = await this.firebaseService.deleteEvent(result.del_id);
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