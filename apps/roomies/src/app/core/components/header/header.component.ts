import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'roomies-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @Input() isLoggedIn = false;
  @Output() userLoggedOut = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  onLogout() {
    this.userLoggedOut.next();
  }
}
