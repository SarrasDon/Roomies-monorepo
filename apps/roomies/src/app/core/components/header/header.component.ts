import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'roomies-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @Input() isLoggedIn = false;
  @Input() avatar = null;
  @Input() userName = null;
  @Output() userLoggedOut = new EventEmitter();
  @Output() uploadImgStarted = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onUploadImg() {
    this.uploadImgStarted.next();
  }

  onLogout() {
    this.userLoggedOut.next();
  }
}
