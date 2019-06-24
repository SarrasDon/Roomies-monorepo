import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'roomies-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data$ = this.service.getData();
 
  title = 'roomies';

  /**
   *
   */
  constructor(private service: AppService) {
    
  }
}
