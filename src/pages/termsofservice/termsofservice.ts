import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the TermsofservicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-termsofservice',
  templateUrl: 'termsofservice.html',
})
export class TermsofservicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private iab:InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsofservicePage');
  }

}
