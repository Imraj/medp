import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,Navbar } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { SubscriptionPage } from "../subscription/subscription"
import { HomePage } from "../home/home";

import { SplitPaneProvider } from "../../providers/split-pane/split-pane";
/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  @ViewChild(Navbar) navBar: Navbar;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public splitPane: SplitPaneProvider, public platform: Platform) {
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => { 
      let pages = [
        {
          page: HomePage
        }
      ];
      this.navCtrl.setPages(pages);
    }
  }

  ionViewWillEnter() {  
    if(this.platform.width() > 700){
      this.splitPane.splitPaneState = true;
    }   
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
