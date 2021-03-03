import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { version } from '../../../../package.json'
@Component({
  selector: 'roomies-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    console.log(version);

  }
}
