import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'roomies-monthly-expenses',
  templateUrl: './monthly-expenses.component.html',
  styleUrls: ['./monthly-expenses.component.css'],
})
export class MonthlyExpensesComponent implements OnInit {
  colorScheme = {
    domain: ['#de594e', '#84dbff', '#10bb66', '#ffd23c'],
  };

  single = [
    {
      name: 'Fun',
      value: 8940000,
    },
    {
      name: 'Bills',
      value: 5000000,
    },
    {
      name: 'Groceries', //#10bb66
      value: 7200000,
    },
    {
      name: 'Furniture', //#ffd23c
      value: 6000000,
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
