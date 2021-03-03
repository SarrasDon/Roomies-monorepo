import { Component, Input } from '@angular/core';

@Component({
  selector: 'roomies-expenses-sprite',
  templateUrl: './expenses-sprite.component.html',
  styleUrls: ['./expenses-sprite.component.css']
})
export class ExpensesSpriteComponent {
  @Input() icon: string
  @Input() size: number = 40

  constructor() { }

}
