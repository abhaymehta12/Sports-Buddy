import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

// Define the interface for your data structure
interface SportElement {
  'S. no': number;
  'Sport': string;
  'Category': string;
  'Sport place': string;
  'Location': string;
  'User': string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterViewInit {
  area: string = '';
  state: string = '';
  selected: object = ['Table Tennis'];

  displayedColumns: string[] = ['S. no', 'Sport', 'Category', 'Sport place', 'Location', 'User'];

  dataSource: MatTableDataSource<SportElement> = new MatTableDataSource([
    { 'S. no': 1, 'Sport': 'Football', 'Category': 'Outdoor', 'Sport place': 'Stadium', 'Location': "Delhi", 'User': "Abhay" },
    { 'S. no': 2, 'Sport': 'Basketball', 'Category': 'Indoor', 'Sport place': 'Arena', 'Location': "Noida", 'User': "Saurav" },
    { 'S. no': 3, 'Sport': 'Tennis', 'Category': 'Outdoor', 'Sport place': 'Court', 'Location': "Delhi", 'User': "Divik" },
    { 'S. no': 4, 'Sport': 'Badminton', 'Category': 'Indoor', 'Sport place': 'Court', 'Location': "Delhi", 'User': "Dipankar" },
  ]);

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  clickedRows(row: SportElement): void {
    console.log(row);
  }
}