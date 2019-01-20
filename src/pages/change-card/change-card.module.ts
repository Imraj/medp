import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeCardPage } from './change-card';

@NgModule({
  declarations: [
    ChangeCardPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeCardPage),
  ],
})
export class ChangeCardPageModule {}
