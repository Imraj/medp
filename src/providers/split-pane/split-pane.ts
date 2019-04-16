import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {Platform} from 'ionic-angular';
/*
  Generated class for the SplitPaneProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SplitPaneProvider {

  splitPaneState : boolean;
  constructor(public platform : Platform) {
    this.splitPaneState = false;
  }

  getSplitPane() {
  
    if (this.platform.width() > 700) {
      this.splitPaneState = true;
    } else {
      this.splitPaneState = false;
    }
    
    return this.splitPaneState;
  }

}
