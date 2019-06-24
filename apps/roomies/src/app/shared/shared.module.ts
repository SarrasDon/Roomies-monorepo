import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialModule } from './material';

@NgModule({
  declarations: [],
  imports: [CommonModule, ScrollingModule, MaterialModule],
  exports: [ScrollingModule, CommonModule, MaterialModule]
})
export class SharedModule {}
