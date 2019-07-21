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
  constructor() {}
  @Input() isLoggedIn = false;
  @Input() avatar = null;
  @Input() userName = null;
  @Output() userLoggedOut = new EventEmitter();
  @Output() uploadImgStarted = new EventEmitter();

  onUploadImg() {
    this.uploadImgStarted.next();
  }

  ngOnInit() {}

  onLogout() {
    this.userLoggedOut.next();
  }
}
