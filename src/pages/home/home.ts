import { Component } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { SubscriptionPage } from "../subscription/subscription"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  
  isTabletOrIpad : boolean;
  
  constructor(public navCtrl: NavController,public platform: Platform) {
    this.isTabletOrIpad = this.platform.is('tablet') || this.platform.is('ipad');
  }

  navToExpirationdate(){
    this.navCtrl.push(ExpirationdatePage)
  }

  navToRecall(){
    this.navCtrl.push(RecallPage)
  }

  navToInsulin(){
    this.navCtrl.push(InsulinguidePage)
  }

  navToSub(){
    this.navCtrl.push(SubscriptionPage)
  }

}
