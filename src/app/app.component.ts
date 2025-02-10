import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sports-buddy';

  // Method to handle the toolbar button click
  onButtonClick() {
    alert('Toolbar button clicked!');
  }

  // Method to handle the alert button click
  onAlertButtonClick() {
    alert('You clicked the "Show Alert" button!');
  }
}
