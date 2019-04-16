import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ExpirationdatePage } from '../expirationdate/expirationdate';
import { RecallPage } from '../recall/recall';
import { InsulinguidePage } from '../insulinguide/insulinguide';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplitPaneProvider } from '../../providers/split-pane/split-pane';


/**
 * Generated class for the PrivacypolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-privacypolicy',
  templateUrl: 'privacypolicy.html',
})
export class PrivacypolicyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private iab:InAppBrowser,
              public splitPane: SplitPaneProvider, public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacypolicyPage');
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

}
